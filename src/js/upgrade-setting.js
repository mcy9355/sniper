const $ = require('jquery');
require('./public.js');
const baseURL = require('baseURL');

$(function () {
    require.ensure([], (require) => {
        require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
        require('scrollbar');
        $('#contain').perfectScrollbar({
            useSelectionScroll: true
        });


        $('.update-save-btn').click(function () {
            var form = $(this).parents('.update_form')[0];
            var file = new FormData(form);
            var url = baseURL('/api/system/update/');
            upload_file(url, file);
            return false;
        });


        function upload_file(url, file) {
            require.ensure([], (require) => {
                require('../lib/layer/skin/layer.css');
                const layer = require('layer');
                $.ajax({
                    url: '/system/update/',
                    type: 'POST',
                    data: file,
                    cache: false,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function success(data) {
                        if (data.ret == 'success') {
                            layer.msg('更新成功!');
                        } else {
                            layer.msg(data.msg);
                        }
                        return false;
                    },
                    error: function error(data) {
                        layer.msg('更新失败!');
                    }
                });
            });

            return;

        }
    });
});


