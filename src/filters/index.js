//过滤购物车数量大于9的显示
const goodsNumberFilter = (value)=>{
  return value>9?'9+':value
}
export {
  goodsNumberFilter
}
