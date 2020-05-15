import {
  axiosGet,
  axiosHeaderTokenGet,
  axiosPost
} from '../axiosUtils.js'

//门禁授权列表
export const userEntranceList = async (params) => {
  let url = `/comm/appInterface/userEntranceList`;
  return await axiosPost(url, params);
}

export const weChatConfig = async (params) => {
  let url = `/comm/appInterface/weChatConfig`;
  return await axiosPost(url, params);
}
//访客门禁二维码
export const getMenQrcode = async (params) => {
  let url = `/comm/appInterface/getEntranceQRCode`
  return await axiosGet(url, params)
}

//访客申请
export const visitorEntranceApply = async (params) => {
  let url = `/comm/appInterface/visitorEntranceApply`
  return await axiosGet(url, params)
}

//访客记录列表
export const myVisitorApplyList = async (params) => {
  let url = `/comm/appInterface/myVisitorApplyList`
  return await axiosGet(url, params)
}

//判断是否有开通门禁
export const haveEntrance = async (params) => {
  let url = `/comm/appInterface/haveEntrance`
  return await axiosGet(url, params)
}

//获取已开通门禁列表
export const entranceList = async (params) => {
  let url = '/comm/appInterface/userEntranceList'
  return await axiosGet(url, params)
}

//获取可以申请开通的门禁列表
export const applyEntranceList = async (params) => {
  let url = '/comm/appInterface/entranceList'
  return await axiosGet(url, params)
}


//获取历史记录
export const addEntrance = async (params) => {
  let url = `/comm/appInterface/addEntrance`
  return await axiosGet(url, params)
}

// 获取项目门禁平台配置
export const getGuardSettings = async (params) => {
  let url = `/comm/appInterface/getGuardSettings`;
  return await axiosPost(url, params);
}

// 千丁业主远程开门
export const qdOpenDoor = async (params) => {
  let url = `/comm/appInterface/qdOpenDoor`;
  return await axiosPost(url, params);
}

//千丁访客远程开门
export const qdVisitorOpenDoor = async (params) => {
  let url = `/comm/appInterface/qdVisitorOpenDoor`;
  return await axiosPost(url, params);
}

//千丁远程扫码开门（业主）
export const qdOpenDoorByQR = async (params) => {
  let url = `/comm/appInterface/qdOpenDoorByQR`;
  return await axiosPost(url, params);
}
