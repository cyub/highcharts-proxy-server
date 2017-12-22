const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const config = require('../config');

module.exports = (() => {
	
	this.dtHandles = [];

	this.handleServerRender = function (req, res, httpClient, callback) {
		process.send({ cmd: 'count.server' });

		let urlParts = url.parse(req.url, true);
		let body = {};

		if (urlParts.type) {
			let dt = this.dtHandles.filter((d) => {
				return d.name == urlParts.type.toLowerCase()
			});
			if (dt) {
				body = require(dt.file)(urlParts)
			}
		} else {
			body = require(__dirname + '/' + 'common.datatype.js')(urlParts)
		}
		if (body) {
			body['infile'] = body;
		}
		
		let options = {};
		options['headers'] = { 'Content-Type': 'application/json;charset=UTF-8'}

		httpClient.post('/', body, options).then(function (response) 
		{
			res.setHeader("Content-Type", "image/png");
			res.end(response.data);
		}).catch(function (error) {
			res.end('error!')
		});	
	};

	this.handleIframeEmbed = function (req, res, httpClient, callback) {
		let urlParts = url.parse(req.url, true);
		let viewData = {
			chart: require('./common.datatype')(urlParts)
		};

		let {width = 800, height = 800 } = urlParts.query;
		viewData.width=width;
		viewData.height=height;

		this.view(res, 'iframe', viewData);
	};

	this.handleMetrics = function (req, res, httpClient, callback) {
		process.send({ cmd: 'metric' });
		process.on('message', (data) => {
			res.end(JSON.stringify(data));
		});
		process.send({ cmd: 'count.metric' });
	}

	this.handleTest = function (req, res, httpClient, callback) {
		process.send({ cmd: 'count.test' });
		return this.view(res, 'test', { hps: config.export_host});
	}

	this.view = function (res, template, viewData) {
		fs.readFile(`${__dirname}/../templates/${template}.tmpl`, 'utf8', (err, tmpl) => {
			if (err) throw err;
			tmpl = tmpl.replace(/{{\s?(\$[\w]+)\s?}}/gi, (match, tuple)=>{
				if (viewData && viewData[tuple.slice(1)]) {
					let val = viewData[tuple.slice(1)];

					if (typeof(val) == 'number' || typeof(val) == 'string') {
						return val;
					} else if (typeof(val) == 'boolean') {
						return val == true ? 'true' : 'false';
					}
					return JSON.stringify(viewData[tuple.slice(1)])
				} else {
					return '';
				}
			});
			res.end(tmpl)
		});
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
	return this
})()
