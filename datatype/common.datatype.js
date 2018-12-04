const toolkit = require('./toolkit');
const config = require('../config');

module.exports = function (params) {
	let dtStruct = {}, {
        type = '',
        title = '',
        xAxis = '',
        yAxis = '',
        series = '',
        legend = '',
        credit = '',
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
        try {
            dtStruct['series'] = JSON.parse(series);
        } catch (e) {
            console.log('parse data[series] argument error', e.stack);
        }
    }

    dtStruct['xAxis'] = {
        'categories': []
    }
    if (xAxis) { // x轴
        try {
            dtStruct['xAxis']['categories'] = JSON.parse(xAxis);
        } catch(e) {
            console.log('parse data[xAxis] argument error', e.stack);
        }
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
        try {
            dtStruct = toolkit.parse(all);
        } catch(e) {
            console.log('parse data[all] argument error', e.stack);
        }
    }

    // 版权信息
    if (credit) {
        let credits = credit.split('|')
        dtStruct['credits'] = {
            enabled: true,
            text: credits[0],
            href: credits[1] || ''
        }
    } else if (config.credits && config.credits.text) {
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