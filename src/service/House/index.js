import {axiosGet, axiosHeaderTokenGet, axiosPost} from '../axiosUtils.js'

//获取房屋列表
export const getHouseList = async (params) => {
  let url = '/comm/appInterface/customerApplyList';
  return await axiosGet(url, params);
}

/*获取城市列表*/
export const getCity = async () => {
  let url = '/comm/appInterface/citys'
  return await axiosPost(url)
}

/*获取社区列表
city；
appType：yezhuApp
communityType：notparks || parks
*/
export const getCommunityList = async (params) => {
  let url = '/comm/appInterface/communityList';
  return await axiosPost(url, params);
}

/*获取楼栋列表 cid*/
export const getBuilding = async (params) => {
  let url = '/comm/appInterface/getBuilding'
  return await axiosPost(url, params)
}
/*获取单元列表 cid*/
export const getUnit = async (params) => {
  let url = '/comm/appInterface/getUnit'
  return await axiosPost(url, params)
}
/*获取房间列表 bid*/
export const getHouse = async (params) => {
  let url = '/comm/appInterface/getHouse'
  return await axiosPost(url, params)
}
// 我的房屋提交
export const customerApply = async (params) => {
  let url = '/property/customerApply/customerApply'
  return await axiosPost(url, params)
}

//获取角色
export const customerTypes = async (params) => {
  let url = '/property/customerApply/customerTypes'
  return await axiosPost(url, params)
}
//业主验证身份
export const createOwnerApply = async (params) => {
  let url = '/property/customerApply/createOwnerApply'
  return await axiosPost(url, params)
}
// 修改个人信息
export const updateUser = async (params) => {
  let url = '/systemApp/updateUser'
  return await axiosPost(url, params)
}

//获取房屋列表
export const getOwnerHouse = async (params) => {
  let url = '/comm/appInterface/getOwnerHouse';
  return await axiosGet(url, params);
}
//体温登记
export const checkTemp = async (params) => {
  let url = '/comm/appInterface/checkTemp';
  return await axiosGet(url, params);
}
