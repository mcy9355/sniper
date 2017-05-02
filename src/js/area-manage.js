const $ = require('jquery');
require('./public.js');
const baseURL = require('baseURL');
$(function () {
  Date.prototype.format = function (format) {
    var date = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S+': this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
      }
    }
    return format;
  };

  // var date = new Date().format('yyyy-MM-dd hh:mm:ss');
  // $('#area tbody tr td:nth-child(4)').text(date);


  var load_content = function () {
    var router_id = $('tr.active').data('id');
    if (router_id) {
      var url = baseURL('/api/hosts/user/router/' + router_id + '/');
      $.get(url, function (data) {
        if (data.ret === 'success' && data.rows) {
          $.each($('#managePerson li'), function (index, item) {
            var user_id = $(this).data('id');
            if (data.rows.indexOf(user_id) > -1) {
              $(this).find('input[type=checkbox]').prop('checked', true);
            }
          });
          check_select_status();
        }
      }, 'json');
    }
  };
  load_content();

  // 点击变色
  $('#area').on('click', 'tbody tr', function () {
    $(this).addClass('active').siblings('tr').removeClass('active');
    $('#managePerson li input[type=checkbox]').prop('checked', false);
    load_content();
  });
  // 删除一行
  $('#area').on('click', '.delete', function () {
    var $self = $(this);
    var router_id = $(this).parents('tr').data('id');
    var url = baseURL('/api/hosts/router/');
    if (router_id) {
      require.ensure([], (require) => {
        require('../lib/layer/skin/layer.css');
        const layer = require('layer');
        $.post(url, 'ids[]=' + router_id + '&act=del', function (data) {
          if (data.ret === 'success') {
            $self.parents('tr').remove();
            var count = $self.parent('td').prev('td').html();
            reset_count(count);
            layer.msg('删除成功! 该分组中存在的主机会移动到默认分组');
          } else {
            layer.msg(data.msg);
          }
        }, 'json');
      });
    }
  });

  // 全选OR取消全选
  $('#managePerson').on('click', 'ul li .sniper-checkbox #checkAll', function () {
    var flag = false;
    if (this.checked) {
      flag = true;
    }
    $("input[name=check-choose]").each(function () {
      this.checked = flag;
    });

  });


  // 添加模态
  $('#addArea').click(function (event) {
    require.ensure([], (require) => {
      // 添加模态窗口
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $('#addAreaModal').modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5
      });
    });
  });

  // 添加分组
  $('#confirmAdd').click(function () {
    var url = baseURL('/api/hosts/router/');
    var areaName = $('#areaName').val().trim();
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      if (areaName) {
        var param = {'name': areaName};

        $.post(url, param, function (data) {
          if (data.ret === 'success') {
            layer.msg('添加成功!');
            var html_content = '<tr data-id="' + data.id + '"><td><span></span></td><td class="area-name">' + areaName + '</td><td>' + data.created + '</td><td>' + data.count + '</td>';
            html_content += '<td><i class="iconfont delete">&#xe65e;</i></td><td><i class="iconfont edit">&#xe605;</i></td></tr>';
            $('#area tbody').append(html_content);
          } else {
            layer.msg(data.msg);
            return false;
          }
          $('#areaName').val('');
          $.modal.close();
        }, 'json');

      } else {
        layer.msg('片区名不能为空！');
      }
    });
  });

  function reset_count(count) {
    count = parseInt(count);
    var $default_td = $('td.default-count');
    var old_count = parseInt($default_td.html());
    $default_td.html(old_count + count);
  }

  // 修改分组
  function change_router(router_name, router_id) {
    var url = baseURL('/api/hosts/router/');
    if (router_id) {
      url += router_id + '/';
    }
    var param = {'name': router_name};
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      $.post(url, param, function (data) {
        if (data.ret === 'success') {
          layer.msg('操作成功!');
        } else {
          layer.msg('操作失败!');
        }
      }, 'json');
    });
  }

  // 添加分组


  // 重命名
  $('#area').on('click', '.edit', function (event) {
    var $hostName = $(this).parents('tr').find('.area-name');
    var curVal = $hostName.text();
    if (curVal != '') {
      var $input = $('<input id="rename-input" type="text" value=' + curVal + '>');
      $hostName.html($input);
      $input.select();
      event.stopPropagation();
    }
  });

  $(document).on('blur', '#rename-input', function () {
    var newHostName = $(this).val();
    var router_id = $(this).parents('tr').data('id');
    var $self = $(this);
    if (newHostName !== '') {
      var url = baseURL('/api/hosts/router/');
      if (router_id) {
        url += router_id + '/';
      }
      var param = {'name': newHostName};
      require.ensure([], (require) => {
        require('../lib/layer/skin/layer.css');
        const layer = require('layer');
        $.post(url, param, function (data) {
          if (data.ret === 'success') {
            layer.msg('操作成功!');
            $self.parents('.area-name').text(newHostName).show();
            $self.remove();
          } else {
            layer.msg('操作失败!');
          }
        }, 'json');
      });
    }
  }).on('keyup', '#rename-input', function (e) {
    if (e.keyCode === 13) {
      $(this).blur();
    }
  });

  // 分页
  $('tfoot tr td a').click(function () {
    $(this).addClass('active').siblings('a').removeClass('active');
  });

  $('#addAreaModal').on('modal:close', function () {
    empty_form($(this).find('form'));
  });
  function empty_form(form) {
    $(':input', form).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
  }

  // 全选OR取消全选
  $("#managePerson").on('click', '#checkAll', function () {
    var user_id_list = get_user_list();
    user_id_list = user_id_list.join(',');
    var flag = false;
    if (this.checked) {
      flag = true;
    }
    $("input[name=check-choose]").each(function () {
      this.checked = flag;
    });
    var router_id = $('tr.active').data('id');
    change_router_user(router_id, user_id_list, flag);

  });

  $('#managePerson').bind('click', 'input[name=check-choose]', function () {
    check_select_status();
  });

  function check_select_status() {
    if ($('input[name=check-choose]').length != $('input[name=check-choose]:checked').length) {
      $('#checkAll').prop('checked', false);
    } else {
      $('#checkAll').prop('checked', true);
    }
  }

  function get_user_list(flag) {
    var user_list_id = [];
    $("#managePerson input[name=check-choose]").each(function () {
      var user_id = $(this).parents('li').data('id');
      user_list_id.push(user_id);
    });
    return user_list_id;
  }


  $('#managePerson').on('change', 'input[name=check-choose]', function () {
    var user_id = $(this).parents('li').data('id');
    var router_id = $('tr.active').data('id');
    var flag = $(this).prop('checked');
    change_router_user(router_id, user_id, flag)
  });

  function change_router_user(router_id, user_id, flag) {
    var url = baseURL('/api/hosts/user/router/');
    if (user_id && router_id) {
      url += router_id + '/';
      var param = {'user_id': user_id};
      if (!flag) {
        param.act = 'del';
      }
      require.ensure([], (require) => {
        require('../lib/layer/skin/layer.css');
        const layer = require('layer');
        $.post(url, param, function (data) {
          if (data.ret == 'success') {
            layer.msg('操作成功!');
          } else {
            layer.msg('操作失败!');
          }
        }, 'json');
      });
    }
  }

});

