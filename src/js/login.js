const $ = require('jquery');
const baseURL = require('baseURL');
const layer = require('layer');
// 改1
// $(document).ready(function () {
//   //..........................
// });
$(document).ready (function () {
  if (window.top != window.self) {
    window.top.location = window.location;
  }
  // var b = window.top != window.self;
  // console.log("当前窗口是否在一个框架中：" + b + top.location + '|' + location);
  // console.log("当前窗口是否在一个框架中：" + (window.self != window.top));
  // console.log("当前窗口是否在一个框架中：" + (parent && parent != window));
  // console.log("当前窗口是否在一个框架中：" + (parent.frames.length > 0 ));
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
  }
  function login_event() {
    var url = baseURL('/api/users/login/');
    $.post(url, {
      username: $('#username').val(),
      password: $('#psw').val(),
      captcha: $('#code').val()
    }, function (data) {
      if (data.ret === 'success') {
        var jump_url = '';
        var next_url = GetQueryString("next");
        if (next_url != null && next_url.toString().length > 1) {
          console.log(next_url.indexOf('/hosts/'));
          if (next_url.indexOf('/hosts/') > -1) {
            location.href = '/hosts/';
          } else {
            location.href = next_url;
          }
        } else {
          location.href = '/';
        }
      }
      else {
        layer.msg(data.msg);
        $('.change-btn').click();
      }
    }, 'json');
    return false;
  }
// 改2
//   var myForm = document.getElementsByTagName('form')[0];
//   myForm.onsubmit = function(event){
//     return false;
//   };

  $("form").bind("submit", function (event) {
    return false;
  });
  let $userName = $('#username');
  let $psw = $('#psw');
  let $code = $('#code');
  let $tipText = $('#error-tip span');
  document.onkeydown = function (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) { // enter 键
          $('.login-btn-box').click();
          return false;
      }
  };
  $('.change-btn').click(function () {
      var url = baseURL('/captcha/?' + Math.random());
      $('#captcha_code').attr('src', url);
  });
  $('.login-btn-box').click(function () {
      if ($userName.val().trim() != '' && $psw.val().trim() != '' && $code.val().trim() != '') {
          $('#error-tip').hide();
          login_event();
      } else {
          if ($userName.val().trim() == '' && $psw.val().trim() == '' && $code.val().trim() == '') {
              $('#error-tip').show();
              $tipText.text('请输入用户名、密码和验证码！');
          }
          if ($userName.val().trim() == '' && $psw.val().trim() != '' && $code.val().trim() != '') {
              $('#error-tip').show();
              $tipText.text('请输入用户名！');
          }
          if ($userName.val().trim() != '' && $psw.val().trim() == '' && $code.val().trim() != '') {
              $('#error-tip').show();
              $tipText.text('请输入密码！');
          }
          if ($userName.val().trim() != '' && $psw.val().trim() != '' && $code.val().trim() == '') {
              $('#error-tip').show();
              $tipText.text('请输入验证码！');
          }
          if ($userName.val().trim() == '' && $psw.val().trim() == '' && $code.val().trim() != '') {
              $('#error-tip').show();
              $tipText.text('请输入用户名和密码！');
          }
          if ($userName.val().trim() == '' && $psw.val().trim() != '' && $code.val().trim() == '') {
              $('#error-tip').show();
              $tipText.text('请输入用户名和验证码！');
          }
          if ($userName.val().trim() != '' && $psw.val().trim() == '' && $code.val().trim() == '') {
              $('#error-tip').show();
              $tipText.text('请输入密码和验证码！');
          }
      }
  });

});

