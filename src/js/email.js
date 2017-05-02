const $ = require('jquery');
require('serialize');
require('./public');
const baseURL = require('baseURL');

require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('#contain').perfectScrollbar({
        useSelectionScroll: true
    });
});

$(function () {
    // 账号变更通知+系统报警通知tab切换-----------------------------------------------------------tab选项卡移动效果
    for (var i = 0; i < $('.tabClick li').length; i++) {
        $('.tabClick li')[i].start = i;
        $('.tabClick li').click(function () {
            $('#email_type-input').val($(this).index() + 1);
            $(this).addClass('active').siblings('li').removeClass('active'); // 标题切换效果
            $('.lineDiv')[0].style.transform = 'translate3d(' + $('#wrap').width() / $('.tabClick li').length * (this.start) + 'px,0,0)'; // 滑动效果
            $('#' + $('.receiver')[this.start].id).removeClass('hidden').siblings('.receiver').addClass('hidden'); // 隐藏与显示
            $('#' + $('.email-title')[this.start].id).removeClass('hidden').siblings('.email-title').addClass('hidden'); // 隐藏与显示
            $('#' + $('.email-content')[this.start].id).removeClass('hidden').siblings('.email-content').addClass('hidden'); // 隐藏与显示
        });
    }

    $('.submit .save').click(function () {
        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            const layer = require('layer');
            var url = baseURL('/api/system/email/');
            var serialize = $('#email-form').serializeJSON();
            $.post(url, serialize, function (data) {
                if (data.ret == 'success') {
                    layer.msg('保存成功!');
                } else {
                    layer.msg(data.msg);
                }
            }, 'json');
        });
    });

    $('.submit .test').click(function () {
        require.ensure([], (require) => {
            require('../lib/layer/skin/layer.css');
            const layer = require('layer');
            var url = baseURL('/api/system/email/test/');
            var serialize = $('#email-form').serializeJSON();
            $.post(url, serialize, function (data) {
                if (data.ret == 'success') {
                    layer.msg('发送成功!');
                } else {
                    layer.msg('发送失败!');
                }
            }, 'json');
        });
    });
});

