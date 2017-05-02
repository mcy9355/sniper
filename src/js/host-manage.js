const $ = require('jquery');
require('./public');
const baseURL = require('baseURL');

$(document).ready(function () {

  var refresh_id;

  function getHashStringArgs() {
    //取得查询的hash，并去除开头的#号
    var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : ""),
    //保持数据的对象
      hashArgs = {},
    //取得每一项hash对
      items = hashStrings.length > 0 ? hashStrings.split("&") : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length;
    //逐个将每一项添加到hashArgs中
    for (i = 0; i < len; i++) {
      item = items[i].split("=");
      name = decodeURIComponent(item[0]);
      value = decodeURIComponent(item[1]);
      if (name.length > 0) {
        hashArgs[name] = value;
      }
    }
    return hashArgs;

  }

  var hash_object = getHashStringArgs();
  var current_host;

  // 分组展开收起
  $('#group-box').on('click', '.group-list >li >.group-item', function () {
    var $group = $(this).parent();
    if ($group.hasClass('open')) {
      $group.removeClass('open');
      $group.children('.host-list').addClass('hide');
    } else {
      $group.addClass('open');
      $group.children('.host-list').removeClass('hide');
    }
  });

  // 重命名
  $('#host-menu')
    .on('click', 'i.edit-btn', function () {
      let thisInput = $(this).siblings('.group-info').children('.rename-input').length;
      if(thisInput < 1){
        let $groupName = $(this).siblings('.group-info').children('.group-name');
        let curVal = $groupName.text();
        let $input = $(`<input class="rename-input pull-left" type="text" value=${curVal}>`);
        $(this).siblings('.group-info').children('.group-host-num').before($input);
        $input.select();
        $groupName.hide();
      }
    })
    .on('blur', '.group-info .rename-input', function (event) {
      let newGroupName = $(this).val();
      if (newGroupName != '') {
        var $self = $(this);
        var url = baseURL('/api/hosts/router/');
        var router_id = $(this).parent().data('id');
        url = url + router_id;
        require.ensure([], (require) => {
          require('../lib/layer/skin/layer.css');
          const layer = require('layer');
          $.post(url, 'name=' + newGroupName, function (data) {
            if (data.ret == 'success') {
              $('#host-menu .group-info').each(function () {
                if($(this).data('id') == router_id){
                  $(this).children('.group-name').text(newGroupName);
                }
              });
              layer.msg('修改成功!');
            } else {
              layer.msg(data.msg);
              event.stopPropagation();
            }
            $self.siblings('.group-name').show();
            $self.remove();
          }, 'json');

        });
      } else {
        $(this).siblings('.group-name').show();
        $(this).remove();
      }
    })
    .on('keyup', '.group-info .rename-input', function (event) {
      if (event.keyCode === 13) {
        $(this).blur();
      }
    });

  function show_iframe(index) {
    var node = document.getElementsByTagName('iframe')[index];
    node.style.display = 'block';
  }

  function _show_iframe(index) {
    return function () {
      show_iframe(index);
    }
  }

  // tab切换  测试完成后恢复
  // $("#nav-details li").click(function () {
  //   $(this).addClass('active').siblings().removeClass('active');
  //   var curIndex = $(this).index();
  //   if (current_host) {
  //     var url = baseURL('/hosts/' + current_host + '/');
  //     if (curIndex == 0) {
  //       $('#host-iframe').attr('src', url);
  //     } else if (curIndex == 1) {
  //       $('#logs-iframe').attr('src', url + 'logs/');
  //     } else if (curIndex == 2) {
  //       $('#rule-iframe').attr('src', url + 'rule/');
  //     }
  //     $(this).parent().parent().nextAll('.iframe-content').each(function (index, el) {
  //       if (curIndex == index) {
  //         setTimeout(_show_iframe(index), 100);
  //       } else {
  //         $(this).hide();
  //       }
  //     });
  //   }
  // });

  // 前端测试代码（完成后删除）
  $("#nav-details li").click(function () {
    $(this).addClass('active').siblings().removeClass('active');

    var curIndex = $(this).index();
    $(this).parent().parent().nextAll('.iframe-content').each(function (index, el) {
      if (curIndex == index) {
        $(this).show();
      }
      else {
        $(this).hide();
      }
    });
  });

  // 筛选主机
  $('.filter-btn').click(function () {
    let $hostType = $('#host-menu .host-list li .sprite');
    if ($(this).hasClass('filter-btn-danger')) {
      if ($(this).hasClass('active-danger-btn')) {
        $(this).removeClass('active-danger-btn');
        $hostType.parent().show();
      } else {
        $(this).addClass('active-danger-btn')
          .siblings().removeClass('active-safe-btn')
          .removeClass('active-outline-btn');
        $hostType.each(function () {
          if ($(this).hasClass('sprite-outlineHost') || $(this).hasClass('sprite-safeHost') || $(this).hasClass('sprite-safeHost-warn')) {
            $(this).parent().hide();
          } else if ($(this).hasClass('sprite-dangerHost') || $(this).hasClass('sprite-dangerHost-warn')) {
            $(this).parent().show();
          }
        });
      }
    } else if ($(this).hasClass('filter-btn-safe')) {
      if ($(this).hasClass('active-safe-btn')) {
        $(this).removeClass('active-safe-btn');
        $hostType.parent().show();
      } else {
        $(this).addClass('active-safe-btn')
          .siblings().removeClass('active-danger-btn')
          .removeClass('active-outline-btn');
        $hostType.each(function () {
          if ($(this).hasClass('sprite-outlineHost') || $(this).hasClass('sprite-dangerHost') || $(this).hasClass('sprite-dangerHost-warn')) {
            $(this).parent().hide();
          } else if ($(this).hasClass('sprite-safeHost') || $(this).hasClass('sprite-safeHost-warn')) {
            $(this).parent().show();
          }
        });
      }
    } else {
      if ($(this).hasClass('active-outline-btn')) {
        $(this).removeClass('active-outline-btn');
        $hostType.parent().show();
      } else {
        $(this).addClass('active-outline-btn')
          .siblings().removeClass('active-danger-btn')
          .removeClass('active-safe-btn');
        $hostType.each(function () {
          if ($(this).hasClass('sprite-safeHost') || $(this).hasClass('sprite-safeHost-warn') || $(this).hasClass('sprite-dangerHost') || $(this).hasClass('sprite-dangerHost-warn')) {
            $(this).parent().hide();
          } else if ($(this).hasClass('sprite-outlineHost')) {
            $(this).parent().show();
          }
        });
      }
    }
  });

  // 标记关键服务器
  $('.group-list').on('click', '.host-list li .star', function (e) {
    e.stopPropagation();
    change_star_status($(this));
  });


  $('#search-result').on('click', 'li, .star', function (e) {
    e.stopPropagation();
    change_star_status($(this));
  });

  function change_star_status($self) {
    var status = 0;
    if ($self.hasClass('icon-star-off')) {
      $self.removeClass('icon-star-off').addClass('icon-star-on');
      status = 1;
    } else {
      $self.removeClass('icon-star-on').addClass('icon-star-off');
    }
    var pk = $self.parents('li').data('id');
    var url = baseURL('/api/hosts/' + pk);


    $.post(url, 'is_favorites=' + status, function (data) {

    }, 'json');
  }

  // 切换主机
  $('.group-list').on('click', '.host-list li', function (e) {
    var now_host = $(this).data('id');
    var ip_address = $(this).find('.host-ip').html();
    if (now_host) {
      switch_host(now_host);
      document.location.hash = '#ip_address=' + ip_address;
    }
    // $('.host-list li').removeClass('active');
    // $(this).addClass('active');
  });


  function switch_host(pk) {
    var url = baseURL('/hosts/' + pk + '/');
    var tab_index = $('#nav-details li.active').index();
    current_host = pk;
    if (tab_index == 0) {
      $('#host-iframe').attr('src', url);
    } else if (tab_index == 1) {
      $('#logs-iframe').attr('src', url + 'logs/');
    } else if (tab_index == 2) {
      $('#rule-iframe').attr('src', url + 'rule/');
    }
    $('#host-menu .host-list li').removeClass('active');
    $('#host-menu .host-list li').each(function (index, item) {
      if ($(this).data('id') == pk) {
        $(this).addClass('active');
      }
    });
    show_title();
  }

  get_router_server();

  function get_router_server(router_id) {
    var url = baseURL('/api/hosts/router/');
    if (router_id) {
      url += router_id + '/';
    } else {
      url += '?type=full';
    }
    $.get(url, function (data) {
      var temp_html = '';
      var rows_index = 0;
      if (data.rows) {
        $('.filter-btn-danger .num').html(data.status.danger);
        $('.filter-btn-safe .num').html(data.status.safe);
        $('.filter-btn-outline .num').html(data.status.outline);

        $.each(data.rows, function (index, item) {
          if (index == 0) {
            temp_html += '<li class="open" data-id=' + item.id + '>';
          } else {
            temp_html += '<li data-id=' + item.id + '>';
          }
          temp_html += '<div class="group-item clearfix">';
          temp_html += '<i class="icon-arrow iconfont pull-left">&#xe62b;</i>';
          temp_html += '<span class="group-info pull-left clearfix" data-id=' + item.id + '>';
          temp_html += '<span class="group-name">' + item.name + '</span>';
          temp_html += '<span class="group-host-num" data-count=' + item.count + '>(' + item.count + ')</span>';
          temp_html += '</span><i class="edit-btn iconfont pull-right">&#xe605;</i></div>';

          var server_html = '';
          if (index == 0) {
            server_html += get_server_info(item.hosts, true);
          } else {
            server_html += get_server_info(item.hosts, false);
          }
          if (server_html.indexOf('<li class') > -1) {
            rows_index += 1;
          }
          temp_html += server_html;
          temp_html += '</li>';
        });
      }
      if (rows_index == 0) {
        var url = baseURL('/hosts/empty/');
        $('#host-iframe').attr('src', url);
      }
      $('.group-list').html(temp_html);


      hashResetHostRouter();
    }, 'json');
  }

  function get_server_info(data, flag = true) {
    var html_content = '';
    if (flag) {
      html_content = '<ul class="host-list">';
    } else {
      html_content = '<ul class="host-list hide">';
    }

    var length = data.length;

    for (var i = 0; i < length; i++) {
      var item = data[i];
      var active = '';

      if (i == 0 && flag) {
        active = 'active';
        switch_host(item.id);
      }

      html_content += get_host_item_html(item, active);
    }

    html_content += '</ul>';
    return html_content;
  }


  function get_host_item_html(item, active = '') {
    var status_css = 'outlineHost';
    var status_css_list = ['', 'outlineHost', 'safeHost', 'dangerHost'];
    status_css = status_css_list[item.status];
    if (!item.lst_status && item.status != 1) {
      status_css += '-warn';
    }
    var stat_css = item.is_favorites ? 'icon-star-on' : 'icon-star-off';
    var html_content = '';

    html_content += '<li class="' + active + ' clearfix" data-id="' + item.id + '">';
    html_content += '<i class="sprite sprite-' + status_css + '"></i>';
    html_content += '<div class="host-info"><span class="host-name">' + item.remark + '</span>';
    html_content += '<span class="host-ip">' + item.ip_address + '</span></div>';
    html_content += '<i class="star iconfont ' + stat_css + '"></i>';
    html_content += '</li>';

    return html_content;
  }


  // 滚动条样式
  require.ensure([], (require) => {
    require('../lib/jquery.perfect-scrollbar/perfect-scrollbar.min.css');
    require('scrollbar');
    $('.group-list,#search-result').perfectScrollbar({
      useSelectionScroll: true
    });
  });

  // 搜索主机
  // 定义搜索主机
  let $searchInput = $('#group-box .search-box input');
  let $searchIcon = $('#group-box .search-box button i');
  let $hostName = $('#host-menu .host-list .host-name');
  let $hostIp = $('#host-menu .host-list .host-ip');
  let $hostInfo = $('div.host-info');
  // 获取焦点时展开下拉菜单并且切换按钮
  $searchInput.focus(function (event) {
    event.stopPropagation();
    $('#search-result').show();
    $searchIcon.addClass('icon-del-search').removeClass('icon-search');
  });

  // 搜索按钮显示效果切换
  $('#group-box .search-box button').click(function () {
    if ($searchIcon.hasClass('icon-del-search')) {
      $searchIcon.addClass('icon-search').removeClass('icon-del-search');
      $(this).siblings('input').val('');
    }
  });
  // 防止事件冒泡
  $searchInput.click(function (e) {
    e.stopPropagation();
  });

  // 实时搜索主机
  $('#group-box .search-box').bind('input propertychange', function () {
    // 获取value值
    var value = $('#group-box .search-box input').val();
    var url = baseURL('/api/hosts/');
    var params = {
      search: value,
      start: 0,
      length: 10
    };
    var searchHtml = '';
    // ajax传值
    $.get(url, params, function (data) {
      if (data.rows) {
        $.each(data.rows, function (i, item) {
          searchHtml += get_host_item_html(item);
        });
        $('#search-result').children('li').remove();
        $('#search-result').html(searchHtml);
        $('#search-result').show();
      }
    }, 'json');
  });

  // 切换搜索列表主机
  $('#search-result').on('click', 'li', function (event) {
    event.stopPropagation();
    var pk = $(this).data('id');
    if (pk) {
      switch_host(pk);
    }
  });

  // 点击其他地方隐藏下拉菜单
  $(document).click(function () {
    $('#search-result').hide();
  });

  // 主机管理滚动加载
  let $groupList = $('.group-list');
  let $titleTop = $('#title-top');

  $titleTop.click(function (e) {
    let groupID = $titleTop.data('group');
    let $groupItem = $(this).siblings('.group-list').find('.group-item');
    $groupItem.each(function (i, el) {
      if (groupID === $(this).parent().data('id')) {
        $(this).click();
        if ($(this).parent().hasClass('open')) {
          $titleTop.addClass('open');
        } else {
          $titleTop.removeClass('open');
        }
      }
    });
  });


  $('#auto-refresh-page').click(function () {
    if ($(this).prop('checked')) {
      refresh_id = setInterval(function () {
        get_router_server();
      }, 6000);
    } else {
      if (refresh_id > 0) {
        clearInterval(refresh_id);
      }
    }
  });

  function show_title() {
    var scrollTop = $groupList.scrollTop();
    var isShowTitle = false;
    let $groupItem = $groupList.find('.group-item');
    $groupItem.each(function (i, el) {
      if (scrollTop > this.offsetTop) {
        isShowTitle = true;
        $titleTop.find('.group-name').text($(this).find('.group-name').text());
        $titleTop.find('.group-host-num').text($(this).find('.group-host-num').text());
        $titleTop.find('.group-info').data('id', $(this).find('.group-info').data('id'));
        $titleTop.data('group', $(this).parent().data('id'));
        if ($(this).parent().hasClass('open')) {
          $titleTop.addClass('open');
        } else {
          $titleTop.removeClass('open');
        }
      }
    });

    if (isShowTitle) {
      $titleTop.show();
    }
    else {
      $titleTop.hide();
    }
  }

  function auto_scroll() {
    $groupList.scroll(function () {
      show_title();
      $titleTop.css({
        'left': $groupList.offset().left + 'px',
        'top': $groupList.offset().top + 'px'
      });
    });
  }

  function hashResetHostRouter() {
    var pk;
    if ('id' in hash_object) {
      var value = parseInt(hash_object.id);
      $('#host-menu .group-list >li').each(function () {
        if (value == $(this).data('id')) {
          $(this).addClass('open').siblings().removeClass('open');
          $(this).children('.host-list').removeClass('hide');
          $(this).siblings().children('.host-list').addClass('hide');
          $('.group-list .host-list >li').removeClass('active');
          $(this).children('.host-list').children('li:first').addClass('active');

          pk = $(this).children('.host-list').children('li:first').data('id');
        }
      });
    } else if ('ip_address' in hash_object) {
      var value = hash_object.ip_address;
      $('#host-menu .host-list .host-ip').each(function () {
        if ($(this).text() == value) {
          $(this).parent().parent()
            .addClass('active')
            .siblings().removeClass('active')
            .parent().parent().addClass('open')
            .siblings().removeClass('open');
          $(this).parents('ul').removeClass('hide').parent().siblings().children('ul').addClass('hide');
          pk = $(this).parents('li').data('id');
        }
      });
    }
    if (pk) {
      switch_host(pk);
    }
    auto_scroll();
  }
});
