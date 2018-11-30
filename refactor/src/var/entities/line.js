/**
 * @file 进度线
 */
define( [
    'EntityCtl'
], function ( EntityCtl ) {
    'use strict';

    var line = {
        xm: new EntityCtl( {
            detail: '西明挖段-进度线',
            show: true
        } ),
        d: new EntityCtl( {
            detail: '盾构段-进度线',
            show: true
        } ),
        dm: new EntityCtl( {
            detail: '东明挖段-进度线',
            show: true
        } ),
        turn: function ( flag ) {
            line.xm.turn( flag );
            line.d.turn( flag );
            line.dm.turn( flag );
        },
        pre: function () {
            line.xm.pre();
            line.d.pre();
            line.dm.pre();
        },
        _pre: true // 缓存旧状态
    };

    return line;
} );
