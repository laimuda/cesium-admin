/**
 * @file 处理业务逻辑
 */
define( [
    'api',
    'pointEntities',
    'lineEntities',
    'allRiskEntities',
    'riskEntities',
    'nbRiskEntities',
    'zbRiskEntities',
    'layerCtl'
], function( api, pointEntities, lineEntities, allRiskEntities, riskEntities, nbRiskEntities,
    zbRiskEntities, layerCtl ) {
    'use strict';

    var UPSTEP = 1000000000;

    function runProgress () {
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

            var l4 = [], l5 = [], l6 = [];

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
                    l4.push( item );
                } else if ( upSmX >= upEnd ){ // 东明挖断
                    sms = dmSms;
                    l6.push( item );
                } else { // 盾挖断
                    sms = dSms;
                    l5.push( item );
                }

                push.apply( sms, [ +item.smX, +item.smY, 2.0 ] );
            } );


            unshift.apply( dSms, xmSms.slice( xmSms.length - 3 ) );
            push.apply( dSms, dmSms.slice( 0, 3) );

            drawLine( lineEntities.xm, Cesium.Color.AQUA );
            drawLine( lineEntities.d, Cesium.Color.BURLYWOOD );
            drawLine( lineEntities.dm, Cesium.Color.CORNFLOWERBLUE );

            // 绘制鹰眼图
            l5.push(l6[0]);
            l5.push(l6[1]);
            l5.push(l6[2]);
            l4.push(l5[0]);
            l4.push(l5[1]);
            l4.push(l5[2]);
            l5.unshift(l4[l4.length - 1]);
            drawYY( l4, l5, l6, point );

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

    // 绘制鹰眼图
    function drawYY( l4, l5, l6, point ) {

        var x = (point.startrLong * 100000000000 + (point.endrLong * 100000000000 - point.startrLong * 100000000000) / 2) / 100000000000;
        var y = (point.startrLaitu * 1 * 100000000000 - 300000000) / 100000000000;
        var y1 = point.startrLaitu * 1;
        var obj = setmask(x, y1, false)
        if (bigNmae && bigNmae == 1) {
            $('.mask').css({ left: obj.x - 10 + 'px', top: obj.y - 10 + 30 + 'px' })
        } else {
            $('.mask').css({ left: obj.x - 20 + 'px', top: obj.y - 20 + 'px' })
        }

        dreamHawk(l4, l5, l6);

        var bigNmae = localStorage.getItem('bigName');
        if (bigNmae && bigNmae == 1) {
            $('.dimensional').css({ height: 200 + "px", width: 300 + 'px' })
            $("#myCanvas").css({ height: 200 + "px", width: 300 + 'px' })
            $('.dimensional>.mask').css({ height: 20 + "px", width: 20 + 'px' })
            localStorage.setItem("bigName", 0)
        } else {
            $('.dimensional').css({ height: 400 + "px", width: 600 + 'px' })
            $("#myCanvas").css({ height: 400 + "px", width: 600 + 'px' })
            $('.dimensional>.mask').css({ height: 40 + "px", width: 40 + 'px' })
        }

        function dreamHawk(l1, l2, l3) {
            let myCanvas = document.getElementById('myCanvas');
            let ctx = myCanvas.getContext('2d');
            var img = new Image()
            img.src = "/site/PVIP/for3D/refactor/static/images/bg.png"
            if (bigNmae && bigNmae == 1) {

                img.onload = function () {
                    ctx.drawImage(img, 0, 0, 300, 200)
                    dreamLine(l1, '#76d9cd', ctx)
                    dreamLine(l2, '#fdbf0d', ctx)
                    dreamLine(l3, '#82a3c7', ctx)
                }
            } else {
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, 300, 200)
                    //ctx.lineWidth=2;
                    dreamLine(l1, '#76d9cd', ctx)
                    dreamLine(l2, '#fdbf0d', ctx)
                    dreamLine(l3, '#82a3c7', ctx)
                }
            }
        }

        function dreamLine(line, color, ctx) {
            var l1 = [];
            line.forEach(function (item, index) {
                var obj = setmask(item.smX * 1, item.smY * 1, true)
                if (l1[l1.length - 2] != obj.x || l1[l1.length - 1] != obj.y) {
                    l1.push(obj.x)
                    l1.push(obj.y)
                    if (l1.length == 8) {
                        ctx.beginPath();
                        ctx.lineTo(l1.shift(), l1.shift());
                        ctx.bezierCurveTo(l1[0], l1[1], l1[2], l1[3], l1[4], l1[5])
                        ctx.strokeStyle = color;
                        ctx.stroke();
                    }
                }
            })
        }

        function setmask(x, y, flag) {
            var rateX = Math.floor((x * 100000000000 - 114.089872933743 * 100000000000) / (114.136424723831 * 100000000000 - 114.089872933743 * 100000000000) * 100);
            var rateY = Math.floor((22.555491431897 * 100000000000 - y * 100000000000) / (22.555491431897 * 100000000000 - 22.526818693937 * 100000000000) * 100);
            var setX = 0;
            var setY = 0;
            if (bigNmae && bigNmae == 1 || flag) {
                setX = 300 * rateX / 100;
                setY = 200 * rateY / 100 - 30;
            }
            else {
                setX = 600 * rateX / 100;
                setY = 400 * rateY / 100;
            }
            return { x: setX, y: setY }
        }
    }

    function runRisk () {
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
                        image: origin +
                            '/site/PVIP/for3D/webgl/examples/images/risk' +
                            index + '.png',
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

    function runInsar () {
        // 加载 insar 图层
        layerCtl( 'insar' ).then( function () {
            layerCtl.insar._layer._visible = false;
        } );
        // 获取 insar 数据, 比较慢
        layerCtl.insarCtl.init(); // 初始化
        layerCtl.insarCtl.api = api.getInsarData().then( function ( data ) {
            if ( !layerCtl.insar ) { // 判断是否加载了 insar 图层
                return;
            }

            data = data.list;
            layerCtl.insarCtl.isLoaded = true;

            layerCtl.insar.then( function ( layer ) {
                $.each( insarLevel.map, function ( index ) {
                    insarLevel.map[ index ] = true;
                } );
                layerCtl.insarCtl.data( data );
            } );
        } );
    }

    return function () {

        // 绘制工程进度线
        runProgress();

        // 全部风险点
        runRisk();

        // insar
        runInsar();
    }
} );
