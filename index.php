<?php
    $id_arr = array('jet', 'hyy');
    require('safe.php');
    if (!isset($_GET['id'])) {
        echo '<script>window.location = "./index.php?id=" + localStorage.id;</script>';
        die();
    } else if (!in_array($_GET['id'], $id_arr)) {
        echo '<script>delete localStorage.id;</script>';
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
        <img id="baseImg" src="./data/1.jpg"/>
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