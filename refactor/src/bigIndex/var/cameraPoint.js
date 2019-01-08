/**
 * @file 视角点
 */
define( [
    'Cesium'
], function ( Cesium ) {
    'use strict';

    return {
        default: {
            destination: new Cesium.Cartesian3.fromDegrees(
                114.0950884505,
                22.5350920691,
                200.022495696321
            ),
            orientation: {
                heading: 0.03870430996292651,
                pitch: -0.4667126875606069,
                roll: 2.8752344505278415e-8
            }
        },
        normal: {
            destination: new Cesium.Cartesian3.fromDegrees (
                114.1122005232474,
                22.508287789121,
                2077.022495696321
            ),
            orientation: {
                heading: 0.03870430996292651,
                pitch: -0.4667126875606069,
                roll: 2.8752344505278415e-8
            }
        }
    };
} );
