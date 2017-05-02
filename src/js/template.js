const $ = require('jquery');
require('./public.js');
require('jsTree');
const baseURL = require('baseURL');
$(function () {

  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('#group-tree,.object-bd').perfectScrollbar({
      useSelectionScroll: true
    });
  });

  // 模态框弹出
  $('.temp-list li .btn-set').click(function () {
    require.ensure([], (require) => {
      require('../lib/jquery-modal/jquery.modal.css');
      require('jqueryModal');
      $("#temp-modal").modal({
        closeClass: 'close-icon',
        closeText: '&times;',
        fadeDuration: 300,
        fadeDelay: 0.5
      });

      // 清空选中状态
      let groupTreeIns = $('#group-tree').jstree(true);
      groupTreeIns.uncheck_node(
        groupTreeIns.get_checked()
      )

      // 清空设置对象
      $('#object-list li').remove();
    });
  });

  // 分组结构树
  $('#group-tree').jstree({
    'core': {
      'animation': 0,
      'check_callback': true,
      'themes': {'stripes': false}
    },
    'types': {
      '#': {
        'max_children': 100,
        'max_depth': 100,
        'valid_children': ['root']
      },
      'root': {
        'icon': '/static/3.3.3/assets/images/tree_icon.png',
        'valid_children': ['default']
      },
      'default': {
        'valid_children': ['default', 'file']
      },
      'file': {
        'icon': 'glyphicon glyphicon-file',
        'valid_children': []
      }
    },
    'plugins': ['dnd', 'search', 'state', 'types', 'checkbox']
  });

  // 分组树搜索
  var to = false;
  $('#groupTreeSearch').keyup(function () {
    if (to) {
      clearTimeout(to);
    }
    to = setTimeout(function () {
      var v = $('#groupTreeSearch').val();
      $('#group-tree').jstree(true).search(v);
    }, 250);
  });

  // 添加设置对象
  $('#temp-modal .arrow-icon').click(function () {
    let nameList = '';
    $('#group-tree li[aria-selected="true"]').each(function () {
      if ($(this).find('ul').length == 0) {
        let thisName = $(this).find('span').text();
        nameList += `<li class="clearfix">` +
          `<span class="pull-left">${thisName}</span>` +
          `<i class="iconfont pull-right">&#xe65e;</i>` +
          `</li>`;
      }
    });

    $('#object-list').html(nameList);
  });

  // 删除分享对象
  $('#object-list').on('click', 'li i', function () {
    $(this).parent('li').remove();
  });

  // 清空设置对象
  $('#temp-modal .clear-btn').click(function () {
    $('#object-list li').remove();
  });

  // 删除模板
  $('.temp-list').on('click','li .btn-del',function (index) {
    let $self = $(this);
    require.ensure([], (require) => {
      require('../lib/layer/skin/layer.css');
      const layer = require('layer');
      layer.confirm('确定删除该模板？', {
        btn: ['确定', '取消']
      }, function () {
        $self.parents('li').remove();
        layer.msg('模板删除成功！');
      });
    });

  });

});