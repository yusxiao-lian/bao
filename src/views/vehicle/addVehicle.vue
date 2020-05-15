<template>
  <div class="addVehicle">
    <i class="img_i"></i>
    <headerTab></headerTab>
    <div class="payCost">
      <p class="payCost-title">输入车牌号</p>
      <ul class="cartNumberBtnALL">
        <template v-for="(item,index) in [1,2,3,4,5,6,7,8]">
          <li @click="clickKey(item)" v-if="item<8" :key="index">{{cartNumber[index]}}</li>
          <li
            @click="clickKey(item)"
            v-if="item==8"
            :class="{'active':keyNumbers==8||cartNumber.length==8}"
            :key="index"
          >{{cartNumber[index]}}
          </li>
        </template>
      </ul>
      <div v-if="needAttachment">
        <div class="payCost_title" v-if="isShow||$route.query.fromApp">
          <p class="prompt">温馨提示：</p>
          <span class="span_title">尊敬的吉祥E+用户，申请月卡前，需提交月卡证件资料，并按要求完成证件的填写、签字、盖章。请添加邮箱地址：</span>
          <div class="email_address">
            <input @focus="isFocus()" type="text" v-model="email" placeholder="请输入邮箱地址">
            <button @click="send">发送</button>
          </div>
        </div>
        <div class="payCost_title" v-else>
          <p class="prompt">温馨提示：</p>
          <span class="span_title">尊敬的吉祥E+用户，申请月卡前，需提交月卡证件资料，并按要求完成证件的填写、签字、盖章。请添加邮箱地址：</span>
          <p class="one">1、点击下载至手机端：</p>
          <span class="download" @click="download"><i></i>月卡证件.zip</span>
          <p class="two">2、下载至邮箱：</p>
          <div class="email_address">
            <input @focus="isFocus()" type="text" v-model="email" placeholder="请输入邮箱地址">
            <button @click="send">发送</button>
          </div>
        </div>
      </div>


      <div class="addVehicle-button" @click="searchKeyNumber">
        确认
      </div>
    </div>
    <keyboard
      v-if="keyboardFlag"
      v-model="cartNumber"
      :keyNumbers="keyNumbers"
      @clearKey="keyNumbers=7"
      @delKey="delKey"
      @closeKey="keyboardFlag=false"
    ></keyboard>
  </div>
</template>

<script>
  import keyboard from "./increase/keyboard";
  import {headerTab} from "../../components/index";
  import * as api from "../../service/vehicle";
  import {baseUrl} from "../../service/configUrl";
  import {judge, is_Weixn} from "../../unit/unit.js";

  export default {
    name: "addVehicle",
    components: {
      keyboard,
      headerTab
    },
    data() {
      return {
        email: '',//邮箱地址
        listArr: [],//已绑定的车牌
        keyNumbers: 7,
        cartNumber: [],
        keyboardFlag: false,
        openid: null,
        userAgent: null,
        userInfo: "", //个人信息
        fileAttachments: '',
        baseUrl,
        isShow: false,
        needAttachment: false,
      };
    },
    watch: {
      keyboardFlag() {
        this.keyNumbers = 7;
      }
    },
    methods: {
      isFocus() {
        this.keyboardFlag = false
      },
      isJudge() {
        this.isShow = judge()
      },
      // 点击下载附件
      download() {
        if (this.fileAttachments.length > 0) {
          window.location.href = this.baseUrl + this.fileAttachments[0].filePath
        } else {
          this.Toast('暂无相关证件')
          return
        }
      },
      // 发送附件到邮箱地址
      async send() {
        let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (!this.email) {
          this.Toast('请填写邮箱地址')
          return
        }
        if (!re.test(this.email)) {
          this.Toast('请填写正确的邮箱地址')
          return
        }
        let params = {
          communityId: this.userInfo.communityId, //项目id
          receive: this.email,//邮箱地址
        };
        let toast = this.$createToast({time: 0, txt: "邮件正在发送请稍候查收"}).show();
        setTimeout(function () {
          toast.hide();
        }, 1000);
        let res = await api.carAttachmentSendMail(params);
        if (res.error.err_code == 0) {

        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取附件地址
      async getParkSettings() {
        let params = {
          communityId: this.userInfo.communityId //项目id
        };
        let res = await api.getParkSettings(params);
        if (res.error.err_code == 0) {
          this.fileAttachments = res.obj.fileAttachments ? JSON.parse(res.obj.fileAttachments) : ''
          this.needAttachment = res.obj.needAttachment
        }
      },
      delKey() {
        this.keyNumbers = 7;
        if (this.cartNumber.length > 0) {
          let lastIndex = this.cartNumber.length - 1;
          this.cartNumber.splice(lastIndex, 1);
        }
      },
      async clickKey(index) {
        if ("micromessenger" == this.userAgent && !this.openid) {
          window.location.href =
            "/h5Pay/toStopPayQueryH5?communityId=" + this.communityId;
          return;
        }
        this.keyboardFlag = true;
        if (index == 8) {
          this.keyNumbers = 8;
        }
      },
      determine() {
        this.$router.push('/addaudit')
      },
      // 绑定车牌号
      async searchKeyNumber() {

        if (this.cartNumber.length == 0) {
          this.Toast("请填写车牌号码");
          return;
        }
        if (this.cartNumber.length < this.keyNumbers) {
          this.Toast("车牌号码位数不够");
          return;
        }
        let numberPlate = "";
        for (let key in this.cartNumber) {
          numberPlate += this.cartNumber[key];
        }
        this.$router.push({name: 'addaudit', query: {numberPlate: numberPlate}})
      }
    },
    mounted() {
      let cartCode = JSON.parse(window.localStorage.getItem("cartNumber"));
      this.cartNumber = cartCode && cartCode.length > 2 ? cartCode : ["粤", "B"];
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      this.getParkSettings()
      this.isJudge()
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .addVehicle {
    height: 100%;
    overflow: hidden;
    position: relative;

    .img_i {
      width: 540px;
      height: 396px;
      display: inline-block;
      background-image: url("../../assets/pay_bg.png") !important;
      background-size: cover;
      position: absolute;
      bottom: 0;
      left: 130px;
      z-index: 1;
    }

    .payCost {
      background-color: #fff;
      padding-top: 100px;
      margin-bottom: 40px;
      position: relative;
      z-index: 2;

      .payCost-title {
        font-size: 60px;
        text-align: center;
        font-weight: 600;
        margin: 60px 0;
      }

      .cartNumberBtnALL {
        width: 684px;
        margin: 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px;

        li {
          font-size: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 88px;
          background: rgba(255, 255, 255, 1);
          border: 2px solid rgba(204, 204, 204, 1);
          border-radius: 4px;
        }

        li:last-of-type {
          background-repeat: no-repeat;
          background-size: 54px 48px;
          background-position: center;
          background-image: url("../../assets/img/add_new.png");
        }

        li:last-of-type.active {
          background: none;
        }
      }

      .payCost_title {
        padding: 30px;

        .prompt {
          font-size: 35px;
          margin-bottom: 30px;
          font-weight: 700;
        }

        .span_title {
          text-indent: 50px;
          margin-top: 30px;
          line-height: 46px;
          font-size: 32px;
          display: block;
        }

        .one, .two {
          line-height: 46px;
          font-size: 32px;
        }

        .download {
          line-height: 46px;
          font-size: 32px;
          text-indent: 50px;
          display: inline-block;
          text-decoration: underline;
          color: rgb(24, 71, 198);

          i {
            margin-right: 10px;
            width: 34px;
            height: 34px;
            display: inline-block;
            background-image: url("../../assets/download.png");
            background-size: cover;
            vertical-align: middle;
          }
        }

        .email_address {
          margin-top: 10px;

          input {
            width: 450px;
            margin-left: 50px;
            padding-left: 8px;
            height: 60px;
            border: 1Px solid #C8C5C6;
            border-radius: 1Px;
            display: block;
            float: left;
          }

          button {
            width: 150px;
            height: 60px;
            border: 1Px solid #C8C5C6;
            border-radius: 1Px;
            color: #fff;
            background: linear-gradient(90deg, #a260a4, #c777c9);
          }
        }
      }

      .addVehicle-button {
        width: 620px;
        height: 88px;
        background: linear-gradient(90deg, rgba(162, 96, 164, 1), rgba(199, 119, 201, 1));
        border-radius: 44px;
        margin: 0 auto;
        margin-top: 60px;
        text-align: center;
        line-height: 88px;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(245, 246, 248, 1);
      }
    }

    .cube-dialog-title-def {
      text-align: left;
    }

  }
</style>
