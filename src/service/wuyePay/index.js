import {axiosHeaderTokenGet, axiosHeaderTokenFormDataPost, axiosGet, axiosPost} from '../axiosUtils.js';

/**
 * 物业缴费-筛选条件
 */
export const appQueryFeeCondition = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appQueryFeeCondition`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}
/**
 * 物业缴费收据列表
 */
export const appGetFeeReceivableList = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appGetFeeReceivableListNew`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}
/**
 * 缴费
 */
export const appFee = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appFee`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}
// 获取能量值
export const exchange = async (params, accessToken) => {
  let url = `/userpoint/user/exchange`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}

//获取房间列表
export const appQueryFeeConditionH5 = async (params, accessToken) => {
  let url = `/property/fee/feeReceivedApp/appQueryFeeConditionH5`;
  return await axiosHeaderTokenFormDataPost(url, params, accessToken);
}

//获取认证的房间列表
export const getOwnerHouse = async (params) => {
  let url = `/comm/appInterface/getOwnerHouse`;
  return await axiosPost(url, params);
}


//查询预缴费用抵扣数据
export const appGetFeeReceivedList = async (params) => {
  let url = `/property/fee/feeReceivedApp/appGetFeeReceivedItem`;
  return await axiosPost(url, params);
}

// 根据房间id查询预缴项目
export const getFeeReceivedProject = async (params) => {
  let url = `/property/fee/feeReceivedApp/appGetFeeItemList`;
  return await axiosPost(url, params);
}

// 预交费支付接口
export const advancePayment = async (params) => {
  let url = `/property/fee/feeReceivedApp/appFee`;
  return await axiosPost(url, params);
}


   

