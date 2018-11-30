/**
 * @file 控制全部 entity 的显示隐藏
 */
define( [
    'allRiskEntities',
    'lineEntities',
    'pointEntities'
], function ( allRiskEntities, lineEntities, pointEntities ) {
    'use strict';

    return {
        turn: function ( flag ) {
            // allRiskEntities._pre = allRiskEntities._show;
            // lineEntities._pre = lineEntities.dm._show;
            // pointEntities._pre = pointEntities._show;
            allRiskEntities.turn( flag );
            lineEntities.turn( flag );
            pointEntities.turn( flag );
        },
        pre: function () {
            allRiskEntities.pre();
            lineEntities.pre();
            pointEntities.pre();
        }
    };
} );
