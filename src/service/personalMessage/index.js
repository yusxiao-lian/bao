import {axiosHeaderTokenGet, axiosHeaderTokenFormDataPost} from '../axiosUtils.js'
/*
* accessToken ：用户token
* */
//获取通知公告类型  communityId
export const getNoticeCategory = async (params, accessToken)=>{
    let url =`/comm/appInterface/noticeCategoryList`
    return await axiosHeaderTokenGet(url, params, accessToken)
}

/**
 * 获取类型对应的数据列表
 * noticeCategoryId
 * appType=yezhuApp
 */
export const getNoticeList = async (params, accessToken)=>{
    let url =`/comm/appInterface/noticeList`
    return await axiosHeaderTokenGet(url, params, accessToken)
}
/**
 * 获取用户信息
 */
export const getUserInfo = async (params={},accessToken)=>{
    let url =`/systemApp/userInfo`
    return await axiosHeaderTokenGet(url, params, accessToken)
}

/**
 * 修改用户信息
 * name
 * phone
 * email
 * images
 *
 * country
 * province
 * street
 * postCode
 */
export const updateUser = async (params, accessToken)=>{
    let url =`/systemApp/updateUser`
    return await axiosHeaderTokenFormDataPost(url, params, accessToken)
}
// 获取待收货件数
export const getOrderCount = async ()=>{
  let url =`/web/orderMgt/getOrderCount`
  return await axiosHeaderTokenGet(url)
}
