define( [

], function( ) {
    'use strict';

    return {

        ip_1: 'http://192.168.10.214:8090',
        // 图层使用的 ID
        ip_2: 'http://120.78.73.154:8090',

        // 获取附近建筑物
        getCurBuild:
            '/iserver/services/map-JianZhuTouYing/rest/maps/FZ000TY@JZTY',

        // 图层
        provider_dt:
            '/iserver/services/map-ChunFengSuiDao2D/rest/maps/CFSD_DT000@cfsd_2D',
            // '/iserver/services/map-smtiles-CFSD/rest/maps/CFSD_DT000@cfsd_2D',
        provider_cad:
            '/iserver/services/map-ChunFengSuiDao2D/rest/maps/West_Part04@cfsd_2D',
        linePromise:
            '/iserver/services/3D-ChunFengSuiDao/rest/realspace/datas/Progress_Line' +
            '@%E6%A1%A9%E5%8F%B7/config',
        buildPromise:
            '/iserver/services/3D-ChunFengSuiDao/rest/realspace/datas/FZ000@ChunFengLu3D01/config',
        insarPromise:
            '/iserver/services/3D-ChunFengSuiDao/rest/realspace/datas/%E6%98%A5%E9%' +
            'A3%8E%E8%B7%AF_InsarPoint@%E6%A1%A9%E5%8F%B7/config',
        progressPromise:
            '/iserver/services/3D-ChunFengSuiDao/rest/realspace/datas/Progress_Point' +
            '@%E6%A1%A9%E5%8F%B7/config',
        GaiBanPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_GaiBan@jikeng_6qu/config',
        DiLianQPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_DiLianQ_Z@jikeng_6qu/config',
        NeiCheng4Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng4@jikeng_6qu/config',
        NeiCheng7Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng7@jikeng_6qu/config',
        GuanliangPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_Guanliang@jikeng_6qu/config',
        JiaoBanZPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_JiaoBanZ@jikeng_6qu/config',
        JianCeDPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_JianCeD@jikeng_6qu/config',
        NeiCheng3Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng3@jikeng_6qu/config',
        DiBanPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_DiBan@jikeng_6qu/config',
        DiLianQ1Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_DiLianQ_Y@jikeng_6qu/config',
        GeGouZPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_GeGouZ@jikeng_6qu/config',
        KangBaZPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/结构柱' +
            '_JK_KangBaZ@jikeng_6qu/config',
        cdDiXingPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/地形' +
            '_CD_DiXing_XiCeMW@jikeng_6qu/config',
        GangBanZPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_GangBanZ@jikeng_6qu/config',
        NeiCheng5Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng5@jikeng_6qu/config',
        NeiCheng2Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng2@jikeng_6qu/config',
        JK_GeGouZPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/结构柱' +
            '_JK_GeGouZ@jikeng_6qu/config',
        XiLiangGBPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_XiLiangGB@jikeng_6qu/config',
        JiShuiJPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_JiShuiJ@jikeng_6qu/config',
        LiZhuGBPromise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_LiZhuGB@jikeng_6qu/config',
        NeiCheng6Promise:
            '/iserver/services/3D-JiKeng6QuBIM/rest/realspace/datas/常规模型' +
            '_JK_NeiCheng6@jikeng_6qu/config'
    };
} );
