import {axiosGet, axiosHeaderTokenGet, axiosPost, formDataPostFiles_, formDataPostFiles} from '../axiosUtils.js'


//投诉提交
export const complaintSubmit = async (info=[],keys=[]) => {
  let url = '/comm/appInterface/complaintSubmit'
  return await formDataPostFiles_(url, info, keys)
}

/*建议提交*/
export const suggestion = async (info=[],keys=[]) => {
  let url = '/comm/appInterface/suggestion'
  return await formDataPostFiles_(url,info, keys)
}
// 投诉列表
export const myComplaintList = async (params) => {
  let url = '/comm/appInterface/myComplaintList'
  return await axiosPost(url, params)
}
// 投诉详情
export const complaintDetail = async (params) => {
  let url = '/comm/appInterface/complaintDetail'
  return await axiosPost(url, params)
}
