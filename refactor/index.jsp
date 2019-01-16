<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1,
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
    <script src="${contextpath}/site/PVIP/constructionSite/js/hls.min.js"></script>
    <script type="text/javascript" src="${contextpath}/site/PVIP/constructionSite/js/ezuikit.js"></script>
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
                    <li class="item" data-key="2" data-item="showGcjd">进度数据</li>
                </ul>
            </div>
        </div>

        <!-- 监测点 -->
        <div class="btn-item icon jcd">
            <div class="mask"></div>
            <button class="btn">风险源</button>
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="">
                        风险源
                        <ul class="sub">
                            <li class="item all-risk" data-key="0" data-item="allRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                工程所有风险源
                            </li>
                            <li class="item" data-key="1" data-item="zbRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                周边风险源
                            </li>
                            <li class="item" data-key="2" data-item="nbRisk">
                                <span class='squaredTwo'>
                                    <input type="checkbox">
                                    <label class="check-icon"></label>
                                </span>
                                工程内部风险源
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
                    <li class="item" data-key="2" data-item="showJcsj">监测数据</li>
                </ul>
            </div>
        </div>

        <!-- 建筑 -->
        <div class="btn-item icon build no-opts active toggle" data-item="isShowOfBuild">
            <div class="mask"></div>
            <button class="btn">建筑</button>
        </div>

        <!-- insar点 -->
        <div class="btn-item icon insar" data-item="isInsarClick">
            <div class="mask"></div>
            <button class="btn">insar点</button>
            <div class="opts more o-insar">
                <div class="tit clearfix">
                    <div class="tit-item all item">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        全选
                    </div>
                    <div class="tit-item reverse item">
                        <span class='squaredTwo'>
                            <input type="checkbox">
                            <label class="check-icon"></label>
                        </span>
                        反选
                    </div>
                    <div class="tit-item"></div>
                </div>
                <ul class="sels">
                    <li class="item" data-key="1" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        一级 (&lt; -8.0)
                    </li>
                    <li class="item" data-key="2" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        二级 (-8.0 - -6.0)
                    </li>
                    <li class="item" data-key="3" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        三级 (-6.0 - -4.0)
                    </li>
                    <li class="item" data-key="4" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        四级 (-4.0 - -2.0)
                    </li>
                    <li class="item" data-key="5" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        五级 (-2.0 - 0)
                    </li>
                    <li class="item" data-key="6" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        六级 (0 - 2.0)
                    </li>
                    <li class="item" data-key="7" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        七级 (2.0 - 4.0)
                    </li>
                    <li class="item" data-key="8" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        八级 (4.0 - 6.0)
                    </li>
                    <li class="item" data-key="9" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        九级 (6.0 - 8.0)
                    </li>
                    <li class="item" data-key="10" data-item="chooseInsarGrade">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        十级 ( > 8.0)
                    </li>
                </ul>
            </div>
            <div class="opts more o-underground">
                <div class="tit clearfix">
                    <div class="tit-item all item">
                        <span class='squaredTwo'>
                            <input type="checkbox" checked>
                            <label class="check-icon"></label>
                        </span>
                        全选
                    </div>
                    <div class="tit-item reverse item">
                        <span class='squaredTwo'>
                            <input type="checkbox">
                            <label class="check-icon"></label>
                        </span>
                        反选
                    </div>
                    <div class="tit-item"></div>
                </div>
                <ul class="sels">
                </ul>
            </div>
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
            <div class="opts select">
                <ul>
                    <li class="item" data-key="0" data-item="lsClick">量算</li>
                    <li class="item" data-key="1" data-item="pickup">坐标拾取</li>
                    <li class="item" data-key="2" data-item="location">坐标定位</li>
                </ul>
            </div>
        </div>

        <!-- 全屏 -->
        <div class="btn-item fr full gcjd no-opts" data-item="fullSize">
        </div>

    </div>

    <!-- 地图容器 -->
    <div class="wrap">

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

            <!-- 量算容器 -->
            <div id="measure" class="map-tool">
                <button class="btn-item" id="distance" data-item="lsDis">测距</button>
                <button class="btn-item" id="area" data-item="lsArea">测面</button>
                <button class="btn-item" id="height" data-item="lsHeight">测高</button>
                <button class="btn-item" id="clear" data-item="lsClear">清除</button>
                <select id="selOpt1" class="select">
                    <option selected value="1">空间量算</option>
                    <option value="2">贴地量算</option>
                </select>
                <button class="close" data-item="lsClose"></button>
            </div>

            <!-- 坐标拾取 -->
            <div id="zbsq" class="map-tool">
                纬度: <span class="w">0</span>
                经度: <span class="j">0</span>
                高度: <span class="h">0</span>
                <button class="btn-item copy" data-item="pickupCoyp">复制</button>
                <button class="close" data-item="pickupClose"></button>
            </div>

            <!-- 坐标提示 -->
            <label for="" class="label-tip">0,0,0</label>

            <!-- 坐标定位 -->
            <div id="zbdw" class="map-tool">
                <input type="text" autofocus placeholder="输入纬度,经度,高度">
                <button class="btn-item submit" data-item="locationSub">确定</button>
                <button class="btn-item clear" data-item="locationCan">清除</button>
                <button class="close" data-item="locationClose"></button>
            </div>

            <!-- Unity -->
            <iframe id="content" src="" frameborder="0" style="width:100%; height:100%"></iframe>

            <div id="fjx"></div>

            <!-- tips bubble -->
            <blockquote id="bubble" class="bubble clearfix">
                <h4 id="title"></h4>
                <div id="des" class="word"></div>
            </blockquote>
            <blockquote id="bubble2" class="bubble clearfix">
            </blockquote>

            <!-- 工程进度数据 -->
            <div id="gcjd" class="show-data">
                <div class="container">
                    <h4 class="tit">工程进度<span class="icon" data-item="hideGcjd"></span></h4>
                    <div class="clearfix centent">
                        <div class="item">
                            <div class="tit">
                                总进度
                                <span class="x">%</span><span class="num">0</span>
                            </div>
                            <div class="pro">
                                <div></div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="tit">
                                西明挖段进度
                                <span class="x">%</span><span class="num">0</span>
                            </div>
                            <div class="pro">
                                <div></div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="tit">
                                东明挖断进度
                                <span class="x">%</span><span class="num">0</span>
                            </div>
                            <div class="pro">
                                <div></div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="tit">
                                盾构段进度
                                <span class="x">%</span><span class="num">0</span>
                            </div>
                            <div class="pro">
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 监测数据 -->
            <div id="jcsj" class="show-data">
                <div class="container">
                    <h4 class="tit">监测数据<span class="icon" data-item="hideJcsj"></span></h4>
                    <div class="clearfix centent">
                        <div class="item topC">
                            <div class="tit">第三方监测</div>
                            <div class="tb1">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>累计值</th>
                                            <th>&gt;100%</th>
                                            <th>80%-100%</th>
                                            <th>70%-80%</th>
                                            <th>&lt;70%</th>
                                        </tr>
                                        <tr class="row">
                                            <td>速率超标</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr class="row">
                                            <td>速率未超标</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="item bottomC">
                            <div class="tit">施工监测</div>
                            <div class="tb2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>累计值</th>
                                            <th>&gt;100%</th>
                                            <th>80%-100%</th>
                                            <th>70%-80%</th>
                                            <th>&lt;70%</th>
                                        </tr>
                                        <tr class="row">
                                            <td>速率超标</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr class="row">
                                            <td>速率未超标</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="item bodC">
                            <div class="tit">当前进度风险点信息</div>
                            <div class="tb3">
                                <ul class="wxInfo">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 超图 -->
            <div id="dtMap">
                <div id="cesiumContainer" oncontextmenu="event.preventDefault()">
                    <div id="slider"></div>
                </div>
            </div>

        </div>
    </div>

</body>

</html>
