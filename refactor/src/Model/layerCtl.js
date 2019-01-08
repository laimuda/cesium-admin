/**
 * @file 图层加载
 */
define( [
    'Cesium',
    'viewer',
    'ZnvUrls',
    './assets/off',
    './config/insarLevel',
    'LayerCtl'
], function ( Cesium, viewer, ZnvUrls, off, insarLevel, LayerCtl ) {
    'use strict';

    // 缓存查询结果
    var cache = [];

    var timer = null;

    // 图层加载失败回调函数
    function error ( e ) {
        if ( viewer.cesiumWidget._showRenderLoopErrors ) {
            var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
            viewer.cesiumWidget.showErrorPanel( title, undefined, e );
        }
    }

    /**
     * 根据 type 加载图层加载图层, 返回一个 promise 对象 ( 非地下图层 )
     * @param { String } type 图层名称, 可能值: build insar
     */
    function _fn ( type ) {

        if ( _fn[ type ] ) {
            return;
        }

        var addS3MTilesLayerByScp = viewer.scene.addS3MTilesLayerByScp;

        if ( !_fn.addLayer ) {
            _fn.addLayer = addS3MTilesLayerByScp;
        }

        var promise = viewer.scene.addS3MTilesLayerByScp(
            ZnvUrls.ip_2 + ZnvUrls[ type + 'Promise' ],
            { name: type }
        ).then( function ( layer ) {
            console.log( '>>> Loaded ' + layer._name );
            _fn[ type ]._layer = layer
            _fn.unUdCtl._layers.push( layer );
            return layer;
        }, error );

        var target = _fn[ type ] = {
            promise: promise,
            then: promise.then,
            _layer: null // 各自的图层
        };

        return target;
    }

    $.extend( _fn, {
        addLayer: /* addS3MTilesLayerByScp */ null,
        bigIndexPromise: null, // bigIndex 加载图层的 promise 对象

        /**
         * 等全部 promise 加载完执行
         * @param { Array } fns [ promise ]
         * @param { Function } done( layer ) 回调函数
         */
        all: function ( fns, done ) {
            return Cesium.when.all( fns, done, error );
        },

        // insar 图层控制器
        insarCtl: {
            count: 0, // 点击 insar 按钮次数
            handler: null,
            _data: [],
            isLoaded: false, // insar 点信息是否请求
            api: null, // 获取 insar 数据的 promise 对象, 在获取数据时候赋值
            _callback: $.Callbacks(),

            // 设置 insar 数据
            data: function ( data ) {
                this._data = data;
                return this;
            },

            /**
             * 修改 insarLevel.map 等级开关
             * @param { Array } valMap 0-10 等级开关
             */
            setMapLevel: function ( valMap ) {
                if ( typeof valMap === 'object' ) {
                    $.extend( insarLevel.map, valMap );
                }
                this.turnOfLevel();
                return this;
            },

            /**
             * 根据 insarLevel.map 来显示 insar 点
             * 手动设置后再调用
             * insarLevel.map: 0-10
             */
            turnOfLevel: function () {
                var layer = _fn.insar._layer, ret = [];
                var that = this;

                if ( !layer ) {
                    return;
                }

                $.each( insarLevel.map, function ( level, value ) {

                    var _ret = [];

                    if ( !value || 0 === level ) {
                        return;
                    }

                    if ( cache[ level ] ) { // 缓存
                        _ret = cache[ level ];
                    } else {
                        $.each( that._data, function ( _, item ) {
                            if ( level === that.getLevel( item ) ) {
                                _ret.push( item.smID );
                            }
                        } );
                        cache[ level ] = _ret;
                    }

                    $.merge( ret, _ret );
                } );

                window.clearTimeout( timer );
                timer = window.setTimeout( function () {
                    layer.setObjsVisible( ret, true );
                }, 1 );
            },

            /**
             * 获取 insar 点等级
             * @param { Object } item insar 图层上的点对象
             */
            getLevel: function ( item ) {
                var level = item.level, vel;

                if ( level != null ) {
                    return level;
                }

                vel = Math.floor( +item.vel );
                if ( vel > 8 ) {
                    level = 10;
                } else if ( vel < -8 ) {
                    level = 1;
                } else {
                    level = insarLevel[ vel + '' ]
                }

                return ( item.level = level );
            },

            /**
             * insar 点的点击事件
             * @param { Function } fn 回调函数
             */
            click: function ( fn ) {

                this._callback.add( fn );
                if ( !this.init.isInit ) {
                    this.init();
                }
                return this;
            },

            // 初始化点击事件
            init: function () {

                this.init.isInit = true;

                this.handler = new Cesium.ScreenSpaceEventHandler( viewer.scene.canvas );

                this.handler.setInputAction( function ( e ) {
                    if ( viewer._viewer.selectedEntity ) {
                        return;
                    }

                    var layer = _fn.insar;

                    if ( !layer || !layer._layer ) {
                        return console.warn( '<<< Don\'t have insar layer' );
                    }

                    var id = layer._layer.getSelection()[ 0 ];

                    if ( id == null ) {
                        return;
                    }

                    var _point = $.grep( this._data, function ( item ) {
                        return id === item.smID;
                    } )[ 0 ];

                    this._callback.fire( e, _point );

                }.bind( this ), Cesium.ScreenSpaceEventType.LEFT_CLICK );
            },

            // 解绑事件
            off: off.bind( this )
        },

        // 非地下图层
        unUdCtl: new LayerCtl( {
            detail: '非地下图层. insar | build'
        } ),

        // 地下图层
        udCtl: new LayerCtl( {
            detail: '地下图层.'
        } )
    } );

    return _fn;
} );
