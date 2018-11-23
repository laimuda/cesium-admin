/**
 * @file UI 绑定事件
 */
define( [
    '../domEventMap'
], function( domEventMap ) {
    'use strict';

    var ACTIVE = 'active', ITEM = 'btn-item', OPTS = 'opts', SQ = 'squaredTwo';
    var CHECKED = 'checked';

    $( function () {
        console.log( '>>> Bind DOM' );

        var $toolbar = $( '#toolbar' );
        var $btnItems = $toolbar.find( '.btn-item' );
        var $mask = $( '#mask' );
        var $opts = $toolbar.find( '.opts' );
        var $btn = $toolbar.find( '.btn' );
        var $item = $toolbar.find( '.item' );
        var $jcdRiskDanger = $( '.jcd .all-risk-danger' );
        var $jcdRisk = $( '.jcd .all-risk' );
        var $rightMenu = $( '.right-menu' );

        function hideSub () {
            $( '.sub' ).hide();
        }

        // 点击遮罩层使子选项全部消失
        $mask.click( function () {
            $btnItems.removeClass( ACTIVE );
            $mask.removeClass( ACTIVE );
            $rightMenu.removeClass( ACTIVE ); // 隐藏右键菜单
            hideSub();
        } );
        // 调整位置, 使 toolbar 也可以点击
        $mask.css( 'top', $( '#sandzMap' )[ 0 ].getBoundingClientRect().top );
        $toolbar.find( '.mask' ).click( function () {
            return false;
        } );

        // 绑定 data-item 事件
        $item.click( function () {
            var $self = $( this );
            var $input = $self.find( '.squaredTwo input' );
            var fn = domEventMap[ $self.data( 'item' ) ];

            if ( typeof fn === 'function' ) {
                if ( $input.length > 0 ) {
                    fn.call( this, $input.prop( CHECKED ), $self.data( 'key' ) );
                } else {
                    fn.call( this, $self.data( 'key' ) );
                }
            }
        } );

        // 绑定 .btn-item 事件
        $btnItems.click( function () {
            var $self = $( this );
            var fn = domEventMap[ $self.data( 'item' ) ];
            hideSub();
            $rightMenu.removeClass( ACTIVE ); // 隐藏右键菜单
            if ( typeof fn === 'function' ) {
                fn.call( this, $self.hasClass( ACTIVE ), $self.data( 'key' ) );
            }
        } );

        // .item不冒泡, 遮罩成消失 父元素失去 active
        $btnItems.click( function () {
            $( this ).toggleClass( ACTIVE ).siblings( '.btn-item' ).removeClass( ACTIVE );
        } );
        // 显示隐藏遮罩层
        $( '.opts>ul>.item' ).click( function () {
            $( this ).parents( '.btn-item' ).removeClass( ACTIVE );
            $mask.removeClass( ACTIVE );
            return false;
        } ).hover( function () {
            // 解决 hover 的问题
            var $self = $( this );
            $self.siblings( '.item' ).find( '.sub' ).hide();
            $self.find( '.sub' ).show();
        } );
        // 子菜单不冒泡
        $( '.opts .sub .item' ).click( function () {
            return false;
        } );

        // .btn-item .btn 点击切换 active
        $toolbar.find( '.btn-item:not(.no-opts)' ).click( function () {
            var $self = $( this );
            if ( !$self.hasClass( ACTIVE ) ) {
                $mask.removeClass( ACTIVE );
            } else {
                $mask.addClass( ACTIVE );
            }
        } );

        // select
        // txt 覆盖文本
        $toolbar.find( '.txt .opts>ul>.item' ).click( function () {
            var $self = $( this );
            $self.parents( '.opts' ).siblings( '.btn' )
                .text( $self.text().replace( /(\r\n|\s)+/g, ' ' ).trim().split( ' ' )[ 0 ]);
        } );

        // 选择框点击选中
        $item.click( function () {
            var $input = $( this ).find( '>.squaredTwo>input' );
            var val = $input.prop( CHECKED );
            $input.prop( CHECKED, !val );
        } );


        // 所有风险源
        $jcdRiskDanger.click( function () {
            var $self = $( this );
            var val = $self.find( 'input' ).prop( CHECKED );
            var $sibs = $self.siblings( '.item' );
            $sibs.find( 'input' ).prop( CHECKED, val );
        } );
        // 风险点联动
        $jcdRiskDanger.siblings( '.item' ).click( function () {
            var $self = $( this ), $parent = $self.parent();
            var val = $self.find( 'input' ).prop( CHECKED );
            var len = $parent.find( '.item:not(.all-risk-danger)' ).length;

            if ( !val ) {
                $jcdRiskDanger.find( 'input' ).prop( CHECKED, false );
            } else if ( $parent.find( '.item:not(.all-risk-danger) input:checked' ).length === len ) {
                $jcdRiskDanger.find( 'input' ).prop( CHECKED, true );
            }
        } );

        // 工程所有风险点
       $jcdRisk.click( function () {
            var $self = $( this );
            var val = $self.find( 'input' ).prop( CHECKED );
            var $sibs = $self.siblings( '.item' );
            $sibs.find( 'input' ).prop( CHECKED, val );
        } );
       $jcdRisk.siblings( '.item' ).click( function () {
            var $self = $( this );
            var val = $self.find( 'input' ).prop( CHECKED );

            if ( !val ) {
               $jcdRisk.find( 'input' ).prop( CHECKED, false );
            }
        } );

        // 鼠标右键
        $rightMenu.on( 'click', '.item', function () {
            var $map = $( '.cesium-widget canvas' );
            var $self = $( this );
            var key = $self.data( 'key' );
            var fn = domEventMap[ $self.data( 'item' ) ];

            if ( typeof fn === 'function' ) {
                fn.call( this, key );
            }

            switch ( key ) {
                case 0: // 选择
                    $map.css( 'cursor', 'url(/resource/images/cursor/ico_choose.png), auto' );
                    break;
                case 1: // 滑行
                    $map.css( 'cursor', 'url(/resource/images/cursor/ico_move.png), auto' );
                    break;
                case 2: // 选择
                    $map.css( 'cursor', 'url(/resource/images/cursor/ico_rotate.png), auto' );
                    break;

                default:
                    $map.css( 'cursor', 'url(/resource/images/cursor/ico_choose.png), auto' );
                    break;
            }

            $rightMenu.removeClass( ACTIVE );
        } );
    } );
} );
