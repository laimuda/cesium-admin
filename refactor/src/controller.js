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
    'videoCtl'
], function ( Cesium, viewer, api, layerCtl, cameraCtl, lineEntities, pointEntities, zbRiskEntities,
        nbRiskEntities, allRiskEntities, riskEntities, insarLevel, rotate, moveFly, rightMenu,
        videoCtl ) {
    'use strict';

    const UPSTEP = 1000000000, ACTIVE = 'active';

    var origin = window.location.origin;

    return function ( _viewer ) {
        var flag = true;

        // 测试
        $( '#btn' ).click( function () {
            // zbRiskEntities.turn( !zbRiskEntities._show );
            // nbRiskEntities.turn( !nbRiskEntities._show );

            // flag = !flag;
            // var ret = $.map( insarLevel.map, function ( item ) {
            //     return item = flag;
            // } );
            // layerCtl.insarCtl.setMapLevel( ret );

            // 切到地下模式
            // cameraCtl.changeModel( 'underground' );

            // 开始旋转
            // rotate.start();

            // 开始滑行
            // moveFly.start();

            _viewer.trackedEntity = null;
        } );

        $( '#btn1' ).click( function () {
            // 结束滑行
            moveFly.close();

            // 结束旋转
            // rotate.close();

            // 切换到标准模式
            // cameraCtl.changeModel( 'default' );

            // flag = !flag;
            // var ret = $.map( insarLevel.map, function ( item ) {
            //     return true;
            // } );
            // ret[ 5 ] = flag
            // layerCtl.insarCtl.setMapLevel( ret );

            // allRiskEntities.turn( !allRiskEntities._show );
        } );

        $( '.change-view, .change-model' )
            .find( '.mask' ).hide();
        $( '#loadingbar' ).hide();

        rotate( _viewer ); // 注册旋转
        moveFly( _viewer ); // 注册滑行
        rightMenu( _viewer ); // 鼠标右键弹出菜单

        // 右键点击事件

        // 加载建筑图层
        layerCtl( 'build' ).then( function ( build ) {
            build.brightness = 1.8;
            build.contrast = 1.1;
            build.saturation = 1.2;
            build.gamma = 1.3;

            $( '.build .mask' ).hide();
        } );

        // // 加载 insar 图层
        // layerCtl( 'insar' );
        // // 获取 insar 数据, 比较慢
        // api.getInsarData().then( function ( data ) {
        //     if ( !layerCtl.insar ) { // 判断是否加载了 insar 图层
        //         return;
        //     }

        //     data = data.list;

        //     layerCtl.insar.then( function ( layer ) {
        //         $.each( insarLevel.map, function ( index ) {
        //             insarLevel.map[ index ] = true;
        //         } );
        //         layerCtl.insarCtl.data( data ).click( function ( e, _point ) {
        //             console.log( '_point:', _point );
        //         } );
        //     } );
        // } );

        // 全部风险点
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

            // 点击事件
            allRiskEntities.click( function ( e, _entity ) {
                console.log( '_entity:', _entity );
            } );

            // 显示检测点
            $( '.jcd .mask' ).hide();

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

        // 进度线 桩号
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
                    point: new Cesium.PointGraphics({
                        color: new Cesium.Color(1, 1, 0),
                        pixelSize: 7,
                        outlineColor: new Cesium.Color(0, 1, 1)
                    }),
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
            $( '.gcjd .mask' ).hide();

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

        // 视频监控
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
                console.log( 'xxxxx:', _entity );
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

            $( '.video .mask' ).hide();

            // 设置样式
            function _setXY ( x, y, hx, hy ) {
                $t.css( {
                    left: x - hx,
                    top: y - hy + $( '#toolbar' ).height()
                } );
            }
        } );
    };
} );
