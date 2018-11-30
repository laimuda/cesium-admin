/**
 * @file insar 点的数据信息
 */
define( [
    'viewer',
    'ZnvUrls',
    './config/viewPosition',
    './var/layers',
    'layerCtl',
    './var/entities/index',
    './config/underground',
    'z'
], function ( viewer, ZnvUrls, viewPosition, layers, layerCtl, allEntitiesCtl, udConfig,
    z ) {
    'use strict';

    var MAXHEIGHT = 1300, DEF = 'default', UD = 'underground', LINK = 'linkage';

    var isLoadForIE = false, isLoadForChrome = false;

    var cameraCtl = {
        _curModel: DEF,

        setView: function ( type ) {
            type = type == null ? 'default' : type;
            var opt = viewPosition[ type ];
            if ( opt ) {
                viewer.scene.camera.setView( opt );
            }
            return this;
        },
        flyTo: function ( type ) {
            type = type == null ? 'default' : type;
            var opt = viewPosition[ type ];
            if ( opt ) {
                viewer.scene.camera.flyTo( $.extend( {
                    maximumHeight: MAXHEIGHT
                }, opt ) );
            }
            return this;
        },

        /**
         * 改变模式
         * @param { String } type 模式类型值, 可能值: 'default', 'underground', 'linkage'
         */
        changeModel: function ( type ) {
            console.log( '>>> ChangeModel ' + type );
            if ( 'underground' !== type ) {
                this.setView( type );
            }
            this[ type ]();
            return this;
        },

        /**
         * 标准模式
         */
        default: function () {
            this.setView();
            this.pre();
            this.setUdConfig( false );
            this._curModel = DEF;
            return this;
        },

        /**
         * 地下模式
         */
        underground: function () {
            this._curModel = UD;

            // 判断是否第一次加载
            if ( this.underground._isLoad ) {
                console.log( 'layers', layerCtl.udCtl._layers );
                this.turn( false ); // 隐藏其他
                this.setView( 'underground' );
                this.setUdConfig( true );
                if ( layerCtl.udCtl._layers.length > 0 ) {
                    $( '.insar .mask' ).hide();
                }
                return;
            }
            this.underground._isLoad = true;

            // 加载地下图层
            var fns = layers.map( function ( name ) {
                return viewer.scene.addS3MTilesLayerByScp(
                    ZnvUrls.ip_2 + ZnvUrls[ name + 'Promise' ], {
                    name: name
                } );
            } );

            layerCtl.all( fns, _done.bind( this ) );

            function _done ( layers ) {
                console.log( '>>> Loaded underground layers' );
                layerCtl.udCtl._layers = layers;

                this.turn( false ); // 隐藏其他
                this.setView( 'underground' );

                // 显示 insar 按钮
                if ( cameraCtl._curModel === 'underground'
                    /* && layerCtl.udCtl._layers.length > 0 */ ) {
                    $( '.insar .mask' ).hide();
                }

                // 配置
                this.setUdConfig( true );
            }

            return this;
        },

        /**
         * 卷帘模式
         */
        linkage: function () {
            var $dt = $( '#dtMap' );
            var $sz = $( '#sandzMap' );
            var h = $sz.height();

            this._curModel = LINK;

            if ( isLoadForIE ) {
                return;
            }

            if ( window._Unity.loaded ) { // 如果已经加载了 Unity
                // 绑定视角变化事件
                var _callback = window._Unity.callback;
                if ( _callback ) {
                    viewer.scene.camera.changed.addEventListener( _callback );
                }

                $dt.height( h / 2 );
                $( '#fjx' ).css( {
                    top: h / 2 - 3
                } ).show();
                return;
            }

            $( '#toolbar' ).find( '.btn-item:not(.change-model) .mask' ).show();
            $( '#loadingbar' ).show();

            $dt.height( 0 );

            if ( isLoadForChrome ) {
                return;
            }

            var $iframe = $( '#content' );

            window.setTimeout( function () {
                if ( z.support.chrome ) {
                    $iframe.attr( 'src', '/site/PVIP/WebContent/ForChorme/cesium.html' );
                    isLoadForChrome = true;
                } else {
                    $iframe.attr( 'src', '/site/PVIP/WebContent/ForIE/cesium.html' );
                    isLoadForIE = true;
                }
            }, 1 );
        },

        // 控制 entities 和地下模式图层的显示隐藏
        turn: function ( flag ) {
            layerCtl.unUdCtl.turn( flag );
            allEntitiesCtl.turn( flag );
            return this;
        },

        // 返回上一个状态
        pre: function () {
            layerCtl.unUdCtl.pre();
            allEntitiesCtl.pre();
            return this;
        },

        // 配置地下模式
        setUdConfig: function ( flag ) {
            // 不能使用 extend 扩展
            var scene = viewer.scene;
            // $.extend( true, viewer.scene, udConfig );
            if ( flag ) { // 地下模式开启
                scene.globe.globeAlpha = 0.01
                scene.undergroundMode = true;
                scene.screenSpaceCameraController.minimumZoomDistance = -1000;
            } else { // 地下模式关闭
                scene.globe.globeAlpha = 1
                scene.undergroundMode = false;
            }
            return this;
        }
    };

    return cameraCtl;
} );
