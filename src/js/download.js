const $ = require('jquery');
$(document).ready(function () {
  // tab切换
  for (var i = 0; i < $('.tabClick li').length; i++) {
    $('.tabClick li')[i].start = i;
    $('.tabClick li').click(function () {
      $(this).addClass('active').siblings('li').removeClass('active'); // 标题切换效果
      $('.lineDiv')[0].style.transform = 'translate3d(' + $('#wrap').width() / $('.tabClick li').length * (this.start) + 'px,0,0)'; // 滑动效果
      $('#' + $('.version')[this.start].id).removeClass('hide').siblings('.version').addClass('hide'); // 隐藏与显示
    });
  }
});
