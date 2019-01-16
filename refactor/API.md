# 大屏数据对接

## 安全教育

```json
http://localhost:8080/site/PVIP/securityedu/getSecEduStatsChartData.ds

参数：
	courseId: 0， 所有课程
	timeType: 2，0：最近7天， 1： 最近30天， 2： 累计
响应：
	{
		"ret":0,
		"chart4":	          // 技术交底合格率
			{
				"positiveNum":0,	 //通过人数
				"negativeNum":0,	 //未通过人数
				"title":"合格率0%"
			},
		"chart3":	          // 技术交底参与率
			{
				"positiveNum":0,	//计划参加人数
				"negativeNum":0,	// 实际参加人数
				"title":"参与率0%"
			},
		"chart2":	{         // 安全教育合格率
				"positiveNum":0,      //通过人数
				"negativeNum":0,	//未通过人数
				"title":"合格率0%"
			},
		"chart1":              // 安全教育参与率
			{
				"positiveNum":0,	//计划参加人数
				"negativeNum":0,     // 实际参加人数
				"title":"参与率0%"
			}
	}
```

## 安全统计

***左边的 echarts没有数据***

```js
// 风险源数据查询
$.post(
    '/site/PVIP/riskhints/getRiskData.ds', {
        startMileage: '',
        endMileage: '',
        subProjectId: JSON.stringify([]),
        riskLevel: '0'
    }
);
```

## 进度统计

```json
已施工的接口: `/site/PVIP/workplan/getConstructionMileageSum.ds`
eastPer: "0" // 东明挖进度
middlePer: "0" // 盾构段进度
receivePer: "0"
startPer: "0"
totlePer: "1.62" // 总进度
westPer: "10" // 西明挖段进度

计划施工的接口: `/site/PVIP/workplan/getPlanJobByAreaThree.ds`
plannum: 0 // 计划的环数

实际环数: 盾构段进度百分比 * 盾构段米数 / 2
每 2 米 一环
利用数据计算出来

每一段的米数和总工程的米数
应该定义在全局唯一 
var rate = [
    {'rate_name':"西明挖段", 'rate_mileage':"837.00", "flag":"westPer"},
    {'rate_name':"盾构段", 'rate_mileage':"3603.00", "flag":"middlePer"},
    {'rate_name':"东明挖段", 'rate_mileage':"737.97", "flag":"eastPer"},
    {'rate_name':"春风隧道总工程", 'rate_mileage':"5177.97", "flag":"totlePer"}
];
```

## 质量统计

```json
http://localhost:8080/site/PVIP/quality/getBigScreenData.ds
请求参数：无

响应：
	{
		"data":{
			"pieData":{			//饼图数据
				"rectifyNum":0,		//待整改
				"overTimeNum":0,		//已超时
				"verifyNum":0,		//待校验
				"closeNum":0		//已关闭
			},
			"top5Data":[			
				{
					"closeNum":2,		
					"overtimeNum":3,
					"projectId":"SSZTB2560000100005",
					"projectName":"外围",
					"rectifyNum":4,
					"time":"2018-04-27",
					"verifyNum":5
				},
				{
					"closeNum":0,
					"overtimeNum":0,
					"projectId":"SSZTB2560000100001",
					"projectName":"钻孔灌注桩",
					"rectifyNum":1,
					"time":"2018-11-06",
					"verifyNum":0
				},
				{	
					"closeNum":1,
					"overtimeNum":0,
					"projectId":"SSZTB2560000200001",
					"projectName":"主体结构",
					"rectifyNum":0,
					"time":"2018-04-26",
					"verifyNum":0
				},
				{
					"closeNum":1,
					"overtimeNum":0,
					"projectId":"SSZTB2560000100004",
					"projectName":"桩顶冠梁",
					"rectifyNum":0,
					"time":"2018-11-06",
					"verifyNum":0
				}
			]
		},
		"error":0,
		"message":""
	}
```

## 人员管理

```json
// /site/PVIP/personnel/getInOutStat.ds
{
    "in": 0,
    "out": 0
}
```

