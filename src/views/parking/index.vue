<template>
  <div></div>
</template>

<script>
import { baseUrl } from "../../service/configUrl.js";

export default {
  name: "",
  data() {
    return {
      baseUrl
    };
  },
  created() {
    this.$createToast({ time: 0, txt: "加载中" }).show();
    let dataList = {
      parkCode: this.$route.query.parkCode, //捷顺车场编码(二维码上获取参数)
      equipCode: this.$route.query.equipCode, //设备编码(二维码上获取参数)
      cid: this.$route.query.cid, //cid(二维码上获取参数)
      version: this.$route.query.version, //version(二维码上获取参数)
      usr: this.$route.query.usr, //usr(二维码上获取参数)
      psw: this.$route.query.psw, //psw(二维码上获取参数)
      communityId: this.$route.query.communityId, //项目id(二维码上获取参数)
      codeType: this.$route.query.codeType, //0无牌入场,1是有牌车场支付，2是有牌车场内收费口支付
      openid: "",
      openId: "",
      plateNumber: ""
    };
    window.localStorage.setItem("dataList", JSON.stringify(dataList));
    this.dataList = JSON.parse(window.localStorage.getItem("dataList"));
    window.location.href = baseUrl + "/h5Pay/toJSPayQueryH5";
  }
};
</script>

<style scoped>
</style>
