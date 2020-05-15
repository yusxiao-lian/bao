import Vue from "vue";
//解决ios输入框键盘弹出被遮挡的页面滚动指令
Vue.directive("inputScroll", {
  bind: function(el, binding) {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let interval = null;
    el.addEventListener("focus", v => {
      let boxEl = document.getElementById("register");
      setTimeout(() => {
        boxEl.scrollTop = 100;
      }, 400);
      //alert( document.body.clientHeight)
      // if (document.body.scrollTop < 2) {
      //   document.body.scrollTop = document.body.scrollHeight / 2;
      // }
      // interval = setInterval(function () {
      // console.log(document.body.scrollTop,'uuuuuuuuuuu')
      // if(document.body.scrollTop<1){
      //   document.body.scrollTop = document.body.scrollHeight;
      // }
      // },200)
    });
    el.addEventListener("blur", v => {
      clearInterval(interval);
      document.body.scrollTop = 0;
    });
    // window.addEventListener('touchmove',()=>{
    //   el.blur()
    // })
  }
});
//设置横向滚动父元素的宽度
Vue.directive("setScrollWidth", {
  bind: (el, binding) => {
    if (binding.value > 0) {
      Vue.nextTick(v => {
        el.style.width = el.children[0].offsetWidth * binding.value + 5 + "px";
      });
    }
  },
  update: (el, binding) => {
    if (binding.value != binding.oldValue) {
      if (binding.value > 0) {
        Vue.nextTick(v => {
          el.style.width =
            el.children[0].offsetWidth * binding.value + 5 + "px";
        });
      } else {
        el.style.width = "0px";
      }
    }
  }
});

//设置竖向滚动父元素的宽度
Vue.directive('setScrollHeight',{
  bind: (el, binding) => {
    let screenHeight = document.body.offsetHeight;
    let t = setTimeout(v => {
      el.style.height = screenHeight - el.getBoundingClientRect().y - 1 + "px";
      binding.value.fn();
      clearTimeout(t)
      t=null
    }, 600);
  },
})

