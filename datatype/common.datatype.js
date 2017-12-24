const config = require('../config');

module.exports = function (params) {
	let dtStruct = {}, {

        type = '',
        title = '',
        xAxis = '',
        yAxis = '',
        series = '',
        legend = '',
        all = '',
    } = params;

    if (type) { // 图表类型
        dtStruct['chart'] = {
            type: type
        }
    }
    if (title) { // 标题，格式eg: x轴标题|x轴子标题|y轴标题
        titles = title.split('|');
        dtStruct['title'] = {
            text: titles[0]
        };
        if (titles[1]) {
            dtStruct['subtitle'] = {
                text: titles[1]
            };
        }
        if (titles[2]) {
            dtStruct['yAxis'] = {
                title: {
                    text: titles[2]
                }
            };
        }
    }
    if (yAxis) { // y轴标题
        dtStruct['yAxis'] = {
            title: {
                text: yAxis
            }
        };
    }

    if (!dtStruct['yAxis']) {
        dtStruct['yAxis'] = {
            title: {
                text: ''
            }
        };
    }

    dtStruct['series'] = [];
    if (series) { // 数据源
        dtStruct['series'] = JSON.parse(series);
    }

    dtStruct['xAxis'] = {
        'categories': []
    }
    if (xAxis) { // x轴
        dtStruct['xAxis']['categories'] = JSON.parse(xAxis);
    }

    if (legend) { // 图例
        legends = legend.split('|');
        dtStruct['legend'] = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            x:0,
            y:0

        }

        for (i in dtStruct['legend']) {
            let v = legends.shift()
            if (v) {
                dtStruct['legend'][i] = v;
            } else {
                break;
            }
        }
    }

    if (all) {
        dtStruct = JSON.parse(all);
    }
    if (config.credits && config.credits.text) { // 版权信息
        dtStruct['credits'] = {
            enabled: true,
            text: config.credits.text,
            href: config.credits.href || ''
        }
    } else {
        dtStruct['credits'] = {
             enabled: false
        }
    }

    return dtStruct;
}