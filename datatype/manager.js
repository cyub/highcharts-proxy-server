const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const config = require('../config');
const axios = require('axios');
const httpClient = axios.create({
  baseURL: config.target,
  timeout: config.timeout,
  headers: {
  	'X-Proxy-By': 'highcharts-proxy-server',
  	'Content-Type':'application/json'
  }
});
const toolkit = require('./toolkit');


module.exports = (function () {
	this.dtHandles = [];

	this.handleServerRender = function (req, res) {
		process.send({ cmd: 'count.server' });
		let urlParts = url.parse(req.url, true);
		let body = { 'infile': {} };

		if (urlParts.type) {
			let dt = this.dtHandles.filter((d) => {
				return d.name == urlParts.type.toLowerCase()
			});
			if (dt) {
				body['infile'] = require(dt.file)(urlParts.query)
			}
		} else {
			body['infile'] = require(__dirname + '/' + 'common.datatype.js')(urlParts.query)
		}

		if (typeof urlParts.query.debug != 'undefined') {
			res.setHeader('Content-Type', 'application/json;charset=utf-8');
			res.end(JSON.stringify(body['infile']));
		}

		let options = {};
		options['headers'] = { 'Content-Type': 'application/json;charset=UTF-8'}
		options['responseType'] = 'arraybuffer';

		httpClient.post('/', body, options).then(function (response) {
			process.send({ cmd: 'count.success' });
			res.setHeader("Content-Type", "image/png");
			res.end(new Buffer(response.data, 'binary'));
		}).catch(function (error) {
			console.log('call highchart server render error:', error);
			process.send({ cmd: 'count.error' });
			res.end('error!')
		});
	};

	this.handleIframeEmbed = function (req, res) {
		let urlParts = url.parse(req.url, true);
		let viewData = {
			chart: require('./common.datatype')(urlParts.query)
		};

		let { width = 800, height = 400 } = urlParts.query;
		viewData.chart = toolkit.addslashes(toolkit.stringify(viewData.chart));
		viewData.width = width;
		viewData.height = height;

		process.send({ cmd: 'count.iframe' });

		this.view(res, 'iframe', viewData);
	};

	this.handleMetrics = function (req, res) {
		process.send({ cmd: 'metric.show' });
		process.send({ cmd: 'count.metric' });
		process.on('message', (metrics) => {
			let params = {
				type: 'column',
				title: 'Highchart Proxy Server 调用次数统计||次数',
				xAxis: JSON.stringify([
					'总数', 'iframe接口', '服务端渲染接口',
					'服务端渲染成功', '服务端渲染失败',
					'测试接口', '统计接口'
					]),
				series: JSON.stringify([{
	            	name:"调用次数统计",
	            	data: [metrics.total, metrics.iframe,
	            	metrics.server, metrics.success, metrics.error,
	            	metrics.test, metrics.metric]
	        	}])
			};
			let viewData = {
				chart: require('./common.datatype')(params),
				width:650,
				height:400
			};

			this.view(res, 'metrics', viewData);
		});
	}

	this.handleTest = function (req, res) {
		process.send({ cmd: 'count.test' });
		return this.view(res, 'test', { hps: config.export_host});
	}

	this.defaultHandle = function (req, res) {
		process.send({ cmd: 'metric.save' });
		res.end('welcome to use highchart!');
	}

	this.view = function (res, template, viewData) {
		fs.readFile(`${__dirname}/../templates/${template}.tmpl`, 'utf8', (err, tmpl) => {
			if (err) throw err;
			tmpl = tmpl.replace(/{{\s*(\$[\w]+)\s*}}/gi, (match, tuple)=>{
				if (viewData && viewData[tuple.slice(1)]) {
					let val = viewData[tuple.slice(1)];

					if (typeof(val) == 'number' || typeof(val) == 'string') {
						return val;
					} else if (typeof(val) == 'boolean') {
						return val == true ? 'true' : 'false';
					}
					return JSON.stringify(viewData[tuple.slice(1)]);
				} else {
					return '';
				}
			});
			res.end(tmpl)
		});
	}

	this.loadMetricFromFile = function () {
		fs.readFile(config.metric_save_file, (err, data) => {
			if (err) {
				console.log('load file error', err);
				return;
			}
			try {
				data = JSON.parse(data);
				process.send({ 'cmd' : 'metric.load', 'data' : data });
			} catch (exception) {
				console.log('parse file exception', exception)
			}
		});
	}

	this.saveMetricToFile = function (metrics) {
		setTimeout(() => {
			fs.writeFileSync(config.metric_save_file, JSON.stringify(metrics));
		}, config.metric_delay);
	}

	this.initDtHandles = function () {
		this.dtHandles = [];
		fs.readdir(__dirname, (err, files) => {
			this.dtHandleLoaded = true;
			if (err || !files) {
				return [];
			}
			files = files.filter(f => { //xxx.datatype.js
				return f.substr(-12) == '.datatype.js';
			});

			this.dtHandles = this.dtHandles.concat((files.map( f => {
				return {
					name: f.substr(0, f.indexOf('.')),
					file: __dirname + '/' + f,
				};
			})));
		});
	}

	this.initDtHandles();
	this.loadMetricFromFile();

	return this
})()
