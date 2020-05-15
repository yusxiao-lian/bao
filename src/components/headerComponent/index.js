import headerTab from './headerTab'
import headerSearch from './headerSearch'
export const HeaderTab= {
  install:(Vue)=>{
    Vue.component('headerTab', headerTab)
  }
}
export const HeaderSearch= {
  install:(Vue)=>{
    Vue.component('headerSearch', headerSearch)
  }
}
