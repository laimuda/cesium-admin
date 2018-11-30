/**
 * @file 坐标拾取
 */
define( [
    'Cesium',
    './Event/rightMenu',
    'coordinate',
    'viewer'
], function ( Cesium, rightMenu, coordinate, viewer ) {
    'use strict';

    var _x = 0, _y = 0, timer, isShow = false;

    var $label;

    function pickup ( _viewer, labelId ) {
        var scene = _viewer.scene;
        pickup.handler = new Cesium.ScreenSpaceEventHandler( scene.canvas );
        $label = $( labelId );
    }

    function _labelMove ( e ) {
        // $label.css( {
        //     top: parseFloat( $label.css( 'top' ) ) + e.offsetX,
        //     left: parseFloat( $label.css( 'left' ) ) + e.offsetY
        // } );
    }

    // 点击事件
    function _click ( e ) {
        var _viewer = viewer._viewer;

        //首先移除之前添加的点
        removeEntity();
        //获取点击位置笛卡尔坐标
        var position = coordinate.toC3( e.position );

        //将笛卡尔坐标转化为经纬度坐标
        var fd = coordinate.c3ToFd( position );

        //在点击位置添加对应点
        _viewer.entities.add( pickup._entity = new Cesium.Entity( {
            point : new Cesium.PointGraphics({
                color : new Cesium.Color( 1, 1, 0 ),
                pixelSize : 10,
                outlineColor : new Cesium.Color( 0, 1, 1 )
            } ),
            position : Cesium.Cartesian3.fromDegrees( fd.lng, fd.lat , fd.h + .5 )
        } ) );

        // 执行回到
        pickup.callback.fire( fd );
    }

    // 设置悬浮 label 位置
    function _setLabelXY () {
        timer = window.requestAnimationFrame( _setLabelXY );
        $label.css( {
            left: _x + 20,
            top: _y + 20
        } ).text( pickup.txt );
    }

    // 鼠标移动获取 x, y 坐标
    function _move ( e ) {
        if ( !isShow ) {
            $label.show();
            isShow = true;
        }
        _x = e.endPosition.x, _y = e.endPosition.y;
        var position = coordinate.toC3( e.endPosition );
        var fd = coordinate.c3ToFd( position );
        pickup.txt = fd.lng + ', ' + fd.lat + ', ' + fd.h;
    }

    // 删除 entity
    function removeEntity () {
        if ( pickup._entity ) {
            viewer._viewer.entities.remove( pickup._entity );
        }
    }

    $.extend( pickup, {
        handler: undefined,
        _entity: null,
        callback: $.Callbacks(),
        txt: '',
        close: function () {
            rightMenu.isShow = true;
            this.handler.removeInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
            this.closeLabel();
            removeEntity();
        },
        start: function () {
            rightMenu.isShow = false;
            this.handler.setInputAction( _click, Cesium.ScreenSpaceEventType.LEFT_CLICK );
            this.setLabel();
        },
        setLabel: function () {
            if ( $label == null ) {
                return;
            }
            this.handler.setInputAction( _move, Cesium.ScreenSpaceEventType.MOUSE_MOVE );
            _setLabelXY();
            isShow = false;
            // $label.show();
            // $label.mousemove( _labelMove );
        },
        closeLabel: function () {
            if ( $label == null ) {
                return;
            }
            this.handler.removeInputAction( Cesium.ScreenSpaceEventType.MOUSE_MOVE );
            // $label.off( 'mousemove', _labelMove );
            $label.hide();
            window.cancelAnimationFrame( timer );
        },
        setXY: function ( x, y ) {
            _x = x, _y = y;
        }
    } );

    return pickup;
} );
