define( [
    'Cesium',
    'ZnvUrls',
    'viewer',
    'cameraCtl',
    'controller',
    'layerCtl',
    'Bubble',
], function( Cesium, ZnvUrls, viewer, cameraCtl, controller, layerCtl, Bubble ) {
    'use strict';

    $( function () {

        var key;

        var _viewer = new Cesium.Viewer( 'cesiumContainer', {
            infoBox: true,
            selectionIndicator: true, // 绿色边框的开关
            imageryProvider: new Cesium.TiandituImageryProvider( {
                credit: new Cesium.Credit(
                    '天地图全球影像服务 数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局'
                )
            } )
        } );

        var imageryLayers = _viewer.imageryLayers;
        var scene = _viewer.scene;
        // var cdDiXing = _viewer.cdDiXing;

        //_viewer.scene.undergroundMode = false;
        //_viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000;

        // 注册服务
        var provider_dt = new Cesium.SuperMapImageryProvider({
            url: ZnvUrls.ip_2 + ZnvUrls.provider_dt
        });
        var provider_cad = new Cesium.SuperMapImageryProvider({
            url: ZnvUrls.ip_2 + ZnvUrls.provider_cad
        });

        var imagery_dt = imageryLayers.addImageryProvider( provider_dt );
        var imagery_cad = imageryLayers.addImageryProvider( provider_cad );

        // 暴露出 viewr 部分属性
        for ( key in viewer ) {
            viewer[ key ] = _viewer[ key ];
        }
        viewer._viewer = _viewer;
        viewer.imagery_cad = imagery_cad;

        // 提供个 Unity 使用
        window._Unity ={
            scene: scene,
            viewer: _viewer,
            Cesium: Cesium
        };

        // 配置
        scene.camera.percentageChanged = .001;
        imageryLayers._layers[0].brightness = 1.2;
        imageryLayers._layers[0].contrast = 1.1;
        imageryLayers._layers[0].saturation = 1.2;
        // imageryLayers._layers[0].gamma = 1.3;
        imagery_dt.brightness = 1.5;
        imagery_dt.contrast = 1.1;
        imagery_dt.saturation = 1.2;
        // imagery_dt.gamma = 1.3
        provider_dt.minVisibleAltitude = 300;
        imagery_cad.show = false; // CAD 图纸
        // 取消鼠标右键缩放
        // scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.zoomEventTypes = Cesium.CameraEventType.WHEEL;


        // 设置相机位置初始位置
        cameraCtl.setView();

        // 控制绿色的图层显示隐藏
        viewer.camera.changed.addEventListener( function ( e ) {
            var cartographic = Cesium.Cartographic.fromCartesian( scene.camera.position );
            if ( cartographic.height > 300 ) {
                imagery_dt.show = true;
            } else {
                imagery_dt.show = false;
            }
        });

        // 设定高度
        var $sandzMap = $( '#sandzMap' );
        var h = $sandzMap.height();
        var w = $sandzMap.width();
        var $ce = $( '.cesium-widget canvas' );
        $ce.height( h );
        $ce.width( w );

        // 业务逻辑
        controller( _viewer );
    } );
} );
