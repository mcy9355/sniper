const $ = require('jquery');
const moment = require('moment');
const baseURL = require('baseURL');
require('tooltipster');
require('../lib/tooltipster/tooltipster.bundle.css');

$(document).ready(function () {
  // 二级菜单收起展开
  function openList($self) {
    if (!$self.hasClass('open')) {
      $self.addClass('open');
      $self.next('.nav-side-sec').show();
    } else {
      $self.removeClass('open');
      $self.next('.nav-side-sec').hide();
    }
  }

  $('.nav-side-list >li .summary').click(function () {
    openList($(this));
  });

  // 头部时间获取
  moment.locale('zh-cn');
  setInterval(function () {
    $('#current-time').text(moment().format('LLL'));
  }, 1000);

  // tab切换
  $('.sort-tab li').click(function () {

    $(this).addClass('active').siblings().removeClass('active');

    var curIndex = $(this).index();
    $(this).parent().parent().siblings('.tab-content').each(function (index, el) {
      if (curIndex === index) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // 修改密码弹框
  $('#set-psw').click(function () {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $('#changePsw').modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5
      });
    });
  });


  // 密码过期
  if ($('#passInput')) {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $("#passInput").modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5,
        showClose: false,
        clickClose: false
      });
    });
  }

  $('#passInput input, #changePsw input').keydown(function (e) {//当按下按键时
    if (e.which == 13) {
      $('#confirmPswAdd').click();
    }
  });

  $('#confirmPswAdd').click(function () {
    var form = $(this).parents('form');
    var data = form.serialize();
    var url = baseURL('/api/users/change_password/');

    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      if($('#passInput').is(':visible')){
        if($('#userName').val().trim() =='' || $('#password').val().trim()=='' || $('#repwd').val().trim()==''){
          layer.msg('信息不能为空！');
          return;
        }
      }else {
        if($('#oldPsw').val().trim() =='' || $('#newPsw').val().trim()=='' || $('#rePsw').val().trim()==''){
          layer.msg('信息不能为空！');
          return;
        }
      }
      $.post(url, data, function (data) {
        if (data.ret == 'success') {
          layer.msg('密码修改成功!');
          $.modal.close();
          setTimeout("location.href = '/login';", 1000);
        } else {
          layer.msg(data.msg);
        }
      });
    });
  });


  $('#changePsw, #passInput').on('modal:close', function () {
    empty_form($(this).find('form'));
  });


  function empty_form(form) {
    $(':input', form).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
  }


  // 侧边导航点击效果
  function toggleTooltips(enable = true) {
    if (enable) {
      $('.tooltip').tooltipster({
        side: 'right',
        delay: 200,
        theme: ['tooltipster-noir', 'tooltipster-noir-customized']
      });
      $('.tooltip').tooltipster('enable');
    } else {
      $('.tooltip').tooltipster('disable');
    }
  }

  let $navSide = $('#nav-side');
  let $mainBox = $('#main-box');
  let $groupBox = $('#group-box');
  let $groupMainBox = $('#group-main-box');
  $('.toggle-nav-btn').click(function () {
    let $arrowIcon = $('.toggle-nav-btn i');
    if ($navSide.hasClass('open')) {
      $navSide.removeClass('open').addClass('close');
      $mainBox.addClass('large');
      $groupBox.addClass('left-small');
      $groupMainBox.addClass('left-small');
      $arrowIcon.addClass('right-arrow');
      toggleTooltips(true);
    } else {
      $navSide.removeClass('close').addClass('open');
      $mainBox.removeClass('large');
      $groupBox.removeClass('left-small');
      $groupMainBox.removeClass('left-small');
      $arrowIcon.removeClass('right-arrow');
      toggleTooltips(false);
    }
  });

});
