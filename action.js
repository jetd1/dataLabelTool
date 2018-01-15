let colorList = [
    'blue', 'red', 'coral', 'yellow',
    'green', 'lime', 'violet', 'brown',
    'aqua', 'olive', 'purple', 'teal'
];

function Circle(cx, cy, r) {
    this.x = cx;
    this.y = cy;
    this.r = r;
}

function drawPoint(ctx, x, y) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCircle(ctx, cx, cy, r) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function clearCanvasDrawSet(ctx, set) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < set.length; i++) {
        ctx.strokeStyle = ctx.fillStyle = colorList[i];
        if (set[i].r > 0)
            drawCircle(ctx, set[i].x, set[i].y, set[i].r);
        else
            drawPoint(ctx, set[i].x, set[i].y);
    }
}

$(document).ready(() => {
    let labelSet = [];
    let baseImg = $("#baseImg")[0];
    // console.log(baseImg.crossOrigin);
    let workshop = $("#workshop");
    let canvas = workshop[0];
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    let ctx = canvas.getContext('2d');
    // ctx.drawImage(baseImg, 0, 0);
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
        let x = e.offsetX;
        let y = e.offsetY;
        clearCanvasDrawSet(ctx, labelSet);
        let cx = (x + toolData.firstPoint.x) / 2;
        let cy = (y + toolData.firstPoint.y) / 2;
        let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        ctx.strokeStyle = ctx.fillStyle = colorList[labelSet.length];
        drawCircle(ctx, cx, cy, r);
    };

    let mouseMoveListenerC = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        clearCanvasDrawSet(ctx, labelSet);
        let cx = toolData.firstPoint.x;
        let cy = toolData.firstPoint.y;
        let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        ctx.strokeStyle = ctx.fillStyle = colorList[labelSet.length];
        drawCircle(ctx, cx, cy, r);
    };

    let mouseMoveListenerM = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        clearCanvasDrawSet(ctx, labelSet);
        ctx.strokeStyle = ctx.fillStyle = colorList[labelSet.length];
        drawCircle(ctx, x, y, toolData.curR);
    };

    canvas.onclick = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;

        if (!toolData.waitSecondFlag) {
            if (toolData.moveFlag) {
                toolData.moveFlag = false;
                canvas.removeEventListener("mousemove", mouseMoveListenerM);
                labelSet.push(new Circle(x, y, toolData.curR));
                clearCanvasDrawSet(ctx, labelSet);
                return;
            } else if (labelSet.length > 0 &&
                labelSet[labelSet.length - 1].r > 0 &&
                Math.abs(x - labelSet[labelSet.length - 1].x) < 5 &&
                Math.abs(y - labelSet[labelSet.length - 1].y) < 5) {
                let last = labelSet.pop();
                toolData.moveFlag = true;
                toolData.curR = last.r;
                canvas.addEventListener("mousemove", mouseMoveListenerM);
                console.log("Move Start");
                return;
            }
        }

        if (toolMode === POINT_TOOL) {
            labelSet.push(new Circle(x, y, 0));
            clearCanvasDrawSet(ctx, labelSet);
        } else if (toolMode === CIRCLE_D_TOOL) {
            if (toolData.waitSecondFlag) {
                toolData.waitSecondFlag = false;
                canvas.removeEventListener("mousemove", mouseMoveListenerD);
                let cx = (x + toolData.firstPoint.x) / 2;
                let cy = (y + toolData.firstPoint.y) / 2;
                let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
                labelSet.push(new Circle(cx, cy, r));
                clearCanvasDrawSet(ctx, labelSet);
            } else {
                toolData.waitSecondFlag = true;
                toolData.firstPoint = new Circle(x, y, 0);
                canvas.addEventListener("mousemove", mouseMoveListenerD);
            }
        } else if (toolMode === CIRCLE_C_TOOL) {
            if (toolData.waitSecondFlag) {
                toolData.waitSecondFlag = false;
                canvas.removeEventListener("mousemove", mouseMoveListenerC);
                let cx = toolData.firstPoint.x;
                let cy = toolData.firstPoint.y;
                let r = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
                labelSet.push(new Circle(cx, cy, r));
                clearCanvasDrawSet(ctx, labelSet);
            } else {
                toolData.waitSecondFlag = true;
                toolData.firstPoint = new Circle(x, y, 0);
                canvas.addEventListener("mousemove", mouseMoveListenerC);
            }
        }
        console.log(labelSet);
    };

    $("#revBtn").on("click", () => {
        labelSet.pop();
        clearCanvasDrawSet(ctx, labelSet);
    });

    $("#resetBtn").on("click", () => {
        labelSet = [];
        clearCanvasDrawSet(ctx, labelSet);
    });

    $("#skipBtn").on("click", () => {
        labelSet = [];
        clearCanvasDrawSet(ctx, labelSet);
        $("#finBtn").click();
    });

    $("#finBtn").on("click", () => {
        let baseImgSrc = baseImg.src;
        let data = {
            tag: baseImgSrc.substr(baseImgSrc.lastIndexOf("/") + 1),
            label: labelSet
        };
        let historyData = eval(localStorage.STRUCT304);
        if (!historyData)
            historyData = [];
        historyData.push(data);
        localStorage.STRUCT304 = JSON.stringify(historyData);
        alert("保存成功！（在浏览器终端输入eval(localStorage.STRUCT304)即可查看）");
        console.log("目前已保存的信息（JSON）：");
        console.log(eval(localStorage.STRUCT304))
    });
});