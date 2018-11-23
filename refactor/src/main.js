require.config( {
    waitSeconds: 1000,
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
        'api': './api/index',

        'cameraCtl': './Model/cameraCtl',
        'layerCtl': './Model/layerCtl',
        'videoCtl': './Model/videoCtl',

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
    './Event/onload',

    './Event/ready',
    './Event/initView',
    './UI/ready'
], function ( onload ) {
    window.onload = onload
} );
