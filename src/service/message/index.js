import {axiosGet, axiosHeaderTokenGet, axiosPost} from '../axiosUtils.js'

// 获取消息类型
export const appMessageType = async (params) => {
  let url = 'messageApp/appMessageType';
  return await axiosPost(url, params);
}

// 获取对应的消息列表
export const appAllMessageByType = async (params) => {
  let url = 'messageApp/appAllMessageByType';
  return await axiosPost(url, params);
}


// 获取对应的消息列表
export const batchReaded = async (params) => {
  let url = 'messageApp/batchReaded';
  return await axiosPost(url, params);
}
