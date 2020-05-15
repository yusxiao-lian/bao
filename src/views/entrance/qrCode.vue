<template>
  <div class="qrcodeOpenDoor">
    <div class="qrcodeOpenDoor_header">
      <div class="left" @click="$router.goBack()">
        <i class="back"></i>
      </div>
      <span class="text">二维码开门</span>
    </div>
    <div class="qrcodeOpenDoor_main">
      <div class="address" @click="$router.goBack()">
        <span>{{objData.doorName}}</span>
      </div>
      <div class="qrcode-box">
        <img class="qrcode-img" :src="'data:image/png;base64,'+objData.qrcodeImg" alt="">
        <div class="text">请将二维码对准门禁设备，保持20cm距离</div>
        <div class="btn-box" @click="getMenQrcode" :class="animateFlag?'animateFlag':''">刷新二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
  import *as api from "../../service/entrance";

  export default {
    name: "qrcodeOpenDoor",
    data() {
      return {
        userInfo: '',
        QRCodeUrl: '',
        objData: {
          "msg": "",
          "buildingName": "",
          "unitName": "",
          "pwd": "",
          "message": "",
          qrcodeImg: '',
          "doorName": "",
        },
        animateFlag: false
      }
    },
    methods: {
      async generateQR(text) {
        try {
          this.QRCodeUrl = await qrcode.toDataURL(text)
        } catch (err) {
          console.error(err)
          this.QRCodeUrl = ''
        }
      },
      async getMenQrcode() {
        if (this.objData.doorName) {
          this.objData.qrcodeImg = ''
        }

        this.animateFlag = true
        let res = await api.getMenQrcode({communityId: this.userInfo.communityId, entranceId: this.$route.query.id})
        this.animateFlag = false
        console.log(res)
        if (res) {
          if (res.error.err_code === "0") {
            if (this.objData.doorName) {
              this.objData.qrcodeImg = res.obj.qrcodeImg
            } else {
              this.objData = res.obj
            }

          } else {
            this.Toast(res.error.err_msg)
          }
        }
      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.getMenQrcode()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .qrcodeOpenDoor {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    background: url("../../assets/img/bg.png") no-repeat;
    background-size: 100% 386px;
  }

  .qrcodeOpenDoor_header {
    color: white;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .left {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      .back {
        width: 12px; /*no*/
        height: 12px; /*no*/
        border-bottom: 2px solid #fff; /*no*/
        border-left: 2px solid #fff; /*no*/
        transform: rotateZ(45deg);
        display: inline-block;
      }
    }
    .text {
      font-size: 34px;
      line-height: 50px;
      height: 50px;
    }
  }

  .qrcodeOpenDoor_main {
    padding: 0 75px 20px 75px;
    overflow: hidden;
    .address {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 30px;
      margin-top: 100px;
      margin-bottom: 30px;
      &:before {
        content: "";
        display: inline-block;
        width: 64px;
        height: 64px;
        background: url("../../assets/img/position.png") no-repeat center;
        background-size: 64px;
      }
      > span {
        max-width: calc(100% - 70px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30px;
        line-height: 50px;
      }
    }
    .qrcode-box {
      min-height: 780px;
      background: white;
      border-radius: 8px; /*no*/
      overflow: hidden;
      box-shadow: 0 0 6px #ddd; /*no*/
      padding-top: 0px;
      .text {
        font-size: 30px;
        line-height: 50px;
        color: #666;
        text-align: center;
        overflow: hidden;
      }
      .btn-box {
        width: 320px;
        height: 82px;
        border-radius: 82px;
        background: #8d77fe;
        margin: 0 auto;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 60px;
        &:before {
          content: "";
          width: 64px;
          height: 64px;
          display: inline-block;
          background: url("../../assets/img/Refresh.png") no-repeat center;
          background-size: 64px;
          transform-origin: 32px 32px;
        }
      }
      .animateFlag {
        &:before {
          animation: animateFlag 1s infinite linear;
        }
      }
    }
    .qrcode-img {
      display: block;
      width: 380px;
      height: 380px;
      margin: 0 auto;
      margin-top: 60px;
      margin-bottom: 60px;
    }
  }

  @keyframes animateFlag {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
</style>
