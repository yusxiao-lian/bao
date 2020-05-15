import QRcode from './QRcodeShare.vue'

const QRcodeShare = {
  install: function(Vue){
    Vue.prototype.QRcodeShare = function (options, shareAble=true){
      var MyComponent = Vue.extend(QRcode)
      var component = new MyComponent().$mount()
      let flag=true
      for (let key in document.body.children){
        if(document.body.children[key].id=='QRcodeShare'){
          flag=false
        }
      }
      if(flag){
        document.body.appendChild(component.$el)
      }
      if(options){
        component.options=options
        component.shareAble=shareAble;  //是否显示分享按钮，主要是放行条和我的二维码有所区别
      }
      component.close=()=>{
        for (let key in document.body.children){
          if(document.body.children[key].id=='QRcodeShare'){
            document.body.removeChild(document.body.children[key])
          }
        }
      }
    };
  }
}
export default QRcodeShare
