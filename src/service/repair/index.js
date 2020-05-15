import {axiosHeaderTokenGet, axiosHeaderTokenFormDataPost,formDataPostFiles_} from '../axiosUtils.js'
/**
 * 查询报修类型
 */
export const maintainItemTree = async (params, accessToken)=>{
    let url =`/maintainApp/maintainItemTree`
    return await axiosHeaderTokenFormDataPost(url, params, accessToken)
}

/**
 * 提交报修申请
 */
export const saveMaintain = async (params,keys)=>{
    let url =`/maintainApp/saveMaintain`
    return await formDataPostFiles_(url, params,keys)
}

//获取日期 参数communityId=社区id
export const planDayList = async (params, accessToken)=>{
    let url =`/maintainApp/planDayList`
    return await axiosHeaderTokenGet(url, params, accessToken)
}
/**
 * 获取时间段
 * communityId 社区id
 * houseId  房间id
 * planDay  上面选的日期
 */
export const planTimeList = async (params, accessToken)=>{
    let url =`/maintainApp/planTimeList`
    return await axiosHeaderTokenGet(url,params,accessToken)
}

/**
 * 获取报修历史记录列表
 * formStatus   报修单状态
 * communityId  社区id
 * strCur   当前页码
 * strSize  页大小
 */
export const getFormList = async (params, accessToken)=>{
    let url =`/maintainApp/formList`
    return await axiosHeaderTokenGet(url,params,accessToken)
}

/**
 * 获取报修报修详情
 * formId   报修单id
 */
export const getFormDetail = async (params, accessToken)=>{
    let url =`/maintainApp/formDetail`
    return await axiosHeaderTokenGet(url,params,accessToken)
}

/**
 * 物业报修评价
 */
export const voteForm = async (params, accessToken)=>{
    let url =`/maintainApp/voteForm`
    return await axiosHeaderTokenFormDataPost(url,params,accessToken)
}
