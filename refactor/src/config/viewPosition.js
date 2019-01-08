/**
 * @file 一些默认视角的信息
 */
define( [
    'Cesium'
], function ( Cesium ) {
    'use strict';

    var Cartesian3 = Cesium.Cartesian3;

    return {

        // 默认视角
        default: {
            destination: new Cartesian3(
                -2407603.334853231,
                5380251.97268399,
                2442779.5895847366
            ),
            orientation: {
                heading: 0.06062453069051976,
                pitch: -0.6112545929995132,
                roll: 3.3614781624891066e-7
            }
        },

        // 西明挖段
        xm: {
            destination: new Cartesian3(
                -2405326.359774132,
                5378440.524852615,
                2444756.2773655206
            ),
            orientation: {
                heading: 6.261322937643357,
                pitch: -1.243375692391211,
                roll: 6.283185306673833
            }
        },

        // 盾构段
        d: {
            destination: new Cartesian3(
                -2408427.0475855656,
                5379603.452988745,
                2444720.675407677
            ),
            orientation: {
                heading: 6.069188776839598,
                pitch: -1.1401228523205122,
                roll: 6.283185307179405
            }
        },

        // 东明挖段
        dm: {
            destination: new Cartesian3(
                -2408809.948265562,
                5376377.955275715,
                2445431.1269209487
            ),
            orientation: {
                heading: 5.733330943065595,
                pitch: -1.059452353780638,
                roll: 6.283185307179577
            }
        },

        // 地下模式
        underground: {
            destination: new Cesium.Cartesian3(
                -2405358.334088489,
                5377933.290978594,
                2444516.709210103
            ),
            orientation: {
                heading: 0.06046737732706475,
                pitch: -0.6108191781261398,
                roll: 0.0001492949895514073
            }
        },

        // 联动模式
        linkage: {
            destination: new Cartesian3(
                -2407603.334853231,
                5380251.97268399,
                2442779.5895847366
            ),
            orientation: {
                heading: 0.06062453069051976,
                pitch: -0.6112545929995132,
                roll: 3.3614781624891066e-7
            }
        },

        // CAD
        cad: {
            destination: new Cesium.Cartesian3(
                -2405377.555422445,
                5378038.925152952,
                2444878.6028560847
            ),
            orientation: {
                heading: 0.013929864878018172,
                pitch: -1.5372230814074777,
                roll: 0
            }
        }
    };
} );
