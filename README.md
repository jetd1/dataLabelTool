# dataLabelTool

 - 数据结构：Point和Circle，以及
 - 三种画点工具、画圆动态预览
 - label点、圆为红色，其中label点画成空心小圆，label圆的圆心画为黑色实心圆
 - data - label 结构：{ tag: 文件名, label: labelSet } （JSON）
 - 点击完成后当前结果自动存进localStorage.STRUCT304（不会覆盖以前结果，在桌面端浏览器用localStorage是安全的，只要不手动清理缓存）
 - 已标数据查看方法：eval(localStorage.STRUCT304)
 - 注意由于有跨域问题，不能用file协议加载

