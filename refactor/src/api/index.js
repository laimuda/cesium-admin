/**
 * @file api
 */
define( [
    './config/apiUrl',
    'ZnvUrls'
], function ( apiUrl, ZnvUrls ) {
    'use strict';

    var post = function ( url, params ) {
        return $.post( url, params ).done( function ( data, success ) {
            if ( 'success' === success ) {
                try {
                    data = JSON.parse( data );
                } catch ( e ) { }
                return data;
            }
        } ).fail( function ( error ) {
            console.error( '<<< ' + url + ' load fail' );
        } );
    }

    var api = {
        getInsarData: function () {
            return post( apiUrl.getInsarData, {
                type: 1
            } ).then( log( 'getInsarData' ) );
        },
        playVideo: function ( id ) {
            return post( apiUrl.playVideo, {
                cameraId: id
            } ).then( log( 'playVideo' ) );
        },
        getMoInsarpointByPcode: function ( id ) {
            return post( apiUrl.getMoInsarpointByPcode, {
                type: 2,
                pcode: id
            } ).then( log( 'getMoInsarpointByPcode' ) );
        }
    };

    var apis = 'getCurRisk getAllRisk getPoint getLine getVideoMsg ' +
        'getProgressData rateEx curProgressRiskMsg';

    $.each( apis.split( ' ' ), function ( index, item ) {
        api[ item ] = function ( params ) {
            return post( apiUrl[ item ], params ).then( log( item ) );
        }
    } );

    function log ( msg ) {
        return function ( data, success ) {

            if ( 'success' === success ) {
                console.log( '>>> ' + msg + ' success' );
                try {
                    data = JSON.parse( data );
                } catch ( e ) { }
            }

            return data;
        }
    }

    return api;
} );
