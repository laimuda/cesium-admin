/**
 * @file 大屏预览
 * @description 对应 example/js/bigIndex.js example/index.jsp
 * @override
 */
require.config( {
    waitSeconds: 30000,
    paths: {
        'echarts': '/../resource/assets/echarts.min',
        'Cesium': '../../webgl/Build/Cesium/Cesium',
        // 'Zlib': '../../webgl/Build/Cesium/Workers/zlib.min',
        'z': './assets/z',
        'Bubble': './assets/Bubble',

        'viewer': './var/viewer',
        'lineEntities': './var/entities/line',
        'pointEntities': './var/entities/point',
        'zbRiskEntities': './var/entities/zbRisk',
        'nbRiskEntities': './var/entities/nbRisk',
        'allRiskEntities': './var/entities/allRisk',
        'riskEntities': './var/entities/risk',
        'ZnvUrls': './config/layerUrl',
        'api': './API/index',
        // 'layerConfig': './config/layerConfig',

        'cameraCtl': './bigIndex/cameraCtl',
        'layerCtl': './Model/layerCtl',
        // 'videoCtl': './Model/videoCtl',
        // 'lsCtl': './Model/lsCtl',
        // 'coordinate': './Model/coordinate',
        // 'pickupCtl': './Model/pickupCtl',
        // 'locCtl': './Model/locCtl',

        'EntityCtl': './Class/EntityCtl',
        'LayerCtl': './Class/LayerCtl',
    },
    shim: {
        Cesium: {
            exports: 'Cesium'
        },
        Zlib: {
            exports: 'Zlib'
        }
    }
} );

require( [
    './bigIndex/ready'
], function () {
    // window.onload = onload
} );
