const $ = require('jquery');
require('./public.js');
const moment = require('moment');
require('dataTables');
const baseURL = require('baseURL');

$(document).ready(function () {

  // 下拉列表
  require.ensure([], (require) => {
    require('../lib/select/select2.css');
    const select2 = require('select2');
    $('.type-select').select2({
      minimumResultsForSearch: Infinity
    });
  });

  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('.tab-content').perfectScrollbar({
      useSelectionScroll: true
    });
  });

  // var date_init = false;
  // var sort_init = false;
  // var analysis_mode = [];
  // // 日期选择
  // var startDate = moment().startOf('day');
  // var endDate = moment().add(1, 'days');
  //
  // var current_time = parse_timestamp(startDate.format('YYYY-MM-DD HH:mm:ss'));
  //
  // $('.date-box > i').click(function () {
  //   $(this).parent().find('input').click();
  // });

  // require.ensure([], (require) => {
  //   require('../lib/daterangepicker/daterangepicker.css');
  //   require('daterangepicker');
  //   $('.date-box > input').daterangepicker({
  //     'timePicker': true,
  //     'timePicker24Hour': true,
  //     "timePickerSeconds": true,
  //     'ranges': {
  //       '今天': [moment().startOf('day'), moment().add(1, 'days')],
  //       '昨天': [moment().startOf('day').subtract(1, 'days'), moment().startOf('day')],
  //       '最近一周': [moment().subtract(6, 'days'), moment().add(1, 'days')],
  //       '最近30天': [moment().subtract(29, 'days'), moment().add(1, 'days')],
  //       '本月': [moment().startOf('months'), moment().add(1, 'days')],
  //       '上一个月': [moment().startOf('months').subtract(1, 'months'), moment().startOf('months')]
  //     },
  //     'locale': {
  //       'format': 'YYYY-MM-DD',
  //       'separator': ' - ',
  //       'applyLabel': '确定',
  //       'cancelLabel': '取消',
  //       'fromLabel': 'From',
  //       'toLabel': 'To',
  //       'customRangeLabel': '自定义',
  //       'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
  //       'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  //       'firstDay': 1
  //     },
  //     'startDate': startDate.format('YYYY-MM-DD HH:mm:ss'),
  //     'endDate': endDate.format('YYYY-MM-DD HH:mm:ss'),
  //     // 'minDate': moment().startOf('months').subtract(1, 'months').format('YYYY-MM-DD'),
  //     'maxDate': endDate.format('YYYY-MM-DD HH:mm:ss')
  //   }, function (start, end, label) {
  //     startDate = start;
  //     endDate = end;
  //     date_init = true;
  //     var tmp_timestamp = parse_timestamp(start.format('YYYY-MM-DD HH:mm:ss'));
  //     if (tmp_timestamp < current_time) {
  //       $('.auto_refresh').attr('disabled', 'disabled');
  //     } else {
  //       $('.auto_refresh').removeAttr('disabled');
  //     }
  //     reload_table();
  //
  //   });
  //
  // });
  //
  // $('.date-box > input').change(function () {
  //   if (date_init) {
  //     var _index = $(this).data('type');
  //     var $my_this = $(this).parents('.filter-box');
  //     if (_index != 5) {
  //       set_process_info(_index, $my_this);
  //     }
  //   }
  // });

  // 事件详情表格
  var data = [
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 1
    },
    {
      "event_time": "2016-08-08 15:23:16",
      "event": "未知漏洞利用提取",
      "digest": "你的服务器192.168.21.36疑似被入侵你的服务器192.168.21.36疑似被入侵",
      "details": "查看详情",
      "safe": 0
    },
  ];

  var tableLanguage = {
    'sProcessing': '处理中...',
    'sLengthMenu': '显示 _MENU_ 项结果',
    'sZeroRecords': '没有匹配结果',
    'sInfo': '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项',
    'sInfoEmpty': '显示第 0 至 0 项结果，共 0 项',
    'sInfoFiltered': '(由 _MAX_ 项结果过滤)',
    'sInfoPostFix': '',
    'sSearch': '搜索:',
    'sUrl': '',
    'sEmptyTable': '表中数据为空',
    'sLoadingRecords': '载入中...',
    'sInfoThousands': ',',
    'oPaginate': {
      'sFirst': '首页',
      'sPrevious': '&lt;',
      'sNext': '&gt',
      'sLast': '末页'
    }
  };

  var tableColumns = [
    {data: 'event_time'},
    {data: 'event'},
    {data: 'digest'},
    {data: 'details'},
    {data: 'safe'}
  ];

  var options = {
    // serverSide: true, // 启用服务器端分页
    searching: false, // 禁用原生搜索
    orderMulti: false, // 启用多列排序
    lengthChange: true, // 是否允许用户自定义显示数量
    'bPaginate': true, // 翻页功能
    'ordering': false, // 排序功能
    'Info': true, // 页脚信息
    'autoWidth': false, // 自动宽度
    'destroy': true,
    data: data,
    language: tableLanguage,
    columns: tableColumns,
    'columnDefs': [
      {
        'targets': 3,
        'createdCell': function createdCell(td, cellData, rowData, row, col) {
          $(td).html('<a class="details-link" href="event-link.html">查看详情</a>');
        }
      },
      {
        'targets': 4,
        'createdCell': function createdCell(td, cellData, rowData, row, col) {
          if (cellData === 1) {
            $(td).html('<div class="sniper-checkbox"><input type="checkbox" checked><i class="iconfont">&#xe624;</i></div>');
          } else if (cellData === 0) {
            $(td).html('<div class="sniper-checkbox"><input type="checkbox"><i class="iconfont">&#xe624;</i></div>');
          } else {
            $(td).html('');
          }
        }
      }]
  };

  $('#event-table').DataTable(options);

  // 标记全部
  $('.filter-box .tag-all-btn').click(function () {
    let $tagInput = $(this).parent().siblings().children('.data-table').find('.sniper-checkbox').children('input');
    $tagInput.prop('checked', true);
    require.ensure([],(require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      layer.msg('标记全部成功!');
    })
  });

});
