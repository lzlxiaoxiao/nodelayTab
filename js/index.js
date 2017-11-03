
$(document).ready(function(){
  var sub = $('#sub');
  var activeRow, activeMenu, timer;
  var mouseInSub = false;

  sub.on('mouseenter',function(){
    mouseInSub = true;
  }).on('mouseleave',function(){
    mouseInSub = false;
  })

  var mouseTrack = [];

  var moveHandler = function(e){
    mouseTrack.push({
      x:e.pageX,
      y:e.pageY
    })
    if(mouseTrack.length > 3){
      mouseTrack.shift()
    }
  }

  $('#test')
    .on('mouseenter',function(){
      sub.removeClass('none');
      $(document).bind('mousemove',moveHandler);
    })
    .on('mouseleave',function(){
      sub.addClass('none');

      if(activeRow){
        activeRow.removeClass('active');
        activeRow = null;
      }

      if(activeMenu){
        activeMenu.addClass('none');
        activeMenu = null;
      }

      //解绑
      $(document).unbind('mousemove',moveHandler);
    })

    .on('mouseenter','li',function(e){
      if(!activeRow){
        activeRow = $(e.target).addClass('active');
        activeMenu = $('#'+activeRow.data('id'));
        activeMenu.removeClass('none');
        return;
      }

      //清除
      if(timer){
        clearTimeout(timer);
      }

      //鼠标当前坐标
      var  currMousePos = mouseTrack[mouseTrack.length - 1];
      //上次的坐标
      var leftCorner = mouseTrack[mouseTrack.length-2];
      var delay = needDelay(sub,leftCorner,currMousePos);
      if(delay){
        // 时间触发，设置一个缓冲期
        timer = setTimeout(function(){
          //判断
          if(mouseInSub){
            return;
          }
          activeRow.removeClass('active');
          activeMenu.addClass('none');

          activeRow = $(e.target);
          activeRow.addClass('active');
          activeMenu = $('#'+ activeRow.data('id'));
          activeMenu.removeClass('none');

          timer = null
        }, 300)
      }else{
        var prevActiveRow = activeRow;
        var prevActiveMenu = activeMenu;

        activeRow = $(e.target);
        activeMenu = $('#' + activeRow.data('id'));

        prevActiveRow.removeClass('active');
        prevActiveMenu.addClass('none');

        activeRow.addClass('active');
        activeMenu.removeClass('none');
      }
    })
})

function sameSign(a,b){
  // a或b大于0，说明符号是相同的
  return (a ^ b) >= 0;
}

// 向量
function vector(a,b){
  return{
    x:b.x - a.x,
    y:b.y - a.y
  }
}

// 向量叉乘结果  如果方向一致则鼠标在三角形内
function vectorProduct(v1,v2){
  return v1.x * v2.y - v2.x * v1.y;
}

function isPointInTrangle(p,a,b,c){
  var pa = vector(p,a);
  var pb = vector(p,b);
  var pc = vector(p,c);

  var t1 = vectorProduct(pa,pb);
  var t2 = vectorProduct(pb,pc);
  var t3 = vectorProduct(pc,pa);

  return sameSign(t1,t2) && sameSign(t2,t3);
}

function needDelay(elem,leftCorner,currMousePos){
  var offset = elem.offset();

  var topLeft = {
    x:offset.left,
    y:offset.top
  }

  var bottomLeft = {
    x:offset.left,
    y:offset.top + elem.height()
  }

  return isPointInTrangle(currMousePos,leftCorner,topLeft,bottomLeft);
}
