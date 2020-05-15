import {
  axiosGet,
  axiosHeaderTokenGet,
  axiosPost,
  axiosFormDataPost,
  formDataPostFiles,
  formDataPostFiles_
} from '../axiosUtils.js'

//获取我的车辆
export const myCarList = async (params) => {
  let url = '/appCar/myCarList'
  return await axiosPost(url, params)
}
//项目小区服务电话
export const servicePhoneNum = async (params) => {
  let url = '/comm/appInterface/servicePhoneNum'
  return await axiosPost(url, params)
}
//获取车辆信息
export const getInfoById = async (params) => {
  let url = '/appCar/getInfoById'
  return await axiosPost(url, params)
}

//获取停车场信息
export const getParkinfo = async (params) => {
  let url = '/appCar/getParkinfo'
  return await axiosPost(url, params)
}

//获取停车场车型
export const getCarModel = async (params) => {
  let url = '/appCar/getCarModel'
  return await axiosPost(url, params)
}

//获取停车场月卡信息
export const getCarType = async (params) => {
  let url = '/appCar/getCarType'
  return await axiosPost(url, params)
}

//判断车辆是否满足月保
export const judgement = async (params) => {
  let url = '/appCar/judgement'
  return await axiosPost(url, params)
}

//获取月保车辆
export const monthlyCarApply = async (params, keys) => {
  let url = '/appCar/monthlyCarApply'
  return await formDataPostFiles_(url, params, keys)
}

//小区判断是否是整月还是自认月（注：chargType返回1表示是自然月缴费，2是表示整月缴费）
export const parkingEnable = async (params) => {
  let url = '/comm/appInterface/parkingEnable'
  return await axiosPost(url, params)
}

//确认缴费
export const monthlyReNewPay = async (params) => {
  let url = '/appCar/monthlyReNewPay'
  return await axiosPost(url, params)
}

//我的缴费
export const doc = async (params, accessToken) => {
  let url = `/comm/appInterface/doc`;
  return await axiosPost(url, params, accessToken);
}

//获取停车场月卡信息
export const getParkSettings = async (params) => {
  let url = '/appCar/getParkSettings'
  return await axiosPost(url, params)
}


//获取停车场月卡缴费记录
export const monthlyCarFeeList = async (params) => {
  let url = '/appCar/monthlyCarFeeList'
  return await axiosPost(url, params)
}


//发送邮箱地址
export const carAttachmentSendMail = async (params) => {
  let url = '/appCar/carAttachmentSendMail'
  return await axiosPost(url, params)
}
