import {axiosGet, axiosHeaderTokenGet, axiosPost} from '../axiosUtils.js'
//获取租售信息列表
export const appGetLeaseList = async (params) => {
    let url = '/asset/app/appGetLeaseList';
    return await axiosGet(url, params);
  }

  //房屋租售详细
  export const appGetLeaseDetail = async (params) => {
    let url = '/asset/app/appGetLeaseDetail';
    return await axiosGet(url, params);
  }
  
  //预约看房
  export const bookHouse = async (params) => {
    let url = '/asset/app/bookHouse';
    return await axiosPost(url, params);
  }



























