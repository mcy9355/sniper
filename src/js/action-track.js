const $ = require('jquery');
require('./public.js');
const baseURL = require('baseURL');
const moment = require('moment');
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
  let $searchInput = $('#track-box .box-bd .ip-box #ip-input');
  $searchInput.focus(function (event) {
    event.stopPropagation();
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
        if($("#searchUl li").length == 0){
          $('#search-result').hide();
        }
      }
    }, 'json');
  });

  // 显示所选择的ip
  $('#search-result').on('click', '#searchUl li', function (event) {
    event.stopPropagation();
    var liText = $(this).html();
    $('#ip-input').val(liText);
    $('#search-result').hide();
  });
  // 回车隐藏下拉菜单
  $('#ip-input').bind('keypress',function(event){
    if(event.keyCode == "13") {
      $('#search-result').hide();
      // console.log('你输入的内容为：' + $('#ip_address').val());
    }
  });
  // 点击下拉菜单之外的内容隐藏下拉菜单
  $(document).click(function () {
    $('#search-result').hide();
  });


  // 日期选择
  var startDate = moment().startOf('day');
  var endDate = moment().add(1, 'days');

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
    $('#main-box,#searchUl').perfectScrollbar({
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

  function get_more_url(param) {
    var url = '/hosts/logs/more/?' + object_to_string(param);
    return url;
  }

  // 结果显示
  $('.search-btn').click(function () {
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      let ip_address = $('#ip-input').val().trim();
      let username = $('#user-input').val().trim();
      if (ip_address || username) {
        $('#ip-input').val(ip_address);

        if (!isIP2(ip_address)) {
          layer.msg('请输入正确的IP地址!');
          return;
        }
        var temp_date = moment($('.date-box input').val());
        var start_time = parse_timestamp(temp_date.subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        var end_time = parse_timestamp(temp_date.add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        var dur_time = parse_timestamp(temp_date.subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'));

        var url = baseURL('/api/logs/');
        var param = {};
        param.start_time = start_time;
        param.end_time = end_time;
        param.ip_address = ip_address;

        param.type = 5;
        // 域名
        $('#domain-box').find('.more-link').attr('href', get_more_url(param));
        $.get(url, param, function (rows) {
          var table_html = '';
          $.each(rows.data, function (index, row) {
            table_html += '<tr>';
            table_html += '<td>' + row.event_time + '</td><td>' + row.domain + '</td>';
            table_html += '<td></td>';
            table_html += '</tr>';
          });
          $('#domain-box .list-table>tbody').html(table_html);
        }, 'json');

        if (username) {
          param.user = username;
          $('#user-input').val(username);
        }

        param.type = 7;

        // 设计文件
        $('#design-file-box').find('.more-link').attr('href', get_more_url(param));
        $.get(url, param, function (rows) {
          var table_html = '';
          $.each(rows.data, function (index, row) {
            table_html += '<tr>';
            table_html += '<td>' + row.event_time + '</td>';
            table_html += '<td>' + row.user + '</td><td title="' + row.process + '">' + row.process_name + '</td>';
            table_html += '<td title="' + row.path + '">' + row.filename + '</td>';
            table_html += '</tr>';
          });

          $('#design-file-box >table>tbody').html(table_html);
        }, 'json');
       
        param.type = 1;
        // 行为
        $('#relate-box').find('.more-link').attr('href', get_more_url(param));
        $.get(url, param, function (rows) {

          var table_html = '';
          $.each(rows.data, function (index, row) {
            table_html += '<tr>';
            table_html += '<td>' + row.event_time + '</td><td>' + row.user + '</td>';
            table_html += '<td>' + row.parent_process + '</td><td title="' + row.process + '">' + row.process_name + '</td><td class="hidden-td">' + row.parameter + '</td>';
            table_html += '</tr>';
          });
          $('#relate-box >table>tbody').html(table_html);
          $('#none-box').hide();
          $('#result-box').show();
        }, 'json');
      } else {
        layer.msg('请输入IP或用户名!');
      }
    });
  });

  function parse_timestamp(str_time) {
    // 替换格式
    str_time = str_time.replace(/-/g, "/");
    // 转换为时间戳
    var timestamp = Date.parse(new Date(str_time));
    // 时间戳除以1000
    timestamp = timestamp / 1000;

    return timestamp;
  }

  function isIP2(ip) {
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return re.test(ip);
  };
});
