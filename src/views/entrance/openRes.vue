<template>
  <div class="open-result">
    <div>
      <headerTab></headerTab>
    </div>
    <div class="main">
      <div class="text">扫码开门</div>
      <div class="openDoorList-l"></div>
      <div v-if="isLoading" class="openning">
        <img id="xuanzhun" class="loading-ico" src="../../assets/entrance/loading2.svg" alt />
        <div>正在开门...</div>
      </div>
      <div class="result">
        <div v-if="isRight">
          <img src="../../assets/entrance/right.png" alt />
          <p class="result-title c-right">开门成功！</p>
          <p class="result-msg">欢迎回来，吉祥E+为您服务！</p>
        </div>
        <div v-if="isError">
          <img src="../../assets/entrance/error.png" alt />
          <p class="result-title c-error">开门失败！</p>
          <p class="result-msg c-333">请进行钥匙刷卡开门或联系物业管理处，谢谢！</p>
        </div>
        <div class="confirm-btn" @click="goBack">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as personalMessage from "@/service/personalMessage";
import { headerTab } from "../../components/index";
import * as api from "../../service/entrance";
export default {
  name: "scanRes",
  components: {
    headerTab
  },
  data() {
    return {
      userInfo: {},
      isRight: false,
      isError: false,
      isLoading: true
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.openDoor();
    // alert(this.$route.query.QRCodeRes);
  },
  methods: {
    openDoor() {
      // if (this.userInfo.ownerType && this.$route.query.id) {
      //   this.qdUserOpenDoor();
      //   return;
      // }
      // if (!this.userInfo.ownerType && this.$route.query.id) {
      //   this.qdVisitorOpenDoor();
      //   return;
      // }
      // if (this.$route.query.QRCodeRes) {
      this.qdOpenDoorByQR();
      // }
    },
    async qdUserOpenDoor() {
      let res = await api.qdOpenDoor({
        communityId: this.userInfo.communityId,
        entranceId: this.$route.query.id
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.isLoading = false;
          this.isRight = true;
        } else if ("1" == res.error.err_code) {
          this.isLoading = false;
          this.isError = true;
        }
      }
    },
    async qdVisitorOpenDoor() {
      let res = await api.qdVisitorOpenDoor({
        communityId: this.userInfo.communityId,
        entranceId: this.$route.query.id
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.isLoading = false;
          this.isRight = true;
        } else if ("1" == res.error.err_code) {
          this.isLoading = false;
          this.isError = true;
          // this.Toast("一键开门失败，请使用扫码开门");
        }
      }
    },
    async qdOpenDoorByQR() {
      let res = await api.qdOpenDoorByQR({
        communityId: this.userInfo.communityId,
        qdMAC: this.$route.query.QRCodeRes
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.isLoading = false;
          this.isRight = true;
        } else {
          this.isLoading = false;
          this.isError = true;
        }
      } else {
        this.isLoading = false;
        this.isError = true;
      }
    },
    goBack() {
      history.go(-1);
    }
  }
};
</script> 

<style lang="scss" scoped>
.open-result {
  padding-top: 120px;
  .main {
    height: calc(100% - 90px);
    overflow: hidden;
    overflow-y: auto;
    padding: 0 50px;
    .text {
      font-size: 30px;
      margin-bottom: 40px;
      margin-top: 40px;
      text-align: center;
      color: #9b9b9b;
    }
    .openning {
      margin: 120px 0;
      text-align: center;
      img {
        margin: 0 auto;
        width: 160px;
        height: 160px;
      }
      div {
        font-size: 30px;
        text-align: center;
        margin-top: 80px;
      }
    }
    .result {
      margin: 120px 0;
      text-align: center;
      img {
        width: 120px;
        height: 120px;
        margin: 0 auto;
      }
      .result-title {
        font-size: 34px;
        padding-top: 80px;
      }
      .result-msg {
        font-size: 30px;
        padding-top: 80px;
      }
      .confirm-btn {
        width: 500px;
        height: 70px;
        line-height: 70px;
        margin: 100px auto 0 auto;
        background: #a360a5;
        border-radius: 50px;
        color: #fff;
      }
      .c-right {
        color: #52c41a;
      }
      .c-error {
        color: #fe6d68;
      }
      .c-333 {
        color: #333;
      }
    }
  }
  .openDoorList-l {
    padding: 0 50px;
  }
}
#xuanzhun {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 3s linear infinite;
  -moz-animation: rotate 3s linear infinite;
  -o-animation: rotate 3s linear infinite;
  animation: rotate 3s linear infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>