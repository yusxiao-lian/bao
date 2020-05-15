<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getWeChatConfig } from "@/service/system";
import jsonp from "jsonp";
import { mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    ...mapActions(["setCity"]),
    async getLocation() {
      this.wxPosition();
    },
    async showError() {
      this.wxPosition();
    },
    async showPosition(position) {
      let latLon = position.coords.latitude + "," + position.coords.longitude;
      this.getPositionCity();
    },
    async wxPosition() {
      const toast = this.$createToast({ time: 0, txt: "" }).show();
      let res = await getWeChatConfig();
      toast.hide();
      if (res) {
        if (res.error.err_code === "0") {
          console.log(res, "222222");
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.obj.appId, // 必填，公众号的唯一标识
            timestamp: res.obj.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.obj.noncestr, // 必填，生成签名的随机串
            signature: res.obj.signature, // 必填，签名
            jsApiList: [
              "getLocation",
              "updateTimelineShareData",
              "updateAppMessageShareData",
              "onMenuShareAppMessage",
              "onMenuShareQQ",
              "onMenuShareQZone",
              "onMenuShareTimeline",
              "scanQRCode",
              "updateTimelineShareData"
            ] // 必填，需要使用的JS接口列表
          });
          wx.ready(async () => {
            this.$store.dispatch("setWxJsSdkFlag", true);
            console.log("jsdk授权成功");
            this.getPositionCity();
          });
          wx.error(res => {
            //window.location.reload();
            //this.getLocation()
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        }
      }
    },
    async getPositionCity(callback) {
      // const toast = this.$createToast({time: 0, txt: ''}).show();
      await wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: async res => {
          let latLon = res.latitude + "," + res.longitude;
          let url =
            "http://api.map.baidu.com/reverse_geocoding/v3/?ak=63t0KGsgV7W7K1RhCj3Ru3Zb8UYoC8XG&output=json&coordtype=wgs84ll&location=" +
            latLon;
          jsonp(url, (err, res) => {
            // toast.hide()
            console.log(res.result.addressComponent.city, "地址信息");
            this.setCity(res.result.addressComponent.city);
            if (callback) {
              callback();
            }
          });
        }
      });
    }
  },
  async mounted() {
    this.getLocation();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Source Han Sans CN;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
}
</style>
