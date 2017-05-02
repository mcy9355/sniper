const $ = require('jquery');
require('./public.js');
require('dataTables');
const baseURL = require('baseURL');

$(document).ready(function () {

    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('.contain').perfectScrollbar({
            useSelectionScroll: true
        });
    });
    // 分页
    $('tfoot tr td a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });

    var search_keyword = '';
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
    var logTableColumns = [
        [
            {'data': 'event_time'},
            {'data': 'ip_address'},
            {'data': 'message'},
            // {'data': 'handle'},
        ],
        [
            {'data': 'event_time'},
            {'data': 'ip_address'},
            {'data': 'status'},
        ]
    ];
    var params;
    var default_search;
    var logTables;
    (window.onpopstate = function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        params = {};
        while (match = search.exec(query))
            params[decode(match[1])] = decode(match[2]);
    })();

    if (params.type) {
        params.type = parseInt(params.type);
    }

    function load_table(params) {
        var options = {
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
                params.limit = data.length; // 页面显示记录条数，在页面显示每页显示多少项的时候
                params.start = data.start; // 开始的记录序号
                // ajax请求数据
                var url = baseURL('/api/logs/');

                if (params.type == 1) {
                    url = baseURL('/api/hosts/alert/logs/');
                }

                if (params.type == 2) {
                    url = baseURL('/api/hosts/scan/logs/');
                }

                if (!default_search && params.search) {
                    delete params.search;
                }
                default_search = false;
                if (search_keyword != '') {
                    params.search = search_keyword;
                }
                $.ajax({
                    type: 'GET',
                    url: url,
                    cache: false,  // 禁用缓存
                    data: params,  // 传入组装的参数
                    dataType: 'json',
                    success: function (result) {
                        var returnData = {};
                        returnData.draw = data.draw; // 这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.recordsTotal; // 返回数据全部记录
                        returnData.recordsFiltered = result.recordsFiltered; // 后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data; // 返回的数据列表
                        callback(returnData);
                    }
                });
            },
            language: tableLanguage,
            columns: logTableColumns[params.type - 1],
            'columnDefs': [{
                'targets': logTableColumns[params.type - 1].length - 1,
                'createdCell': function createdCell(td, cellData, rowData, row, col) {
                    if (rowData.handle) {
                        // if (rowData.handle === 2) {
                        //     $(td).html('<div class="sniper-checkbox" data-id="' + rowData.id + '"><input type="checkbox" checked><i class="iconfont">&#xe624;</i></div>');
                        // }
                        // if (rowData.handle === 1) {
                        //     $(td).html('<div class="sniper-checkbox" data-id="' + rowData.id + '"><input type="checkbox"><i class="iconfont">&#xe624;</i></div>');
                        // }
                    } else {
                        if (rowData.status == 3) {
                            $(td).html('<span style="color:red">可疑</span>');
                        }
                        if (rowData.status == 2) {
                            $(td).html('<span style="color:green">安全</span>');
                        }
                    }
                }
            }],
        };
        logTables = $('#scanResult').DataTable(options);
    }

    load_table(params);

    $('.toggle-vis').on('change', function (e) {
        e.preventDefault();
        let tableType = $(this).parent().parent('.filter-ul').data('type');
        let column = logTables.column($(this).attr('data-column'));
        column.visible(!column.visible());
    });

    $('.filter-btn').click(function () {
        let $thisFilterUl = $(this).siblings('.filter-ul');
        $thisFilterUl.toggle();
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.filter-ul').hide();
    });

    $('.filter-ul').click(function () {
        event.stopPropagation();
    });


    $('.search-box button').click(function () {
        search_keyword = $(this).prev('input').val();
        load_table(params)
    });

    $('.search-box input').keydown(function (e) {//当按下按键时
        if (e.which == 13) {
            search_keyword = $(this).val();
            load_table(params)
        }
    });

    //
    $('#main-box').on('keyup', '.redirect', function (e) {
        if (e.keyCode == 13) {
            var redirect_page = 0;
            if ($(this).val() && $(this).val() > 0) {
                redirect_page = $(this).val() - 1;
            }
            // cur_table.context[0]._iRecordsTotal

            logTables.page(redirect_page).draw(false);
        }
    });

});
