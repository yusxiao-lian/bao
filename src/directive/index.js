//解决ios输入框键盘弹出被遮挡的页面一直滚动指令
const inputScroll={
  bind:function (el, binding) {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS){
      let interval=null;
      el.addEventListener('focus',v=>{
        interval = setInterval(function () {
          document.body.scrollTop = document.body.scrollHeight;
        },200)
      })
      el.addEventListener('blur',v=>{
        clearInterval(interval);
      })
    }
    window.addEventListener('touchmove',()=>{
      el.blur()
    })
  }
}
//设置横向滚动父元素的宽度
const setScrollWidth = {
  bind:(el, binding)=>{
    if(binding.value>0){
      setTimeout(v=>{
        el.style.width=el.children[0].offsetWidth*binding.value+5+'px'
      },200)
    }
  },
  update:(el, binding)=>{
    if(binding.value!=binding.oldValue){
      if(binding.value>0){
        setTimeout(v=>{
          el.style.width=el.children[0].offsetWidth*binding.value+5+'px'
        },200)
      }else {
        el.style.width='0px'
      }
    }
  }
}
export {
  inputScroll,
  setScrollWidth
}
