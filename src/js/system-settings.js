const $ = require('jquery');
require('serialize');
require('./public');
const baseURL = require('baseURL');
$(function () {

  if ($('.timeout-strategy').length > 0) {
    require.ensure([], (require) => {
      require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
      require('scrollbar');
      $('#contain').perfectScrollbar({
        useSelectionScroll: true
      });
    });
  }


  $('.save-btn').click(function () {
    var ipFlag = true;
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      var serialize = $('#setting-form').serializeJSON();
      var url = baseURL('/api/system/settings/');
      var ipVal = $('.ip-range input').val();
      if(ipVal !== ''){
        if(ipFlag){
          if(!validateIP(ipVal)){
            layer.msg('请输入正确的IP地址！');
            ipFlag = false;
          }
        }
      }
      if (!ipFlag) {
        layer.msg('请输入正确的IP地址！');
        return false;
      }
      $.post(url, serialize, function (data) {
        if (data.ret == 'success') {
          layer.msg('保存成功!');
        } else {
          layer.msg(data.msg);
        }
      }, 'json');
    });
  });



  // 验证IP地址合法性函数
  function validateIP(what) {
    if (what.search(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) == -1) return false;
    var fs = 0,
      ls = 0;
    var myArray = what.split(/\./);
    var i;
    for (i = 0; i < 4; i++) {
      if (isNaN(myArray[i])) return false;

      var t = parseInt(myArray[i]);
      /* 每个域值范围0-255 */
      if (t < 0 || t > 255) return false;
    }
    fs = parseInt(myArray[0]); //取第一位进行校验
    ls = parseInt(myArray[3]); //取最后一位进行校验

    /* 主机部分不能全是1和0（第一位不能为255和0），网络部分不能全是0（最后一位不能为0） */
    if (fs == 255 || fs == 0 || ls == 0) {
      return false;
    }
    return true;
  }


  $('.sniper-checkbox').click(function () {
    var $check_box = $(this).children('input[type=checkbox]');
    if ($check_box.prop('checked')) {
      $(this).next('input[type=hidden]').val(1);
    } else {
      $(this).next('input[type=hidden]').val(0);
    }
  });

  require.ensure([], (require) => {
    require('../lib/select/select2.css');
    const select2 = require('select2');
    $('.sel-time').select2({
      minimumResultsForSearch: Infinity
    });
  });

  // 数字输入框

  $('.num-input').keyup(function () {
    var value = $(this).val();
    value = value.replace(/[^\d]/g, '')
    $(this).val(value);
  });
});

