const $ = require('jquery');
require('./public.js');
const baseURL = require('baseURL');
const moment = require('moment');
require('jsTree');

$(document).ready(function () {
  // 搜索主机
  function get_host_item_html(item, active = '') {
    var status_css = 'outlineHost';
    var status_css_list = ['', 'outlineHost', 'safeHost', 'dangerHost'];
    status_css = status_css_list[item.status];
    if (!item.lst_status && item.status != 1) {
      status_css += '-warn';
    }
    var stat_css = item.is_favorites ? 'icon-star-on' : 'icon-star-off';
    var html_content = '';
    html_content += '<li class="' + active + ' clearfix" data-id="' + item.id + '">';
    html_content += item.ip_address;
    html_content += '</li>';
    return html_content;
  }

  let $searchInput = $('#track-box .box-bd .ip-box #ip_address');
  $searchInput.focus(function (event) {
    event.stopPropagation();
    // $('#search-result').show();
  });
  $searchInput.click(function (e) {
    e.stopPropagation();
  });
  // 实时搜索主机
  $('.box-bd .ip-box').bind('input propertychange', function () {
    var value = $('.box-bd .ip-box input').val();
    var url = baseURL('/api/hosts/');
    var params = {
      search: value,
      start: 0,
      length: 10
    };
    var searchHtml = '';

    $.get(url, params, function (data) {
      if (data.rows) {
        $.each(data.rows, function (i, item) {
          searchHtml += get_host_item_html(item);
        });
        $('#search-result ul').children('li').remove();
        $('#search-result ul').html(searchHtml);
        $('#search-result').show();
        if ($("#searchUl li").length == 0) {
          $('#search-result').hide();
        }
      }
    }, 'json');
  });

  // 显示所选择的ip
  $('#search-result').on('click', '#searchUl li', function (event) {
    event.stopPropagation();
    var liText = $(this).html();
    $('#ip_address').val(liText);
    $('#search-result').hide();
  });
  // 下拉菜单为空时，隐藏下拉菜单

  // 回车隐藏下拉菜单
  $('#ip_address').bind('keypress', function (event) {
    if (event.keyCode == "13") {
      $('#search-result').hide();
      // console.log('你输入的内容为：' + $('#ip_address').val());
    }
  });
  // 点击下拉菜单之外的内容隐藏下拉菜单
  $(document).click(function () {
    $('#search-result').hide();
  });

  // radio模拟
  $('.radio-btn').click(function () {
    let $thisInput = $(this).parent().siblings('.input-area');
    let $siblingInput = $(this).parent().parent().siblings().children('.input-area');
    $thisInput.prop('disabled', false);
    $siblingInput.prop('disabled', true);
  });

  // 日期选择
  var startDate = moment().startOf('day');
  var endDate = moment().add(1, 'days');

  var process_flag = 0;

  $('.date-box > i').click(function () {
    $(this).parent().find('input').click();
  });

  require.ensure([], (require) => {
    require('../lib/daterangepicker/daterangepicker.css');
    require('daterangepicker');
    $('.date-box > input').daterangepicker({
      'singleDatePicker': true,
      'timePicker': true,
      'timePicker24Hour': true,
      "timePickerSeconds": true,
      'locale': {
        'format': 'YYYY-MM-DD HH:mm:ss',
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
      'maxDate': moment().format('YYYY-MM-DD HH:mm:ss')
    }, function (start, end, label) {
      startDate = start;
      endDate = end;
    });
  });

  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('#main-box').perfectScrollbar({
      useSelectionScroll: true
    });
  });


  function object_to_string(_object) {
    var content = '';
    for (var i in _object) {
      content += i + '=' + _object[i] + '&';
    }
    return content;
  }

  function get_more_url(param, url = '') {
    if (url != '') {
      return url + '?' + object_to_string(param);
    } else {
      return '/hosts/logs/more/?' + object_to_string(param);
    }
  }

  // 结果显示
  $('.search-btn').click(function () {
    $('#none-box').hide();

    var ip_address = $('#ip_address').val().trim();
    var process_name = '';
    var filename = '';
    var $filename_input = $('#filename');
    var $process_input = $('#process_name');
    if (!$filename_input.prop('disabled')) {
      filename = $filename_input.val().trim();
      $filename_input.val(filename);
    }
    if (!$process_input.prop('disabled')) {
      process_name = $process_input.val().trim();
      $process_input.val(process_name);
    }

    var url = baseURL('/api/logs/');

    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');

      if (ip_address === '' || !isIP2(ip_address)) {
        layer.msg('请输入正确的IP地址!');
        return;
      }

      $('#ip_address').val(ip_address);
      url = baseURL('/api/logs');
      var temp_date = moment($('.date-box input').val());
      var start_time = parse_timestamp(temp_date.subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));
      var end_time = parse_timestamp(temp_date.add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'));
      var dur_time = parse_timestamp(temp_date.subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));

      var param = {
        'start_time': start_time, 'end_time': end_time,
        'ip_address': ip_address
      };

      $('#current_host').html(ip_address);

      // 设计文件
      param.type = 7;
      if (filename !== '') {
        param.search = filename;
      }
      if (process_name != '') {
        param.process_name = process_name;
      }

      $('#design-file-box').find('.more-link').attr('href', get_more_url(param));
      $.get(url, param, function (rows) {
        var file_html = '';
        $.each(rows.data, function (index, row) {
          file_html += '<tr>';
          file_html += '<td>' + row.event_time + '</td><td title="' + row.process + '">' + row.process_name + '</td>';
          file_html += '<td>' + row.user + '</td><td title="' + row.path + '">' + row.filename + '</td>';
          file_html += '</tr>';
        });
        $('#design-file-box .list-table>tbody').html(file_html);
      }, 'json');


      delete param.search;

      if (process_name !== '') {
        param.search = process_name;
      }
      // 行为
      param.type = 1;
      $('#relate-box').find('.more-link').attr('href', get_more_url(param));
      $.get(url, param, function (rows) {
        var process_html = '';
        $.each(rows.data, function (index, row) {
          process_html += '<tr>';
          process_html += '<td>' + row.event_time + '</td><td>' + row.user + '</td>';
          process_html += '<td>' + row.parent_process + '</td><td title="' + row.process + '">' + row.process_name + '</td><td class="hidden-td">' + row.parameter + '</td>';
          process_html += '</tr>';
        });

        $('#relate-box .list-table>tbody').html(process_html);
      }, 'json');

      if (param.process_name) {
        delete param.process_name;
      }

      param.type = 'network';
      url = baseURL('/api/logs/network/connect/');
      $('#network-box').find('.more-link').attr('href', get_more_url(param));
      // 网络连接
      $.get(url, param, function (rows) {
        var network_html = '';
        $.each(rows.data, function (index, row) {
          network_html += '<div class="link-item">';
          network_html += '<span>' + row.localhost + ':' + row.src_port + '</span><i class="iconfont">&#xe65a;</i><span>' + row.ip_address + ':' + row.des_port + '</span>';
          network_html += '</div>';
        });
        $('#network-box .link-wrap').html(network_html);
      }, 'json');

      delete param.search;
      url = baseURL('/api/logs/network/');
      param.flag = 1;
      param.type = 'login';

      // 用户网络连接
      $('#user-box').find('.more-link').attr('href', get_more_url(param));
      $.get(url, param, function (rows) {
        var network_html = '';
        $.each(rows.data, function (index, row) {
          network_html += '<tr>';
          network_html += '<td>' + row.user + '</td><td>' + row.ip_address + '</td><td>' + row.port + '</td>';
          network_html += '</tr>';
        });
        $('#user-box .list-table > tbody').html(network_html);
      }, 'json');

      delete param.flag;
      // 全网用户网络连接
      $('#login-state-box').find('.more-link').attr('href', get_more_url(param));
      $.get(url, param, function (rows) {
        var network_html = '';
        $.each(rows.data, function (index, row) {
          network_html += '<tr>';
          network_html += '<td>' + row.user + '</td><td>' + row.ip_address + '</td><td>' + row.port + '</td>';
          network_html += '</tr>';
        });
        $('#login-state-box .list-table > tbody').html(network_html);
      }, 'json');
      //渗透溯源
      get_honey_info();
      $('#process-tree').jstree("destroy");


      // 系统状态
      url = baseURL('/api/logs/system/');
      param.start_time = param.end_time;
      param.search = process_name;
      param.start_time = dur_time;
      param.end_time = dur_time;
      $.get(url, param, function (rows) {
        var html_content = '<ul>';
        $.each(rows.data, function (index, row) {
          if (row.close_flag) {
            html_content += '<li class="bg-disable">';
          } else {
            html_content += '<li>';
          }
          html_content += format_process_info(row);
          html_content += each_process_info(row.child);
          html_content += '</li>';
        });
        process_flag = 1;
        html_content += '</ul>';
        $('#process-tree').html(html_content);
        init_process_tree();
        $('.bg-disable .jstree-wholerow').css('backgroundColor', '#e5e5e5');
      }, 'json');
      $('#result-box').show();

    });
  });




  function get_honey_info() {
    var url = baseURL('/api/logs/honey/');
    var ip_address = $('#ip_address').val().trim();
    if (ip_address === '' || !isIP2(ip_address)) {
      layer.msg('请输入正确的IP地址!');
      return;
    }
    var temp_date = moment($('.date-box input').val());
    var start_time = parse_timestamp(temp_date.subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));
    var end_time = parse_timestamp(temp_date.add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'));

    var param = {
      'start_time': start_time, 'end_time': end_time,
      'ip_address': ip_address
    };
    $.get(url, param, function (rows) {
      var html_content = '';
      var page_size = 8;
      if (page_size > rows.total) {
        page_size = rows.total;
      }
      var page_count = parseInt(rows.total / page_size) + 1;
      for (var i = 1; i <= page_count; i++) {
        var data = [];
        for (var n = (i - 1 ) * page_size; n < i * page_size; n++) {
          if (n < rows.total) {
            data.push(rows.data[n]);
          }
        }
        if (data) {
          html_content += get_honey_host_html(data);
        }
      }
      $('#link_count').html(rows.total);
      $('ul.host-link-list').remove();
      $('.parent-host').after(html_content);

      network_format_data();
    }, 'json');
  }

  function get_honey_host_html(data) {
    var ul_content = '<ul class="host-link-list">';
    $.each(data, function (index, row) {
      ul_content += '<li><i class="circle"></i><span>' + row.ip_address + '</span></li>';
    });
    ul_content += '</ul>';
    return ul_content;
  }

  $('#link-box .update-icon').click(function () {
    get_honey_info();
  });


  function parse_timestamp(str_time) {
    str_time = str_time.replace(/-/g, "/");
    var timestamp = Date.parse(new Date(str_time));
    timestamp = timestamp / 1000;
    return timestamp;
  }


  // 进程树
  function each_process_info(data) {
    var html_content = '<ul>';
    $.each(data, function (index, row) {
      html_content += '<li>';
      html_content += format_process_info(row);
      if (row.child) {
        html_content += each_process_info(row.child);
      }
      html_content += '</li>';
    });
    html_content += '</ul>';
    return html_content;
  }

  function format_process_info(row) {
    var html_content = '';
    html_content += '<span title="' + row.process + '">' + row.process_name + '</span><span>' + row.event_time + '</span>';
    html_content += '<span>' + row.user + '</span>' + '<span title="' + row.parameter.replace('"', '\'') + '">' + row.parameter + '</span>';
    return html_content;
  }

  function isIP2(ip) {
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return re.test(ip);
  }

  // 文件树

  function init_process_tree() {
    // if (process_flag){
    //
    // }
    $('#process-tree').jstree({
      'core': {
        'animation': 0,
        'check_callback': true,
        'themes': {'stripes': true}
      },
      'types': {
        '#': {
          'max_children': 1,
          'max_depth': 4,
          'valid_children': ['root']
        },
        'root': {
          'icon': '/static/3.3.3/assets/images/tree_icon.png',
          'valid_children': ['default']
        },
        'default': {
          'valid_children': ['default', 'file']
        },
        'file': {
          'icon': 'glyphicon glyphicon-file',
          'valid_children': []
        }
      },
      'plugins': ['wholerow']
    });
  }

  function network_format_data() {
    // 网络链路图
    $('.host-link-list').each(function () {
      let ipNum = $(this).children('li').length;
      let lineHtml = '';
      if (ipNum === 0) {
        $(this).remove();
      }
      if (ipNum < 4 && ipNum > 0) {
        for (var i = 0; i < 4 - ipNum; i++) {
          lineHtml += '<li class="empty-host-item">';
          lineHtml += '</li>';
        }
      }

      $(this).append(lineHtml);

      let itemNum = $(this).children('li').length;
      if (itemNum === 4) {
        $(this).children('li').eq(3).addClass('add-line');
      }
    });

    $('.link-chart-wrap').each(function () {
      if ($(this).children('.host-link-list').length === 0) {
        $(this).children('.parent-host').addClass('no-arrow');
      }
    });
  }

});

