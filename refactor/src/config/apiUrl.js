/**
 * @file api 请求路径
 */
define( [

], function( ) {
    'use strict';

    return {
        // 获取 insar 点信息, 加载很慢
        getInsarData: '/site/PVIP/moInsarpoint/getMoInsarpoint.ds',
        // 获取内部风险点
        getCurRisk: '/site/PVIP/risklist/getCurrRiskResourceDataFor3d.ds',
        // 获取全部风险点
        getAllRisk: '/site/PVIP/risklist/getAllRiskResourceDataFor3d.ds',
        // 获取桩号
        getPoint: '/site/PVIP/risklist/getCurrentWorkProgressFor3d.ds',
        // 获取进度线
        getLine: '/site/PVIP/moPoint/getMoPoint.ds',
        // 点击获取最近的建筑物
        getLatelyBuild:
            'http://120.78.73.154:8090/iserver/services/map-JianZhuTouYing/rest/maps/FZ000TY@JZTY',
        // 获取视频监控数据
        getVideoMsg: '/site/PVIP/cameraList/getCameraList.ds',
        // 播放视频
        playVideo: '/site/PVIP/cameraList/videoplayer.ds',
    };
} );
