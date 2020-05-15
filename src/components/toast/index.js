import toast from './toast.vue'

const Toast = {
  install: function(Vue){
    Vue.prototype.Toast = function (params,options){
      var MyComponent = Vue.extend(toast)
      var component = new MyComponent().$mount()
      document.body.appendChild(component.$el)
      if(params){
        component.text=params
      }
      let time = setTimeout(v=>{
        document.body.removeChild(component.$el)
        clearTimeout(time)
        time=null
      },4000)
    };
  }
}

// 导出组件
export default Toast

