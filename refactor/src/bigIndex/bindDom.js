/**
 * @file 绑定页面事件
 */
define( [
    'layerCtl',
    'allRiskEntities',
    'nbRiskEntities',
    'zbRiskEntities'
], function ( layerCtl, allRiskEntities, nbRiskEntities, zbRiskEntities ) {
    'use strict';

    return function () {

        var CHECKED = 'checked';

        // 绑定选取款的点击事件
        $( '.squaredTwo' ).click( function () {
            var $self = $( this ), $inp = $self.find( 'input' );
            var val = $inp.prop( CHECKED );
            $inp.prop( CHECKED, !val );
        } );

        // 建筑按钮
        $( '#building .squaredTwo' ).click( function () {
            // 获取建筑图层
            layerCtl.bigIndexPromise.then( function ( layers ) {
                var build = null;

                $.each( layers, function ( _, layer ) {
                    if ( layer._name === 'fz' ) {
                        build = layer;
                    } else {
                        return;
                    }
                } );

                build._visible = !build._visible;
            } );
        } );

        // 全部风险点
        $( '#dAll .squaredTwo' ).click( function () {
            var $self = $( this ), $inp = $self.find( 'input' );
            var val = $inp.prop( CHECKED );
            var $childs = $( '#risk, #arisk' ).find( '.squaredTwo input' );
            allRiskEntities.turn( val );

            if ( val ) { // 联动
                $childs.prop( CHECKED, true );
            } else {
                $childs.prop( CHECKED, false );
            }
        } );

        // 周边风险点
        $( '#risk .squaredTwo' ).click( function () {
            var $self = $( this ), $inp = $self.find( 'input' );
            var val = $inp.prop( CHECKED );
            var $all =  $( '#dAll .squaredTwo input' );
            var allVal = $all.prop( CHECKED );
            zbRiskEntities.turn( val );

            if ( !val && allVal ) {
                $all.prop( CHECKED, false );
            }
        } );

        // 工程内部风险点
        $( '#arisk .squaredTwo' ).click( function () {
            var $self = $( this ), $inp = $self.find( 'input' );
            var val = $inp.prop( CHECKED );
            var $all =  $( '#dAll .squaredTwo input' );
            var allVal = $all.prop( CHECKED );
            nbRiskEntities.turn( val );

            if ( !val && allVal ) {
                $all.prop( CHECKED, false );
            }
        } );

        // insar 点
        $( '#ground .squaredTwo' ).click( function () {
            var $self = $( this ), $inp = $self.find( 'input' );
            var val = $inp.prop( CHECKED );
            layerCtl.insar._layer._visible = val;
        } );
    }
} );
