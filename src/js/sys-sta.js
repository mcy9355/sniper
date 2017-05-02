const $ = require('jquery');
require('./public');
const baseURL = require('baseURL');
const moment = require('moment');
$(function () {
  // alert(1)
  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('#contain').perfectScrollbar({
      useSelectionScroll: true
    });
  });
  //CPU使用率
  const echarts = require('echarts');
  let attackChartCpu = echarts.init(document.getElementById('cpuRate'));
  let optionCpu = {
    tooltip: [{
      show:true,
      showContent:true,
      trigger: 'item',
      borderColor: "rgba(127,127,127,0.7)",
      axisPointer: { //解决移上去出现线的bug
        lineStyle: {
          color: 'rbga(255,255,255,0)', //把先的颜色设置为透明
          opacity: 0 //为0时，不会绘制改图形
        }
      },
      formatter: '时间：{b}<br>{a}：{c}' //格式化字符串
    }],
    legend: {
      data:['cpu.user','cpu.idle','cpu.system'],
      right:'52',
      top:'20'
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
      axisTick: false,
      splitLine: {
        show: false
      },
      data: ['21:00', '2.Nov', '03:00', '06:00', '09:00', '12:00', '15:00','18:00'],
      //坐标轴线
      axisLine: {
        show: false
      },
      //    坐标刻度
      axisLabel: {
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      }
    },
    yAxis: [{
      type: 'value',
      axisTick: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e5e8ef'
        }
      },
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      },
      axisLine: {
        show: false
      }
    }],
    series: [
      {
        name: 'cpu.user',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['rgba(89,131,200,0.8)'],
            borderColor: ['rgba(89,131,200,0.8)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['rgba(89,131,200,0.8)'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(89,131,200,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#5983c8'
          }
        },
        areaStyle:{
          normal:{
            color:'#F5F7FA',
            opacity:1
          }
        },
        data: [3.5, 5, 3.8, 4, 2.2, 1.7, 2.3,2.5]
      },
      {
        name: 'cpu.idle',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#58b530'
          }
        },
        areaStyle:{
          normal:{
            color:'#F1FAED',
            opacity:1
          }
        },
        data: [3, 4.5, 3.3, 3.5, 1.7, 1.2, 1.8,2]
      },
      {
        name: 'cpu.system',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#f39800'],
            borderColor: ['rgba(243,152,0,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#f39800'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(243,152,0,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#f39800'
          }
        },
        areaStyle:{
          normal:{
            color:'#FAF5ED',
            opacity:1
          }
        },
        data: [2.5, 4, 2.8, 3, 1.2, 0.7, 1.3,1.5]
      }
    ]
  };
  attackChartCpu.setOption(optionCpu);
  // 系统负载
  let attackChartRam = echarts.init(document.getElementById('ramRate'));
  let optionRam = {
    tooltip: [{
      show:true,
      showContent:true,
      trigger: 'item',
      borderColor: "rgba(127,127,127,0.7)",
      axisPointer: { //解决移上去出现线的bug
        lineStyle: {
          color: 'rbga(255,255,255,0)', //把先的颜色设置为透明
          opacity: 0 //为0时，不会绘制改图形
        }
      },
      formatter: '时间：{b}<br>{a}：{c}' //格式化字符串
    }],
    legend: {
      data:['load1','load5','load15'],
      right:'52',
      top:'20'
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
      axisTick: false,
      splitLine: {
        show: false
      },
      data: ['21:00', '2.Nov', '03:00', '06:00', '09:00', '12:00', '15:00','18:00'],
      //坐标轴线
      axisLine: {
        show: false
      },
      //    坐标刻度
      axisLabel: {
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      }
    },
    yAxis: [{
      type: 'value',
      axisTick: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e5e8ef'
        }
      },
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      },
      axisLine: {
        show: false
      }
    }],
    series: [
      {
        name: 'load1',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['rgba(89,131,200,0.8)'],
            borderColor: ['rgba(89,131,200,0.8)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['rgba(89,131,200,0.8)'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(89,131,200,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#5983c8'
          }
        },
        areaStyle:{
          normal:{
            color:'#F5F7FA',
            opacity:1
          }
        },
        data: [3.5, 5, 3.8, 4, 2.2, 1.7, 2.3,2.5]
      },
      {
        name: 'load5',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#58b530'
          }
        },
        areaStyle:{
          normal:{
            color:'#F1FAED',
            opacity:1
          }
        },
        data: [3, 4.5, 3.3, 3.5, 1.7, 1.2, 1.8,2]
      },
      {
        name: 'load15',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#f39800'],
            borderColor: ['rgba(243,152,0,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#f39800'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(243,152,0,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#f39800'
          }
        },
        areaStyle:{
          normal:{
            color:'#FAF5ED',
            opacity:1
          }
        },
        data: [2.5, 4, 2.8, 3, 1.2, 0.7, 1.3,1.5]
      }
    ]
  };
  attackChartRam.setOption(optionRam);
  // 内存使用率
  let attackChartSystemUpward = echarts.init(document.getElementById('systemUpward'));
  let optionSystemUpward = {
    tooltip: [{
      show:true,
      showContent:true,
      trigger: 'item',
      borderColor: "rgba(127,127,127,0.7)",
      axisPointer: { //解决移上去出现线的bug
        lineStyle: {
          color: 'rbga(255,255,255,0)', //把先的颜色设置为透明
          opacity: 0 //为0时，不会绘制改图形
        }
      },
      formatter: '时间：{b}<br>{a}：{c}' //格式化字符串
    }],
    legend: {
      data:['total','used'],
      right:'52',
      top:'20'
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
      axisTick: false,
      splitLine: {
        show: false
      },
      data: ['21:00', '2.Nov', '03:00', '06:00', '09:00', '12:00', '15:00','18:00'],
      //坐标轴线
      axisLine: {
        show: false
      },
      //    坐标刻度
      axisLabel: {
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      }
    },
    yAxis: [{
      type: 'value',
      axisTick: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e5e8ef'
        }
      },
      axisLabel: {
        formatter: '{value}MB',
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      },
      axisLine: {
        show: false
      }
    }],
    series: [
      {
        name: 'total',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['rgba(89,131,200,0.8)'],
            borderColor: ['rgba(89,131,200,0.8)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['rgba(89,131,200,0.8)'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(89,131,200,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#5983c8'
          }
        },
        areaStyle:{
          normal:{
            color:'#F5F7FA',
            opacity:1
          }
        },
        data: [3.5, 5, 3.8, 4, 2.2, 1.7, 2.3,2.5]
      },
      {
        name: 'used',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#58b530'
          }
        },
        areaStyle:{
          normal:{
            color:'#F1FAED',
            opacity:1
          }
        },
        data: [3, 4.5, 3.3, 3.5, 1.7, 1.2, 1.8,2]
      }
    ]
  };
  attackChartSystemUpward.setOption(optionSystemUpward);
  // 网络流量
  let attackChartSystemDownward = echarts.init(document.getElementById('systemDownward'));
  let optionSystemDownward = {
    tooltip: [{
      show:true,
      showContent:true,
      trigger: 'item',
      borderColor: "rgba(127,127,127,0.7)",
      axisPointer: { //解决移上去出现线的bug
        lineStyle: {
          color: 'rbga(255,255,255,0)', //把先的颜色设置为透明
          opacity: 0 //为0时，不会绘制改图形
        }
      },
      formatter: '时间：{b}<br>{a}：{c}' //格式化字符串
    }],
    legend: {
      data:['net.bytes_sent','net.bytes_rcvd'],
      right:'52',
      top:'20'
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
      axisTick: false,
      splitLine: {
        show: false
      },
      data: ['21:00', '2.Nov', '03:00', '06:00', '09:00', '12:00', '15:00','18:00'],
      //坐标轴线
      axisLine: {
        show: false
      },
      //    坐标刻度
      axisLabel: {
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      }
    },
    yAxis: [{
      type: 'value',
      axisTick: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e5e8ef'
        }
      },
      axisLabel: {
        formatter: '{value}MB',
        textStyle: {
          color: '#333',
          //x轴修改字体大小为12px
          fontSize: 12
        }
      },
      axisLine: {
        show: false
      }
    }],
    series: [
      {
        name: 'net.bytes_sent',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['rgba(89,131,200,0.8)'],
            borderColor: ['rgba(89,131,200,0.8)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['rgba(89,131,200,0.8)'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(89,131,200,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#5983c8'
          }
        },
        areaStyle:{
          normal:{
            color:'#F5F7FA',
            opacity:1
          }
        },
        data: [3.5, 5, 3.8, 4, 2.2, 1.7, 2.3,2.5]
      },
      {
        name: 'net.bytes_rcvd',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6, //圆点的大小为8像素
        showSymbol: true,
        showAllSymbol:true,
        itemStyle: {
          normal: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            lineStyle: {        // 系列级个性化折线样式
              width: 1, //宽度为2px
              type: 'solid'
            },
            shadowBlur: 0
          },
          emphasis: {
            color: ['#58b530'],
            //移上去显示一个透明度为50%的阴影
            borderColor: ['rgba(88,181,48,0.5)'],
            borderWidth: 8 //移上去内圈显示10px 外圈20ox
          }
        },
        lineStyle:{
          normal:{
            color:'#58b530'
          }
        },
        areaStyle:{
          normal:{
            color:'#F1FAED',
            opacity:1
          }
        },
        data: [3, 4.5, 3.3, 3.5, 1.7, 1.2, 1.8,2]
      }
    ]
  };
  attackChartSystemDownward.setOption(optionSystemDownward);

});
