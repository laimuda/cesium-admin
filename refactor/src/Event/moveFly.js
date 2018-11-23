/**
 * @file 右键滑行功能
 */
define( [
    'Cesium',
    'viewer'
], function( Cesium, viewer ) {
    'use strict';

    var CLOSE = 'close', START = 'start', FLY = 'flying';
    var SCALE = 1000000;

    // 标识状态
    var flyStatu = CLOSE;

    function moveFly ( _viewer ) {
        var scene = _viewer.scene;
        moveFly.handler = new Cesium.ScreenSpaceEventHandler( scene.canvas );
    }

    // 滑行事件
    function _callback ( e ) {

        if ( flyStatu === FLY ) {
            return;
        }

        var scene = viewer.scene;
        var mousePosition = scene.pickPosition( e.endPosition );
        var cartographic = Cesium.Cartographic.fromCartesian( mousePosition );
        var longitude = Cesium.Math.toDegrees( cartographic.longitude );
        var latitude = ( Cesium.Math.toDegrees( cartographic.latitude ) * SCALE - 15000) / SCALE;

        viewer.camera.flyTo( {
            destination: Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                1299.022495696321
            ),
            orientation: {
                heading: 0.06061424437391327,
                pitch: -0.6109960275561157,
                roll: 33.6143213755224224e-8
            }
        } );
    }

    $.extend( moveFly, {
        close: function () {
            console.log( '>>> Close moveFly' );
            moveFly.handler.removeInputAction( Cesium.ScreenSpaceEventType.MOUSE_MOVE );
        },
        start: function () {
            console.log( '>>> Start moveFly' );
            moveFly.handler.setInputAction( _callback, Cesium.ScreenSpaceEventType.MOUSE_MOVE );
        }
    } );

    return moveFly;
} );
