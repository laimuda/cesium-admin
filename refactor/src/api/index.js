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
                return ( data = JSON.parse( data ) );
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
        }
    };

    var apis = 'getCurRisk getAllRisk getPoint getLine getVideoMsg';

    $.each( apis.split( ' ' ), function ( index, item ) {
        api[ item ] = function () {
            return post( apiUrl[ item ] ).then( log( item ) );
        }
    } );

    function log ( msg ) {
        return function ( data, success ) {

            if ( 'success' === success ) {
                console.log( '>>> ' + msg + ' success' );
                data = JSON.parse( data );
            }

            return data;
        }
    }

    return api;
} );
