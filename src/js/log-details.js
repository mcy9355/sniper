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

  var date_init = false;
  var sort_init = false;
  var analysis_mode = [];
  // 日期选择
  var startDate = moment().startOf('day');
  var endDate = moment().add(1, 'days');

  var current_time = parse_timestamp(startDate.format('YYYY-MM-DD HH:mm:ss'));

  $('.date-box > i').click(function () {
    $(this).parent().find('input').click();
  });

  require.ensure([], (require) => {
    require('../lib/daterangepicker/daterangepicker.css');
    require('daterangepicker');
    $('.date-box > input').daterangepicker({
      'timePicker': true,
      'timePicker24Hour': true,
      "timePickerSeconds": true,
      'ranges': {
        '今天': [moment().startOf('day'), moment().add(1, 'days')],
        '昨天': [moment().startOf('day').subtract(1, 'days'), moment().startOf('day')],
        '最近一周': [moment().subtract(6, 'days'), moment().add(1, 'days')],
        '最近30天': [moment().subtract(29, 'days'), moment().add(1, 'days')],
        '本月': [moment().startOf('months'), moment().add(1, 'days')],
        '上一个月': [moment().startOf('months').subtract(1, 'months'), moment().startOf('months')]
      },
      'locale': {
        'format': 'YYYY-MM-DD',
        'separator': ' - ',
        'applyLabel': '确定',
        'cancelLabel': '取消',
        'fromLabel': 'From',
        'toLabel': 'To',
        'customRangeLabel': '自定义',
        'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
        'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'firstDay': 1
      },
      'startDate': startDate.format('YYYY-MM-DD HH:mm:ss'),
      'endDate': endDate.format('YYYY-MM-DD HH:mm:ss'),
      // 'minDate': moment().startOf('months').subtract(1, 'months').format('YYYY-MM-DD'),
      'maxDate': endDate.format('YYYY-MM-DD HH:mm:ss')
    }, function (start, end, label) {
      startDate = start;
      endDate = end;
      date_init = true;
      var tmp_timestamp = parse_timestamp(start.format('YYYY-MM-DD HH:mm:ss'));
      if (tmp_timestamp < current_time) {
        $('.auto_refresh').attr('disabled', 'disabled');
      } else {
        $('.auto_refresh').removeAttr('disabled');
      }
      reload_table();

    });

  });

  $('.date-box > input').change(function () {
    if (date_init) {
      var _index = $(this).data('type');
      var $my_this = $(this).parents('.filter-box');
      if (_index != 5) {
        set_process_info(_index, $my_this);
      }
    }
  });

  // 日志详情表格
  var actionTable = void 0;
  var fileTable = void 0;
  var networkTable = void 0;
  var domainTable = void 0;
  var eplfileTable = void 0;
  var logTables = [actionTable, fileTable, networkTable, '', domainTable, eplfileTable];

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
  var sku = $('#sku').val();
  var handle_index = '';
  var process_name = '';
  var event_id = '';
  var search_keyword = '';
  var tab_index = 1;
  var logTableColumns;
  var options;
  var cur_table;
  var _loop = function _loop(i, flag) {
    logTableColumns = [
      // 行为分析
      [{'data': 'id'}, {'data': 'event_time'}, {'data': 'event'}, {'data': 'parent_process'}, {'data': 'process'}, {'data': 'user'}, {'data': 'parameter'}, {'data': 'content'}],
      // 文件防护
      [{'data': 'id'}, {'data': 'event_time'}, {'data': 'event'}, {'data': 'user'}, {'data': 'process'}, {'data': 'path'}, {'data': 'type'}, {'data': 'size'}, {'data': 'attr'}, {'data': 'keyword'}, {'data': 'content'}],
      // 网络链路
      [{'data': 'id'}, {'data': 'event_time'}, {'data': 'event'}, {'data': 'user'}, {'data': 'update_time'}, {'data': 'port'}, {'data': 'localhost'}, {'data': 'ip_address'}, {'data': 'content'}],
      [{'data': 'id'}, {'data': 'event_time'}, {'data': 'domain'}, {'data': 'content'}],
      // EPL设计文件
      [{'data': 'id'}, {'data': 'event_time'}, {'data': 'event'}, {'data': 'user'}, {'data': 'process'}, {'data': 'path'}, {'data': 'type'}, {'data': 'size'}, {'data': 'attr'}]
    ];
    var index = i - 1;

    if (i == 5) index = 3;
    if (i == 7) index = 4;
    options = {
      // processing: true, // 隐藏加载提示,自行处理
      serverSide: true, // 启用服务器端分页
      searching: false, // 禁用原生搜索
      orderMulti: false, // 启用多列排序
      lengthChange: true, // 是否允许用户自定义显示数量
      'bPaginate': true, // 翻页功能
      'ordering': false, // 排序功能
      'Info': true, // 页脚信息
      'autoWidth': false, // 自动宽度
      'destroy': true,
      // "pagingType": "input",
      ajax: function (data, callback, settings) {
        // 封装请求参数
        var param = {};
        param.limit = data.length; // 页面显示记录条数，在页面显示每页显示多少项的时候
        param.start = data.start; // 开始的记录序号
        // param.page = (data.start / data.length)+1; // 当前页码
        param.type = i;
        param.sku = sku;
        param.start_time = parse_timestamp(startDate.format('YYYY-MM-DD HH:mm:ss'));
        param.end_time = parse_timestamp(endDate.format('YYYY-MM-DD HH:mm:ss'));
        // param.time = startDate.format('YYYY-MM-DD') + ' - ' + endDate.format('YYYY-MM-DD');

        if (flag) {
          // param.ordering = 'process_name';
          param.mode = 1;
        } else {
          if (param.mode) {
            delete  param.mode;
          }
        }

        if (search_keyword !== '') {
          param.search = search_keyword;
        }

        if (event_id) {
          param.event_id = event_id;
        }

        if (process_name) {
          param.process_name = process_name;
        }

        if (handle_index) {
          param.handle = handle_index;
        }
        // console.log(param);
        // ajax请求数据
        var url = baseURL('/api/logs/');
        $.ajax({
          type: 'GET',
          url: url,
          cache: false,  // 禁用缓存
          data: param,  // 传入组装的参数
          dataType: 'json',
          success: function (result) {
            // console.log(result);
            // setTimeout仅为测试延迟效果
            // setTimeout(function () {
            // 封装返回数据
            var returnData = {};
            returnData.draw = data.draw; // 这里直接自行返回了draw计数器,应该由后台返回
            returnData.recordsTotal = result.recordsTotal; // 返回数据全部记录
            returnData.recordsFiltered = result.recordsFiltered; // 后台不实现过滤功能，每次查询均视作全部结果
            returnData.data = result.data; // 返回的数据列表
            // console.log(returnData);
            // 调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
            // 此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
            callback(returnData);
            // }, 200);
          }
        });
      },
      language: tableLanguage,
      columns: logTableColumns[index],
      'columnDefs': [{
        'targets': 0,
        'createdCell': function createdCell(td, cellData, rowData, row, col) {
          if (flag) {
            if (rowData.total > 1 && rowData.total <= 3) {
              $(td).html('<div class="tag tag-orange"></div>');
            } else if (rowData.total == 1) {
              $(td).html('<div class="tag tag-red"></div>');
            } else {
              $(td).html('<div class="tag" style="background: green"></div>');
            }
          } else {
            $(td).html('');
          }

        }
      // }, {
      //   'targets': logTableColumns[index].length - 1,
      //   'createdCell': function createdCell(td, cellData, rowData, row, col) {
      //     if (cellData === 2) {
      //       $(td).html('<div class="sniper-checkbox" data-id="' + rowData.id + '"><input type="checkbox" checked><i class="iconfont">&#xe624;</i></div>');
      //     } else if (cellData === 1) {
      //       $(td).html('<div class="sniper-checkbox" data-id="' + rowData.id + '"><input type="checkbox"><i class="iconfont">&#xe624;</i></div>');
      //     } else {
      //       $(td).html('');
      //     }
      //   }
      }]
    };

    if (index === 0) {
      var ext = {
        "targets": 4,
        "createdCell": function createdCell(td, cellData, rowData, row, col) {
          var filename = cellData.substring(cellData.lastIndexOf('\\') + 1);
          $(td).html('<div title="' + cellData + '">' + filename + '</div>');
        }
      };
      options.columnDefs.push(ext);
    }
    logTables[index] = $('.data-table').eq(index).DataTable(options);
    cur_table = logTables[index];
  };
  _loop(1);
  set_process_info(1, $('.tab-content:first'));

  //
  $('.main-details-box').on('keyup', '.redirect', function (e) {
    if (e.keyCode == 13) {
      var redirect_page = 0;
      if ($(this).val() && $(this).val() > 0) {
        redirect_page = $(this).val() - 1;
      }
      // cur_table.context[0]._iRecordsTotal

      cur_table.page(redirect_page).draw(false);
    }
  });


  $('.sort-tab li').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    var curIndex = $(this).index();
    var tmpIndex = 0;
    var log_index = $(this).data('id');
    process_name = '';
    event_id = '';
    tab_index = log_index;
    $(this).parent().parent().siblings('.tab-content').each(function (index, el) {
      if (curIndex === index) {
        $(this).show();
        if (log_index != 4) {
          sort_init = false;
          $('.auto_refresh').removeAttr('disabled');
          search_keyword = '';
          reload_table();
          $('.toggle-vis').prop('checked',true);
          $('.search-box input').val('');
          // tab_index = curIndex;
          var index_list = [1, 2, 7];
          var $my_this = $(this);
          if (index_list.indexOf(log_index) > -1) {
            set_process_info(log_index, $my_this);
          }
        } else {
          get_honey_list();
        }

      } else {
        $(this).hide();
      }
    });
  });

  function set_process_info(_index, $my_this) {
    var url = baseURL('/api/logs/');
    var param = {
      type: _index,
      total: 'process_name',
      sku: sku,
    };
    param.start_time = parse_timestamp(startDate.format('YYYY-MM-DD HH:mm:ss'));
    param.end_time = parse_timestamp(endDate.format('YYYY-MM-DD HH:mm:ss'));
    $.get(url, param, function (data) {
      var html_content = '<option value="">全部</option>';
      $.each(data.rows, function (index, item) {
        var total = parseInt(item.total);
        if (total >= 5) {
          analysis_mode.push(item.process_name);
        }
        html_content += '<option value="' + item.process_name + '">' + item.process_name + '</option>';
      });
      $my_this.find('.process-select').html(html_content);
    }, 'json');
  }

  function parse_timestamp(str_time) {
    str_time = str_time.replace(/-/g, "/");
    var timestamp = Date.parse(new Date(str_time));
    timestamp = timestamp / 1000;
    return timestamp;
  }

  // $('.tab-content').on('click', '.sniper-checkbox', function () {
  //   var status = 1;
  //   if ($(this).children('input').prop('checked')) {
  //     status = 2;
  //   }
  //   var id = $(this).data('id');
  //   if (id) {
  //     var param = {
  //       'sku': sku,
  //       'status': status,
  //       'log_id[]': id,
  //       'type': tab_index,
  //     };
  //     handle_log(param);
  //   }
  // });

  // function handle_log(data) {
  //   var url = baseURL('/api/logs/handle/');
  //
  //   require.ensure([], (require) => {
  //     require('../lib/layer/skin/layer.css');
  //     const layer = require('layer');
  //     var msg = '';
  //     if (data.status == 1) {
  //       msg = '取消成功!';
  //     } else {
  //       msg = '标记成功!';
  //     }
  //
  //     $.post(url, data, function (data) {
  //       if (data.ret == 'success') {
  //         layer.msg(msg);
  //       } else {
  //         layer.msg('标记失败!');
  //       }
  //     }, 'json');
  //   });
  // }

  function reload_table() {
    if (sort_init) {
      _loop(tab_index, 1)
    } else {
      _loop(tab_index);
    }
  }

  $('.process-select').change(function () {
    process_name = $(this).val();
    reload_table();
  });

  $('.handle-select').change(function () {
    handle_index = $(this).val();
    reload_table();
  });

  $('.event-select').change(function () {
    event_id = $(this).val();
    reload_table();
  });

  $('.search-box button').click(function () {
    search_keyword = $(this).prev('input').val();
    reload_table();
  });

  $('.search-box input').keydown(function (e) {//当按下按键时
    if (e.which == 13) {
      search_keyword = $(this).val();
      reload_table();
    }
  });

  var refresh = [0, 0, 0, 0, 0, 0, 0, 0];
  $('.auto_refresh').click(function () {
    var type = $(this).data('type');
    var flag = false;
    if ($(this).prop('checked')) {
      flag = true;
    }
    if (flag) {
      refresh[type - 1] = setInterval(function () {
        reload_table();
      }, 6000);
    } else {
      if (refresh[type - 1] > 0) {
        clearInterval(refresh[type - 1]);
        refresh[type - 1] = 0;
      }
    }
  });

  $('.refresh-btn').click(function () {
    reload_table();

  });

  // 表格显示隐藏列
  $('.toggle-vis').on('change', function (e) {
    e.preventDefault();
    let tableType = $(this).parent().parent('.filter-ul').data('type');
    let column = logTables[tableType - 1].column($(this).attr('data-column'));
    column.visible(!column.visible());
  });

  $('.filter-btn').click(function (event) {
    let $thisFilterUl = $(this).children('.filter-ul');
    $thisFilterUl.toggle();
    event.stopPropagation();
  });

  $(document).click(function () {
    $('.filter-ul').hide();
  });

  $('.filter-ul').click(function (event) {
    event.stopPropagation();
  });

  // 排序切换
  $('.filter-box .sort-btn').click(function () {
    if (!$(this).hasClass('checked')) {
      $(this).addClass('checked');
      sort_init = true;
    } else {
      $(this).removeClass('checked');
      sort_init = false;
    }

    reload_table();
  });

  // 根据ID查找当前主机函数
  function findOneHost(data, id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i];
      }
      if (data[i].children && data[i].children.length > 0) {
        let res = findOneHost(data[i].children, id);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }

  function get_honey_list(ip_address) {
    var param = {};
    var url = baseURL('/api/logs/honey/');
    if (!ip_address) {
      param.sku = $('#sku').val();
    }
    $.get(url, param, function (rows) {
      let sourceHtml = '<ul class="child-host-ul">';
      var rows_length = rows.data.length;
      $.each(rows.data, function (i, el) {
        let line = 'line';
        if (i === rows_length - 1) {
          line = '';
        }
        sourceHtml += format_honey_content(el, line);
      });
      sourceHtml += '</ul>';
      $('.child-host-wrap').html(sourceHtml);

      // 判断渗透溯源节点是否为空
      $('#source-content .child-host-wrap').each(function () {
        let $hostItem = $(this).children('.child-host-ul').children('.child-host-item');
        if ($hostItem.length == 0) {
          $(this).siblings('.parent-host').hide();
          $(this).siblings('.no-source-host').show();
        }
      });

      $('#link_count').html(rows_length);
    }, 'json');
  }

  function format_honey_content(el, line) {
    var sourceHtml = '';
    sourceHtml += '<li class="child-host-item ' + line + '" data-ip="' + el.ip_address + '">';
    sourceHtml += '<span class="ip-name pull-left">' + el.ip_address + '(' + el.count + ')</span>';
    if (el.child && el.child.length > 0) {
      sourceHtml += '<span class="num pull-left"></span>';
      sourceHtml += '<i class="pull-right iconfont icon-link-open"></i>';
    }
    sourceHtml += '<div class="tip-box"><div class="hd"><span>时间</span><span>协议</span><span>端口</span></div>';
    sourceHtml += '<ul>';
    $.each(el.child, function (index, item) {
      sourceHtml += '<li><span>' + item.event_time + '</span><span>' + item.protocol + '</span><span>' + item.port + '</span></li>';
    });
    sourceHtml += '</ul></li>';
    return sourceHtml;
  }

  // 遍历一级主机
  // 点击主机事件
  $('.child-host-wrap').on('click', '.child-host-item', function () {
    if ($(this).hasClass('active')) {
      $(this).parent().nextAll().remove();
      $(this).removeClass('active').children('.active-arrow').remove();
      $(this).children('.iconfont').removeClass('icon-link-close').addClass('icon-link-open');
      return;
    }
    if ($(this).children('.iconfont').length > 0) {
      $(this).addClass('active').siblings('.child-host-item')
        .removeClass('active').children('.num').hide()
        .siblings('.iconfont').removeClass('icon-link-close').addClass('icon-link-open');
      $(this).children('.num').show();
      $(this).children('.iconfont').removeClass('icon-link-open').addClass('icon-link-close');
    }
    $(this).parent().nextAll().remove();
    let $item = $(this);
    var param = {
      'ip_address': $(this).data('ip')
    };

    var current_host = $('#link_count').parents('span').prev('span').text();
    var host_array = [];
    var url = baseURL('/api/logs/honey/');
    var $self = $(this);
    $.get(url, param, function (rows) {
      let sourceHtml = '<ul class="child-host-ul">';
      var rwos_length = rows.data.length;
      if (rows.data && rwos_length >= 1) {
        let childrenCount = 0;
        let customLineCount = 0;
        let prevIndex = 0;


        $.each(rows.data, function(i,el){
          if(host_array.indexOf(el.ip_address) === -1){
            host_array.push(el.ip_address);
          }
        });
        
        
        $item.siblings().children('.active-arrow').remove();
        $item.prepend('<div class="active-arrow"></div>');
        
        
        if ($item.parent().prev().length > 0) {
          prevIndex = $item.parent().prev().children('.active').index();
        } else {
          prevIndex = $item.index();
        }
        childrenCount = rows.data.length;

        if(host_array.indexOf(current_host) > -1){
          childrenCount -=1;
        }

        customLineCount = (childrenCount - prevIndex - 1) < 0 ? prevIndex - childrenCount : 0;
        let isDrawLastLine = prevIndex < childrenCount ? false : true;


        
        $.each(rows.data, function (i, el) {

          if(el.ip_address != current_host){
            let line = 'line';
            if (i === rwos_length - 1 && !isDrawLastLine) {
              line = '';
            }
            sourceHtml += format_honey_content(el, line);
          }
        });

        // 绘制竖线
        for (var i = 0; i < customLineCount; i++) {
          sourceHtml += '<li class="child-host-item line empty-host-item">';
          sourceHtml += '</li>';
        }
        sourceHtml += '</ul>';
        $('.child-host-wrap').append(sourceHtml);
      }else{
        $self.parent('ul').find('.active-arrow').remove();
      }
    }, 'json');
  });

  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('.tab-content,.tip-box >ul').perfectScrollbar({
      useSelectionScroll: true
    });
  });
});
