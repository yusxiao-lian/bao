import {axiosGet, axiosHeaderTokenGet, axiosPost} from '../axiosUtils.js'

// 获取报修渠道
export const appGetRepairSource = async (params) => {
    let url = '/newMaintainApp/dict';
    return await axiosGet(url, params);
}

// 获取种类
export const appGetRepairType = async (params) => {
    let url = '/newMaintainApp/maintainItemTree'
    return await axiosGet(url, params);
}			

// 获取项目
export const appGetRepairProject = async (params) => {
    let url = '/comm/appInterface/communityList'
    return await axiosGet(url, params);
}

// 获取楼层
export const appGetRepairFloor = async (params) => {
    let url = '/comm/appInterface/getBuilding'
    return await axiosGet(url, params);
}

// 获取房间
export const appGetRepairRoom = async (params) => {
    let url = '/comm/appInterface/getHouse	'
    return await axiosGet(url, params);
}
		

