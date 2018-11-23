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
            _pre: true // 缓存状态
        } );
    }

    $.extend( LayerCtl.prototype, {
        // 返回上一状态
        pre: function () {
            this.turn( this._pre );

        },
        // 隐藏显示
        turn: function ( flag ) {
            var layers = this._layers, len = this._layers.length;
            this._pre = len > 0 && layers[ 0 ]._visible && layers[ len - 1 ]._visible;
            $.each( this._layers, function ( _, item ) {
                item._visible = flag;
            } );
        }
    } );

    return LayerCtl;
} );
