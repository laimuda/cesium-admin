<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1,
    user-scalable=no">
    <title>三维地图</title>
    <link href="${contextpath}/site/PVIP/for3D/webgl/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <link href="${contextpath}/site/PVIP/for3D/webgl/examples/css/bootstrap.min.css" rel="stylesheet">
    <link href="${contextpath}/site/PVIP/for3D/webgl/examples/css/pretty.css?d=18" rel="stylesheet">
    <link rel="stylesheet" href="/site/PVIP/for3D/refactor/static/style/bigIndex.css">

    <script src="/resource/assets/jquery.min.js"></script>
    <script src="${contextpath}/site/PVIP/for3D/webgl/examples/js/bootstrap.min.js"></script>
    <script src="${contextpath}/site/PVIP/for3D/webgl/examples/js/bootstrap-select.min.js"></script>
	<script type="text/javascript" src="/resource/assets/echarts.min.js"></script>
	<script type="text/javascript" src="${contextpath}/resource/js/znvweb_plugin.js"></script>
	<script src="${contextpath}/resource/js/znvweb_lib.js"></script>
    <!-- <script src="./js/config.js"></script> -->
    <!-- <script src="/site/PVIP/for3D/webgl/example/js/supermap/SuperMap.Include.js"></script> -->
    <script type="text/javascript" src="/resource/assets/require.min.js" data-main="/site/PVIP/for3D/refactor/src/bigIndex.js"></script>
    <!-- <script src="./js/Bubble.js"></script> -->
    <script type="text/javascript">
        var ZnvWeb = parent.ZnvWeb;
    </script>
    <style>
        html, body, #cesiumContainer {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000000;
        }

        b, p {
            color: #ffffff;
        }
    </style>
</head>
<body>
<div id="cesiumContainer"></div>

<blockquote id="bubble" class="bubble">
    <!--<img id="myimg" src="./images/home_banner.jpg" width="50%" height="auto">-->
    <h4 id="title"></h4>
    <div id="des" class="word"></div>
    <!-- <audio controls="controls">
    <source src="./media/song.mp3" type="audio/mpeg" ></source>Your browser does not support the audio tag.
    </audio>-->
</blockquote>
<div id='loadingbar' class="spinner">
    <div class="spinner-container container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
</div>
<div class='dimensional'>
	<canvas id="myCanvas" style='width:0px;height:0px'></canvas>
	<div class='mask'></div>
</div>
<div id="toolbar" style="position: absolute;left: 10px;top: 30px;z-index: 999">

    <div id="pannel" style="padding: 10px;">
        <div id="ground" class="col-sm-12">
         <span id="g_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox">
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>insar 点</p>


        </div>
        <div id="building" class="col-sm-12">
        <span id="b_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox" checked>
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-12'>建筑</p>


        </div>
        <div id="line" class="col-sm-12" style="display: none;">
        <span id="l_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox" checked>
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>线</p>


        </div>
  <div id="progress" class="col-sm-12" style="display: none;">
  <span id="p_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox" checked>
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>进度点</p>


        </div>
        <div id="risk" class="col-sm-12">
         <span id="r_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox">
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>周边环境风险点</p>


        </div>
        <div id="arisk" class="col-sm-12">
         <span id="a_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox">
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>工程内部风险点</p>


        </div>
         <div id="dAll" class="col-sm-12">
         <span id="d_one" class='col-sm-2'>
    <div class="squaredTwo" data="1">
    <input type="checkbox">
    <label class="check-icon"></label>
    </div>

    </span>
            <p class='col-sm-9'>工程全部风险点</p>
        </div>
    </div>
</div>
<!-- <script type="text/javascript" src='./js/bigIndex.js?d=27'></script> -->

</body>
</html>
