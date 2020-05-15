import {
  axiosGet,
  axiosHeaderTokenGet,
  axiosPost,
  formDataPostFiles_
} from '../axiosUtils.js'

//发布话题
export const releaseTopic = async (info = [], keys = []) => {
  let url = '/comm/topicApp/appTopicsave'
  return await formDataPostFiles_(url, info, keys)
}
//分类列表
export const categoryList = async (params) => {
  let url = `/comm/topicApp/categoryList`;
  return await axiosPost(url, params);
}

//话题列表
export const topicList = async (params) => {
  let url = `/comm/topicApp/applist`;
  return await axiosPost(url, params);
}

//话题点赞
export const topicThumbsUp = async (params) => {
  let url = `/comm/topicApp/appThumbsUp`;
  return await axiosPost(url, params);
}

//话题详情
export const topicDetail = async (params) => {
  let url = `/comm/topicApp/topicDetail`;
  return await axiosPost(url, params);
}

//删除话题
export const delTopic = async (params) => {
  let url = `/comm/topicApp/delTopic`;
  return await axiosPost(url, params);
}

//我的话题
export const selfTopic = async (params) => {
  let url = `/comm/topicApp/appSelfTopic`;
  return await axiosPost(url, params);
}

//发布评论
export const commentSave = async (params) => {
  let url = `/comm/topicApp/appCommentsave`;
  return await axiosPost(url, params);
}

//举报
export const reportSave = async (params) => {
  let url = `/comm/topicApp/appreport`;
  return await axiosPost(url, params);
}

//我的评论
export const selfComment = async (params) => {
  let url = `/comm/topicApp/appSelfComment`;
  return await axiosPost(url, params);
}

//删除评论
export const delComment = async (params) => {
  let url = `/comm/topicApp/delComment`;
  return await axiosPost(url, params);
}
