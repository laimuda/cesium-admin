/**
 * @file layerCtl 里面控制图层状态和显示隐藏的类
 */
define( [
    'Cesium',
    'viewer'
], function ( Cesium, viewer ) {
    'use strict';

    function LayerCtl ( opts ) {
        $.extend( this, {
            detail: opts.detail,
            _layers: [], // 图层集合
            _pre: [] // 缓存状态
        } );
    }

    $.extend( LayerCtl.prototype, {
        // 返回上一状态
        pre: function () {
            var that = this;
            $.each( this._pre, function ( index, item ) {
                that._layers[ index ]._visible = item;
            } );
        },
        // 隐藏显示
        turn: function ( flag ) {
            var layers = this._layers, that = this;
            $.each( layers, function ( index, item ) {
                that._pre[ index ] = item._visible;
                item._visible = flag;
            } );
        }
    } );

    return LayerCtl;
} );
