/**
 * @file 处理业务逻辑
 */
define( [
    'Cesium',
    'viewer',
    'api',
    'layerCtl',
    'cameraCtl',
    'lineEntities',
    'pointEntities',
    'zbRiskEntities',
    'nbRiskEntities',
    'allRiskEntities',
    'riskEntities',
    './config/insarLevel',
    './Event/rotate',
    './Event/moveFly',
    './Event/rightMenu',
    'videoCtl',
    'lsCtl',
    './var/layers',
    'pickupCtl',
    'locCtl',
    'Bubble',
    'ZnvUrls',
    'echarts'
], function ( Cesium, viewer, api, layerCtl, cameraCtl, lineEntities, pointEntities, zbRiskEntities,
        nbRiskEntities, allRiskEntities, riskEntities, insarLevel, rotate, moveFly, rightMenu,
        videoCtl, lsCtl, layers, pickupCtl, locCtl, Bubble, ZnvUrls, echarts ) {
    'use strict';

    const UPSTEP = 1000000000, ACTIVE = 'active';

    var origin = window.location.origin;

    function _fn( _viewer ) {

        // 暴露给 Unity
        $.extend( window._Unity, {
            allRiskEntities: allRiskEntities,
            pointEntities: pointEntities,
            layerCtl: layerCtl,
            videoCtl: videoCtl
        } );

        rotate( _viewer ); // 注册旋转
        moveFly( _viewer ); // 注册滑行
        rightMenu( _viewer ); // 鼠标右键弹出菜单

        // 点击使 show-data 消失
        canvasClick( _viewer, function ( e ) {
            $( '.show-data' ).removeClass( ACTIVE );
        } );

        // 创建地下模式菜单
        createOUnderground( _viewer );

        // 注册提示栏
        runBubble( _viewer );

        // 加载建筑图层
        runBuild( _viewer );

        // insar
        runInsar( _viewer );
        showTipForInsar( _viewer );

        // 全部风险点
        runRisk( _viewer );

        // 进度线 桩号
        runProgress( _viewer );
        showTipForPoint( _viewer );
        getGcjdData( _viewer );

        // 视频监控
        runVideo( _viewer );

        // 注册量算的 change 事件
        runLs( _viewer );

        // 坐标拾取
        runPickup( _viewer );

        // 坐标定位
        runLoc( _viewer );

        // 点击风险点获取附近建筑物
        runGetCurBuild( _viewer );
        showTipForRisk( _viewer );
        getJcsjData( _viewer );

        $( '.change-view, .change-model, .tool' )
            .find( '.mask' ).hide(); // 遮罩层
        $( '#loadingbar' ).hide();
    };

    function runRisk ( _viewer ) {
        $.when( api.getAllRisk(), api.getCurRisk() ).then( function ( allRisk, curRisk ) {
            // console.log( 'curRiskData:', curRisk );
            // console.log( 'allRiskData:', allRisk );

            var riskMap = {
                '4': '极高风险',
                '3': '高等级风险',
                '2': '中等风险',
                '1': '低等级风险'
            };

            // riskSourceId 映射 entity
            // 用于周边风险点查找
            var idMap = {};

            // 全部风险点
            $.each( allRisk, function ( index, item ) {
                var isEmpty = true, key;

                for ( key in riskMap ) {
                    $.each( item[ key ], function ( i, risk ) {
                        isEmpty = false;
                        pushEntities( risk, key );
                    } )
                }

                // 无风险
                if ( isEmpty ) {
                    pushEntities( item, 0 );
                }
            } );

            // 周边风险点, 工程内部风险点
            $.each( curRisk, function ( index, item ) {
                var isEmpty = true, key;

                for ( key in riskMap ) {
                    $.each( item[ key ], function ( i, risk ) {
                        isEmpty = false;
                        noHaveIdPush( risk, key, !pushCurEntity( getID( risk ) ) );
                    } )
                }

                if ( isEmpty ) {
                    noHaveIdPush( item, 0, !pushCurEntity( getID( item ) ) );
                }
            } );

            // 显示
            allRiskEntities.turn( false );
            allRiskEntities.show();

            // 显示检测点
            hideMask( '.jcd' );

            // 添加 Entity
            function pushEntities ( obj, key ) {
                var id = getID( obj );

                if ( obj.rLong == null ) {
                    // console.log( '<<< don\'t have rLong' );
                    // 基坑
                    idMap[ id ] = obj;
                    return;
                }

                var x = +obj.rLong, y = +obj.rLaitu;
                var entity, name = '', index = 4;

                if ( 0 !== key ) {
                    index = 5 - key;
                    name = ', ' + riskMap[ key ];
                }

                entity = new Cesium.Entity( {
                    vname: obj.riskSource + name,
                    vdata: obj,
                    vPosition: { x: x, y: y, z: 40 },
                    billboard: {
                        image: origin + '/site/PVIP/for3D/webgl/examples/images/risk' + index + '.png',
                        width: 20,
                        height: 20
                    },
                    position: Cesium.Cartesian3.fromDegrees( x, y, 40),
                } );

                // 用于周边风险源查找
                idMap[ id ] = entity;

                allRiskEntities.push( entity );
                riskEntities[ key ].push( entity );
                return entity;
            }

            // 根据 id 查询添加 entity
            function pushCurEntity ( id ) {
                if ( !id ) {
                    return false;
                }

                var _entity = idMap[ id ];

                if ( _entity instanceof Cesium.Entity )  {
                    pushZbNbEntity( _entity._vdata.riskSourceTypeId, _entity );
                    return true;
                }

                if ( _entity != null ) {
                    // console.log(
                    //     '全部风险源里面有周边风险点但是全部风险源的点没有经纬度! data:',
                    //     _entity
                    // );
                } else {
                    console.error( '全部风险源里面没有周边风险源!' );
                }

                return false;
            }

            // Fixed: 周边风险点里面有些是全部风险点里面没有
            function noHaveIdPush ( obj, key, flag ) {
                if ( flag ) {
                    pushZbNbEntity( obj.riskSourceTypeId, pushEntities( obj, key ) );
                }
            }

            // 周边风险点, 工程内部风险点添加 entity
            function pushZbNbEntity ( type, entity ) {
                switch ( +type ) {
                    case 1: // 工程内部风险点
                        nbRiskEntities.push( entity );
                        break;

                    default: // 周边风险点
                        zbRiskEntities.push( entity );
                        break;
                }
            }

            // 计算 ID, 数据没有唯一 ID
            function getID ( obj ) {
                return obj.riskSourceId + ( obj.riskEventId ? obj.riskEventId : '' );
            }
        } );
    }

    function runProgress ( _viewer ) {
        $.when( api.getLine(), api.getPoint() ).then( function ( line, point ) {
            line = line.list;
            line.sort( function ( a, b ) {
                return a.smX - b.smX;
            } );

            var upSmX, upStart, upEnd, sms;
            var push = Array.prototype.push;
            var unshift = Array.prototype.unshift;

            var xmSms = lineEntities.xm.sms = [];
            var dSms = lineEntities.d.sms = [];
            var dmSms = lineEntities.dm.sms = [];

            $.each( line, function ( index, item ) {

                pointEntities.add( {
                    name: '工程进度点-' + index,
                    vMsg: item,
                    point: new Cesium.PointGraphics( {
                        color: new Cesium.Color( 1, 1, 0 ),
                        pixelSize: 7,
                        outlineColor: new Cesium.Color( 0, 1, 1 )
                    } ),
                    position: Cesium.Cartesian3.fromDegrees( +item.smX, +item.smY , 3.0 )
                } );

                // 添加进度线
                upSmX = item.smX * UPSTEP;
                upStart = point.startrLong * UPSTEP;
                upEnd = point.endrLong * UPSTEP;

                if( upSmX <= upStart ){ // 西明挖段
                    sms = xmSms;
                } else if ( upSmX >= upEnd ){ // 东明挖断
                    sms = dmSms;
                } else { // 盾挖断
                    sms = dSms;
                }

                push.apply( sms, [ +item.smX, +item.smY, 2.0 ] );
            } );


            unshift.apply( dSms, xmSms.slice( xmSms.length - 3 ) );
            push.apply( dSms, dmSms.slice( 0, 3) );

            drawLine( lineEntities.xm, Cesium.Color.AQUA );
            drawLine( lineEntities.d, Cesium.Color.BURLYWOOD );
            drawLine( lineEntities.dm, Cesium.Color.CORNFLOWERBLUE );

            // 打开遮罩层
            hideMask( '.gcjd' );

            // 绘制进度线
            function drawLine ( target, color ) {
                target.add( {
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights( target.sms ),
                        height: 0, //离地高度
                        width: 10, //线宽
                        material: color,
                        outline: false, //外边线
                        outlineColor: Cesium.Color.BLACK
                    }
                } );
            }
        } );
    }

    function runVideo ( _viewer ) {
        videoCtl.post().then( function ( data ) {
            // console.log( 'data:::', data );

            var IMAGE = '/resource/images/icon/local_parabolic-aerial_fushu.png';
            var SUBIMG = '/resource/images/icon/monitor-Point.png';
            var R = 30, W = 10;
            var $t = $( '.vctl' );

            // 子菜单点击消失
            $t.mousedown( function () {
                $( this ).removeClass( ACTIVE );
            } );
            // 子菜单点击播放
            $t.on( 'mousedown', 'li img', function () {
                console.log( '>>> Play', $( this ).data( 'devId' ) );
                // videoCtl.play( $( this ).data( 'devId' ) );
            } );

            // 遍历创建 entity
            var points = [], clong, claitu, pMap = {}, image, ids = [];
            $.each( data, function ( index, item ) {
                clong = item.clong;
                claitu = item.claitu;

                if ( pMap[ clong ] && pMap[ clong ] === claitu ) {
                    pMap[ 'c_' + clong ]++;
                    image = IMAGE;
                    videoCtl.remove( pMap[ 'p_' + clong ] );
                    pMap[ 'id_' + clong ].push( item.device_id );
                } else {
                    pMap[ clong ] = claitu;
                    pMap[ 'c_' + clong ] = 1;
                    pMap[ 'id_' + clong ] = [ item.device_id ];
                    image = undefined;
                }

                if ( clong && claitu ) {
                    points.push( [ clong, claitu, item.device_id ] );
                    ids.push( item.device_id );
                    pMap[ 'p_' + clong ] = videoCtl.push( {
                        lng: +clong,
                        lat: +claitu,
                        height: 100,
                        image: image,
                        isMore: pMap[ 'c_' + clong ] > 1,
                        count: pMap[ 'c_' + clong ],
                        ids: ids,
                        curIds: pMap[ 'id_' + clong ],
                        clong: +clong,
                        claitu: +claitu,
                        position: new Cesium.Cartesian3.fromDegrees(
                            +clong,
                            +claitu,
                            150
                        )
                    } );
                }
            } );

            // 显示视频散点
            videoCtl.show();

            // 注册点击事件, 显示二级选项
            var oldEn, i;
            videoCtl.click( function ( e, _entity ) {
                console.log( 'entity:', _entity );
                var wgs = new Cesium.Cartesian3.fromDegrees(
                    _entity._vclong,
                    _entity._vclaitu,
                    10
                );
                var ve = Cesium.SceneTransforms
                    .wgs84ToWindowCoordinates( _viewer.scene, wgs );
                var curIds = _entity._vcurIds;
                var count = _entity._vCount;
                var x = ve.x;
                var y = ve.y;
                var r = 2 * Math.PI / count;
                var _x, _y;
                var hx = $t.width() / 2, hy = $t.height() / 2;

                if ( !_entity._visMore ) { // 只有一个视频监控
                    console.log( '>>> Play', curIds[ 0 ] );
                    // videoCtl.play( curIds[ 0 ] );
                } else { // 多个视频监控
                    // 在屏幕绕原点弹出
                    // 需要获取屏幕坐标
                    $t.empty();

                    for ( i = 0; i < count; i++ ) {
                        _x = R * Math.cos( r * i + Math.PI/2 ) + hx;
                        _y = R * Math.sin( r * i + Math.PI/2 ) + hy - R/2 + W/2;
                        $t.append( $( '<li>' ).append( $( '<img>', {
                            src: SUBIMG
                        } ).data( 'devId', curIds[ i ] ) ).css( {
                            left: _x,
                            top: _y
                        } ) );
                    }

                    if ( $t.hasClass( ACTIVE ) && oldEn !== _entity ) {
                        $t.removeClass( ACTIVE );
                    } else {
                        _setXY( x, y, hx, hy );
                        window.setTimeout( function () {
                            $t.toggleClass( ACTIVE );
                        }, 100 );
                    }
                }

                oldEn = _entity;
            } );

            // 数据库有可能返回了一个空数组
            if ( videoCtl._entities.length > 0 ) {
                hideMask( '.video' );
            } else {
                console.warn( '<<< 视频监控接口返回空数据, data:', data );
            }

            // 设置样式
            function _setXY ( x, y, hx, hy ) {
                $t.css( {
                    left: x - hx,
                    top: y - hy + $( '#toolbar' ).height()
                } );
            }
        } );
    }

    function runInsar ( _viewer ) {
        // 加载 insar 图层
        layerCtl( 'insar' ).then( function () {
            layerCtl.insar._layer._visible = false;
        } );
        // 获取 insar 数据, 比较慢
        layerCtl.insarCtl.api = api.getInsarData().then( function ( data ) {
            if ( !layerCtl.insar ) { // 判断是否加载了 insar 图层
                return;
            }

            data = data.list;
            layerCtl.insarCtl.isLoaded = true;

            hideMask( '.insar' );

            layerCtl.insar.then( function ( layer ) {
                $.each( insarLevel.map, function ( index ) {
                    insarLevel.map[ index ] = true;
                } );
                layerCtl.insarCtl.data( data ).click( function ( e, _point ) {
                    console.log( '_point:', _point );

                    // 显示提示栏
                    // showTipForInsar();
                } );
            } );
        } );
    }

    function runBuild ( _viewer ) {
        layerCtl( 'build' ).then( function ( build ) {
            build.brightness = 1.8;
            build.contrast = 1.1;
            build.saturation = 1.2;
            build.gamma = 1.3;

            hideMask( '.build' );
        } );
    }

    function runLs ( _viewer ) {
        lsCtl( _viewer );
        $( function () {
            $( '#selOpt1 ' ).change( function () {
                lsCtl.change( +$( this ).val() );
            } );
        } );
    }

    function runPickup ( _viewer ) {
        pickupCtl( _viewer, '.label-tip' ); // 注册坐标拾取
        pickupCtl.callback.add( function ( fd ) {
            var $t = $( '#zbsq' );
            $t.find( '.w' ).text( fd.lng.toFixed( 10 ) );
            $t.find( '.j' ).text( fd.lat.toFixed( 10 ) );
            $t.find( '.h' ).text( fd.h.toFixed( 10 ) );
        } );
        $( '.label-tip' ).mousemove( function ( e ) {
            var msg = this.getBoundingClientRect();
            $( this ).css( {
                top: function () {
                    return msg.left + e.offsetX;
                },
                left: function () {
                    return msg.top + e.offsetY;
                }
            } );
        } );
    }

    function runLoc ( _viewer ) {
        // 回车确定
        $( '#zbdw input' ).keypress( function ( $e ) {
            if ( $e.keyCode === 13 ) {
                $( this ).siblings( '.submit' ).click();
            }
        } )
        // 右键粘贴
        // .on( 'contextmenu', function ( $e ) {
        //     $( this ).val( pickupCtl.txt );
        // } );
    }

    function runGetCurBuild ( _viewer ) {
        allRiskEntities.click( function ( e, _entity ) {
            var centerPoint = new SuperMap.Geometry.Point(
                _entity.vPosition.x,
                _entity.vPosition.y
            );
            queryByDistance( centerPoint, 0.0002 );
        } );

        // 获取附近建筑 ID
        function processCompleted( queryEventArgs ) {
            console.log( 'queryEventArgs:', queryEventArgs.result );

            var i, j, result = queryEventArgs.result, SmID;

            for(i = 0;i < result.recordsets.length; i++) {
                for(j = 0; j < result.recordsets[ i ].features.length; j++) {
                    // 暂时使用 SmUserID
                    SmID = result.recordsets[ i ].features[ j ].data.SmUserID;
                }
            }

            if ( SmID ) {
                layerCtl.build.then( function ( build ) {
                    build.setSelection( SmID );
                } );
            }
        }

        function processFailed( e ){
            console.error( e.error.errorMsg );
        }

        function queryByDistance( centerPoint, queryDis ) {
            var queryByDistanceParams = new SuperMap.REST.QueryByDistanceParameters({
                queryParams: new Array( new SuperMap.REST.FilterParameter( {
                    name: "FZ000TY@JZTY"
                } ) ),
                returnContent: true,
                distance: queryDis,
                geometry: centerPoint,
                isNearest: true,
                expectCount: 1
            });

            var queryByDistanceService = new SuperMap.REST.QueryByDistanceService(
                ZnvUrls.ip_2 + ZnvUrls.getCurBuild
            );

            queryByDistanceService.events.on( {
                "processCompleted": processCompleted,
                "processFailed": processFailed
            } );

            queryByDistanceService.processAsync( queryByDistanceParams );
        }
    }

    function runBubble ( _viewer ) {
        // 创建提示栏
        viewer.bubble = new Bubble( _viewer.scene, 'bubble' );
        // 点击消失
        var handler = new Cesium.ScreenSpaceEventHandler( _viewer.scene.canvas );
        handler.setInputAction( function ( e ) {
            viewer.bubble.visibility( false );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );
    }

    function hideMask ( id ) {
        if ( cameraCtl._curModel !== 'linkage' ) {
            $( id ).find( '.mask' ).hide();
        }
    }

    function createOUnderground () {
        $( function () {
            var $ul = $( '.o-underground .sels' );
            $.each( layers, function ( index, layer ) {
                $ul.append( '<li class="item" data-key="' + index + '" data-item="isShowUdLayers">' +
                    '<span class="squaredTwo">' +
                        '<input type="checkbox" checked>' +
                        '<label class="check-icon"></label>' +
                    '</span>' +
                    layer +
                '</li>' );
            } );
        } );
    }

    function showTipForRisk ( _viewer ) {
        allRiskEntities.click( function ( e, _entity ) {

            var arrStr = _entity._vname.split( ',' );
            var data = _entity._vdata;
            var html =
                '<p>风险概况:' + data.riskDesc + '</p>' +
                '<p>结构类型:' + data.structType + '</p>' +
                '<p>基础类型:' + data.basicType + '</p>' +
                '<p>竣工时间:' + data.finishTime + '</p>';

            exitEcharts();
            $( '#title' ).text( arrStr[ 0 ] + ' ' + ( arrStr[ 1 ] || '' ) );
            $( '#des' ).html( html );

            var bubbleposition = new Cesium.Cartesian3.fromDegrees(
                _entity.vPosition.x,
                _entity.vPosition.y,
                _entity.vPosition.z
            );

            viewer.bubble.showAt( bubbleposition );
        } );
    }

    function showTipForPoint ( _viewer ) {
        pointEntities.click( function ( e, _entity ) {

            var strInfoX = ( +_entity._vMsg.smX ).toFixed( 6 );
            var strInfoY = ( +_entity._vMsg.smY ).toFixed( 6 );

            exitEcharts();
            $( '#title' ).text( '桩号: ' + _entity._vMsg.No );
            $( '#des' ).html(
                '<p>x: ' + strInfoX + '</p>' +
                '<p>y: ' + strInfoY + '</p>'
            );

            var bubbleposition = new Cesium.Cartesian3.fromDegrees(
                +_entity._vMsg.smX,
                +_entity._vMsg.smY,
                10 );
            viewer.bubble.showAt( bubbleposition );
        } );
    }

    function showTipForInsar ( _viewer ) {
        var _api = layerCtl.insarCtl.api;

        if ( !api ) {
            return;
        }

        _api.then( function () {
            layerCtl.insarCtl.click( function ( e, _point ) {
                var pccode = _point.pcode;

                $( '.bubble' ).addClass( ACTIVE );
                $( '#title' ).text( 'PCODE: ' + pccode + '沉降数据图' );
                $( '#des' ).html(
                    '<div id="chart" style="width: 260px; height: 200px; z-index:7"></div>'
                );

                api.getMoInsarpointByPcode( pccode ).then( drawEcharts );
            } );
        } );

        function drawEcharts ( data ) {
            var myChart = echarts.init( $( '#chart' )[ 0 ] );

            var date = data.date;
            var list = date.dateList;
            var code = [], arr = [], _item;

            $.each( list, function ( _, item ) {
                _item = item.split( ':' );
                code.push( _item[ 0 ] );
                arr.push( +_item[ 1 ] );
            } );

            var option = {
                grid: {
                    top: 10,
                    bottom: 40,
                    left: 35,
                    right: 10
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: code
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: [{
                        lte: 6,
                        color: 'green'
                    }, {
                        gt: 6,
                        lte: 8,
                        color: 'red'
                    }, {
                        gt: 8,
                        lte: 14,
                        color: 'green'
                    }, {
                        gt: 14,
                        lte: 17,
                        color: 'red'
                    }, {
                        gt: 17,
                        color: 'green'
                    }]
                },
                series: [
                    {
                        name: '沉降值',
                        type: 'line',
                        smooth: true,
                        data: arr,

                    }
                ]
            };

            myChart.setOption( option );

            var bubbleposition = new Cesium.Cartesian3.fromDegrees(
                date.smX, date.smY, date.height
            );
            viewer.bubble.showAt( bubbleposition );
        }
    }

    function exitEcharts () {
        $( '.bubble' ).removeClass( ACTIVE );
    }

    function getGcjdData ( _viewer ) {
        api.getProgressData().then( function ( data ) {
            data = data.data[ 0 ];

            // 修改 html
            var $nums = $( '#gcjd .num' );
            var keys = [ 'totlePer', 'westPer', 'eastPer', 'middlePer' ];

            $.each( keys, function ( index, k ) {
                $nums.eq( index ).html( data[ k ] )
                    .parent().siblings( '.pro' ).find( 'div' )
                    .css( 'transform', 'translateX(-' + ( 100 - data[ k ] ) + '%)' );
            } );
        } );
    }

    function getJcsjData ( _viewer ) {
        api.rateEx( {
            type: 1
        } ).then( function ( data ) {
            // 修改第二个表格
            _setTable( '#jcsj .tb2 .row', data );
        } );

        api.rateEx( {
            type: 2
        } ).then( function ( data ) {
            // 修改第一个表格
            _setTable( '#jcsj .tb1 .row', data );
        } );

        api.curProgressRiskMsg().then( function ( data ) {

            var html = '';

            $.each( data, function ( _, item ) {
                html +=
                    '<li class="info">' +
                        item.riskSource + '&nbsp&nbsp' + item.riskEvent +
                    '</li>';
            } );

            $( '#jcsj .tb3 ul' ).html( html );
        } );

        function _setTable ( id, data ) {
            var $trs = $( id );
            var trs = [ $trs.eq( 0 ).find( 'td' ), $trs.eq( 1 ).find( 'td' ) ];
            var kMap = [ 'levelOneCount', 'levelTwoCount', 'levelThreeCount', 'levelFourCount' ];

            // 修改第二个表格
            $.each( data.warnWorkStat, function ( index, item ) {
                $.each( kMap, function ( i, k ) {
                    trs[ index ].eq( i + 1 ).text( item[ k ] );
                } );
            } );
        }
    }

    function canvasClick ( _viewer, fn ) {
        if ( typeof fn !== 'function' ) {
            return;
        }
        // 点击消失
        var handler = new Cesium.ScreenSpaceEventHandler( _viewer.scene.canvas );
        handler.setInputAction( function ( e ) {
            fn( e );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );
    }

    return _fn;
} );
