const cluster = require('cluster');
const http = require('http');
const os = require('os');
const config = require('./config');
const url = require('url');

const dtManager = require('./datatype/manager');
const workers = [];
const metrics = {
	'total': 0, // 总共多少请求数，
	'success': 0, // 服务端渲染成功的请求数，
	'error':0, // 服务端渲染失败的请求数，
	'iframe':0, // 使用iframe接口请求数
	'server':0, // 使用服务端接口请求数
	'test':0, // 使用测试接口请求数
	'metric': 0, // 查看统计接口请求数
};

if (cluster.isMaster) {
	for (let i = 0; i < os.cpus().length; i++) {
		let work = cluster.fork();
		workers.push(work);
	}

	cluster.on('message', (worker, msg, handle) =>  {
		if (msg.cmd.substr(0, 5) == 'count') {
			let flag = msg.cmd.substr(6);
			if (flag in metrics) {
				metrics['total']++
				metrics[flag]++;
			}
			return;
		} else if(msg.cmd == 'metric.show') {
			return worker.send(metrics);
		} else if (msg.cmd == 'metric.load') {
			for (i in msg.data) {
				(typeof(metrics[i]) !== 'undefined')
				&& (metrics[i] = msg.data[i]);
			}
			return;
		} else if (msg.cmd == 'metric.save') {
			return dtManager.saveMetricToFile(metrics);
		}

		console.log(`uncatch worker message ${msg.cmd}`);
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker exit with code:${code}, signal:${signal}`)
		workers.filter((w) => {
			return w != worker
		});
		workers.push(cluster.fork());
	})
} else {
	const server = http.createServer((req, res) => {
		urlParts = url.parse(req.url, true);
		switch (urlParts.pathname) {
			case '/i':
				dtManager.handleIframeEmbed(req, res)
			break;
			case '/t':
				dtManager.handleTest(req, res);
			break;
			case '/m':
				dtManager.handleMetrics(req, res);
				break;
			case '/s':
				dtManager.handleServerRender(req, res);
				break;
			default:
				dtManager.defaultHandle(req, res);

		}
	}).listen(config.port, config.host, () => {
		console.log(`start proxy service listen ${config.host}:${config.port} at workder[${cluster.worker.id}]`)
	});

	server.on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			console.log('address in use, retrying after...');
			setTimeout(() => {
				server.close()
				server.listen(config.port, config.host)
			}, 2000);
		} else {
			console.log('caught exception: %j', err, err.stack);
			server.close();
			process.exit(1);
		}
	})
}