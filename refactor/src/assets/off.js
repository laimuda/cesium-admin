/**
 * @file 解绑事件
 */
define( [
    'Cesium'
], function ( Cesium ) {
    'use strict';

    return function ( type ) {
        if ( this.handler == null ) {
            return this;
        }

        type = type || 'click';

        switch ( type ) {
            case 'click':
                this.handler.removeInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
                break;

            default:
                break;
        }
        return this;
    }
} );
