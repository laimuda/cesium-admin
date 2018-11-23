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
        _oldShow: undefined, // 缓存旧的状态
        turn: function ( flag ) {
            allRiskEntities._pre = allRiskEntities._show;
            lineEntities._pre = lineEntities.dm._show;
            pointEntities._pre = pointEntities._show;
            allRiskEntities.turn( flag );
            lineEntities.turn( flag );
            pointEntities.turn( flag );
        },
        pre: function () {
            this.turn( allRiskEntities._pre && lineEntities._pre );
        }
    };
} );
