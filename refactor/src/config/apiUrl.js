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
        // 获取视频监控数据
        getVideoMsg: '/site/PVIP/cameraList/getCameraList.ds',
        // 播放视频
        playVideo: '/site/PVIP/cameraList/videoplayer.ds',
        // 根据 ID 获取 insar 点信息
        getMoInsarpointByPcode:
            '/site/PVIP/moInsarpoint/getMoInsarpointByPcode.ds',
        // 获取工程进度数据
        getProgressData: '/site/PVIP/workplan/getConstructionMileageSum.ds',
        // 第三方检测: 速率超标, 速率未超标, type: 1
        // 施工检测: 速率超标, 速率未超标 type: 2
        rateEx: '/site/PVIP/riskanalysis/getMonitorObjectWarnStateByProject.ds',
        // 当前进度风险点信息
        curProgressRiskMsg: '/site/PVIP/risklist/getRiskResourceDataNotMapFor3d.ds'
    };
} );
