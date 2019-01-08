define( [
    'Cesium',
    'viewer',
    './assets/off'
], function ( Cesium, viewer, off ) {
    'use strict';

    var keyMap = {
        1: 'add',
        0: 'remove'
    };


    function EntityCtl ( opts ) {
        this._opts = opts;
        this._entities = [];
        this._show = false;
        this._pre = false;
        this.detail = opts.detail;
        this.handler = undefined;
        this._callback = $.Callbacks();
        this._isInit = false; // 是否注册点击事件

        if ( opts.show ) {
            this._show = true;
            this._pre = true;
        }
    }

    $.extend( EntityCtl.prototype, {

        // 添加 entity
        add: function ( opt ) {
            var entity = new Cesium.Entity( opt );
            this.push( entity );
            viewer.entities.add( entity );
            return
        },

        // 隐藏( 删除全部点 )
        hide: function () {
            $.each( this._entities, function ( index, entity ) {
                viewer.entities.remove( entity );
            } );
            return this;
        },

        // 添加( 显示全部点 )
        show: function () {
            $.each( this._entities, function ( index, entity ) {
                viewer.entities.add( entity );
            } );
            return this;
        },

        // 显示或者隐藏
        turn: function ( flag ) {
            this._pre = this._show;
            $.each( this._entities, function ( index, entity ) {
                entity.show = flag;
            } );
            this._show = flag;
            return this;
        },

        // 返回上一次状态
        pre: function () {
            this.turn( this._pre );
        },

        // 添加 entity 到 _entities
        push: function ( entity ) {
            if ( this._show !== entity._show ) {
                viewer.entities[ keyMap[ +this._show ] ]( entity );
            }
            this._entities.push( entity );
            return entity;
        },

        // 删除点
        remove: function ( entity ) {
            viewer.entities.remove( entity );
        },

        // 是否拥有该点
        has: function ( entity ) {

            return $.grep( this._entities, function ( item ) {
                return entity === item;
            } ).length > 0;
        },

        // 获取元素索引
        findIndex: function ( fn ) {
            var _index = -1;
            $.each( this._entities, function ( index, entity ) {
                if ( fn( entity, index ) ) {
                    _index = index;
                }
            } );
            return _index;
        },

        // 点击事件
        click: function ( fn ) {

            this._callback.add( fn );

            if ( !this._isInit ) {
                this.init();
            }
            return this;
        },

        // 初始化点击事件
        init: function () {
            this._isInit = true;
            this.handler = new Cesium.ScreenSpaceEventHandler( viewer.scene.canvas );

            this.handler.setInputAction( function ( e ) {
                var _entity = viewer._viewer.selectedEntity;

                if ( this.has( _entity ) ) {
                    this._callback.fire( e, _entity );
                }

            }.bind( this ), Cesium.ScreenSpaceEventType.LEFT_CLICK );
        },

        // 解绑事件
        off: off.bind( this )
    } );

    return EntityCtl;
} );
