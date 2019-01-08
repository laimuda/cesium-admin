# 目录结构

## API

请求方式都是 post 

+ apiUrl: api 请求路径
+ index: api 对象, 属性为 apiUrl 的键, 值为函数. 默认 post 请求. 返回 promise 对象.

## assets

工具函数

+ z.js: 工具函数
+ Bubble: 提示框插件
+ off: 解绑事件函数

## bigIndex

大屏预览的文件

入口文件: `src/bigIndex.js`

+ var
  + cameraPoint: 默认的视角点位
  + layers: 要加载的图层集合
+ bindDom: 在 `ready` 事件中绑定页面元素的各类事件( 页面的点击事件 )
+ cameraCtl: 控制视角的控制器
+ controller: 处理主要的业务逻辑
+ initView: 初始化 `viewer`
+ ready: `ready` 事件

## Class

Class 类文件

+ EntityCtl: 控制 `entities` 的类
+ layerCtl: 控制图层的类. ( src/Model/layerCtl 中的 layerCtl.insarCtl )

## config

配置文件

+ insarLevel: 用于判断 `insarLevel` 等级
+ layerConfig: 图层配置信息. 目前抽离 `build` 图层
+ layerUrl: 加载图层的请求路径
+ viewPosition: 三维地图的一些默认视角位置

## Event 

事件文件

+ initView: 初始化 `viewer` 事件
+ moveFly: 滑动事件
+ onload: `window.onload` 事件
+ reay: `ready` 事件
+ rightMenu: 鼠标右键点击事件
+ rotate: 旋转事件
+ unityCallback: 三维地质的回调事件

## Model

各类控制器

+ cameraCtl: `camera` 的控制器
+ coordinate: 坐标转换
+ layerCtl: 图层控制器
+ locCtl: 坐标定位
+ lsCtl: 量算功能
+ pickupCtl: 坐标拾取
+ videoCtl: 视频监控

## UI

toolbar 的样式以及基于 UI 的交互点击事件. 

+ bindDom: 例如: 全选功能. 点击触发 `data-item` 事件等.

+ toolbar.less: `toolbar`的样式

## var

定义一些变量

+ entities
  + allRisk: 全部风险点
  + index: 全部 `entities` 点
  + line: 工程进度线
  + nbRisk: 工程内部风险点
  + point: 工程桩号
  + risk: 风险等级划分的全部风险点
  + zbRisk: 周边风险点
+ layers: 要加载的图层
+ origin: 根路径 ( http://localhost:8080 )
+ viewer: 包含 `_viewer` 以及 `_viewer` 下的一些对象

## bigIndex

大屏预览的入口文件

## main 

三维地图的入口文件

## controller

三维地图的主要业务逻辑

## domEventMap

页面上 `DOM` 元素绑定的事件集合

例如: 点击显示隐藏建筑