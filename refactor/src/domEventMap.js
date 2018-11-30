/**
 * @file UI 绑定事件
 */
define( [
    'cameraCtl',
    'layerCtl',
    'z',
    'viewer',
    'pointEntities',
    'lineEntities',
    'allRiskEntities',
    'nbRiskEntities',
    'zbRiskEntities',
    'riskEntities',
    './Event/rotate',
    './Event/moveFly',
    'videoCtl',
    './config/insarLevel',
    'lsCtl',
    'pickupCtl',
    'locCtl'
], function( cameraCtl, layerCtl, z, viewer, pointEntities, lineEntities, allRiskEntities,
    nbRiskEntities, zbRiskEntities, riskEntities, rotate, moveFly, videoCtl, insarLevel,
    lsCtl, pickupCtl, locCtl ) {
    'use strict';

    var ACTIVE = 'active';

    // 退出卷帘模式
    function exitLinkAge () {
        var $dt = $( '#dtMap' );
        var $sz = $( '#sandzMap' );
        var h = $sz.height();
        $( '#fjx' ).hide();
        $dt.height( h );

        // 移除视角变化事件
        var _callback = window._Unity.callback;
        if ( _callback ) {
            viewer.scene.camera.changed.removeEventListener( _callback );
        }

        if ( !z.support.chrome ) {
            $( '#content' ).hide();
        }
        $dt.show();
    }

    // 工具箱点击隐藏菜单
    function toolClick () {
        pickupCtl.close();
        lsCtl.close();
        locCtl.close();
        $( '.map-tool' ).removeClass( ACTIVE );
    }

    // 退出地下模式显示其他按钮
    function showOth () {
        if ( layerCtl.build ) {
            layerCtl.build.then( function () {
                $( '.build .mask' ).hide();
            } );
        }

        if ( layerCtl.insar && layerCtl.insarCtl.isLoaded ) {
            layerCtl.insar.then( function () {
                $( '.insar .mask' ).hide();
            } );
        } else {
            $( '.insar .mask' ).show();
        }

        if ( allRiskEntities._entities.length > 0 ) {
            $( '.jcd .mask' ).hide();
        }
        if ( pointEntities._entities.length > 0 ) {
            $( '.gcjd .mask' ).hide();
        }
        if ( videoCtl._entities.length > 0 ) {
            $( '.video .mask' ).hide();
        }

        $( '.change-view .mask, .tool .mask' ).hide();
        $( '#toolbar .o-insar' ).show();
        $( '#toolbar .o-underground' ).hide();
    }

    // 模式切换
    function _changeModel () {
        $( '.bubble' ).hide();
    }

    // 检测数据风险信息滚动动画
    var count = 0, scrollTimer = null;
    function autoScroll () {
        ++count;

        var top = -21 * count;
        var $t = $( '.tb3' ).find( 'ul' );

        $t.animate( {
            marginTop: top
        }, 500 );

        if ( Math.abs(top) >= ( $t.height() - 105 ) ) {
            $t.css( { marginTop: 0 } );
            count = 0;
        }
    }

    var events = {

        /* 视角切换 */
        toDefault: function ( key ) {
            cameraCtl.flyTo( 'default' );
        },
        toXm: function ( key ) {
            cameraCtl.flyTo( 'xm' );
        },
        toD: function ( key ) {
            cameraCtl.flyTo( 'd' );
        },
        toDm: function ( key ) {
            cameraCtl.flyTo( 'dm' );
        },

        /* 模式切换功能 */
        defModel: function ( key ) {
            layerCtl.udCtl.turn( false ); // 隐藏地下图层
            $( '.chaneg-view .mask' ).hide();
            $( '.cesium-viewer-navigationContainer' ).show();
            _changeModel();
            cameraCtl.changeModel( 'default' );
            exitLinkAge();
            showOth(); // 显示其他按钮
        },
        udModel: function ( key ) {
            $( '.chaneg-view .mask' ).show();
            // 关闭其他的按钮, 关闭 insar 按钮
            $( '#toolbar .btn-item:not(.change-model) .mask' ).show();
            $( '#toolbar .o-insar' ).hide();
            $( '.cesium-viewer-navigationContainer' ).hide();
            $( '#toolbar .o-underground' ).show();

            _changeModel();
            exitLinkAge();
            cameraCtl.changeModel( 'underground' );
            layerCtl.udCtl.turn( true ); // 显示地下图层
        },
        toCAD: function ( value, key ) {
            if ( cameraCtl._curModel !== 'default' ) {
                $( this ).parents( '.item' ).click();
            }
            viewer.imagery_cad.show = !value;
            cameraCtl.setUdConfig( false );

            if ( !value ) {
                cameraCtl.flyTo( 'cad' );
            }
        },
        linkage: function ( key ) {
            showOth(); // 显示其他按钮
            $( '#content' ).show();
            $( '.cesium-viewer-navigationContainer' ).hide();
            if ( !z.support.chrome ) {
                $( '#dtMap' ).hide();
            }
            _changeModel();
            cameraCtl.linkage();
        },

        /* 工程进度 */
        turnPoint: function ( value, key ) {
            pointEntities.turn( !pointEntities._show );
        },
        turnLine: function ( value, key ) {
            lineEntities.turn( !lineEntities.dm._show );
        },
        showGcjd: function () {
            window.setTimeout( function () {
                $( '.show-data:not(#gcjd)' ).removeClass( ACTIVE );
                $( '#gcjd, #mask' ).addClass( ACTIVE );
            }, 1 );
        },
        hideGcjd: function () {
            $( '#gcjd, #mask' ).removeClass( ACTIVE );
            $( '#mask' ).click();
        },

        /* 监测点 */
        allRisk: function ( value, key ) {
            allRiskEntities.turn( !value );
        },
        nbRisk: function ( value, key ) {
            nbRiskEntities.turn( !value );
        },
        zbRisk: function ( value, key ) {
            zbRiskEntities.turn( !value );
        },
        riskDanger: function ( value, key ) {
            value = !value;
            switch ( key ) {
                case 0: //所有
                    riskEntities.turn( value );
                    break;
                case 1: // 重大风险
                    riskEntities[ 4 ].turn( value );
                    break;
                case 2: // 较大风险
                    riskEntities[ 3 ].turn( value );
                    break;
                case 3: // 一般分险
                    riskEntities[ 2 ].turn( value );
                    break;
                case 4: // 安全可控
                    riskEntities[ 1 ].turn( value );
                    riskEntities[ 0 ].turn( value );
                    break;

                default:
                    break;
            }
        },
        showJcsj: function () {
            window.setTimeout( function () {
                $( '.show-data:not(#jcsj)' ).removeClass( ACTIVE );
                $( '#jcsj, #mask' ).addClass( ACTIVE );
                scrollTimer = window.setInterval( autoScroll, 3000 );
            }, 1 );
        },
        hideJcsj: function () {
            window.clearInterval( scrollTimer );
            $( '#jcsj, #mask' ).removeClass( ACTIVE );
            $( '#mask' ).click();
        },

        /* 建筑 显示隐藏 */
        isShowOfBuild: function ( val ) {
            var build = layerCtl.build._layer;
            build._visible = !build._visible;
        },

        /* insar 点 */
        isInsarClick: function ( val ) {
            if ( val ) {
                return;
            }

            // 判断模式
            if ( cameraCtl._curModel === 'underground' ) {
                $( '.o-underground' ).addClass( ACTIVE );
            } else {
                var count = ++layerCtl.insarCtl.count;
                if ( count === 1 )   {
                    layerCtl.insar._layer._visible = true;
                }
                $( '.o-insar' ).addClass( ACTIVE );
            }
        },
        chooseInsarGrade: function ( val, key ) {
            insarLevel.map[ key ] = !val;
            layerCtl.insarCtl.setMapLevel();
        },
        isShowUdLayers: function ( val, key ) {
            var $self = $( this ), layers = layerCtl.udCtl._layers;

            if ( layers[ key ]._name === $self.text() ) {
                layers[ key ]._visible = !val;
                return;
            }

            $.each( layers, function ( _, layer ) {
                if ( layer._name === $self.text() ) {
                    layer._visible = !val;
                }
            } );
        },

        /* 视频监控 */
        isShowVideo: function ( val ) {
            videoCtl.turn( !val );
        },

        /* 工具箱 */
        // 量算
        lsClick: function () {
            toolClick();
            $( '#measure' ).addClass( ACTIVE );
        },
        lsClose: function () {
            lsCtl.close();
            $( '#measure' ).removeClass( ACTIVE );
        },
        lsDis: function () {
            lsCtl.distance();
        },
        lsArea: function () {
            lsCtl.area();
        },
        lsHeight: function () {
            lsCtl.height();
        },
        lsClear: function () {
            lsCtl.clear();
        },
        // 坐标拾取
        pickup: function () {
            toolClick();
            pickupCtl.start();
            $( '#zbsq' ).addClass( ACTIVE );
        },
        pickupClose: function () {
            pickupCtl.close();
            $( '#zbsq' ).removeClass( ACTIVE );
        },
        pickupCoyp: function () {
            var $self = $( this );
            var w = $self.siblings( '.w' ).html();
            var j = $self.siblings( '.j' ).html();
            var h = $self.siblings( '.h' ).html();
            var clipBoardContent = [ w, j, h ].join( ',' );
            z.copyToClipboard( clipBoardContent );
        },
        // 坐标定位
        location: function () {
            toolClick();
            locCtl.start();
            $( '#zbdw' ).addClass( ACTIVE );
        },
        locationSub: function () {
            var txt = $( '#zbdw input' ).val();
            locCtl.submit( txt );
        },
        locationCan: function () {
            locCtl.clear();
            $( '#zbdw input' ).val( '' );
        },
        locationClose: function () {
            locCtl.close();
            $( '#zbdw' ).removeClass( ACTIVE );
        },

        /* 全屏 */
        fullSize: function ( val ) {
            if ( val ) {
                z.exitFull();
            } else {
                z.requestFullScreen( document.getElementById( 'for3d' ) );
            }
        },

        /* 鼠标右键 */
        rightMenu: function ( key ) {
            switch ( key ) {
                case 0: // 选择
                    rotate.close();
                    moveFly.close();
                    viewer._viewer.trackedEntity = null;
                    break;
                case 1: // 滑行
                    rotate.close();
                    moveFly.start();
                    break;
                case 2: // 旋转
                    moveFly.close();
                    rotate.start();
                    break;

                default:
                    rotate.close();
                    moveFly.close();
                    break;
            }
        }
    };

    return events;
} );
