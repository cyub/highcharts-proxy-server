# highcharts-proxy-server
`Highcharts-Proxy-Server`是基于`Highchart`的简易数据可视化编辑工具和服务端渲染工具。服务端渲染基于Highchart官方提供导出服务工具[highcharts-export-server](https://github.com/highcharts/node-export-server)

`Highcharts-Proxy-Server`可适用用场景如下：

1. 我有些数据，想快速数据可视化并分享给别人
2. 由于运营统计需要，希望每日能够自动发送邮件报表

为了解决1，2场景问题，`Highcharts-Proxy-Server`支持页面嵌套和图片生成两种形式。假设你部署的地址
是export.example.com,你只需要将数据按照一定的规则处理即可：

```
// 网页地址
http.example.com/i?title=x轴标题|x轴副标题|y轴标题&type=图表类型&xAxis=x轴数据&series=y轴数据

// 生成图片
http.example.com/s?title=x轴标题|x轴副标题|y轴标题&type=图表类型&xAxis=x轴数据&series=y轴数据
```

**注意：**自动发送邮件这个场景只解决数据图片生成的处理，至于发送处理需额外处理。由于使用的是URL传递数据，限于浏览器和web服务器url长度限制需注意。

现在就可以访问[export.cyub.me](http://export.cyub.me/t)测试使用

