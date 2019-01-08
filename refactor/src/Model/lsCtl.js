/**
 * @file 量算功能
 */
define( [
    'Cesium',
    './Event/rightMenu'
], function ( Cesium, rightMenu ) {
    'use strict';

    var clampMode = 0;

    function lsCtl ( _viewer ) {

        if ( !_viewer.scene.pickPositionSupported ) {
            alert( '不支持深度拾取,量算功能无法使用(无法进行鼠标交互绘制)' );
            return;
        }

        handlerDis = new Cesium.MeasureHandler( _viewer, Cesium.MeasureMode.Distance, clampMode );
        handlerArea = new Cesium.MeasureHandler( _viewer, Cesium.MeasureMode.Area, clampMode );
        handlerHeight = new Cesium.MeasureHandler( _viewer, Cesium.MeasureMode.DVH );

        var handlerArea, handlerDis, handlerHeight

        function clearAll() {
            handlerDis && handlerDis.clear();
            handlerArea && handlerArea.clear();
            handlerHeight && handlerHeight.clear();
        }

        function deactiveAll() {
            handlerDis && handlerDis.deactivate();
            handlerArea && handlerArea.deactivate();
            handlerHeight && handlerHeight.deactivate();
        }

        // 测距功能事件
        function _dis ( result ) {
            var dis = Number( result.distance );
            var distance = dis > 1000 ? ( dis / 1000 ).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
            handlerDis.disLabel.text = '距离:' + distance;
        }
        // 用来判断是否处于活动中
        function _isActiveDis ( isActive ) {
            if ( isActive == true ) {
                lsCtl.isActive = true;
                _viewer.enableCursorStyle = false;
                _viewer._element.style.cursor = '';
            } else {
                lsCtl.isActive = false;
                _viewer.enableCursorStyle = true;
            }
        }

        // 测量面积
        function _area ( result ) {
            var mj = Number( result.area );
            var area = mj > 1000000 ? ( mj / 1000000 ).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
            handlerArea.areaLabel.text = '面积:' + area;
        }

        function _isActiveArea ( isActive ) {
            if ( isActive == true ) {
                _viewer.enableCursorStyle = false;
                _viewer._element.style.cursor = '';
            } else {
                _viewer.enableCursorStyle = true;
            }
        }

        // 测量高度
        function _height ( result ) {
            var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
            var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
            var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
            handlerHeight.disLabel.text = '空间距离:' + distance;
            handlerHeight.vLabel.text = '垂直高度:' + vHeight;
            handlerHeight.hLabel.text = '水平距离:' + hDistance;
        }

        function _isActiveHeight ( isActive ) {
            if ( isActive == true ) {
                _viewer.enableCursorStyle = false;
                _viewer._element.style.cursor = '';
            } else {
                _viewer.enableCursorStyle = true;
            }
        }

        $.extend( lsCtl, {
            isActive: false,
            close: function () {
                handlerDis.measureEvt.removeEventListener( _dis );
                handlerDis.activeEvt.removeEventListener( _isActiveDis );
                handlerArea.measureEvt.removeEventListener( _area );
                handlerArea.activeEvt.removeEventListener( _isActiveArea );
                handlerHeight.measureEvt.removeEventListener( _height );
                handlerHeight.activeEvt.removeEventListener( _isActiveHeight );
                rightMenu.isShow = true;
                this.clear();
            },
            clear: function () {
                clearAll();
            },
            height: function () {
                rightMenu.isShow = false;
                deactiveAll();
                handlerHeight && handlerHeight.activate();
            },
            area: function () {
                rightMenu.isShow = false;
                deactiveAll();
                handlerArea && handlerArea.activate();
            },
            distance: function () {
                rightMenu.isShow = false;
                deactiveAll();
                handlerDis && handlerDis.activate();
            },
            start: function () {
                handlerDis.measureEvt.addEventListener( _dis );
                handlerDis.activeEvt.addEventListener( _isActiveDis );
                handlerArea.measureEvt.addEventListener( _area );
                handlerArea.activeEvt.addEventListener( _isActiveArea );
                handlerHeight.measureEvt.addEventListener( _height );
                handlerHeight.activeEvt.addEventListener( _isActiveHeight );
            },
            change: function ( value ) {
                if ( 0 === value ) {
                    clampMode = 0;
                    handlerArea.clampMode = 0;
                    handlerDis.clampMode = 0;
                } else {
                    clampMode = 1;
                    handlerArea.clampMode = 1;
                    handlerDis.clampMode = 1;
                }
            }
        } );
    }

    return lsCtl;
} );
