function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Circle(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
}

function drawPoint(ctx, x, y) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCircle(ctx, cx, cy, r) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(cx, cy, 1, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSet(ctx, set) {
    for (let i = 0; i < set.length; i++) {
        if (set[i].r)
            drawCircle(ctx, set[i].cx, set[i].cy, set[i].r);
        else
            drawPoint(ctx, set[i].x, set[i].y);
    }
}

$(document).ready(() => {
    let labelSet = [];

    let baseImg = $("#baseImg")[0];
    console.log(baseImg.crossOrigin);
    let workshop = $("#workshop");
    let canvas = workshop[0];
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(baseImg, 0, 0);
    ctx.fillStyle = ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    let POINT_TOOL = 0,
        CIRCLE_D_TOOL = 1,
        CIRCLE_C_TOOL = 2;

    let toolMode = POINT_TOOL;
    let toolData = {};
    let toolSel = $(".toolSel");
    toolSel.on("change", () => {
        for (let i = 0; i < 3; i++)
            if (toolSel[i].checked)
                toolMode = +toolSel[i].value;
        toolData = {};
    });

    let mouseMoveListenerD = function (e) {
        let x = e.x - workshop.offset().left;
        let y = e.y - workshop.offset().top;
        ctx.putImageData(toolData.backUp, 0, 0);
        let cx = (x + toolData.firstPoint.x) / 2;
        let cy = (y + toolData.firstPoint.y) / 2;
        let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        drawCircle(ctx, cx, cy, r);
    };

    let mouseMoveListenerC = function (e) {
        let x = e.x - workshop.offset().left;
        let y = e.y - workshop.offset().top;
        ctx.putImageData(toolData.backUp, 0, 0);
        let cx = toolData.firstPoint.x;
        let cy = toolData.firstPoint.y;
        let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        drawCircle(ctx, cx, cy, r);
    };

    canvas.onclick = function (e) {
        let x = e.x - workshop.offset().left;
        let y = e.y - workshop.offset().top;

        if (toolMode === POINT_TOOL) {
            labelSet.push(new Point(x, y));
            drawPoint(ctx, x, y);
        } else if (toolMode === CIRCLE_D_TOOL) {
            if (toolData.waitSecond) {
                toolData.waitSecond = false;
                canvas.removeEventListener("mousemove", mouseMoveListenerD);
                ctx.putImageData(toolData.backUp, 0, 0);
                let cx = (x + toolData.firstPoint.x) / 2;
                let cy = (y + toolData.firstPoint.y) / 2;
                let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
                labelSet.push(new Circle(cx, cy, r));
                drawCircle(ctx, cx, cy, r);
            } else {
                toolData.waitSecond = true;
                toolData.firstPoint = new Point(x, y);
                toolData.backUp = ctx.getImageData(0, 0, canvas.width, canvas.height);
                canvas.addEventListener("mousemove", mouseMoveListenerD);
            }
        } else if (toolMode === CIRCLE_C_TOOL) {
            if (toolData.waitSecond) {
                toolData.waitSecond = false;
                canvas.removeEventListener("mousemove", mouseMoveListenerC);
                ctx.putImageData(toolData.backUp, 0, 0);
                let cx = toolData.firstPoint.x;
                let cy = toolData.firstPoint.y;
                let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
                labelSet.push(new Circle(cx, cy, r));
                drawCircle(ctx, cx, cy, r)
            } else {
                toolData.waitSecond = true;
                toolData.firstPoint = new Point(x, y);
                toolData.backUp = ctx.getImageData(0, 0, canvas.width, canvas.height);
                canvas.addEventListener("mousemove", mouseMoveListenerC);
            }
        }
        console.log(labelSet);
    };

    $("#revBtn").on("click", () => {
        canvas.height = canvas.height;
        labelSet.pop();
        ctx.drawImage(baseImg, 0, 0);
        ctx.fillStyle = ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        drawSet(ctx, labelSet);
    });

    $("#resetBtn").on("click", () => {
        canvas.height = canvas.height;
        labelSet = [];
        ctx.drawImage(baseImg, 0, 0);
        ctx.fillStyle = ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        drawSet(ctx, labelSet);
    });

    let data = {
        tag: baseImg.src,
        label: labelSet
    };

    $("#finBtn").on("click", () => {
        let historyData = eval(localStorage.STRUCT304);
        if (!historyData)
            historyData = [];
        historyData.push(data);
        localStorage.STRUCT304 = JSON.stringify(historyData);
        alert("保存成功！（在浏览器终端输入eval(localStorage.STRUCT304)即可查看）")
    });
});