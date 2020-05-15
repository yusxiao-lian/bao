import {axiosGet, axiosFormDataPost, axiosPost, axiosFormDataPost_, axiosPost_} from '../axiosUtils.js';

//首页轮播
export const getMainLunbo = async (params) => {
  let url = '/avoidLogin/appShop/getBanner'
  return await axiosPost(url, params)
}

/*购物车*/
//获取购物车信息
export const getShoppingCart = async () => {
  let url = '/web/cartMgt/findcarts'
  return await axiosPost(url)
}

//商品列表
export const getGoodsList = async (params) => {
  let url = '/avoidLogin/appShop/productList'
  return await axiosPost(url, params)
}

//产品分类
export const getGoodsType = async (params) => {
  let url = '/avoidLogin/appShop/getShopProductCategory'
  return await axiosPost(url, params)
}


//判断员工
export const judgeStaff = async () => {
  let url = `/avoidLogin/appShop/employee`
  return await axiosPost(url)
}


//访客门禁二维码
export const getMenQrcode = async (params) => {
  let url = `/comm/appInterface/getVisitorEntranceQRCode`
  return await axiosGet(url, params)
}


// 获取商品分类
export const externalMerchantList = async (params) => {
  let url = `/avoidLogin/appShop/externalMerchantList`
  return await axiosPost(url, params)
}

/*获取社区列表
cityName；
appType：yezhuApp
communityType：notparks
*/
export const getCommunityList = async(params)=>{
  let url = '/comm/appInterface/communityList'
  return await axiosPost(url,params)
}






