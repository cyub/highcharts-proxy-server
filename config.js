var config = {
	target: "http://127.0.0.1:7100", // highchart服务端渲染地址
	host: "0.0.0.0", // proxy服务ip
	port: "8989", // proxy服务port
    metric_save_file: __dirname + '/metric.data', // 统计数据保存文件
    metric_delay: 3000,
	export_host:"http://192.168.33.10:8989", // proxy服务地址
	credits : { // 图表版权信息
       // text: 'highchart-proxy-server',
       // href: 'http://example.com'
     },
     timeout: 1500
}

module.exports = config
