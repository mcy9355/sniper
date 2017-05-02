const $ = require('jquery');
require('./public');
const baseURL = require('baseURL');
const moment = require('moment');

$(function () {
    //tab切换
    for (var i = 0; i < $('.tabClick li').length; i++) {
        $('.tabClick li')[i].start = i;
        $('.tabClick li').click(function () {
            $(this).addClass('active').siblings('li').removeClass('active'); // 标题切换效果
            $('.lineDiv')[0].style.transform = 'translate3d(' + $('#wrap').width() / $('.tabClick li').length * (this.start) + 'px,0,0)'; // 滑动效果
            $('#' + $('.recently')[this.start].id).removeClass('hide').siblings('.recently').addClass('hide'); // 隐藏与显示
        });
    }
    var start_time = parse_timestamp(moment().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    var end_time = parse_timestamp(moment().format('YYYY-MM-DD HH:mm:ss'));
    // 滚动条样式
    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('#contain').perfectScrollbar({
            useSelectionScroll: true
        });
    });

    //关键服务器点击变化
    $(".severLink p a").click(function () {
        $(this).toggleClass("selected").siblings('a').removeClass('selected').parent('p').siblings('p').children('a').removeClass('selected');
    });

    function parse_timestamp(str_time) {
        str_time = str_time.replace(/-/g,"/");
        var timestamp = Date.parse(new Date(str_time));
        timestamp = timestamp / 1000;
        return timestamp;
    }

    function reset_slide() {
        // 轮播
        require.ensure([], (require) => {
            const SuperSlide = require('slide');
            $("#slideBox").slide({
                mainCell: "ul",
                vis: 5,
                prevCell: ".sPrev",
                nextCell: ".sNext",
                effect: "leftLoop"
            });
        });
        if ($('#slideBox li').length <= 5) {
            $('#slideBox .sPrev,#slideBox .sNext').hide();
            $('#slideBox').removeClass('more-host').addClass('less-host');
        } else {
            $('#slideBox').removeClass('less-host').addClass('more-host');
        }
    }


    function object_to_string(_object) {
        var content = '';
        for (var i in _object) {
            content += i + '=' + _object[i] + '&';
        }
        return content;
    }

    function get_more_url(param) {
        var url = '/hosts/event/more/?' + object_to_string(param);
        return url;
    }

    require.ensure([], (require) => {
        const echarts = require('echarts');

        //服务器/PC端数量统计饼图
        let attackChart1 = echarts.init(document.getElementById('pie-canvas1'));
        let option1 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}:{c}台 ({d}%)",
                borderColor: "rgba(127,127,127,0.7)",
            },
            legend: {
                x: 'left',
                orient: 'horizontal',
                align: 'left',
                left: '20px',
                top: '32px',
                bottom: '32px',
                width: '80%',
                itemHeight: 10,
                itemWidth: 10,
                data: [
                    {
                        name: '服务器',
                        icon: 'circle'
                    }, {
                        name: 'PC',
                        icon: 'circle'
                    }]
            },
            series: [{
                name: '数量统计',
                type: 'pie',
                center: ['50%', '60%'],
                radius: ['47%', '67%'], //修复内圈90px，外圈130pxbug
                data: [],
                label: {
                    normal: {
                        show: false,
                    }
                }
            }],
            color: ['#3a69b5', '#93b4e1']
        };


        //可疑/安全/离线数量统计饼图
        let attackChart2 = echarts.init(document.getElementById('pie-canvas2'));

        var load_host_info = function () {
            var url = baseURL('/api/hosts/total/');
            $.get(url, function (data) {
                if (data.ret == 'success') {
                    // PC/服务器统计
                    option1.series[0].data = data.server;
                    attackChart1.setOption(option1);
                    // PC 状态
                    let option2 = option1;
                    option2.series[0].data = data.status;
                    delete option2.tooltip.borderColor;
                    option2.legend.width = '100%';
                    option2.legend.data = [{name: '离线', icon: 'circle'}, {name: '安全', icon: 'circle'}, {
                        name: '可疑',
                        icon: 'circle'
                    }];
                    option2.color = ['#cdcdcd', '#7fc14e', '#ff9b3c'];

                    attackChart2.setOption(option2);

                    var favorites_list = '<p>';
                    var danger_list = '';
                    var danger_count = 0;


                    if (data.favorites) {
                        var items = data.favorites;
                        var favorites_count = items.length;
                        if (data.favorites_show) {
                            if (favorites_count > data.favorites_show) {
                                favorites_count = data.favorites_show;
                            }
                        }
                        for (var i = 0; i < favorites_count; i++) {
                            if (i > 1 && i % 2 == 0) {
                                favorites_list += '</p><p>';
                            }
                            favorites_list += '<a href="/hosts/#ip_address=' + items[i].ip_address + '">' + items[i].ip_address + '</a>';
                            // if(index < items.length - 1){
                            // 	favorites_list += '</p>';
                            // }
                        }
                    }

                    $.each(data.danger, function (index, item) {
                        danger_list += '<li><a href="/hosts/#ip_address=' + item.ip_address + '"><i class="sprite sprite-computer"></i>';
                        danger_list += '<p>' + item.ip_address + '</p></a></li>';
                        danger_count++;
                    });

                    // 服务器总数
                    $('#num').html(data.count);

                    // 关键服务器
                    $('.severLink').html(favorites_list);

                    // 风险服务器列表
                    $('#slideBox ul').html(danger_list);
                    reset_slide();
                    $('#dunner_count').html(danger_count);
                }

            }, 'json');
        }();

        // 事件日志
        var load_danger_log = function () {
            var param = {'type': 1};
            $('#event_table').prev('h6').find('.more-link').attr('href', get_more_url(param));
            var url = baseURL('/api/hosts/alert/logs/');
            $.get(url, function (rows) {
                if (rows.data) {
                    var table_html = '';
                    $.each(rows.data, function (index, item) {
                        table_html += '<tr>';
                        table_html += '<td>' + item.event_time + '</td>';
                        table_html += '<td style="color: #5584c5;cursor: pointer;"><a href="/hosts/#ip_address=' + item.ip_address + '">' + item.ip_address + '</a></td>';
                        table_html += '<td>' + item.message + '</td>';
                        table_html += '</tr>';
                    });
                    $('#event_table >tbody').html(table_html);
                }
            }, 'json');
        }();

        var load_scan_log = function () {
            var param = {'type': 2};
            //扫描日志
            var url = baseURL('/api/hosts/scan/logs/');
            $('#scan_table').prev('h6').find('.more-link').attr('href', get_more_url(param));
            $.get(url, function (rows) {
                if (rows.data) {
                    var table_html = '';
                    $.each(rows.data, function (index, item) {
                        table_html += '<tr>';
                        table_html += '<td>' + item.event_time + '</td>';
                        table_html += '<td style="color: #5584c5;cursor: pointer;"><a href="/hosts/#ip_address=' + item.ip_address + '">' + item.ip_address + '</a></td>';
                        if (item.status == 3) {
                            table_html += '<td><span class="active">可疑</span></td>';
                        } else {
                            table_html += '<td><span>安全</span></td>';
                        }

                        table_html += '</tr>';
                    });
                    $('#scan_table >tbody').html(table_html);
                }
            }, 'json');
        }();

        //
        var url = baseURL('/api/logs/');
        var param = {
            type: 7,
            count: 1,
            start_time: start_time,
            end_time: end_time,
        };

        // 当前网络连接数、设计文件数
        $.get(url, param, function (data) {
            var count = data.rows.count;
            $('.file-num .num:first p').html(count);
        }, 'json');

        param.type = 8;
        $.get(url, param, function (data) {
            var count = data.rows.count;
            $('.file-num .num:last p').html(count);
        }, 'json');

        delete param.count;
        param.total = 'ip_address';
        param.start_time = parse_timestamp(moment().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'));

        // var attackChart3 = echarts.init(document.getElementById('con-canvas'));
        var option3 = {
            title: {
                show: false
            },
            legend: {
                show: false
            },
            tooltip: {
                type: 'axis',
                formatter: '{a}:{c}'
            },
            grid: {
                show: true,
                left: '54px',
                right: '54px',
                top: '30px',
                containLabel: true,
                borderColor: '#ffffff'
            },
            xAxis: {
                type: 'value',
                axisTick: false,
                splitLine: false,
                boundaryGap: [0, 1],
                axisLine: {
                    lineStyle: {
                        color: '#e5e8ef'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333333'
                    }
                }

            },
            yAxis: {
                type: 'category',
                axisTick: false,
                splitLine: false,
                data: [],
                axisLine: {
                    lineStyle: {
                        color: '#e5e8ef'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [{
                type: 'bar',
                name: '连接数',
                data: [],
                barWidth: '14'
            }],
            itemStyle: {
                normal: {
                    color: '#93b4e1'
                }
            }
        };
        // attackChart3.setOption(option3);
        //最近一小时设计文件打开数量
        // var attackChart4 = echarts.init(document.getElementById('open-canvas'));
        var option4 = {
            title: {
                show: false
            },
            legend: {
                show: true
            },
            tooltip: {
                type: 'axis',
                formatter: '{a}:{c}'
            },
            grid: {
                show: true,
                left: '54px',
                right: '54px',
                top: '30px',
                containLabel: true,
                borderColor: '#ffffff'
            },
            xAxis: {
                type: 'value',
                axisTick: false,
                splitLine: false,
                boundaryGap: [0, 1],
                axisLine: {
                    lineStyle: {
                        color: '#e5e8ef'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333333'
                    }
                },
            },
            yAxis: {
                type: 'category',
                axisTick: false,
                splitLine: false,
                data: [],
                axisLine: {
                    lineStyle: {
                        color: '#e5e8ef'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [{
                type: 'bar',
                name: '文件打开数量',
                data: [],
                barWidth: '14'
            }],
            itemStyle: {
                normal: {
                    color: '#93b4e1'
                }
            }

        };
        // attackChart4.setOption(option4);

        // 最近一小时网络连接
        let attackChart3 = echarts.init(document.getElementById('con-canvas'));

        $.get(url, param, function (data) {
            option3.yAxis.data = data.rows.x;
            option3.series[0].data = data.rows.y;
            attackChart3.setOption(option3);
        }, 'json');


        $('#file-canvas').width($('.con-num').width());
        $('#file-canvas').height($('.con-num').height());
        var attackChart4 = echarts.init(document.getElementById('file-canvas'));
        attackChart4.setOption(option4);
        // 最近一小时设计文件打开数量
        param.type = 7;
        $.get(url, param, function (data) {
            option4.yAxis.data = data.rows.x;
            option4.series[0].data = data.rows.y;
            // option4.series[0].name = '打开数';
            attackChart4.setOption(option4);
        }, 'json');

        var tabCanvasWidth = $('.canvas-box').width();
        $("#sevenTenCanvas").css({width: tabCanvasWidth});
        $("#sevenConCanvas").css({width: tabCanvasWidth});
        $("#proTime").css({width: tabCanvasWidth});

        //最近7天文件数
        let attackChart5 = echarts.init(document.getElementById('sevenTenCanvas'));
        let option5 = {
            tooltip: {
                //show:true,
                //showContent:true,

                trigger: 'axis',
                //formatter: "{a} <br/>{b}",
                //borderColor: "rgba(127,127,127,0.7)",
                axisPointer: { //解决移上去出现线的bug
                    lineStyle: {
                        color: 'rbga(255,255,255,0)', //把先的颜色设置为透明
                        opacity: 0 //为0时，不会绘制改图形
                    }
                },
                formatter: '时间:{b}<br>{a}:{c}' //格式化字符串
            },

            grid: {
                left: '30',
                right: '52',
                bottom: '30',
                top: '72',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // axisTick: false,
                // splitLine: {
                //     show: false
                // },
                data: [],
                //坐标轴线
                axisLine: {
                    show: false
                },
                //    坐标刻度
                axisLabel: {
                    textStyle: {
                        color: '#000'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisTick: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#e5e8ef'
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                },
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    name: '文件打开数量',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: ['rgba(89,131,200,0.2)']
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: ['rgba(89,131,200,0.8)']
                        }
                    },
                    symbol: 'circle',
                    symbolSize: '8',
                    showSymbol: true,
                    itemStyle: {
                        normal: {
                            color: ['rgba(89,131,200,0.8)'],
                            borderColor: ['rgba(89,131,200,0.8)'],
                            lineStyle: {        // 系列级个性化折线样式
                                width: 1,
                                type: 'solid'
                            },
                            shadowBlur: 0
                        },
                        emphasis: {
                            color: ['rgba(89,131,200,0.8)']
                        }
                    },
                    data: []
                }
            ],
        };
        let option6 = option5;


        // 最近7天设计文件
        param = {
            type: 7,
            total: 'event_date',
        };
        $.get(url, param, function (data) {
            option5.xAxis.data = data.rows.x;
            option5.series[0].data = data.rows.y;
            attackChart5.setOption(option5);
        }, 'json');


        // 最近7天网络连接数
        let attackChart6 = echarts.init(document.getElementById('sevenConCanvas'));

        param.type = 8;
        $.get(url, param, function (data) {
            option6.xAxis.data = data.rows.x;
            option6.series[0].data = data.rows.y;
            option6.series[0].name = '网络连接数';
            attackChart6.setOption(option6);
        }, 'json');


        //防护时间轴
        let attackChart7 = echarts.init(document.getElementById('proTime'));
        let option7 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: [{
                    name: '可疑',
                    // 强制设置图形为圆。
                    icon: 'circle',
                    textStyle: {
                        color: '#000'
                    }
                }, {
                    name: '已防护',
                    // 强制设置图形为圆。
                    icon: 'circle',
                    textStyle: {
                        color: '#000'
                    }
                }],
                icon: 'circle',
                textStyle: {
                    color: '#333333',
                    fontSize: 12

                },
                right: '52',
                top: '30',
                itemWidth: 10,
                itemHeight: 10,
            },
            grid: {
                left: '30',
                right: '52',
                bottom: '30',
                top: '72',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    splitLine: {show: false},
                    data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00'],
                    axisTick: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666666'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisTick: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666666'
                        }
                    }
                }
            ],
            series: [

                {
                    name: '已防护',
                    type: 'bar',
                    stack: '主机',
                    barWidth: 16,
                    data: [120, 132, 101, 134, 90, 230, 210, 22, 123, 345]
                },
                {
                    name: '可疑',
                    type: 'bar',
                    stack: '主机',
                    barWidth: 16,
                    data: [2, 8, 5, 7, 400, 6, 10, 24, 55, 33]
                }
            ],
            color: ['#7fc14e', '#ff9b3c']
        };

        url = baseURL('/api/logs/timetotal/');
        $.get(url, function (data) {
            option7.xAxis[0].data = data.time.hour;
            option7.series[0].data = data.time.safe;
            option7.series[1].data = data.time.suspicious;
            attackChart7.setOption(option7);
        }, 'json');

        const china = require('china');
        //地图
        // 基于准备好的dom，初始化echarts实例
        let myMapChart = echarts.init(document.getElementById('mapCanvas'));
        var geoCoordMap = {
            '澳门': [113.5715, 22.1583],
            '新疆': [84.9023, 41.748],
            '西藏': [88.7695, 31.6846],
            '内蒙古': [117.5977, 44.3408],
            '青海': [96.2402, 35.4199],
            '四川': [102.9199, 30.1904],
            '黑龙江': [128.1445, 48.5156],
            '甘肃': [95.7129, 40.166],
            '云南': [101.8652, 25.1807],
            '广西': [108.2813, 23.6426],
            '湖南': [111.5332, 27.3779],
            '陕西': [109.5996, 35.6396],
            '广东': [113.4668, 22.8076],
            '吉林': [126.4746, 43.5938],
            '河北': [115.4004, 37.9688],
            '湖北': [112.2363, 31.1572],
            '贵州': [106.6113, 26.9385],
            '山东': [118.7402, 36.4307],
            '江西': [116.0156, 27.29],
            '河南': [113.4668, 33.8818],
            '辽宁': [122.3438, 41.0889],
            '山西': [112.4121, 37.6611],
            '安徽': [117.2461, 32.0361],
            '福建': [118.3008, 25.9277],
            '浙江': [120.498, 29.0918],
            '江苏': [120.0586, 32.915],
            '重庆': [107.7539, 30.1904],
            '宁夏': [105.9961, 37.3096],
            '海南': [109.9512, 19.2041],
            '台湾': [121.0254, 23.5986],
            '北京': [116.4551, 40.2539],
            '天津': [117.4219, 39.4189],
            '上海': [121.4648, 31.2891],
            '香港': [114.2578, 22.3242],
            '澳门': [113.5547, 22.1484]
        };

        var map_init = function () {
            var url = baseURL('/api/hosts/router/?type=chart');
            $.get(url, function (data) {
                // var markPointData = [{ name: '重庆', coord: [116.0156, 27.29] }];
                var temp_coord = data.markPoint.coord;
                temp_coord[0] = parseFloat(temp_coord[0]);
                temp_coord[1] = parseFloat(temp_coord[1]);
                data.markPoint.coord = temp_coord;
                var markPointData = [data.markPoint];

                var markData = [];
                markData = data.rows;
                var convertData = function convertData(data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        var fromCoord = markPointData[0].coord;
                        var toCoord = dataItem.coord;
                        if (fromCoord && toCoord) {
                            res.push({
                                fromName: markPointData[0].name,
                                toName: dataItem.name,
                                coords: [fromCoord, toCoord]
                            });
                        }
                    }
                    return res;
                };

                var color = ['#a6c84c', '#ffa022', '#46bee9'];
                var series = [];
                series = get_map_series(markData);

                function get_map_series(markData) {
                    var series = [];
                    [[markPointData[0].name, markData]].forEach(function (item, i) {
                        series.push({
                            name: item[0],
                            type: 'lines',
                            zlevel: 1,
                            lineStyle: {
                                normal: {
                                    color: '#a6c84c',
                                    width: 1,
                                    opacity: 0.4,
                                    curveness: 0.2
                                }
                            },
                            data: convertData(item[1])
                        }, { //移动 点
                            name: item[0],
                            type: 'lines',
                            zlevel: 1,
                            lineStyle: {
                                normal: {
                                    color: '#7a9dd3',
                                    width: 1,
                                    opacity: 0.4,
                                    curveness: 0.2
                                }
                            },
                            data: convertData(item[1])
                        }, {
                            name: item[0],
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: ['20%', '33%'],
                                    formatter: '{b}',
                                    textStyle: {
                                        color: 'white',
                                        fontSize: 14
                                    }
                                }
                            },
                            symbolSize: 50,
                            itemStyle: {
                                normal: {
                                    color: '#7a9dd3'
                                }
                            },
                            data: item[1].map(function (dataItem) {
                                return {
                                    name: dataItem.name,
                                    value: dataItem.coord.concat([dataItem.value])
                                };
                            }),
                            markPoint: {
                                symbol: 'pin',
                                symbolSize: 30,
                                silent: true,
                                label: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: markPointData,
                                itemStyle: {
                                    normal: {
                                        color: '#80c151'
                                    }
                                }
                            }
                        });
                    });

                    return series;
                }

                // 地图设置
                var mapOption = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function formatter(params) {
                            if (params.componentSubType == 'effectScatter') {
                                var item = markData[params.dataIndex];
                                if (item) {
                                    return item.name + '<br>' + '<i class="iconfont" style="font-size: 12px;color: #ff9b3c;margin-right: 4px">&#xe623;</i>' + item.status[2].name + ':' + item.status[2].value +
                                        '<br>' + '<i class="iconfont" style="font-size: 12px;color: #7fc14e;margin-right: 4px"">&#xe623;</i>' + item.status[1].name + ':' + item.status[1].value +
                                        '<br>' + '<i class="iconfont" style="font-size: 12px;color: #c6cedd;margin-right: 4px"">&#xe623;</i>' + item.status[0].name + ':' + item.status[0].value;
                                }
                            }
                            return '';
                        }
                    },
                    title: {
                        show: false
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#e3e5e7',
                                borderColor: '#fff'
                            },
                            emphasis: {
                                areaColor: '#ccc'
                            }
                        }
                    },
                    series: series
                };

                myMapChart.setOption(mapOption);

                // 点击事件
                myMapChart.on('click', function (params) {
                    if (params.data) {
                        if (params.value) {
                            var item = markData[params.dataIndex];
                            var url = baseURL('/hosts/#id=' + item.id);
                            window.open(url);
                        }
                    } else {
                        var city = params.name;
                        var point = geoCoordMap[city];
                        var param = {
                            'sys_coord': {name: params.name, coord: point.join(",")}
                        };
                        var url = baseURL('/api/system/settings/');
                        param = JSON.stringify(param);
                        $.post(url, param, function (data) {
                            if (data.ret == 'success') {
                                markPointData = [{name: params.name, coord: geoCoordMap[city]}];
                                series = get_map_series(markData);
                                mapOption.series = series;
                                myMapChart.setOption(mapOption);
                            }
                        });
                    }
                });
            }, 'json');
        }();
    });
});
