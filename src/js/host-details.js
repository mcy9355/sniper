const $ = require('jquery');
require('jsTree');
const moment = require('moment');
const baseURL = require('baseURL');

$(document).ready(function () {
    var host_id = $('#current_host_id').val();
    var host_sku = $('#current_host_sku').val();
    var host_old_router_id = $('#access-select').val();
    var host_url = baseURL('/api/hosts/' + host_id + '/');
    var start_time = parse_timestamp(moment().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    var end_time = parse_timestamp(moment().format('YYYY-MM-DD HH:mm:ss'));
    // 攻击事件图表
    require.ensure([], (require) => {
        const echarts = require('echarts');
        let attackChart = echarts.init(document.getElementById('attack-chart'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [{
                name: '事件类型',
                type: 'pie',
                radius: ['35%', '55%'],
                data: []
            }],
            color: ['#7fc14e', '#5983c8', '#93b4e1', '#ff7269', '#ff9b3c']
        };

        var url = baseURL('/api/logs/total/');
        var param = {
            type: 'danger',
            sku: host_sku
        };
        $.get(url, param, function (rows) {
            if (rows.ret == 'success') {
                option.series[0].data = rows.data;
                attackChart.setOption(option);
            }
        }, 'json');
        param.type = 'remote';
        $.get(url, param, function (rows) {
            if (rows.ret == 'success') {
                if (rows.rows[0]) {
                    $('.remote-num .num').html(rows.rows[0].remote_user);
                    $('.login-num .num').html(rows.rows[0].local_user);
                }
            }
        }, 'json');

        get_network_connect_count();

    });

    // 下拉列表
    require.ensure([], (require) => {
        require('../lib/select/select2.css');
        const select2 = require('select2');
        $('#access-select').select2({
            minimumResultsForSearch: Infinity
        });
    });

    // 重命名
    $('#edit-btn').click(function () {
        if($('#rename-input').length < 1 ){
            let $hostName = $(this).siblings('.host-name');
            let curVal = $hostName.text();
            let $input = $(`<input id="rename-input" class="pull-left" type="text" value=${curVal}>`);
            if (curVal != '') {
                $(this).before($input);
                $input.select();
                $hostName.hide();
            }
        }
    });

    $('#access-select').change(function () {
        var router_id = $(this).val();
        var param = {router_id: router_id};
        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            $.post(host_url, param, function (data) {
                if (data.ret == 'success') {
                    var $active_host = $('.group-list', window.parent.document).find('.host-list li.active');
                    change_host(host_old_router_id, $active_host);
                    change_host(router_id, $active_host, true);
                } else {
                    layer.msg(data.msg);
                }
            }, 'json');
        });
    });

    function change_host(router_id, $active_host, flag = false) {
        var $group_list = $('.group-list>li', window.parent.document);
        $.each($group_list, function (index, item) {
            var curId = $(this).data('id');
            // 新分组
            if (curId == router_id) {
                var $group = $(this).find('.group-host-num');
                var group_count = parseInt($group.attr('data-count'));

                group_count = flag ? group_count + 1 : group_count - 1;

                $group.attr('data-count', group_count);
                $group.html('(' + (group_count) + ')');

                if (flag) {
                    $(this).find('.host-list').prepend($active_host);
                    host_old_router_id = router_id;
                    $(this).addClass('open');
                    $(this).children('.host-list').removeClass('hide');
                } else {
                    $(this).removeClass('open');
                    $(this).children('.host-list').addClass('hide');
                    var $tmp_host = $active_host;
                    $tmp_host.remove();
                }
            }
            // console.log($(this).data('id') + '---' + $(this).find('.group-host-num').html());
        });
    }

    $(document).on('blur', '#rename-input', function (event) {
        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            const layer = require('layer');
            var newHostName = $(this).val();
            var $self = $(this);
            if (newHostName != '') {
                var param = {remark: newHostName};
                $.post(host_url, param, function (data) {
                    if (data.ret == 'success') {
                        var $active_host = $('.group-list', window.parent.document).find('.host-list li.active');
                        $active_host.find('.host-name').html(newHostName);
                        $self.siblings('.host-name').text(newHostName).show();
                    } else {
                        layer.msg(data.msg);
                        event.stopPropagation();
                        $self.siblings('.host-name').show();
                    }
                    $self.remove();
                }, 'json');
            } else {
                $(this).siblings('.host-name').show();
                $(this).remove();
            }
        });
    }).on('keyup', '#rename-input', function (e) {
        if (e.keyCode === 13) {
            $(this).blur();
        }
    });

    function parse_timestamp(str_time) {
        str_time = str_time.replace(/-/g,"/");
        var timestamp = Date.parse(new Date(str_time));
        timestamp = timestamp / 1000;
        return timestamp;
    }


    get_epl_file_info();
    get_honey_info();
    function get_domain_info() {
        var url = baseURL('/api/logs/');
        var param = {
            type: 5,
            sku: host_sku,
            start_time: start_time,
            end_time: end_time
        };

        $('#domain-box').find('.more-link').attr('href', get_more_url(param));
        //域名
        $.get(url, param, function (rows) {
            var table_html = '';
            $.each(rows.data, function (index, row) {
                table_html += '<tr>';
                table_html += '<td title="' + row.domain + '">' + row.domain + '</td>';
                table_html += '<td><i class="iconfont">&#xe631;</i> <span>未知</span></td>';
                table_html += '</tr>';
            });
            $('#domain-box >table>tbody').html(table_html);
        }, 'json');
    }

    function get_honey_info() {
        var url = baseURL('/api/logs/honey/');
        var param = {
            sku: host_sku,
            start_time: start_time,
            end_time: end_time
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
    // 渗透溯源
    function get_honey_host_html(data) {
        var ul_content = '<ul class="host-link-list">';
        $.each(data, function (index, row) {
            ul_content += '<li><i class="circle"></i><span>' + row.ip_address + '</span></li>';
        });
        ul_content += '</ul>';
        return ul_content;
    }

    function get_epl_file_info() {
        var url = baseURL('/api/logs/');
        var param = {
            sku: host_sku,
            type: 7,
            close_flag: 0
        };

        $('#design-file').find('.more-link').attr('href', get_more_url(param));
        // 设计文件
        $.get(url, param, function (rows) {
            var table_html = '';
            var count = 0;
            $.each(rows.data, function (index, row) {
                table_html += '<tr>';
                table_html += '<td>' + row.user + '</td>';
                table_html += '<td title="' + row.process.replace('"', '') + '">' + row.process_name + '</td><td title="' + row.path + '">' + row.filename + '</td>';
                table_html += '</tr>';
                count += 1;
            });

            $('#statistics .file-num .num').html(rows.recordsTotal);

            $('#design-file >table>tbody').html(table_html);
        }, 'json');
    }

    function get_network_connect_count() {
        var url = baseURL('/api/logs/');
        var param = {
            sku: host_sku,
            type: 8,
            count: 1,
            close_flag: 0
        };

        $.get(url, param, function (data) {
            if (data.ret == 'success') {
                $('#statistics .link-num').find('.num').html(data.rows.count);
            }
        });

    }

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

    function get_epl_file_history() {
        var url = baseURL('/api/logs/');
        var param = {
            sku: host_sku,
            type: 7,
        };

        $('#file-access').find('.more-link').attr('href', get_more_url(param));
        // 设计文件
        $.get(url, param, function (rows) {
            var table_html = '';
            var count = 0;
            $.each(rows.data, function (index, row) {
                table_html += '<tr>';
                table_html += '<td>' + row.event_time + '</td>' + '<td>' + row.user + '</td>';
                table_html += '<td title="' + row.process.replace('"', '') + '">' + row.process_name + '</td><td title="' + row.path + '">' + row.filename + '</td>';
                table_html += '</tr>';
                count += 1;
            });

            $('#file-access-table>tbody').html(table_html);
        }, 'json');
    }


    function process_format_data(flag = false) {

        $('#system-tree').jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": {"stripes": true}
            },
            "types": {
                "#": {
                    "max_children": 1,
                    "max_depth": 4,
                    "valid_children": ["root"]
                },
                "root": {
                    "icon": "/static/3.3.3/assets/images/tree_icon.png",
                    "valid_children": ["default"]
                },
                "default": {
                    "valid_children": ["default", "file"]
                },
                "file": {
                    "icon": "glyphicon glyphicon-file",
                    "valid_children": []
                }
            },
            "plugins": ["wholerow"]
        });

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
        html_content += '<span title="' + row.process + '">' + row.process_name + '</span>' + '<span>' + row.process + '</span>';
        html_content += '<span>' + row.user + '</span>' + '<span title="' + row.parameter.replace('"', '\'') + '">' + row.parameter + '</span>';
        return html_content;
    }

    function get_process_info(flag = false) {
        var url = baseURL('/api/logs/system/?sku=' + host_sku);
        $.get(url, function (rows) {
            var html_content = '<ul>';
            $.each(rows.data, function (index, row) {
                if (rows.close_flag) {
                    html_content += '<li class="bg-disable">';
                } else {
                    html_content += '<li>';
                }
                html_content += format_process_info(row);
                html_content += each_process_info(row.child);
                html_content += '</li>';
            });
            html_content += '</ul>';
            $('#system-tree').html(html_content);
            // 进程树
            process_format_data();
            $('.bg-disable .jstree-wholerow').css('backgroundColor', '#e5e5e5');
        }, 'json');
    }

    // 刷新按钮
    $('#system-state').on('click', '.update-icon', function () {
        $('#system-tree').jstree("destroy");

        get_process_info();
    });

    $('#design-file').on('click', '.update-icon', function () {
        get_epl_file_info();
    });

    $('#link-list').on('click', '.update-icon', function () {
        get_honey_info();
    });


    // 主机详情板块自适应
    $('#host-info .disk-box').each(function () {
        if ($(this).find('.disk-group').length > 4) {
            $('.name-info-box').css({
                'width': "28%"
            });
            $('.host-info-box').css({
                'width': "32%"
            });
            $('.disk-box').css({
                'width': '40%'
            });
            $('.disk-group').css({
                'float': 'left'
            });
        }
    });

    // 滚动条样式
    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('.main-details-box').perfectScrollbar({
            useSelectionScroll: true
        });
        var is_scroll = false;
        $('.main-details-box').scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();

            if (!is_scroll) {
                if (scrollTop > 200) {
                    get_domain_info();
                    get_epl_file_history();
                    get_process_info();
                    is_scroll = true;
                }
            }
        });
    });

    // 网络链路图
    function network_format_data() {
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