# dataLabelTool

 - 三种画点工具、画圆动态预览、最后画的圆可点击圆形移位
 - 支持多达十二种点/圆颜色
 - tag - label 结构：`{ tag: 文件名, label: labelSet }` （JSON），其中 `labelSet` 是十二个 `Circle` 的集合，如用户选择跳过，则 `labelSet = []`
 - 基本数据结构：`Circle`：`{ x: 0, y: 0, r: 0 }`，其中 `r = 0` 时退化为点
 - 点击完成后，当前结果自动加入 `localStorage.STRUCT304` 中（不会覆盖以前结果，在桌面端浏览器用localStorage是安全的，只要不手动清理缓存）
 - 已标数据查看方法：`eval(localStorage.STRUCT304)`
