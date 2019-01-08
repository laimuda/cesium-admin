/**
 * @file Cesium 初始化
 */
define( [
    'viewer',
    'cameraCtl',
    'layerCtl',
    './var/layers',
    'ZnvUrls'
], function( viewer, cameraCtl, layerCtl, layers, ZnvUrls ) {
    'use strict';

    return function () {

        var _viewer = new Cesium.Viewer('cesiumContainer', {
            //sceneModePicker:true,
            //navigation:false,
            //baseLayerPicker : false,
            imageryProvider: new Cesium.SingleTileImageryProvider( {
                url: '/site/PVIP/for3D/refactor/static/images/earthbump1k.jpg'
            } )
        } );

        viewer._viewer = _viewer;
        viewer.scene = _viewer.scene;
        viewer.camera = _viewer.camera;
        viewer.entities = _viewer.entities;

        cameraCtl.setView( 'default' );

        var fns = layers.map( function ( name ) {
            return _viewer.scene.addS3MTilesLayerByScp(
                ZnvUrls.ip_2 + ZnvUrls[ name + 'Promise' ], {
                name: name
            } );
        } );

        // 加载图层
        layerCtl.bigIndexPromise = layerCtl.all( fns, _done, function (e) {
            if ( _viewer.cesiumWidget._showRenderLoopErrors ) {
                var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
                _viewer.cesiumWidget.showErrorPanel( title, undefined, e );
            }
        } );

        function _done ( layers ) {

            $( '#loadingbar' ).hide();

            $.each( layers, function ( _, layer ) {
                if ( layer._name === 'fz' ) {
                    layer.brightness = 1.5;
                } else if ( layer._name === 'dt' ) {
                    layer.brightness = 1.5;
                }
                layer.refresh();
            } );

            return layers;
        }
    }
} );
