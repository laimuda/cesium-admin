define( [
    'Cesium'
], function( Cesium ) {
    'use strict';

    $( function () {
        console.log( '>>> Ready' );


        var $fjx = $( '#fjx' );
        var $sandzMap = $( '#sandzMap' );
        var $dtMap = $( '#dtMap' );
        var $mask = $sandzMap.find( '.mask' );

        setCanvasHeight();

        // canvas 自适应
        window.onresize = setCanvasHeight;

        // 为分界线添加事件
        ( function () {
            var top;
            var handler = function ( $e ) {
                top = $e.pageY - 64;
                $fjx.css( {
                    top: top
                } );
                $dtMap.css( {
                    height: top + 3
                } );

                window.getSelection ?
                        window.getSelection().removeAllRanges() :
                        document.selection.empty();
            };

            window._fjxCallback = handler;

            $fjx.on( 'mousedown', function () {
                $mask.show().on( 'mousemove', handler );
            } )
            $mask.parent().on( 'mouseup', function () {
                $mask.hide().off( 'mousemove', handler );
            } );
        } )();

        function setCanvasHeight() {
            var $ce = $( '.cesium-widget canvas' );
            var $fjx = $( '#fjx' );
            var w = $sandzMap.width(), h = $sandzMap.height();
            var top = +$fjx.css( 'top' ).match( /\d*/ )[ 0 ], scalc = 1;

            scalc = h / $ce.height();
            top *= scalc;

            $ce.css( {
                width: w, height: h
            } ).attr( {
                width: w, height: h
            } );

            $fjx = $( '#fjx' ).css( {
                top: top
            } );

            if ( $fjx.css( 'display' ) !== 'none' ) {
                $dtMap.height( top + 3 );
            }
        }
    } );
} );
