import {axiosGet, axiosPost,axiosHeaderTokenGet, axiosHeaderTokenFormDataPost, axiosFormDataPost} from '../axiosUtils.js';

//获取问卷列表
export const listForH5 = async (params) => {
  let url = `/survey/app/listForH5`;
  return await axiosPost(url, params);
}


//获取所有已经认证的房间
export const appGetHouseListAll = async (params) => {
  let url = `property/fee/feeReceivedApp/appGetHouseListAll`;
  return await axiosPost(url, params);
}
