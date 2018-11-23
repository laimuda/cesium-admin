/**
 * @file 进度线
 */
define( [
    'EntityCtl'
], function ( EntityCtl ) {
    'use strict';

    var line = {
        xm: new EntityCtl( {
            detail: '西明挖段-进度线'
        } ),
        d: new EntityCtl( {
            detail: '盾构段-进度线'
        } ),
        dm: new EntityCtl( {
            detail: '东明挖段-进度线'
        } ),
        turn: function ( flag ) {
            line.xm.turn( flag );
            line.d.turn( flag );
            line.dm.turn( flag );
        },
        _pre: true // 缓存旧状态
    };

    return line;
} );
