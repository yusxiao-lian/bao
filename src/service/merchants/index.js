import {axiosGet, axiosHeaderTokenGet, axiosPost} from '../axiosUtils.js'

// 获取首页配置
export const getBasicSetting = async (params) => {
  let url = '/comm/appInterface/homePageData';
  return await axiosGet(url, params);
}

// 获取首页信息
export const getBasicInfo = async (params) => {
  let url = '/comm/appInterface/indexData';
  return await axiosGet(url, params);
}

// 获取热门商户
export const popularMerchants = async (params) => {
  let url = '/avoidLogin/appShop/externalMerchantList';
  return await axiosGet(url, params);
}

// 获取是否有门禁
export const entrance = async (params) => {
  let url = '/comm/appInterface/haveEntrance'
  return await axiosGet(url, params)
}

// 获取是否有物业电话
export const comPhone = async (params) => {
  let url = '/comm/appInterface/communityConvenience'
  return await axiosGet(url, params)
}

// 获取周边商家和便民服务
export const communityConvenience = async (params) => {
  let url = '/comm/appInterface/communityConvenience'
  return await axiosPost(url, params)
}

// 获取管家列表
export const myHousekeeper = async (params) => {
  let url = '/comm/appInterface/myHousekeeper'
  return await axiosPost(url, params)
}

// 获取通知公告列表
export const newNoticeList = async (params) => {
  let url = '/comm/appInterface/newNoticeList'
  return await axiosPost(url, params)
}


// 获取通知公告列表
export const noticeDetail = async (params) => {
  let url = '/comm/appInterface/noticeDetail'
  return await axiosPost(url, params)
}
