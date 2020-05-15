import footerBtn from './footerBtn.vue'
import commodityFooter from './commodityFooter.vue'
export const CommodityFooter={
  install:(Vue)=>{
    Vue.component('commodityFooter',commodityFooter)
  }
}
export const FooterBtn={
  install:(Vue)=>{
    Vue.component('footerBtn',footerBtn)
  }
}


