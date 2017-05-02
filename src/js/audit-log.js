const $ = require('jquery');
const baseURL = require('baseURL');
require('./public.js');
const moment = require('moment');
require('dataTables');


$(function () {
    // 日期选择
    var startDate = moment().startOf('day');
    var endDate = moment().add(1, 'days');
    $('.date-box > i').click(function () {
        $(this).parent().find('input').click();
    });
    // 下拉列表
    require.ensure([], (require) => {
        require('../lib/select/select2.css');
        const select2 = require('select2');
        $('.sel-1 select').select2({
            minimumResultsForSearch: Infinity
        });
    });

    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('#contain').perfectScrollbar({
            useSelectionScroll: true
        });
    });

    var search;
    var module;

    require.ensure([], (require) => {
        require('../lib/daterangepicker/daterangepicker.css');
        require('daterangepicker');
        $('.date-box > input').daterangepicker({
            'timePicker': true,
            'timePicker24Hour': true,
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
            'maxDate': endDate.format('YYYY-MM-DD HH:mm:ss')
        }, function (start, end, label) {
            startDate = start;
            endDate = end;
        });
    });

    $('tfoot tr td a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });

    $('.sel-1 select').change(function () {
        module = $(this).val();
        search_result();
    });

    $('.search-box input').change(function () {
        search = $(this).val();

    });

    $('.search-box i').click(function () {
        search_result();
    });

    $('.search-box input').keydown(function (e) {//当按下按键时
        if (e.which == 13) {
            $('.search-box i').click();
        }
    });


    function search_result() {
        var params = '';

        if (search) {
            params += 'search=' + search + '&';
        }

        if (module) {
            params += 'module=' + module + '&';
        }

        if (startDate && endDate) {
            var start_time = startDate.format('YYYY-MM-DD HH:mm:ss');
            var end_time = endDate.format('YYYY-MM-DD HH:mm:ss');
            params += 'start_time=' + start_time + '&end_time=' + end_time;
        }
        if (params.substring(params.length - 1, params.length) == "&")
            params = params.substring(0, params.length - 1);

        if(params != ''){
            location.href = '?' + params;
        }else{
            location.href = '/';
        }
    }

    //
    // var tableLanguage = {
    //     'sProcessing': '处理中...',
    //     'sLengthMenu': '显示 _MENU_ 项结果',
    //     'sZeroRecords': '没有匹配结果',
    //     'sInfo': '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项',
    //     'sInfoEmpty': '显示第 0 至 0 项结果，共 0 项',
    //     'sInfoFiltered': '(由 _MAX_ 项结果过滤)',
    //     'sInfoPostFix': '',
    //     'sSearch': '搜索:',
    //     'sUrl': '',
    //     'sEmptyTable': '表中数据为空',
    //     'sLoadingRecords': '载入中...',
    //     'sInfoThousands': ',',
    //     'oPaginate': {
    //         'sFirst': '首页',
    //         'sPrevious': '&lt;',
    //         'sNext': '&gt',
    //         'sLast': '末页'
    //     }
    // };
    // var logTableColumns = [
    //     {'data': 'event_time'},
    //     {'data': 'user'},
    //     {'data': 'group_name'},
    //     {'data': 'module'},
    //     {'data': 'message'},
    //     {'data': 'status'},
    // ];
    //
    //
    // var options = {
    //     // processing: true, // 隐藏加载提示,自行处理
    //     serverSide: true, // 启用服务器端分页
    //     searching: false, // 禁用原生搜索
    //     orderMulti: false, // 启用多列排序
    //     lengthChange: true, // 是否允许用户自定义显示数量
    //     'bPaginate': true, // 翻页功能
    //     'ordering': false, // 排序功能
    //     'Info': true, // 页脚信息
    //     'autoWidth': false, // 自动宽度
    //     'destroy': true,
    //     ajax: function (data, callback, settings) {
    //         // 封装请求参数
    //         var param = {};
    //         param.limit = data.length; // 页面显示记录条数，在页面显示每页显示多少项的时候
    //         param.start = data.start; // 开始的记录序号
    //         param.start_time = startDate.format('YYYY-MM-DD');
    //         param.end_time = endDate.format('YYYY-MM-DD');
    //         // param.time = startDate.format('YYYY-MM-DD') + ' - ' + endDate.format('YYYY-MM-DD');
    //         // console.log(param);
    //         // ajax请求数据
    //         var url = baseURL('/api/audit/logs/');
    //         $.ajax({
    //             type: 'GET',
    //             url: url,
    //             cache: false,  // 禁用缓存
    //             data: param,  // 传入组装的参数
    //             dataType: 'json',
    //             success: function (result) {
    //                 var returnData = {};
    //                 returnData.draw = data.draw; // 这里直接自行返回了draw计数器,应该由后台返回
    //                 returnData.recordsTotal = result.recordsTotal; // 返回数据全部记录
    //                 returnData.recordsFiltered = result.recordsFiltered; // 后台不实现过滤功能，每次查询均视作全部结果
    //                 returnData.data = result.data; // 返回的数据列表
    //                 callback(returnData);
    //                 // }, 200);
    //             }
    //         });
    //     },
    //     language: tableLanguage,
    //     columns: logTableColumns,
    //     'columnDefs': [
    //         {
    //             'targets': 0,
    //             'createdCell': function createdCell(td, cellData, rowData, row, col) {
    //                 if (cellData === 1) {
    //                     $(td).html('<div class="tag tag-green"></div>');
    //                 } else if (cellData === 2) {
    //                     $(td).html('<div class="tag tag-orange"></div>');
    //                 } else if (cellData === 3) {
    //                     $(td).html('<div class="tag tag-red"></div>');
    //                 }
    //             }
    //         },
    //         {
    //             'targets': 0,
    //             'createdCell': function createdCell(td, cellData, rowData, row, col) {
    //                 if (cellData === 1) {
    //                     $(td).html('<div class="sniper-checkbox"><input type="checkbox" checked><i class="iconfont">&#xe624;</i></div>');
    //                 } else if (cellData === 0) {
    //                     $(td).html('<div class="sniper-checkbox"><input type="checkbox"><i class="iconfont">&#xe624;</i></div>');
    //                 }
    //             }
    //         }
    //     ]
    // };
    //
    // $('#log-tab').DataTable(options);
    //
    // $('.toggle-vis').on('change', function (e) {
    //     e.preventDefault();
    //     let tableType = $(this).parent().parent('.filter-ul').data('type');
    //     let column = logTables[tableType - 1].column($(this).attr('data-column'));
    //     column.visible(!column.visible());
    // });
    //
    // $('.filter-btn').click(function () {
    //     let $thisFilterUl = $(this).siblings('.filter-ul');
    //     $thisFilterUl.toggle();
    //     event.stopPropagation();
    // });
    //
    // $(document).click(function () {
    //     $('.filter-ul').hide();
    // });
    //
    // $('.filter-ul').click(function () {
    //     event.stopPropagation();
    // });

});
