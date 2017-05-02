const $ = require('jquery');
require('./public.js');
require('serialize');
const baseURL = require('baseURL');
$(document).ready(function () {
  // 滚动条
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('#scroll').perfectScrollbar({
      useSelectionScroll: true
    });
  });

  // 总体弹框
  $('.apply-btn').click(function (event) {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $("#applyModal").modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5,
        showClose: false,
        clickClose: false
      });
    });
  });

  //switch总开关按钮按钮切换
  $(".switchMain-input").bind("click", function () {
    if ($(this).prop("checked")) {
      $(this).parent('.switch-main').addClass("open").removeClass("close");
      $(this).next('input').val(1);
    } else {
      $(this).parent('.switch-main').addClass("close").removeClass("open");
      $(this).next('input').val(0);
      //console.log('xxx');
    }
  });


  $(".auto-protect .switchMain-input").bind("click", function () {
    if ($(this).prop("checked")) {
      $(".auto-protect-con input,.auto-protect-con select").attr("disabled", false).parents('.auto-protect').removeClass('disable');
    } else {
      $(".auto-protect-con input,.auto-protect-con select").attr("disabled", "disabled").parents('.auto-protect').addClass('disable');
    }
  });


  $(".web-protect .switchMain-input").bind("click", function () {
    if ($(this).prop("checked")) {
      // 执行选定类型文件时进行关键词检查及木马查杀---所控制的输入框
      $(".web-protect-con input,.web-protect-con textarea, .web-protect-con select").attr("disabled", false).parents('.web-protect').removeClass('disable');
    } else {
      $(".web-protect-con input,.web-protect-con textarea, .web-protect-con select").attr("disabled", "disabled").parents('.web-protect').addClass('disable');
    }

    check_disabled_status();
  });

  //点击添加出现add框
  $('.add-wrap i,.add-wrap label').on('click', function () {
    $(this).parents('.add-wrap').find('.add-name').show();
  });


  //点击回车，或者鼠标移除，增加一项
  function checkName(name) {
    var result = true;
    //遍历判断是否有重复的
    $('.product-con .check-box>.pull-left').not('.add-wrap').each(function () {
      if ($(this).find('label').html() == name || $(this).find('label').html().trim() == '') {
        result = false;
      }
    });
    return result;
  };

  $('.add-name').on('blur', function () {
    // 先撤销之前的点击
    // $('#checkAll , input.only').prop('checked', false);
    var name = $(this).val();
    if (name.trim() == "" || name == null || name.trim().length < 1) {
      // require('../lib/layer/skin/layer.css');
      // const layer = require('layer');
      // layer.msg('不能为空');
      $(this).hide();
    } else {
      var result = checkName(name);
      if (result) {
        $('.add-wrap').before("<div class='pull-left check-box-child'>" +
          "<div class='sniper-checkbox pull-left'>" +
          "<input type='checkbox' class='only' name=\"file[webprotect][script][]\" value='" + name + " 'id='" + name + "' checked>" +
          "<i class='iconfont'>&#xe624;</i>" +
          '</div>' +
          "<label id='" + name + "'>" + name + '</label>' +
          "<i class='iconfont delete'>&#xe658;</i>" +
          '</div>');
        $(this).val('');
        $(this).hide();
      } else {
        require('../lib/layer/skin/layer.css');
        const layer = require('layer');
        layer.msg('命名已存在!');
        $(this).focus();
      }
    }
  });

  $('.add-name').on('keydown', function (event) {
    var isIE = (document.all) ? true : false;
    var key;
    if (isIE) {
      key = event.keyCode;
    } else {
      key = event.which;
    }
    if (key == 13) {
      $(this).blur();
      event.preventDefault();
      //阻止其他事件执行
      event.stopPropagation();
      //防止页面跳转
      return false;
    }
  });
  // 删除功能
  $('.product-con').on('click', 'section .check-box div.pull-left .delete', function () {
    $(this).parent('div.pull-left').remove();
  });

  $('.monitor-web').on('click', '.check-box div.pull-left .delete', function () {
    $(this).parent('div.pull-left').remove();
  });


  $('.name-capture .switchMain-input').bind('click', function () {
    if ($(this).prop('checked')) {
      $('.name-capture textarea').attr('disabled', false).parents('section').removeClass('disable');
    } else {
      $('.name-capture textarea').attr('disabled', 'disabled').parents('section').addClass('disable');
    }
  });

  //网络链路
  $('input[type=radio][name=trackName]').click(function () {
    $(this).parents('.sniper-radio').siblings('.change-bg').removeClass('radio-noCheck').attr('disabled', false)
      .parents('.only-one-track').siblings('.only-one-track').find('.change-bg').addClass('radio-noCheck').prop({
      'disabled': 'disabled',
      "value": ""
    });
  });

  // 密码可视
  $('.scan-pwd').click(function () {
    if ($(this).siblings('input').attr("type") == "password") {
      $(this).addClass('close-pwd')
        .siblings('input').attr("type", "text")
    } else {
      $(this).removeClass('close-pwd')
        .siblings('input').attr("type", "password")
    }
  });


  //switch按钮切换
  var checkArry = document.getElementsByName("switch");
  for (var i = 0; i < checkArry.length; i++) {
    if (checkArry[i].checked == true) {
      $("input:checked").siblings('.text-info').html("已开启");
    }
  }
  $(".switch-input").bind("click", function (event) {
    if (check_web_process_status(this)) {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      layer.msg('请先选择需要监控的web中间件进程!');
      return;
    }

    if (!$('.analysis-switch').prop('checked')) {
      $('.filter-switch').prop('checked', false).siblings('.text-info').html('已关闭')
        .parent('.switch').addClass('close').removeClass('open');
    }

    if ($(this).prop("checked")) {
      enable_input($(this));
    } else {
      disabled_input($(this));
    }
  });


  // 关联按钮
  $('#analysis-input, #privilege-input').click(function () {
    if ($(this).prop("checked")) {
      $(this).parents('section').next('section').find('input[type=checkbox]').removeAttr('disabled');
    } else {
      disabled_next_input($(this));
    }
  });
  // 检查开关状态
  check_disabled_status();

  // 行为分析
  disabled_next_input($('#analysis-input'));
  $('.choose-all input[type=checkbox]').click(function () {
    if (this.checked) {
      $(this).parents('.choose-all').siblings('.choose-item').find('input[type=checkbox]').each(function () {
        this.checked = true;
      });
    } else {
      $(this).parents('.choose-all').siblings('.choose-item').find('input[type=checkbox]').each(function () {
        this.checked = false;
      });
    }
  });

  $('.choose-block input[type=checkbox]').click(function () {
    console.log($(this).parents('.choose-block').siblings('.choose-content').find('input[type=checkbox]').prop("checked"));
    if ($(this).parents('.choose-block').siblings('.choose-content').children('.sniper-checkbox').children('input[type=checkbox]').prop("checked") == false) {
      $(this).prop('checked',false);
    }
  });

  $('.choose-content input[type=checkbox]').click(function () {
    console.log($(this).prop("checked"));
    if ($(this).prop("checked") == false) {
      $(this).parents('.choose-content').siblings('.choose-block').find('input[type=checkbox]').prop('checked',false);
    }
  });


  // 提权
  disabled_next_input($('#privilege-input'));

  function check_web_process_status($this) {
    var web_process = $('#webprocess-input').val();
    if (web_process == "" && $this.id == 'folder-input') {
      return true;
    }
  }

  function check_disabled_status() {
    //自动保护设计文件
    if (!$(".auto-protect .switchMain-input").prop("checked")) {
      $(".auto-protect-con input,.auto-protect-con select").attr("disabled", "disabled").parents('.auto-protect').addClass('disable');
    }

    // 域名捕获
    if (!$('.name-capture .switchMain-input').prop('checked')) {
      $('.name-capture textarea').attr('disabled', 'disabled').parents('section').addClass('disable');
    }

    //web应用防护
    if (!$(".web-protect .switchMain-input").prop("checked")) {
      $(".web-protect-con input,.web-protect-con textarea, .web-protect-con select").attr("disabled", "disabled").parents('.web-protect').addClass('disable');
    }

    // 文件夹浏览轨迹
    if (!$("#folder-input").prop("checked")) {
      $("#folder-input").parent('div').siblings('textarea').attr('disabled', 'disabled').addClass('disable-textarea');
      $('.monitor input').attr('disabled', 'disabled').addClass('disable-textarea');
    }

    //关键词
    if (!$(".search-skill .switch .searchSkill").prop("checked")) {
      $('.key-table input,.key-table textarea,.radio-one input').attr("disabled", "disabled");
      $('.key-table,.radio-one').addClass('disable');
    }
  }


  $('.search-skill .switch .searchSkill').click(function () {
    if (this.checked) {
      $('.key-table input,.key-table textarea,.radio-one input').prop("disabled", false);
      $('.key-table,.radio-one').removeClass('disable');
    } else {
      $('.key-table input,.key-table textarea,.radio-one input').prop("disabled", "disabled");
      $('.key-table,.radio-one').addClass('disable');
    }
  });


  function disabled_next_input($input) {
    if (!$input.prop('checked')) {
      var $section = $input.parents('section').next('section');
      var $checkbox = $section.find('input[type=checkbox]');
      $checkbox.attr('disabled', 'disabled');
      disabled_input($checkbox);
    }
  }

  function enable_input($input) {
    $input.siblings('.text-info').html("已开启").parent('.switch').addClass("open").removeClass("close");
    $input.next('input[type=hidden]').val(1);
  }

  function disabled_input($input) {
    $input.siblings('.text-info').html("已关闭").parent('.switch').addClass("close").removeClass("open");
    $input.next('input[type=hidden]').val(0);
  }


  $('#folder-input').click(function (event) {
    if (check_web_process_status(this)) {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      layer.msg('请先选择需要监控的web中间件进程!');
      return false;
    }
    if ($(this).prop("checked")) {
      $(this).parent('div').siblings('textarea').removeAttr('disabled').removeClass('disable-textarea');
      $('.monitor input').prop('disabled', false).removeClass('disable-textarea');
    } else {
      $(this).parent('div').siblings('textarea').attr('disabled', 'disabled').addClass('disable-textarea');
      $('.monitor input').attr('disabled', 'disabled').addClass('disable-textarea');
    }

  });

  // 关联全选
  $('.check-box').each(function () {
    var $input_box_list = $(this).find('input[type=checkbox]');
    if ($input_box_list.length == $(this).find('input[type=checkbox]:checked').length) {
      $(this).prev('.multi-select').find('input[type=checkbox]').prop('checked', true);
    }
  });

  // web防护项，单选一项时，自动选择报警

  // 渗透溯源单选，选择主动溯源
  $('#checkWhole').click(function () {
    $(this).checked = !$(this).checked; // fuck ie
    var $traceability_input = $('#traceability-input');
    if ($(this).prop('checked')) {
      enable_input($traceability_input);
    } else {
      disabled_next_input($(this));
    }
  });

  if($('.traceability-trap-con .only:checked').length > 0){
    console.log($('.traceability-trap-con .only:checked').length);
    $('#traceability-input').prop('disabled', true);

  }else{
    $('#traceability-input').prop('disabled', false);
  }

  $('.traceability-trap-con .check-box input[type=checkbox]').change(function () {
    var count = $(this).parents('section').find('input[type=checkbox]:checked').length;
    var $traceability_input = $('#traceability-input');
    var hidden_value = $traceability_input.next('input[type=hidden]').val();
    if ($(this).prop('checked')) {
      $traceability_input.prop('disabled', false);
      hidden_value = parseInt(hidden_value);
      if (hidden_value == 0) {
        enable_input($traceability_input);
      }
    } else {
      if (count < 1) {
        disabled_next_input($(this));
      }
    }
    if($('.traceability-trap-con .only:checked').length > 0){
      console.log($('.traceability-trap-con .only:checked').length);
      $traceability_input.prop('disabled', true);
    }else{
      $traceability_input.prop('disabled', false);
    }
  });



  // 数字输入框
  $('.num-input').keyup(function () {
    var value = $(this).val();
    value = value.replace(/[^\d]/g, '')
    $(this).val(value);
  });

  $('.domain-input').change(function () {
    var reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    var lines = $(this).val();
    $(this).val(verfiy_line(lines, reg));
  });

  $('.ip-address-input').change(function () {
    var content = $(this).val();
    $(this).val(verfiy_line(content));
  });

  function isIP2(ip) {
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return re.test(ip);
  }

  function verfiy_line(content, reg) {
    var lines = content.split("\n");
    var content = '';
    for (var i = 0; i < lines.length; i++) {
      if (isIP2(lines[i])) {
        content += lines[i] + "\n";
      }else if(reg && reg.test(lines[i])){
        content += lines[i] + "\n";
      }
    }
    if (content != "") {
      content = content.trim();
    }
    return content.trim();
  }

  // // 全选OR取消全选
  $('.all').click(function () {
    if (this.checked) {
      $(this).parents('.multi-select').siblings('.check-box').children('div.pull-left').children('div.sniper-checkbox').children('input.only').each(function () {
        this.checked = true;
      });
    } else {
      $(this).parents('.multi-select').siblings('.check-box').children('div.pull-left').children('div.sniper-checkbox').children('input.only').each(function () {
        this.checked = false;
      });
    }
  });


  // 没有选中时要取消+++++++++++s++++++++全选时，全选框要选中
  $('.only').click(function () {
    if (!$(this).checked) {
      $(this).parents('.check-box').siblings('.multi-select').children('.sniper-checkbox').children('.all').prop("checked", false);
    }
    var chsub = $(this).parents('.check-box').find('.only').length; //获取subcheck的个数
    var checkedsub = $(this).parents('.check-box').find("input.only:checked").length; //获取选中的subcheck的个数
    if (checkedsub == chsub) {
      $(this).parents('.check-box').siblings('.multi-select').children('.sniper-checkbox').children('.all').prop("checked", true);
    }
  });

  $(document).on('click', '.setting_save', function (event) {
    event.preventDefault();
    var host_id = $('#now_host').val();
    $(".auto-protect-con input, .auto-protect-con select").removeAttr('disabled');
    $(".web-protect-con input, .web-protect-con textarea, .web-protect-con select").removeAttr('disabled');
    $(".name-capture-con textarea").removeAttr('disabled');

    var json_data = $('#strategy_form').serializeJSON();
    // var router_id = $('#group').val();
    var router_id = $(this).parent().find('select').val();
    var url = baseURL('/api/hosts/');
    if (router_id == 'one') {
      url = url + host_id + '/rule/';
    } else if (router_id == 'all') {
      url = url + 'all/rule/';
    } else {
      url = url + 'router/' + router_id + '/rule/';
    }

    $.post(url, json_data, function (msg) {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      if (msg.ret == 'success') {
        layer.msg('设置成功!');
      } else {

        layer.msg('设置失败!');
      }
    });

    check_disabled_status();
  });

  // 统一应用配置
  $(document).on('click', '#confirmAdd', function (event) {
    event.preventDefault();
    var host_id = $('#now_host').val();
    $(".auto-protect-con input, .auto-protect-con select").removeAttr('disabled');
    $(".web-protect-con input, .web-protect-con textarea, .web-protect-con select").removeAttr('disabled');
    $(".name-capture-con textarea").removeAttr('disabled');

    var json_data = $('#strategy_form').serializeJSON();
    var router_id = $(this).parent().prev().find('select').val();
    var url = baseURL('/api/hosts/');
    url = url + 'router/' + router_id + '/rule/';

    $.post(url, json_data, function (msg) {
      if (msg.ret == 'success') {
        require('../lib/layer/skin/layer.css');
        const layer = require('layer');
        layer.msg('设置成功!');
      }
    });
  });

  // 下拉列表
  require.ensure([], (require) => {
    require('../lib/select/select2.css');
    const select2 = require('select2');
    $('.sel-1 select,.sel-preset, #areaName,#monitorWeb').select2({
      minimumResultsForSearch: Infinity
    });
  });

  $('.auto-protect-con .switch').click(function () {
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      var file_type_list = $('input[name=file\\[epl\\]\\[type\\]]').val();
      if (file_type_list == '') {
        layer.msg('请先填写设计文件类型!');
        $(this).children('input[type=checkbox]').attr('disabled', true);
        return;

      } else {
        $(this).children('input[type=checkbox]').attr('disabled', false);
      }
    });

  });

  $('#keyword_btn').click(function () {
    if ($(this).prop('checked')) {
      $(this).parent().next("input[type=hidden]").val(1);
    } else {
      $(this).parent().next("input[type=hidden]").val(0);
    }

  });

  // 重命名
  // $('.tem-info').on('click','.tem-name-icon i',function () {
  //   let $hostName = $(this).parents(".tem-name-icon").siblings('.tem-name-input');
  //   console.log($hostName);
  //   let curVal = $hostName.html();
  //   console.log(curVal);
  //   let $input = $(`<input id="rename-input" type="text" value=${curVal}>`);
  //   $hostName.html($input);
  //   $input.select();
  // });
  //
  // $(document).on('blur', '#rename-input', function () {
  //   let newHostName = $(this).val();
  //   if(newHostName !=''){
  //     $(this).parents(".tem-name-input").text(newHostName).show();
  //     $(this).remove();
  //   }
  // }).on('keyup', '#rename-input', function (e) {
  //   if (e.keyCode === 13) {
  //     $(this).blur();
  //   }
  // });

  /*
   if ($('input[name=check-choose]').length != $('input[name=check-choose]:checked').length) {
   $('#checkAll').prop('checked', false);
   } else {
   $('#checkAll').prop('checked', true);
   }

   */
});
