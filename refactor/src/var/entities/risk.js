/**
 * @file 所有风险点-风险等级
 */
define( [
    'EntityCtl'
], function ( EntityCtl ) {
    'use strict';

    var risk = {
        '4': new EntityCtl( {
            detail: '极高风险 '
        } ),
        '3': new EntityCtl( {
            detail: '高等级风险'
        } ),
        '2': new EntityCtl( {
            detail: '中等风险'
        } ),
        '1': new EntityCtl( {
            detail: '低等级风险'
        } ),
        '0': new EntityCtl( {
            detail: '无风险'
        } ),
        turn: function ( value ) {
            risk[ 0 ].turn( value );
            risk[ 1 ].turn( value );
            risk[ 2 ].turn( value );
            risk[ 3 ].turn( value );
            risk[ 4 ].turn( value );
        }
    };

    return risk;
} );
