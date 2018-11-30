/**
 * @file 坐标转换
 */
define( [
    'Cesium',
    'viewer'
], function ( Cesium, viewer ) {
    'use strict';

    var coordinate = {
        /**
         * 将笛卡尔坐标转化为经纬度坐标
         * @param { Object } 笛卡尔坐标 { x, y, z }
         */
        c3ToFd: function ( position ) {

            var cartographic = Cesium.Cartographic.fromCartesian( position );
            var longitude = Cesium.Math.toDegrees( cartographic.longitude );  // 经度
            var latitude = Cesium.Math.toDegrees( cartographic.latitude );    // 纬度
            var height = cartographic.height; // 高度
            // height = height > 0 ? height : 0;

            return {
                lng: longitude,
                lat: latitude,
                h: height
            };
        },
        /**
         * 将经纬度转成笛卡尔坐标
         */
        fdToC3: function () {

        },
        /**
         * 获取当前坐标的经度纬度高度
         * @param { Object } 笛卡尔坐标 { x, y, z }
         */
        getCurPoint: function ( e ) {

        },
        /**
         * position 对象转换成笛卡尔坐标
         * 获取点击位置的 笛卡尔坐标
         * @param { Object } e 坐标 { x, y, z }
         */
        toC3: function ( position ) {
            return viewer.scene.pickPosition( position );
        }
    };

    return coordinate;
} );
