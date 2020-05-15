import axios from 'axios';
import qs from 'qs';
//不带accessToken请求
export const axiosGet= async (url,params={})=> {
  let res  = await axios.get(url, {params:params});
  if(res && res.status==200) {
    return res.data;
  }else {
    return res;
  }
}
//带accessToken请求
export const axiosHeaderTokenGet= async (url, params={}, accessToken)=> {
  let res  = await axios.get(url, {
    headers: {
      'Access-Token':accessToken,
    },
    params:params
  })
  if(res && res.status==200) {
    return res.data;
  } else {
    return res;
  }
}
export const axiosPost= async (url,params={})=>{
  let res  = await axios( {
    method:"post",
    url:url,
    data:qs.stringify(params),
  })
  if(res&&res.status==200){
    return res.data
  }else {
    return res
  }
}
export const axiosHeaderTokenFormDataPost= async (url,params={},accessToken)=> {
  let formData = new FormData();
  for(let key in params) {
    formData.append(key, params[key]);
  }
  let res  = await axios.post(url, formData, {
    headers: {
      'Access-Token':accessToken,
      'Content-Type': 'application/x-www-form'
    }
  })
  if(res && res.status==200) {
    return res.data;
  } else {
    return res;
  }
}
export const axiosFormDataPost = async (url,params={})=> {
  let formData = new FormData();
  for(let key in params) {
    formData.append(key,params[key]);
  }
  let res  = await axios.post(url,formData);
  if(res && res.status==200) {
    return res.data;
  } else {
    return res;
  }
}

export const axiosFormDataPostAll = async (url,params={})=> {
  let formData = new FormData();
  for(let key in params) {
    formData.append(key,params[key]);
  }
  console.log(await axios.post(url, formData));
  return await axios.post(url,formData);
  if(res && res.status==200) {
    return res.data;
  } else {
    return res;
  }
}

/*多文件表单提交*/
export const formDataPostFiles= async (url,info={},filesList=[{key:'',list:[]}])=>{

  let formData = new FormData()
  for(let key in info){
    formData.append(key,info[key])
  }
  filesList.forEach(v=>{
    v.list.forEach(k=>{
      formData.append(v.key,k)
    })
  })
  let res  = await axios.post(url,formData)
  if(res&&res.status==200){
    return res.data
  }else {
    return res
  }
}

export const formDataPostFiles_= async (url,info={},filesKeys=[])=>{
  let formData = new FormData()
  for(let key in info){
    let flag = true
    filesKeys.forEach(v=>{
      if(v===key){
        flag=false
        info[key].forEach(k=>{
          formData.append(key,k)
        })
      }
    })
    if(flag){
      formData.append(key,info[key])
    }
  }

  let res  = await axios.post(url,formData)
  if(res&&res.status==200){
    return res.data
  }else {
    return res
  }
}
