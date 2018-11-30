( {
    // appDir: '../src',
    baseUrl: '../src',
    name: "main",
    paths: {
        'echarts': '../../../../../resource/assets/echarts.min',
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
        'lsCtl': './Model/lsCtl',
        'coordinate': './Model/coordinate',
        'pickupCtl': './Model/pickupCtl',
        'locCtl': './Model/locCtl',

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
    },
    out: '../src/build.js'
} )
