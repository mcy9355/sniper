require('./public.js');
const $ = require('jquery');
const baseURL = require('baseURL');
$(function () {
  // 点击展开按钮
  $('.body-list').on('click', 'li .icon i', function () {
    var $secProgress = $(this).parents('.first-progress').siblings('.sec-progress');
    if ($(this).hasClass('icon-link-open')) {
      $(this).removeClass('icon-link-open').addClass('icon-link-close');
      $secProgress.show('fast');
    } else {
      $(this).addClass('icon-link-open').removeClass('icon-link-close');
      $secProgress.hide('fast');
    }
  });

// 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('.body-list').perfectScrollbar({
      useSelectionScroll: true
    });
  });
});