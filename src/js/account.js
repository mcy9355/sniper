require('./public.js');
const $ = require('jquery');
const baseURL = require('baseURL');
$(function () {
//switch切换动画效果

  var url = baseURL('/api/users/');
  var current_user = 0;

  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('.bg-white').perfectScrollbar({
      useSelectionScroll: true
    });
  });


  var serialize_object = function (form) {
    var o = {};
    $.each(form.serializeArray(), function (index) {
      if (o[this['name']]) {
        o[this['name']] = o[this['name']] + "," + this['value'];
      } else {
        o[this['name']] = this['value'];
      }
    });
    return o;
  };

  $("#userList").on("click", 'tbody tr .switch-input', function () {
    var user_id = $(this).parents('tr').data('id');
    var param = {
      is_active: 1
    };

    if ($(this).prop("checked")) {
      $(this).siblings('.text-info').html("已开启");
      $(this).parent('.switch').addClass("open").removeClass("close");
      param.is_active = 0;
    } else {
      $(this).siblings('.text-info').html("已关闭");
      $(this).parent('.switch').addClass("close").removeClass("open");
    }

    change_user(user_id, param);
  });

  if($('table tbody tr').length == 0){
    $('table .sniper-checkbox').addClass('hide');
  }else{
    $('table .sniper-checkbox').removeClass('hide');
  }

  // 全选OR取消全选
  $('#userList').on('click', '#checkAll', function () {
    var flag = false;
    if (this.checked) {
      flag = true;
    }
    $("input[name=check-choose]").prop('checked', flag);
  });

//添加用户
  $('#addUser').click(function (event) {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $("#addUserModal").modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5
      });
    });
    $('table .sniper-checkbox').removeClass('hide');
  });

  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
      var style_value = $('#addUserModal').attr('style');
      if (style_value.indexOf('display:none') <= -1) {
        $('#confirmAdd').click();
      }
      return false;
    }
  };

  $('#confirmAdd').click(function () {
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      var form = $(this).parents('form');
      var payload = serialize_object(form);
      var userName = $('#addUserModal input[name=username]');
      var psw1 = $('#addUserModal input[name=new_password1]');
      var psw2 =$('#addUserModal input[name=new_password2]');
      if(userName.val().trim() =='' || psw1.val().trim()=='' || psw2.val().trim()==''){
        layer.msg('信息不能为空！');
        return;
      }
      $.post(url, payload, function (data) {
        if (data.ret && data.ret == 'success') {
          layer.msg('添加成功!');
          var html_content = '<tr data-id="' + data.id + '">';
          html_content += "<td><div class='sniper-checkbox pull-left'><input type='checkbox' name='check-choose'>" +
            "<i class='iconfont'>&#xe624;</i></div></td>";
          html_content += "<td>" + payload.username + "</td><td><span></span><span></span></td>" +
            "<td><i class='iconfont delete'>&#xe65e;</i></td><td><i class='iconfont edit'>&#xe605;</i></td>";
          html_content += "<td><div class='switch'><span class='text-info'>已关闭</span>" +
            "<input class='switch-input' type='checkbox' name='switch'>" +
            "<div class='switch-box'></div></div></td></tr>";
          $("#userList").append(html_content);
          $.modal.close();
          empty_form(form);
        } else {
          layer.msg(data.msg);
        }
      });
    });
  });

  function empty_form(form) {
    $(':input', form).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
  }

  // 修改用户
  $('#confirmEdit').click(function () {
    var form = $(this).parents('form');
    var payload = serialize_object(form);
    change_user(current_user, payload, form);
  });

  //删除用户模态框
  $('#deleteUser').click(function (event) {
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      var data = '';
      var ids = '';
      layer.confirm('确定删除选择用户？', {
        btn: ['确定', '取消']
      }, function () {
        $.each($("input[type=checkbox][name=check-choose]:checked"), function (index, item) {
          ids = $(this).parents('tr').data('id');
          data += 'ids[]=' + ids + '&';
        });
        if (data != '') {
          data += 'act=del';
          $.post(url, data, function (data) {
            if (data.ret == 'success') {
              layer.msg('用户已删除!');
              $("input[type=checkbox][name=check-choose]:checked").parents("tr").remove();
              if($('table tbody tr').length == 0){
                $('table .sniper-checkbox').addClass('hide');
              }else{
                $('table .sniper-checkbox').removeClass('hide');
              }
            } else {
              layer.msg(data.msg);
            }
            $('#checkAll').attr('checked', false);
          })
        } else {
          layer.msg('请至少选择一个用户进行删除!');
        }
      });
    });
  });


  // 删除用户
  $('#userList').on('click', '.delete', function () {
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');

      var user_id = $(this).parents('tr').data('id');
      if (user_id) {
        $(this).parents("tr").remove();
        var payload = {
          'act': 'del',
          'ids[]': user_id
        };
        $.post(url, payload, function (data) {
          if (data.ret == 'success') {
            layer.msg('用户已删除!');
          } else {
            layer.msg(data.msg);
          }
        }, 'json');
      }
    });
    if($('table tbody tr').length == 0){
      $('table .sniper-checkbox').addClass('hide');
    }else{
      $('table .sniper-checkbox').removeClass('hide');
    }

  });

  // 编辑用户
  $('#userList').on('click', '.edit', function () {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $("#changeUserModal").modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5
      });
      current_user = $(this).parents('tr').data('id');
    });
  });


  $('#addUserModal, #changeUserModal').on('modal:close', function () {
    empty_form($(this).find('form'));
  });


  function change_user(user_id, param, form = '') {
    var change_url = url + user_id + '/';
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      $.post(change_url, param, function (data) {
        if (data.ret && data.ret == 'success') {
          empty_form(form);
          layer.msg('修改成功!');
          $.modal.close();
        } else {
          layer.msg(data.msg);
        }
      }, 'json');
    });
  }

  // 取消全选
  $('#userList').bind('click', 'input[name=check-choose]', function () {
    if ($('input[name=check-choose]').length != $('input[name=check-choose]:checked').length) {
      $('#checkAll').prop('checked', false);
    } else {
      $('#checkAll').prop('checked', true);
    }
  });
});



