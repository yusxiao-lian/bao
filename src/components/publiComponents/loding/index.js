import loding from './loding.vue'


// 导出组件
export default {
  install: function(Vue){
    Vue.prototype.Loding =  (params,options)=>{
      let MyComponent = Vue.extend(loding)
      let component = new MyComponent().$mount()
      document.body.appendChild(component.$el)
      // if(params){
      //   component.text=params
      // }
     /* let time = setTimeout(v=>{
        document.body.removeChild(component.$el)
        clearTimeout(time)
        time=null
      },1000)*/
      component.hide=()=>{
        document.body.removeChild(component.$el)
      }
     return component
    };
  }
}
