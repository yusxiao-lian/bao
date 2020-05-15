<template>
  <section class="personalCenter">
    <div class="infomation">
      <div class="photo">
        <img :src="allUserInfo.userPic?baseUrl+allUserInfo.userPic:icoBg" />
      </div>
      <div class="info">
        <div class="user">
          <div class="name">{{personalMessageForm.name}}</div>
          <div>
            <div class="identity" v-if="!authFlag">
              <!--如登录，加上类active即可-->
              <i></i>
              {{authFlag?'用户已认证':'用户未验证'}}
            </div>
            <div
              v-if="authFlag"
              :class="{'identity-state':true,'identity-img2':allUserInfo.ownerType==1||allUserInfo.ownerType==11,'identity-img4':allUserInfo.ownerType==2,'identity-img3':allUserInfo.ownerType==3}"
            ></div>
            <div class="identity-state identity-img1" v-if="allUserInfo.employeeApply"></div>
          </div>
        </div>
        <div class="energy" @click="toUserPoint">
          <i></i>
          <div class="score">
            <p>{{allUserInfo.point}}</p>
            <p>能量值</p>
          </div>
        </div>
      </div>
    </div>
    <div class="function">
      <h3>业主服务</h3>
      <div class="module">
        <ul>
          <li @click="toServer('房间')">
            <img src="../../assets/img/personalCenterIcon1.png" class="img1" />
            <p>房间</p>
          </li>
          <li @click="toServer('缴费')">
            <img src="../../assets/img/personalCenterIcon2.png" class="img1" />
            <p>缴费</p>
          </li>
          <li @click="toServer('报修')">
            <img src="../../assets/img/personalCenterIcon3.png" class="img1" />
            <p>报修</p>
          </li>
          <li @click="toServer('车辆')">
            <img src="../../assets/img/personalCenterIcon4.png" class="img1" />
            <p>车辆</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="function">
      <h3>
        订单管理
        <span class="more" @click="toMyOrder('全部订单')">
          <span>全部订单</span>
        </span>
      </h3>
      <div class="module">
        <ul>
          <li @click="toMyOrder('待付款')">
            <img src="../../assets/img/personalCenterIcon5.png" class="img2" />
            <p>待付款</p>
            <span
              class="charge"
              v-if="messageNum.noPaymentCount>0"
            >{{messageNum.noPaymentCount<99?messageNum.noPaymentCount:'99+'}}</span>
          </li>
          <li @click="toMyOrder('待收货')">
            <!--<span class="tag">99+</span>-->
            <img src="../../assets/img/personalCenterIcon6.png" class="img2" />
            <p>待收货</p>
            <span
              class="charge"
              v-if="messageNum.noReceivingCount>0"
            >{{messageNum.noReceivingCount<99?messageNum.noReceivingCount:'99+'}}</span>
          </li>
          <li @click="toMyOrder('待评价')">
            <img src="../../assets/img/personalCenterIcon7.png" class="img2" />
            <p>待评价</p>
            <span
              class="charge"
              v-if="messageNum.noEvaluateCount>0"
            >{{messageNum.noEvaluateCount<99?messageNum.noEvaluateCount:'99+'}}</span>
          </li>
          <li @click="toMyOrder('已完成')">
            <img src="../../assets/img/personalCenterIcon8.png" class="img2" />
            <p>已完成</p>
            <span
              class="charge"
              v-if="messageNum.recpiptCount>0"
            >{{messageNum.recpiptCount<99?messageNum.recpiptCount:'99+'}}</span>
          </li>
        </ul>
      </div>
    </div>
    <p class="my-topic-enter" @click="()=>{$router.push('/myTopic')}">我的话题</p>
    <p class="my-topic-enter" @click="()=>{$router.push('/myComment')}">我的评论</p>
    <div class="operation" :style="{'bottom': inside_page ? '90px' : 0}">
      <span @click="loginOut()">退出登录</span>
    </div>
    <!--自动认证弹框-->
    <div class="personalCenter-bounced" v-if="isShow">
      <div class="bounced-content">
        <h2>自动认证通过</h2>
        <div class="bounced-item" v-for="(v,i) in houseList">
          <h3>
            {{v.communityName}}
            <span v-if="i==0">当前房屋</span>
          </h3>
          <p>{{v.communityName}}{{v.buildingName}}{{v.houseName}}</p>
          <span class="certification">已认证</span>
        </div>

        <div v-if="houseList.length>2" class="gengduo" @click="toServer('房间')">查看更多 ></div>
        <div class="prompt">我们已为您开通物业缴费、报修投诉等功能</div>
        <div class="bounced-button" @click="shutDown">好的</div>
      </div>
    </div>
  </section>
</template>
<script>
import { getHouseList } from "../../service/House";
import * as api from "../../service/vehicle";
import * as system from "@/service/system";
import * as personalMessage from "@/service/personalMessage";
import icoBg from "../../assets/comm_ico_head.png";
import qr_code from "../../assets/qr_code.png";
import axios from "axios";

export default {
  name: "personalMessage",
  props: {
    inside_page: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: false,
      houseListCertification: [], //自动认证房间数据
      baseUrl: "http://" + window.location.host,
      icoBg, //头像
      qr_code, //二维码
      personalMessageForm: {
        name: "",
        phone: "",
        email: ""
      },
      PMList: {},
      imgFile: null,
      imgFilePath: "",
      userInfo: null,
      allUserInfo: {},
      authFlag: false,
      messageNum: {
        noEvaluateCount: 0,
        noPaymentCount: 0,
        noReceivingCount: 0, //待收货的件数
        recpiptCount: 0
      },
      enable: true,
      communitys: "",
      citys: [], //项目区域
      communitys: [], //项目数据
      houseList: [] //项目房间
    };
  },
  methods: {
    toUserPoint() {
      this.$router.push({ name: "userPoint" });
    },
    // -------------
    // 获取项目区域
    async getCity() {
      const toast = this.$createToast({ time: 0, txt: "" }).show();
      let res = await system.getCity();
      toast.hide();
      if (res) {
        console.log(1);
        if (res.error.err_code === "0") {
          this.citys = res.list.map(v => {
            return Object.assign(v, {
              value: v.id,
              text: v.name
            });
          });
          await this.getCommunityList({
            cityName: this.citys[0].text,
            // appType: 'yezhuApp',
            communityType: "notparks"
          });
          console.log(this.citys, "aaaaaaa");
        } else {
          this.citys = [];
          this.Toast(res.error.err_msg);
        }
      }
    },
    // 获取项目
    async getCommunityList(params) {
      let res = await system.getCommunityList(params);
      if (res) {
        console.log(2);
        if (res.error.err_code === "0") {
          let arr = [];
          res.list.forEach(v => {
            v.list.forEach(k => {
              arr.push(k);
            });
          });
          this.communitys = arr.map(v => {
            return Object.assign(v, {
              value: v.id,
              text: v.name
            });
          });
          console.log(this.communitys, "bbbbbbb");
          await this.changeSelectCom(
            this.communitys[0].id,
            0,
            this.communitys[0].name
          );
        } else {
          this.communitys = [];
          this.Toast(res.error.err_msg);
        }
      }
    },
    // 获取当前项目的房间
    async getHouseList() {
      let data = {
        // communityId: ''
      };
      let res = await getHouseList(data);
      if (res) {
        if (res.error.err_code === "0") {
          this.houseList = res.list;
        } else {
        }
      }
    },
    //判断是否是该问卷的受访者
    async interviewees(id, token) {
      let params = {
        surveyId: this.$route.query.id
      };
      let res = await system.interviewees(params, this.userInfo.accessToken);
      if (res) {
        if (res.error.err_code === "0") {
          window.location.href =
            this.baseUrl +
            "/survey/app/wechatDetail?surveyId=" +
            id +
            "&Access-Token=" +
            token;
        } else {
          this.$createDialog({
            type: "alert",
            icon: "cubeic-alert",
            showClose: true,
            title: res.error.err_msg,
            onClose: () => {}
          }).show();
          // this.Toast(res.error.err_msg)
        }
      }
    },
    // 存取数据
    async changeSelectCom(value, index, text) {
      console.log(value, index, text, "ccccc");
      let useInfo = localStorage.getItem("userInfo");
      useInfo = useInfo ? JSON.parse(useInfo) : {};
      console.log(this.houseList);
      console.log("houseId", "YYYYYYYYYYYYYY");
      this.houseList.forEach((v, i) => {
        if (v.communityId == value) {
          if (v.approveStatus == 1) {
            useInfo.houseId = v.houseId;
            useInfo.houseName = v.houseName;
            useInfo.authFlag = true;
            console.log("简理财");
            return;
          }
        }
      });
      useInfo.communityId = value;
      useInfo.communityName = text;
      useInfo.cityId = value;
      useInfo.cityName = text;
      console.log(useInfo, "eeeeeeee");
      localStorage.setItem("userInfo", JSON.stringify(useInfo));
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      await this.getUserInfo();
      await this.getOrderCount();
      await this.customerAutoApply();
      await this.parkingEnable();
      // setTimeout(v => {
      //   let page = window.localStorage.getItem('toGoURL');
      //   page ? window.location.href = page : this.$router.push('/personalMessage')
      //   window.localStorage.removeItem('toGoURL');
      // }, 300)
    },
    // 判断是否有车辆功能
    async parkingEnable() {
      let res = await api.parkingEnable({
        communityId: this.userInfo.communityId
      });
      console.log(res, "((****");
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.enable = res.obj.enable;
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast("call getUserInfo interface exception");
      }
    },
    async getOrderCount() {
      let res = await personalMessage.getOrderCount();
      this.noReceivingCount = res.obj.noReceivingCount;
      this.messageNum = res.obj;
    },
    // 自动认证
    async customerAutoApply() {
      let res = await system.customerAutoApply({
        mobileTel: this.userInfo.loginName
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          if (res.obj.houseList.length > 0) {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
          res.obj.houseList.forEach((v, i) => {
            if (i <= 2) {
              this.houseListCertification.push(v);
            }
          });
          if (this.houseListCertification.length > 0) {
            this.userInfo.communityId = this.houseListCertification[0].communityId;
            this.userInfo.communityName = this.houseListCertification[0].communityName;
            window.localStorage.setItem(
              "userInfo",
              JSON.stringify(this.userInfo)
            );
          }
        } else {
          // this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast("call getUserInfo interface exception");
      }
    },
    toServer(type) {
      switch (type) {
        case "房间":
          this.$router.push("/HouseList");
          break;
        case "缴费":
          if (!this.authFlag) {
            this.showBtn();
            return;
          }
          this.$router.push("/payHistoryList");
          break;
        case "报修":
          if (!this.authFlag) {
            this.showBtn();
            return;
          }
          this.$router.push("/repairRecord");
          break;
        case "车辆":
          if (!this.authFlag) {
            this.showBtn();
            return;
          }
          if (!this.enable) {
            this.Toast("本社区暂未开放停车场，建议到个人中心切换社区！");
            return;
          } else {
            this.$router.push("/myVehicle");
          }
          break;
      }
    },
    showBtn() {
      this.$createDialog({
        type: "confirm",
        icon: "cubeic-alert",
        content: "未认证当前社区",
        confirmBtn: {
          text: this.communitys.length > 0 ? "切换房间" : "去认证",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
          this.$router.push("/HouseList");
        },
        onCancel: () => {}
      }).show();
    },
    toMyOrder(type) {
      switch (type) {
        case "全部订单":
          location.href =
            this.baseUrl + "/static/h5/commerce/index.html#/MyOrder";
        case "待付款":
          location.href =
            this.baseUrl +
            "/static/h5/commerce/index.html#/MyOrder?type=noPayment";
          break;
        case "待收货":
          location.href =
            this.baseUrl +
            "/static/h5/commerce/index.html#/MyOrder?type=noCollectGoods";
          break;
        case "待评价":
          location.href =
            this.baseUrl +
            "/static/h5/commerce/index.html#/MyOrder?type=noEvaluate";
          break;
        case "已完成":
          location.href =
            this.baseUrl +
            "/static/h5/commerce/index.html#/MyOrder?type=noComplete";
          break;
      }
    },
    //获取列表数据
    async getUserInfo() {
      let useInfo = localStorage.getItem("userInfo");
      useInfo = useInfo ? JSON.parse(useInfo) : {};
      let res = await personalMessage.getUserInfo({
        communityId: useInfo.communityId
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          if (!res.obj) {
            this.Toast("没有数据");
            return;
          }
          console.log(res.obj, "用户信息");
          this.name = res.obj.nameJson.name;
          this.PMList = [
            { label: "昵称", model: "name", editAble: true },
            { label: "邮箱", model: "email", editAble: true },
            { label: "手机号码", model: "phone", editAble: true }
          ];
          this.allUserInfo = res.obj;
          //ownerType : 产权业主 --业主  1 租户  2 家人  3 员工  4 潜在  5 会所会员  6 佣工  7 企业  8 业主--副业主  11;
          this.personalMessageForm.name = res.obj.nameJson.name;
          this.personalMessageForm.email = res.obj.emailJson.email
            ? res.obj.emailJson.email
            : "";
          this.personalMessageForm.phone = res.obj.phoneJson.phone;
          this.imgFilePath = axios.defaults.baseURL + res.obj.userPic;
          this.communitys = res.obj.communitys;
          res.obj.communitys.forEach(v => {
            if (v === useInfo.communityId) {
              this.authFlag = true;
              useInfo.authFlag = true;
              localStorage.setItem("userInfo", JSON.stringify(useInfo));
              console.log("认证用户");
            }
          });
          console.log(this.allUserInfo.ownerType);
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast(res.error.err_msg);
      }
    },
    // 退出登录
    async loginOut() {
      let res = await system.logout({});
      window.location.href = "/wechat/toLogin";
      window.localStorage.clear();
      localStorage.setItem("fromMerchant", true);
    },
    shutDown() {
      this.isShow = false;
      this.getUserInfo();
      this.getOrderCount();
    }
  },
  async mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    console.log(this.inside_page);
    if (this.inside_page) {
      console.log("现在是内页");
      if (this.userInfo.accessToken) {
        if (!this.userInfo.communityId) {
          await this.getHouseList();
          await this.getCity();
        } else {
          await this.getUserInfo();
          await this.getOrderCount();
          await this.customerAutoApply();
          await this.parkingEnable();
        }
      }
    } else {
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      } else {
        if (!this.userInfo.communityId) {
          await this.getHouseList();
          await this.getCity();
        } else {
          await this.getUserInfo();
          await this.getOrderCount();
          await this.customerAutoApply();
          await this.parkingEnable();
        }
      }
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.personalCenter {
  background: #f9f9f9;
  height: 100%;
  overflow: auto;
  .infomation {
    height: 250px;
    background: #fff;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    .photo {
      padding: 80px 20px 0 30px;
      img {
        width: 140px;
        height: 140px;
        border-radius: 50%;
      }
    }
    .info {
      display: flex;
      flex-wrap: wrap;
      width: 560px;
      .user {
        padding-top: 105px;
        width: 380px;
        .name {
          font-size: 36px;
          color: #333;
          margin-bottom: 15px;
          text-align: left;
        }
        .identity {
          float: left;
          display: inline-block;
          padding-right: 20px;
          border-radius: 20px;
          background-color: #dbdbdb;
          color: #fff;
          font-size: 22px;
          line-height: 40px;
          display: table;
          i {
            margin-right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: url("../../assets/img/nameplate.png") no-repeat 8px 8px
              rgba(255, 255, 255, 0.3);
            background-size: 22px 26px;
            display: inline-block;
            vertical-align: top;
          }
          &.active {
            background: #09bb07;
          }
        }
        .identity-state {
          float: left;
          width: 104px;
          height: 40px;
          display: inline-block;
          margin-left: 20px;
        }
        .identity-img1 {
          background: url("../../assets/img/1.png");
          background-size: cover;
        }
        .identity-img2 {
          background: url("../../assets/img/2.png");
          background-size: cover;
        }
        .identity-img3 {
          background: url("../../assets/img/3.png");
          background-size: cover;
        }
        .identity-img4 {
          background: url("../../assets/img/4.png");
          background-size: cover;
        }
      }
      .energy {
        position: relative;
        top: 110px;
        right: -20px;
        height: 80px;
        border-top-left-radius: 40px;
        border-bottom-left-radius: 40px;
        background: #a260a4;
        display: flex;
        flex-wrap: wrap;

        i {
          margin: 10px 10px 0 10px;
          margin-right: 0;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: url("../../assets/img/flash.png") no-repeat 15px 15px
            rgba(102, 102, 102, 0.3);
          background-size: 28px 33px;
          display: inline-block;
          vertical-align: middle;
        }
        .score {
          width: 90px;
          text-align: center;
          margin-top: 10px;
          display: inline-block;
          p {
            display: block;
            font-size: 22px;
            color: #fff;
            line-height: 1.2;
            &:first-child {
              font-size: 28px;
            }
          }
        }
      }
    }
  }
  .function {
    height: 272px;
    background: #fff;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    h3 {
      position: relative;
      padding-left: 30px;
      width: 100%;
      height: 86px;
      line-height: 86px;
      font-size: 28px;
      color: #333;
      font-weight: 700;
      border-bottom: 1px solid #f2f2f2;
      .more {
        position: absolute;
        top: 5px;
        right: 50px;
        width: 400px;
        height: 100%;
        font-size: 24px;
        color: #333;
        text-align: right;
        line-height: 86px;
        > span {
          display: inline-block;
        }
        &:after {
          content: "";
          display: inline-block;
          width: 13px;
          height: 13px;
          border-top: 2px solid #333;
          border-right: 2px solid #333;
          transform-origin: center center;
          transform: rotateZ(45deg) translateY(-5px);
          vertical-align: middle;
        }
      }
    }
    .module {
      width: 100%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          position: relative;
          width: 25%;
          .img1 {
            margin: 0 auto;
            width: 76px;
            height: 76px;
          }
          .img2 {
            margin: 0 auto;
            width: 76px;
            height: 76px;
          }
          .tag {
            position: absolute;
            top: -5px;
            left: 50%;
            margin-left: 10px;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            color: #fc974f;
            font-size: 24px;
            text-align: center;
            background: #fff;
            border: 1px solid #fc974f;
            border-radius: 20px;
            z-index: 10;
          }
          p {
            text-align: center;
            font-size: 24px;
            color: #333333;
          }
          .charge {
            min-width: 45px;
            height: 32px;
            display: inline-block;
            background: rgba(255, 255, 255, 1);
            border: 2px solid rgba(253, 145, 75, 1);
            border-radius: 16px;
            background-color: #fff;
            position: absolute;
            right: 25px;
            top: 0;
            font-size: 24px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(252, 148, 78, 1);
            line-height: 32px;
            text-align: center;
          }
        }
      }
    }
  }

  .operation {
    // position: absolute;
    margin: 40px 0;
    bottom: 0;
    left: 0;
    padding: 20px 40px;
    width: 750px;
    height: 100px;
    text-align: center;
    line-height: 60px;
    z-index: 1;
    color: #333;
    font-size: 32px;
    background: rgba(255, 255, 255, 1);
    //box-shadow: 0px -5px 9px 0px rgba(0, 0, 0, 0.1);
  }

  .personalCenter-bounced {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 2;
    .bounced-content {
      width: 640px;
      background: rgba(255, 255, 255, 1);
      border-radius: 22px;
      margin: 0 auto;
      margin-top: 200px;
      padding: 0 30px;
      padding-bottom: 30px;
      h2 {
        line-height: 134px;
        text-align: center;
        font-size: 36px;
        font-family: PingFang;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
      }
      .bounced-item {
        width: 580px;
        height: 156px;
        border-radius: 10px;
        background-image: url("../../assets/register-bg.png");
        background-size: cover;
        border-top: 6px solid rgba(115, 209, 113, 1);
        padding-top: 30px;
        padding-left: 30px;
        margin-bottom: 24px;
        position: relative;
        h3 {
          font-size: 36px;
          font-family: PingFang;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 20px;
          span {
            margin-left: 12px;
            width: 108px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            background: linear-gradient(
              90deg,
              rgba(115, 209, 113, 1),
              rgba(161, 223, 159, 1)
            );
            border-radius: 17px;
            display: inline-block;
            font-size: 22px;
            font-family: PingFang;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }
        }
        p {
          font-size: 28px;
          font-family: PingFang;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .certification {
          width: 120px;
          height: 48px;
          display: inline-block;
          background-image: url("../../assets/img/tag1.png");
          background-size: cover;
          position: absolute;
          right: 0;
          top: 48px;
          font-size: 28px;
          font-family: PingFang;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 48px;
          text-align: center;
        }
      }
      .gengduo {
        height: 40px;
        line-height: 40px;
        font-size: 26px;
        font-family: PingFang;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        margin-bottom: 60px;
      }
      .prompt {
        text-align: center;
        font-size: 26px;
        font-family: PingFang;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 40px;
      }
      .bounced-button {
        margin: 0 auto;
        width: 446px;
        height: 80px;
        background: rgba(162, 96, 164, 1);
        border-radius: 40px;
        text-align: center;
        line-height: 80px;
        font-size: 28px;
        font-family: PingFang;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
.my-topic-enter {
  background-color: #fff;
  padding: 30px 20px;
  border-bottom: 1px solid #f9f9f9;
}
</style>
