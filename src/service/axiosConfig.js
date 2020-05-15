import axios from "axios";
import {
  baseUrl
} from "./configUrl";
axios.defaults.timeout = 50000;
axios.defaults.baseURL =
  process.env.NODE_ENV === "production" ? baseUrl : "/api"; //代理/api 正式环境http://o2o.jixiangit.com  UAT:http://o2otest.jixiangit.com
let pending = [];
let cancelToken = axios.CancelToken;

let str = "";
//添加请求拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem("userInfo")) {
      let token =
        JSON.parse(localStorage.getItem("userInfo")).accessToken || "";
      if (token) {
        config.headers["Access-Token"] = token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//添加响应拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response, "response");
    if (response.data.error.err_msg == "请登录" || response.data.error.err_code == "4") {
      console.log("testtesttesttesttesttest")
      try {
        window.webkit.messageHandlers.toLogin.postMessage("");
        return;
      } catch (e) {}
      try {
        window.jsObject.toLogin();
        return;
      } catch (e) {}
      window.localStorage.setItem("toGoURL", window.location.href);
      window.location.href = "/wechat/toLogin";
    }

    return response;
  },
  error => {
    return error;
  }
);
