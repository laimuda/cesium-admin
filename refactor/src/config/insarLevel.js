/**
 * @file 用于判别 insar 点的级别
 */
define( [

], function( ) {
    'use strict';

    // 评判 insar 等级
    return {
        '-8': 2,
        '-7': 2,
        '-6': 3,
        '-5': 3,
        '-4': 4,
        '-3': 4,
        '-2': 5,
        '-1': 5,
        '0': 6,
        '1': 6,
        '2': 7,
        '3': 7,
        '4': 8,
        '5': 8,
        '6': 9,
        '7': 9,

        // 根据等级等级显示, [ boolean ]
        // IE 不支持 fill
        'map': [
            undefined,
            false, false, false, false, false,
            false, false, false, false, false
        ]
    };
} );
