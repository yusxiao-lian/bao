import {
  axiosGet,
  axiosHeaderTokenGet,
  axiosPost
} from '../axiosUtils.js'

//获取微信AccessToken
export const getCommAccessToken = async (params) => {
  let url = '/wechat/getCommAccessToken';
  return await axiosGet(url, params);
}
//获取微信code url
export const getWXCodeURL = async (params) => {
  let url = '/wechat/getCodeURL';
  return await axiosGet(url, params);
}
//登陆
export const login = async (params) => {
  let url = '/web/login'
  return await axiosGet(url, params)
}
//登出
export const logout = async (params) => {
  let url = '/web/logout';
  return await axiosGet(url, params)
}
//注册
export const loginAndRegister = async (params) => {
  let url = '/web/loginAndRegister'
  return await axiosGet(url, params)
}
//获取验证码
export const getCode = async (params) => {
  let url = '/web/authCodeNew'
  return await axiosGet(url, params)
}
//找回密码||忘记密码
export const lookForPassword = async (params) => {
  let url = '/web/forgetPwd'
  return await axiosGet(url, params)
}
//修改密码
export const modifyPassword = async (params, accessToken) => {
  let url = '/web/modifyPwd'
  return await axiosHeaderTokenGet(url, params, accessToken)
}


//获取项目列表
export const getProjectList = async () => {
  let url = '/comm/appInterface/communityList'
  return await axiosGet(url)
}
//获取房间列表
export const getRoomList = async (params, accessToken) => {
  let url = '/property/fee/feeReceivedApp/appGetHouseListAll'
  return await axiosHeaderTokenGet(url, params, accessToken)
}

/*获取城市列表*/
export const getCity = async () => {
  let url = '/comm/appInterface/citys'
  return await axiosPost(url)
}
/*获取社区列表
cityName；
appType：yezhuApp
communityType：notparks
*/
export const getCommunityList = async (params) => {
  let url = '/comm/appInterface/communityList'
  return await axiosPost(url, params)
}


export const customerAutoApply = async (params) => {
  let url = '/property/customerApply/customerAutoApply'
  return await axiosPost(url, params)
}

/*获取公众号签名*/
export const getWeChatConfig = async () => {
  let url = '/comm/appInterface/weChatConfig'
  return await axiosPost(url, {
    url: location.href.split('#')[0]
  })
}

//判断是否是该问卷的受访者
export const interviewees = async (params, accessToken) => {
  let url = '/survey/app/interviewees'
  return await axiosHeaderTokenGet(url, params, accessToken)
}

//获取能量值记录
export const getUserPoint = async (params) => {
  let url = '/point/userPoint'
  return await axiosPost(url, params)
}

//能量值消费记录
export const pointgetRecord = async (params) => {
  let url = '/point/getRecord'
  return await axiosPost(url, params)
}

//查看能量值规则
export const pointRule = async (params) => {
  let url = '/comm/appInterface/doc'
  return await axiosPost(url, params)
}

// 消费能量值记录
export const pointConsumeRecord = async (params) => {
  let url = '/point/consumeRecord'
  return await axiosPost(url, params)
}
