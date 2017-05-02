const $ = require('jquery');
require('./public');
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
  require.ensure([],(require) => {
    const echarts = require('echarts');
    // cpu使用率
    let attackChartCpu = echarts.init(document.getElementById('cpuRate'));
    let optionCpu = {
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
        formatter: '时间：{b}<br>使用率：{c}' //格式化字符串
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
      },
      series: [
        {
          name: '时间',
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
          symbolSize: 6, //圆点的大小为8像素
          showSymbol: true,
          // hoverAnimation:false, //取消移上去的变大提示
          itemStyle: {
            normal: {
              color: ['rgba(89,131,200,0.8)'],
              borderColor: ['rgba(89,131,200,0.8)'],
              lineStyle: {        // 系列级个性化折线样式
                width: 1, //宽度为2px
                type: 'solid'
              },
              shadowBlur: 0,
            },
            emphasis: {
              color: ['rgba(89,131,200,0.8)'],
              //移上去显示一个透明度为50%的阴影
              borderColor: ['rgba(89,131,200,0.5)'],
              borderWidth: 8 //移上去内圈显示10px 外圈20ox
            }
          },
          data: [3.2, 5, 3.6, 4, 2, 1.5, 2.2,2.5]
        }
      ]
    };
    attackChartCpu.setOption(optionCpu);
    // 内存使用率
    let attackChartRam = echarts.init(document.getElementById('ramRate'));
    let optionRam = {
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
        formatter: '时间：{b}<br>使用率：{c}' //格式化字符串
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
      },
      series: [
        {
          name: '时间',
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
          symbolSize: 6, //圆点的大小为8像素
          showSymbol: true,
          // hoverAnimation:false, //取消移上去的变大提示
          itemStyle: {
            normal: {
              color: ['rgba(89,131,200,0.8)'],
              borderColor: ['rgba(89,131,200,0.8)'],
              lineStyle: {        // 系列级个性化折线样式
                width: 1, //宽度为2px
                type: 'solid'
              },
              shadowBlur: 0,
            },
            emphasis: {
              color: ['rgba(89,131,200,0.8)'],
              //移上去显示一个透明度为50%的阴影
              borderColor: ['rgba(89,131,200,0.5)'],
              borderWidth: 8 //移上去内圈显示10px 外圈20ox
            }
          },
          data: [30, 50, 35, 40, 20, 15, 22,25]
        }
      ]
    };
    attackChartRam.setOption(optionRam);
    // 网络上行
    let attackChartSystemUpward = echarts.init(document.getElementById('systemUpward'));
    let optionSystemUpward = {
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
        formatter: '时间：{b}<br>使用率：{c}' //格式化字符串
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
        data: ['21:00', '22:00', '23:00', '2.Nov', '01:00', '02:00', '03:00','04:00','05:00','06:00','07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
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
      },
      series: [
        {
          name: '时间',
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
          symbolSize: 6, //圆点的大小为8像素
          showSymbol: true,
          // hoverAnimation:false, //取消移上去的变大提示
          itemStyle: {
            normal: {
              color: ['rgba(89,131,200,0.8)'],
              borderColor: ['rgba(89,131,200,0.8)'],
              lineStyle: {        // 系列级个性化折线样式
                width: 1, //宽度为2px
                type: 'solid'
              },
              shadowBlur: 0,
            },
            emphasis: {
              color: ['rgba(89,131,200,0.8)'],
              //移上去显示一个透明度为50%的阴影
              borderColor: ['rgba(89,131,200,0.5)'],
              borderWidth: 8 //移上去内圈显示10px 外圈20ox
            }
          },
          data: [0.025, 0.02, 0.03,0.04,0.05,0.01,0.026,0.016,0.025,0.02,0.03,0.04,0.05,0.01,0.026,0.016,0.025,0.02,0.03,0.04,0.05,0.01,0.026,0.016]
        }
      ]
    };
    attackChartSystemUpward.setOption(optionSystemUpward);
    // 网络下行
    let attackChartSystemDownward = echarts.init(document.getElementById('systemDownward'));
    let optionSystemDownward = {
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
        formatter: '时间：{b}<br>使用率：{c}' //格式化字符串
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
        data: ['21:00', '22:00', '23:00', '2.Nov', '01:00', '02:00', '03:00','04:00','05:00','06:00','07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
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
      },
      series: [
        {
          name: '时间',
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
          symbolSize: 6, //圆点的大小为8像素
          showSymbol: true,
          // hoverAnimation:false, //取消移上去的变大提示
          itemStyle: {
            normal: {
              color: ['rgba(89,131,200,0.8)'],
              borderColor: ['rgba(89,131,200,0.8)'],
              lineStyle: {        // 系列级个性化折线样式
                width: 1, //宽度为2px
                type: 'solid'
              },
              shadowBlur: 0,
            },
            emphasis: {
              color: ['rgba(89,131,200,0.8)'],
              //移上去显示一个透明度为50%的阴影
              borderColor: ['rgba(89,131,200,0.5)'],
              borderWidth: 8 //移上去内圈显示10px 外圈20ox
            }
          },
          data: [0.025, 0.02, 0.03,0.04,0.05,0.01,0.026,0.016,0.025,0.02,0.03,0.04,0.05,0.01,0.026,0.016,0.025,0.02,0.03,0.04,0.05,0.01,0.026,0.016]
        }
      ]
    };
    attackChartSystemDownward.setOption(optionSystemDownward);

  });










});
