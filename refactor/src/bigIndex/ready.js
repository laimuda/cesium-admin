/**
 * @file ready 事件, 用于处理一些 DOM 的初始化以及注册 resize 事件
 */
define( [
    './initView',
    './controller',
    'viewer',
    './bindDom'
], function ( initView, controller, viewer, bindDom ) {
    'use strict';

    $( function () {

        // 初始化
        initView();

        // 绑定 DOM 事件
        bindDom();

        // 处理业务逻辑
        controller();

    } );
} );
