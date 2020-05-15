import {axiosGet, axiosHeaderTokenGet, axiosHeaderTokenFormDataPost, axiosFormDataPost,axiosFormDataPostAll} from '../axiosUtils.js';

//捷顺跳转页面判断
export const h5JSJudgement = async (params) => {
  let url = `/appCar/h5JSJudgement`;
  return await axiosFormDataPost(url, params);
}

//h5临停-根据车牌获取费用
export const h5calculatingTempCost = async (params) => {
  let url = `/appCar/h5calculatingTempCost`;
  return await axiosFormDataPost(url, params);
}

//临停-停车费缴费
export const tempCost = async (params) => {
  let url = `/appCar/tempCost`;
  return await axiosFormDataPost(url, params);
}
//临停-无牌车入场
export const h5EntryOrExit = async (params) => {
  let url = `/appCar/h5EntryOrExit`;
  return await axiosFormDataPost(url, params);
}

//无牌缴费
export const h5JSWP = async (params) => {
  let url = `/appCar/h5JSWP`;
  return await axiosFormDataPost(url, params);
}

// 查询南网订单号判断是否有充电优惠  
/**
 * @params 
 */
export const h5findChargeOrder = async (params) => {
  let url = `/appCar/h5findChargeOrder`;
  return await axiosFormDataPost(url, params);
}




