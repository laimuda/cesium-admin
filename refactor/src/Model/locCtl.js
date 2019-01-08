/**
 * @file 坐标定位
 */
define( [
    'Cesium',
    './Event/rightMenu',
    'viewer'
], function ( Cesium, rightMenu, viewer ) {
    'use strict';

    var REG = /^\d+\.\d+,\s*\d+\.\d+,\s*\d+\.\d+$/;

    function loc ( _viewer ) {

    }

    // 添加点
    function _zbdw ( longitude, latitude, height ) {
        loc._entity = new Cesium.Entity( {
            point : new Cesium.PointGraphics( {
                color : new Cesium.Color( 1, 1, 0 ),
                pixelSize : 10,
                outlineColor : new Cesium.Color( 0, 1, 1 )
            } ),
            position : Cesium.Cartesian3.fromDegrees( longitude, latitude , height )
            // position : Cesium.Cartesian3.fromDegrees(114.11, 22.54 , 37.06 + 0.5)
        } );
        viewer._viewer.entities.add( loc._entity );
    }

    // 删除 entity
    function removeEntity () {
        if ( loc._entity ) {
            viewer._viewer.entities.remove( loc._entity );
        }
    }

    $.extend( loc, {
        _entity: null,
        start: function () {
            rightMenu.isShow = false;
        },
        close: function () {
            rightMenu.isShow = true;
            this.clear();
        },
        clear: function () {
            removeEntity();
        },
        submit: function ( txt ) {
            if ( !REG.test( txt ) ) {
                return console.warn( '<<< 输入坐标有误, 请按格式输入' );
            }

            var ret = txt.split( /,\s*/ );

            _zbdw( +ret[ 0 ], +ret[ 1 ], +ret[ 2 ] ); // 添加点
            viewer._viewer.zoomTo( loc._entity ); // 跳转到该点上
        }
    } );

    return loc;
} );
