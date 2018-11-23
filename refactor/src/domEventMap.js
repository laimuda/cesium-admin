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
    'videoCtl'
], function( cameraCtl, layerCtl, z, viewer, pointEntities, lineEntities, allRiskEntities,
    nbRiskEntities, zbRiskEntities, riskEntities, rotate, moveFly, videoCtl ) {
    'use strict';

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
    }

    // 退出地下模式显示其他按钮
    function showOth () {
        if ( layerCtl.build ) {
            layerCtl.build.then( function () {
                $( '.build .mask' ).hide();
            } );
        }

        if ( layerCtl.insar ) {
            layerCtl.insar.then( function () {
                $( '.insar .mask' ).hide();
            } );
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

        $( '.change-view .mask' ).hide();

        // TODO: 工具箱
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
            cameraCtl.changeModel( 'default' );
            exitLinkAge();
            showOth(); // 显示其他按钮
        },
        udModel: function ( key ) {
            $( '.chaneg-view .mask' ).show();
            layerCtl.udCtl.turn( true ); // 显示地下图层
            cameraCtl.changeModel( 'underground' );
            exitLinkAge();
            // 关闭其他的按钮
            $( '#toolbar .btn-item:not(.change-model) .mask' ).show();
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
            cameraCtl.linkage();
        },

        /* 工程进度 */
        turnPoint: function ( value, key ) {
            pointEntities.turn( !pointEntities._show );
        },
        turnLine: function ( value, key ) {
            lineEntities.turn( !lineEntities.dm._show );
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


        /* 建筑 显示隐藏 */
        isShowOfBuild: function ( val ) {
            var build = layerCtl.build._layer;
            build._visible = !build._visible;
        },

        /* insar 点 */

        /* 视频监控 */
        isShowVideo: function ( val ) {
            videoCtl.turn( !val );
        },

        /* 工具箱 */

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
