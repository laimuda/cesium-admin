/**
 * @file cameraCtl
 */
define( [
    'viewer',
    './bigIndex/var/cameraPoint'
], function ( viewer, cameraPoint ) {
    'use strict';

    var MAXHEIGHT = 1300, DEF = 'default';

    var cameraCtl = {
        setView: function ( type ) {
            type = type == null ? 'default' : type;
            var opt = cameraPoint[ type ];
            if ( opt ) {
                viewer.scene.camera.setView( opt );
            }
            return this;
        },
        flyTo: function ( type ) {
            type = type == null ? 'default' : type;
            var opt = cameraPoint[ type ];
            if ( opt ) {
                viewer.scene.camera.flyTo( $.extend( {
                    maximumHeight: MAXHEIGHT
                }, opt ) );
            }
            return this;
        }
    };

    return cameraCtl;
} );
