<?php
    $id_arr = array('jet', 'hyy');
    require('safe.php');
    if (!isset($_GET['id'])) {
        echo '<script>window.location = "./index.php?id=" + localStorage.id;</script>';
        die();
    } else if (!in_array($_GET['id'], $id_arr)) {
        echo '<script>delete localStorage.id;</script>';
    }

    if (isset($_POST['idString']) and in_array($_POST['idString'], $id_arr)) {
        $id = $_POST['idString'];
        $cur_label = $_POST['labelString'];
        $img = $_POST['imgSrc'];

        $database = mysqli_connect("localhost", "root", "JmsBryan123")
        or die("无法连接到数据库，请联系   jet@pku.edu.cn. err1");
        mysqli_select_db($database, "STRUCT")
        or die("无法选择数据库，请联系   jet@pku.edu.cn. err2");
        $query = "SELECT * FROM STRUCT304 WHERE IMAGE='$img'";
        $result = mysqli_query($database, $query)
        or die("无法访问数据库-2，请联系jet@pku.edu.cn.");
        if (mysqli_num_rows($result) == 0) {
            die("数据库错误，找不到项目" . $img . "，请联系jet@pku.edu.cn");
        }
        $row = mysqli_fetch_array($result);
        $label_cnt = ((int) $row['LABEL_CNT']) + 1;
        $label = substr($row['LABEL'], 0, strlen($row['LABEL']) - 1);
        if ($label_cnt > 1)
            $label = $label . ",";
        $label = $label . $cur_label . "]";
        $ffu = unserialize($row['FFU']);
        array_push($ffu, $id);
        $ffu = serialize($ffu);
        
        $query = "UPDATE STRUCT304 SET LABEL='$label', LABEL_CNT='$label_cnt', FFU='$ffu' WHERE IMAGE='$img';";
        mysqli_query($database, $query)
        or die("无法访问数据库-3，请联系jet@pku.edu.cn." . $label);
    }
?>
<html>
<head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="style.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"/>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="action.js"></script>
    <title>快乐标数据</title>
</head>
<body>

<div id="bigDiv">
    <div id="workshopDiv">
        <img id="baseImg" src="./data/"
        <?php
            echo "0000.jpg";
        ?>
        />
        <canvas id="workshop"></canvas>
    </div>
    <div id="toolsDiv">
        <input type="radio" class="toolSel" name="toolType" value="0" checked/>&nbsp点工具 <br/>
        <input type="radio" class="toolSel" name="toolType" value="1"/>&nbsp圆工具（对径点）<br/>
        <input type="radio" class="toolSel" name="toolType" value="2"/>&nbsp圆工具（圆心-圆周）<br/><br/>
        <button id="revBtn">撤销</button>&nbsp<button id="resetBtn">重置</button><br/>
        <button id="skipBtn">跳过</button>&nbsp<button id="finBtn">完成</button>
    </div>
    <form id="dataForm" method="post">
        <input type="text" id="imgSrcBox" name="imgSrc">
        <input type="text" id="labelBox" name="labelString">
        <input type="text" id="idBox" name="idString">
    </form>
</div>

</body>
</html>