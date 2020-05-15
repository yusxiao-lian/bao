import {axiosGet, axiosHeaderTokenGet, axiosHeaderTokenFormDataPost, axiosFormDataPost} from '../axiosUtils.js';

//获取缴费记录
export const payHistoryList = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appGetFeeReceivedList`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}

//临停H5-根据车牌获取费用
export const h5calculatingTempCost = async (params) => {
  let url = `/appCar/h5calculatingTempCost`;
  return await axiosFormDataPost(url, params);
}

//临停H5-通道扫码获取临停
export const h5scanCalculatingTempCost = async (params) => {
  let url = `/appCar/h5scanCalculatingTempCost`;
  return await axiosFormDataPost(url, params);
}

//停车费缴费
export const tempCost = async (params) => {
  let url = `/appCar/tempCost`;
  return await axiosFormDataPost(url, params);
}

//查询月保卡信息
export const queryMonthly = async (params, accessToken) => {
  let url = `/monthlyMonthlyCarParkApplyApp/queryMonthly`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}

//月保卡续费
export const monthlyReNewPay = async (params, accessToken) => {
  let url = `/monthlyMonthlyCarParkApplyApp/monthlyReNewPay`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}

//我的缴费
export const appGetFeeReceivableListNew = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appGetFeeReceivableListNew`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}



