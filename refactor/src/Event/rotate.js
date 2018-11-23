/**
 * @file 右键旋转功能
 */
define( [
    'Cesium',
    'viewer'
], function( Cesium, viewer ) {
    'use strict';

    var CLOSE = 'close', START = 'start', ROTATING = 'rotateing'

    // 是否正在旋转
    var rotateState = CLOSE;

    function rotate ( _viewer ) {
        rotate.handler = new Cesium.DrawHandler( _viewer, Cesium.DrawMode.Point );

        // 点击停止, 再点击继续
        var scene = viewer.scene;
        var _handler = new Cesium.ScreenSpaceEventHandler( scene.canvas );
        _handler.setInputAction( function ( e ) {
            if ( rotateState !== ROTATING ) {
                return;
            }

            // 旋转中
            if ( scene.camera._isFlyCircle ) {
                console.log( '>>> Stop rotate' );
                scene.camera._isFlyCircle = false;

                // 执行回调
                rotate.clickFns.fire( e );
            } else {
                console.log( '>>> Reset rotate' );
                rotate.handler.activate();
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOWN );
    }

    // 旋转事件
    function _callback ( e ) {
        console.log( '>>> Rotating...' );
        var scene = viewer.scene, id, build, center;

        build = scene.layers.find( 'build' );

        if ( build ) {
            // id = build.getSelection();
            // id = id[ 0 ] * 1;
            center = e.object.position;
            window.setTimeout( function () {
                rotateState = ROTATING;
            }, 10 );
            scene.camera.flyCircle( center, 5000 ); // 旋转
        }
    }

    $.extend( rotate, {
        // 点击取消事件的回调
        clickFns: $.Callbacks(),
        // 退出旋转
        close: function () {
            console.log( '>>> Close rotate' );
            var scene = viewer.scene;
            var handler = rotate.handler;

            rotateState = CLOSE;
            scene.camera._isFlyCircle = false;
            handler.clear();
            handler.drawEvt.removeEventListener( _callback );
        },
        // 开启旋转
        start: function () {
            console.log( '>>> Start rotate' );
            var handler = rotate.handler;

            rotateState = START;
            handler.drawEvt.addEventListener( _callback );
            handler.activate();
        }
    } );

    return rotate;
} );
