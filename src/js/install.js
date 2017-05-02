const $ = require('jquery');
require('./public.js');
const baseURL = require('baseURL');

$(function () {
    // 滚动条样式
    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('.bg-white').perfectScrollbar({
            useSelectionScroll: true
        });
    });
    // 全选OR取消全选
    $('#install-tab').on('click', '#checkAll', function () {
        var flag = false;
        if (this.checked) {
            flag = true;
        }
        $("input[name=check-choose]").prop('checked', flag);
    });

            // 批量删除
    $('#deleteIp').click(function (event) {
        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            const layer = require('layer');
            var data = '';
            var sku = '';
            var url = baseURL('/api/hosts/uninstall/');
            layer.confirm('确认卸载所选中的主机？', {
                btn: ['确认', '取消']
            }, function () {
                $.each($('input[name=check-choose]:checked'), function (index, item) {
                    sku = $(this).parents('tr').data('sku');
                    data += 'sku[]=' + sku + '&';
                });

                if (data != '') {
                    data += 'is_delete=1';
                    $.post(url, data, function (data) {
                        if (data.ret == 'success') {
                            $('input[name=check-choose]:checked').parents('tr').remove();
                            layer.msg('卸载成功!');
                            window.location.reload();
                        }
                    });
                } else {
                    layer.msg('请至少选择一台主机进行卸载!');
                }
            });
        });
    });

    // 搜索
    $('#search-btn').click(function () {
        var keyword = $(this).prev('input').val();
        var url = baseURL('/?search=' + keyword);

        var page_num = $('tfoot a.active').html();
        if (page_num) {
            url += '&page=' + page_num;
        }
        location.href = url;
        return false;
    });

    $('.search-box input').keydown(function (e) {//当按下按键时
        if (e.which == 13) {
            $('#search-btn').click();
        }
    });

    // 删除一行
    $('#install-tab').on('click', '.delete', function () {
        var url = baseURL('/api/hosts/uninstall/');
        var sku = $(this).parents('tr').data('sku');
        var my_this = $(this);

        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            const layer = require('layer');
            layer.confirm('确认卸载？', {
                btn: ['确认', '取消']
            }, function () {
                $.post(url, 'is_delete=1&sku=' + sku, function (data) {
                    if (data.ret === 'success') {
                        my_this.parents('tr').remove();
                        layer.msg('卸载成功!');
                    } else {
                        layer.msg('卸载失败!');
                    }
                }, 'json');
            });
        });
    });


    // // 没有选中时要取消+++++++++++++++++++全选时，全选框要选中
    // $('#install-tab').bind('click', 'input[name=check-choose]:checked', function () {
    //     if (!$(this).checked) {
    //         $('#checkAll').prop('checked', false);
    //     }
    //
    //
    //     // var chsub = $('input.only').length; // 获取subcheck的个数
    //     // var checkedsub = $('input.only:checked').length; // 获取选中的subcheck的个数
    //     // if ($('input[name=check-choose]:checked').length === $('input.only').length) {
    //     //     $('input.all').each(function () {
    //     //         this.checked = true;
    //     //     });
    //     // }
    // });

    $('#install-tab').bind('click', 'input[name=check-choose]', function () {
        if ($('input[name=check-choose]').length != $('input[name=check-choose]:checked').length) {
            $('#checkAll').prop('checked', false);
        } else {
            $('#checkAll').prop('checked', true);
        }
    });
});
