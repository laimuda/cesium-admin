<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1,
            user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

    <title>三维地图</title>

    <link href="${contextpath}/site/PVIP/for3D/webgl/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <!-- <link href="${contextpath}/site/PVIP/for3D/webgl/examples/css/bootstrap.min.css" rel="stylesheet"> -->

    <!-- <script src="${contextpath}/resource/assets/jquery.min.js"></script> -->
    <!-- <script src="${contextpath}/resource/assets/bootstrap.min.js"></script> -->

    <script type="text/javascript" src="${contextpath}/resource/js/znvweb_plugin.js"></script>
    <script src="${contextpath}/resource/js/znvweb_lib.js"></script>
    <script src="${contextpath}/resource/assets/supermap/SuperMap.Include.js"></script>
    <!-- <script src="./config.js"></script> -->

    <script type="text/javascript" src="${contextpath}/resource/assets/require.min.js" data-main="./src/main.js"></script>
    <script type="text/javascript">
        var ZnvWeb = parent.ZnvWeb;
    </script>

    <link rel="stylesheet" href="./static/style/index.css">
</head>

<body id="for3d">
    <div class="" id="mask" oncontextmenu="event.preventDefault()"></div>

    <div id="toolbar" class="clearfix">

        <!-- 改变视角 -->
        <div class="btn-item txt change-view">
            <div class="mask"></div>
            <button class="btn">默认视角</button>
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="toDefault">默认视角</li>
                    <li class="item" data-key="1" data-item="toXm">西明挖段</li>
                    <li class="item" data-key="2" data-item="toDm">东明挖段</li>
                    <li class="item" data-key="3" data-item="toD">盾构段</li>
                </ul>
            </div>
        </div>

        <!-- 模式切换 -->
        <div class="btn-item txt change-model">
            <div class="mask"></div>
            <button class="btn">标准模式</button>
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="defModel">
                        标准模式

                        <ul class="sub">
                            <li class="item" data-key="0" data-item="toCAD">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                CAD图纸
                            </li>
                        </ul>
                    </li>
                    <li class="item" data-key="1" data-item="udModel">地下模式</li>
                    <li class="item" data-key="2" data-item="linkage">卷帘模式</li>
                </ul>
            </div>
        </div>

        <!-- 工程进度 -->
        <div class="btn-item icon gcjd">
            <div class="mask"></div>
            <button class="btn">工程进度</button>
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="turnPoint">桩号</li>
                    <li class="item" data-key="1" data-item="turnLine">
                        进度线
                        <ul class="sub znv-disable">
                            <li class="item" data-key="0" data-item="">
                                未施工
                            </li>
                            <li class="item" data-key="1" data-item="">
                                施工中
                            </li>
                            <li class="item" data-key="2" data-item="">
                                已完成
                            </li>
                        </ul>
                    </li>
                    <li class="item" data-key="2" data-item="">进度数据</li>
                </ul>
            </div>
        </div>

        <!-- 监测点 -->
        <div class="btn-item icon jcd">
            <div class="mask"></div>
            <button class="btn">监测点</button>
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="">
                        检测点
                        <ul class="sub">
                            <li class="item all-risk" data-key="0" data-item="allRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                工程所有风险点
                            </li>
                            <li class="item" data-key="1" data-item="zbRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                周边风险点
                            </li>
                            <li class="item" data-key="2" data-item="nbRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                工程内部风险点
                            </li>
                        </ul>
                    </li>
                    <li class="item" data-key="1" data-item="">
                        风险源等级
                        <ul class="sub risk-danger">
                            <li class="item all-risk-danger" data-key="0" data-item="riskDanger">
                                <span class='squaredTwo'>
                                    <input type="checkbox" checked>
                                    <label class="check-icon"></label>
                                </span>
                                所有风险源
                            </li>
                            <li class="item" data-key="1" data-item="riskDanger">
                                <span class='squaredTwo'>
                                    <input type="checkbox" checked>
                                    <label class="check-icon"></label>
                                </span>
                                重大风险
                            </li>
                            <li class="item" data-key="2" data-item="riskDanger">
                                <span class='squaredTwo'>
                                    <input type="checkbox" checked>
                                    <label class="check-icon"></label>
                                </span>
                                较大风险
                            </li>
                            <li class="item" data-key="3" data-item="riskDanger">
                                <span class='squaredTwo'>
                                    <input type="checkbox" checked>
                                    <label class="check-icon"></label>
                                </span>
                                一般分险
                            </li>
                            <li class="item" data-key="4" data-item="riskDanger">
                                <span class='squaredTwo'>
                                    <input type="checkbox" checked>
                                    <label class="check-icon"></label>
                                </span>
                                安全可控
                            </li>
                        </ul>
                    </li>
                    <li class="item" data-key="2" data-item="">检测数据</li>
                </ul>
            </div>
        </div>

        <!-- 建筑 -->
        <div class="btn-item icon build no-opts" data-item="isShowOfBuild">
            <div class="mask"></div>
            <button class="btn">建筑</button>
        </div>

        <!-- insar点 -->
        <div class="btn-item icon insar">
            <div class="mask"></div>
            <button class="btn">insar点</button>
        </div>

        <!-- 视频监控-->
        <div class="btn-item icon video no-opts" data-item="isShowVideo">
            <div class="mask"></div>
            <button class="btn">视频监控</button>
        </div>

        <!-- 工具箱-->
        <div class="btn-item icon tool">
            <div class="mask"></div>
            <button class="btn">工具箱</button>
        </div>

        <!-- 全屏 -->
        <div class="btn-item fr full gcjd no-opts" data-item="fullSize">
        </div>

    </div>

    <!-- 地图容器 -->
    <div class="wrap" oncontextmenu="event.preventDefault()">

        <!-- longding -->
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

        <!-- 右键菜单 -->
        <div class="right-menu" oncontextmenu="event.preventDefault()">
            <ul class="clearfix">
                <li class="select item" data-key="0" data-item="rightMenu">选择</li>
                <li class="hx item" data-key="1" data-item="rightMenu">滑行</li>
                <li class="xz item" data-key="2" data-item="rightMenu">旋转</li>
            </ul>
        </div>

        <!-- 视频监控 entity 点 -->
        <div class="vctl">
            <ul class="clearfix">
            </ul>
        </div>


        <div id="sandzMap" class="fullSize">
            <div class="mask"></div>

            <!-- Unity -->
            <iframe id="content" src="" frameborder="0" style="width:100%; height:100%"></iframe>

            <div id="fjx"></div>

            <!-- 超图 -->
            <div id="dtMap">
                <div id="cesiumContainer">
                    <div id="slider"></div>
                </div>
            </div>

        </div>
    </div>

</body>

</html>
