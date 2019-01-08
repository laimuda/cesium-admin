/**
 * @file 鼠标右键点击事件
 */
define( [
    'Cesium',
    'cameraCtl'
], function( Cesium, cameraCtl ) {
    'use strict';

    function rightClick ( _viewer ) {
        var handler = new Cesium.ScreenSpaceEventHandler( _viewer.scene.canvas );
        var $menu = $( '.right-menu' );
        var ACTIVE = 'active';

        // 控制是否显示隐藏
        // @important
        rightClick.isShow = true;

        handler.setInputAction( function ( e ) {
            if ( !rightClick.isShow ) {
                return;
            }

            $menu.removeClass( ACTIVE ).css( {
                top: e.position.y + $( '#toolbar' ).height() + 30 - 3,
                left: e.position.x + 20 - 3
            } ).addClass( ACTIVE );

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );

        handler.setInputAction( function ( e ) {
            $menu.removeClass( ACTIVE );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );
    }

    return rightClick;
} );
