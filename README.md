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

现在就可以访问[export.cyub.me](http://export.cyub.me/t)测试使用：

图片: 

<img src="http://export.cyub.me/s?type=line&title=%E6%9C%88%E5%B9%B3%E5%9D%87%E9%99%8D%E9%9B%A8%E9%87%8F%7C%E6%95%B0%E6%8D%AE%E6%9D%A5%E6%BA%90%3A%20WorldClimate.com%7C%E9%99%8D%E9%9B%A8%E9%87%8F%20(mm)&legend=vertical%7Cright%7Cmiddle&width=490&height=360&xAxis=%5B%22%E4%B8%80%E6%9C%88%22%2C%22%E4%BA%8C%E6%9C%88%22%2C%22%E4%B8%89%E6%9C%88%22%2C%22%E5%9B%9B%E6%9C%88%22%2C%22%E4%BA%94%E6%9C%88%22%2C%22%E5%85%AD%E6%9C%88%22%2C%22%E4%B8%83%E6%9C%88%22%2C%22%E5%85%AB%E6%9C%88%22%2C%22%E4%B9%9D%E6%9C%88%22%2C%22%E5%8D%81%E6%9C%88%22%2C%22%E5%8D%81%E4%B8%80%E6%9C%88%22%2C%22%E5%8D%81%E4%BA%8C%E6%9C%88%22%5D&series=%5B%7B%22name%22%3A%22%E4%B8%9C%E4%BA%AC%22%2C%22data%22%3A%5B49.9%2C71.5%2C106.4%2C129.2%2C144%2C176%2C135.6%2C148.5%2C216.4%2C194.1%2C95.6%2C54.4%5D%7D%2C%7B%22name%22%3A%22%E7%BA%BD%E7%BA%A6%22%2C%22data%22%3A%5B83.6%2C78.8%2C98.5%2C93.4%2C106%2C84.5%2C105%2C104.3%2C91.2%2C83.5%2C106.6%2C92.3%5D%7D%2C%7B%22name%22%3A%22%E4%BC%A6%E6%95%A6%22%2C%22data%22%3A%5B48.9%2C38.8%2C39.3%2C41.4%2C47%2C48.3%2C59%2C59.6%2C52.4%2C65.2%2C59.3%2C51.2%5D%7D%2C%7B%22name%22%3A%22%E6%9F%8F%E6%9E%97%22%2C%22data%22%3A%5B42.4%2C33.2%2C34.5%2C39.7%2C52.6%2C75.5%2C57.4%2C60.4%2C47.6%2C39.1%2C46.8%2C51.1%5D%7D%5D" width="490px" height="360px">


页面: 

<iframe src="http://export.cyub.me/i?type=line&title=%E6%9C%88%E5%B9%B3%E5%9D%87%E9%99%8D%E9%9B%A8%E9%87%8F%7C%E6%95%B0%E6%8D%AE%E6%9D%A5%E6%BA%90%3A%20WorldClimate.com%7C%E9%99%8D%E9%9B%A8%E9%87%8F%20(mm)&legend=vertical%7Cright%7Cmiddle&width=490&height=360&xAxis=%5B%22%E4%B8%80%E6%9C%88%22%2C%22%E4%BA%8C%E6%9C%88%22%2C%22%E4%B8%89%E6%9C%88%22%2C%22%E5%9B%9B%E6%9C%88%22%2C%22%E4%BA%94%E6%9C%88%22%2C%22%E5%85%AD%E6%9C%88%22%2C%22%E4%B8%83%E6%9C%88%22%2C%22%E5%85%AB%E6%9C%88%22%2C%22%E4%B9%9D%E6%9C%88%22%2C%22%E5%8D%81%E6%9C%88%22%2C%22%E5%8D%81%E4%B8%80%E6%9C%88%22%2C%22%E5%8D%81%E4%BA%8C%E6%9C%88%22%5D&series=%5B%7B%22name%22%3A%22%E4%B8%9C%E4%BA%AC%22%2C%22data%22%3A%5B49.9%2C71.5%2C106.4%2C129.2%2C144%2C176%2C135.6%2C148.5%2C216.4%2C194.1%2C95.6%2C54.4%5D%7D%2C%7B%22name%22%3A%22%E7%BA%BD%E7%BA%A6%22%2C%22data%22%3A%5B83.6%2C78.8%2C98.5%2C93.4%2C106%2C84.5%2C105%2C104.3%2C91.2%2C83.5%2C106.6%2C92.3%5D%7D%2C%7B%22name%22%3A%22%E4%BC%A6%E6%95%A6%22%2C%22data%22%3A%5B48.9%2C38.8%2C39.3%2C41.4%2C47%2C48.3%2C59%2C59.6%2C52.4%2C65.2%2C59.3%2C51.2%5D%7D%2C%7B%22name%22%3A%22%E6%9F%8F%E6%9E%97%22%2C%22data%22%3A%5B42.4%2C33.2%2C34.5%2C39.7%2C52.6%2C75.5%2C57.4%2C60.4%2C47.6%2C39.1%2C46.8%2C51.1%5D%7D%5D" width="490" height="360 overflow="hide"" frameborder="0">

