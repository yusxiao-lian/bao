<template>
  <div class="myVehicle">
    <headerTab>
      <div v-if="enable" slot="right" class="right" @click="addvehicle">添加车辆</div>
    </headerTab>
    <div class="myVehicle-content-all" v-if="listItems.length>0">
      <cube-slide :autoPlay="false" ref="slide" :data="listItems">
        <cube-slide-item v-for="(item, index) in listItems" :key="index">
          <div class="myVehicle-box">
            <div class="myVehicle-img">
              <div
                :class="{'slide-item-img':true,'img1':item.status==2,'img2':item.status==0,'img3':item.status==1}"
              >
                <div class="div">
                  <span v-for="v in item.numberPlateS">{{v}}</span>
                </div>
                <p>
                  <span>{{item.carBrand}}</span>
                  <span>{{item.typeCar}}</span>
                  <span>{{item.color}}</span>
                </p>
              </div>
              <div class="myVehicle-content">
                <p>
                  <i class="i1"></i>
                  <span>{{item.parkingName}}</span>
                </p>
                <p>
                  <i class="i2"></i>
                  <span>{{item.state}}</span>
                </p>
                <p @click="paymentRecords(item)">
                  <i class="i3"></i>
                  <span>缴费记录查看</span>
                  <i class="arrow"></i>
                </p>
                <div v-if="item.status!=0" class="myVehicle-content-button" @click="openItem(item)">
                  <span>{{item.text}}</span>
                </div>
                <div v-if="item.status==0" class="myVehicle-content-button" @click="openPhone()">
                  <a v-if="item.status==0&&phoneNum" :href="'tel://'+phoneNum">{{item.text}}</a>
                  <span v-else>{{item.text}}</span>
                </div>
              </div>
            </div>
          </div>
        </cube-slide-item>
      </cube-slide>
    </div>
    <!--无数据-->
    <div class="content" v-if="listItems.length<1">
      <div class="content-item">
        <img src="../../assets/img/vehicle.png"/>
        <p>添加车辆</p>
        <p>足不出户办月卡</p>
        <button v-if="enable" class="content-button" @click="addvehicle">添加车辆</button>
        <button v-else class="content-none" disabled>添加车辆</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import * as api from "../../service/vehicle";

  export default {
    name: "myVehicle",
    components: {
      headerTab
    },
    data() {
      return {
        userInfo: "", //用户信息
        flag: 0,
        listItems: [], //列表数据
        phoneNum: "",
        xkyx: '',//是否第三方的申请的月卡
        enable: true,//判断是否开启了停车场功能
      };
    },
    async created() {
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
      if (this.$route.query.openid) {
        this.userInfo.accessToken = this.$route.query.accessToken
        this.userInfo.communityId = this.$route.query.communityId
        this.userInfo.houseId = this.$route.query.houseId
        this.userInfo.openid = this.$route.query.openid
      }
      console.log(this.userInfo);
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
        return;
      }
      await this.parkingEnable()
      if (!this.enable) {
        this.Toast('本社区暂未开放停车场，建议到个人中心切换社区！');
        return
      }
      if (!this.userInfo.houseId) {
        this.enable =false
        this.Toast('登录失效请重新登录或到个人中心获取最新状态！');
        return
      }
      await this.getParkSettings()
      await this.myCarList();
      await this.servicePhoneNum();
    },
    methods: {
      // 判断是否有车辆功能
      async parkingEnable() {
        let res = await api.parkingEnable({
          communityId: this.userInfo.communityId
        });
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            this.enable = res.obj.enable;
          }
        }
      },
      // 判断当前停车场
      async getParkSettings() {
        let params = {
          communityId: this.userInfo.communityId //项目id
        };
        let res = await api.getParkSettings(params);
        if (res.error.err_code == 0) {
          this.xkyx = res.obj.xkyx
          // this.xkyx = true
          console.log(this.xkyx);
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      changePage(current) {
        console.log('当前轮播图序号为:' + current)
      },
      clickHandler(item, index) {
        console.log(item, index)
      },
      // 查看缴费记录
      paymentRecords(item) {
        this.$router.push({
          path: "/instructions",
          query: {carCode: item.numberPlate}
        });
      },
      openPhone() {
        if (!this.phoneNum) {
          this.$createDialog({
            type: "alert",
            title: "该物业暂未配置电话号码",
            content: ""
          }).show();
        }
      },
      // 获取当前时间的昨天或者明天
      YesterdayTomorrow(type, date) {
        let day1;
        if (date) {
          day1 = new Date(date);
        } else {
          day1 = new Date();
        }
        if (type == "昨天") {
          day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000); //年份
        } else if (type == "明天") {
          day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000); //年份
        } else if (type == "今天") {
          day1.setTime(day1.getTime());
        }
        let month = day1.getMonth() + 1; //月份
        let strDate = day1.getDate(); //日期
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }

        let s1 = day1.getFullYear() + "-" + month + "-" + strDate;
        return s1;
      },
      // 获取我的车辆列表
      async myCarList() {
        let params = {communityId: this.userInfo.communityId};
        let res = await api.myCarList(params);
        if (res.error.err_code == 0) {
          this.listItems = res.list;
          this.listItems.forEach(v => {
            // if (this.xkyx) {
            //   v.isNewCard = false
            // }
            switch (v.status) {
              case 0:
                v.text = "咨询物业";
                v.state = "审核中";
                break;
              case 1:
                v.text = "月卡续费";
                if (v.isNewCard&&!this.xkyx) {
                  v.state =
                    this.YesterdayTomorrow("昨天", v.monthlyValidity) +
                    " 23:59 到期";
                } else {
                  v.state = v.monthlyValidity + "到期";
                }

                break;
              case 2:
                v.text = "申请月卡";
                v.state = "未开通";
                break; //结束整个switch语句
            }
            let arr = [];
            for (let i = 0; i < v.numberPlate.length; i++) {
              if (i == 2) {
                arr.push("·");
              }
              arr.push(v.numberPlate[i]);
            }
            v.numberPlateS = arr;
          });
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取项目小区电话
      async servicePhoneNum() {
        let params = {communityId: this.userInfo.communityId, type: ""};
        let res = await api.servicePhoneNum(params);
        if (res.error.err_code == 0) {
          this.phoneNum = res.obj.phoneNum;
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 判断车辆是否满足月保
      async judgement(item) {
        let params = {
          communityId: this.userInfo.communityId,
          parkingId: item.parkingId,
          type: item.status == 1 ? "monthlyPay" : "monthlyApply",
          numberPlate: item.numberPlate
        };
        let res = await api.judgement(params);
        if (res.error.err_code == 0) {
          if (item.status == 1) {
            this.$router.push({
              name: "payCost",
              path: "/payCost",
              params: {
                items: item,
                fromApp: this.$route.query.fromApp
                  ? this.$route.query.fromApp
                  : ""
              },
              query: {
                infoId: item.infoId,
                amount: item.amount,
                phoneNum: this.phoneNum,
                openid: this.$route.query.openid
              }
            });
          } else {
            this.$router.push({
              path: "/addaudit",
              query: {infoId: item.infoId}
            });
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.obj.message,
            content: ""
          }).show();
        }
      },
      // 点击状态跳转
      openItem(item) {
        // this.$router.push({path: '/addaudit', query: {infoId: item.infoId}})
        switch (item.status) {
          case 0:
            break; //结束整个switch语句
          case 1:
            this.judgement(item);
            break;
          case 2:
            this.judgement(item);
            break;
        }
      },
      // 添加车辆
      addvehicle() {
        this.$router.push({
          name: "addVehicle",
          query: {
            fromApp: this.$route.query.fromApp ? this.$route.query.fromApp : ''
          }
        });
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .myVehicle {
    overflow: auto;
    height: 100%;
    background-color: rgba(249, 249, 249, 1);
    padding-top: 120px;

    .myVehicle-content-all {
      .myVehicle-content-button {
        // margin-top: 150px;
        width: 540px;
        height: 88px;
        background: linear-gradient(
            90deg,
            rgba(162, 96, 164, 1),
            rgba(199, 119, 201, 1)
        );
        border-radius: 44px;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(245, 246, 248, 1);
        line-height: 88px;
        text-align: center;
        position: absolute;
        left: 35px;
        bottom: 20px;

        a {
          width: 540px;
          height: 88px;
          line-height: 88px;
          display: inline-block;
          color: rgba(245, 246, 248, 1);
        }
      }

      .myVehicle-content-view {
        width: 540px;
        height: 88px;
        background: linear-gradient(
            90deg,
            rgba(162, 96, 164, 1),
            rgba(199, 119, 201, 1)
        );
        border-radius: 44px;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(245, 246, 248, 1);
        line-height: 88px;
        text-align: center;
        position: absolute;
        left: 35px;
      }
    }

    .right {
      font-size: 30px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      white-space: nowrap;
    }

    .myVehicle-box {
      height: 100%;
      padding: 60px 0;
      // padding-bottom: 60px;
    }

    .myVehicle-img {
      width: 610px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10px 50px 0px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      padding-bottom: 15px;
      margin: 0 auto;
      position: relative;

      .slide-item-img {
        overflow: hidden;
        height: 420px;
        width: 610px;
        padding-left: 80px;
        font-size: 48px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 300px;

        .div {
          font-size: 48px;

          span:nth-child(3) {
            margin: 0 5px;
            font-size: 64px;
          }
        }

        p {
          line-height: 0;
          position: absolute;
          left: 80px;
          top: 250px;
          color: #fff;
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);

          span {
            margin-right: 10px;
          }
        }
      }

      .img1 {
        background-image: url("../../assets/img/yueka.png");
        background-size: cover;
      }

      .img2 {
        background-image: url("../../assets/img/wuye.png");
        background-size: cover;
      }

      .img3 {
        background-image: url("../../assets/img/xufei.png");
        background-size: cover;
      }
    }

    .myVehicle-content {
      height: 454px;
      background-color: #fff;
      padding-top: 50px;
      position: relative;

      p {
        margin: 0 auto;
        // padding-left: 60px;
        width: 490px;
        height: 28px;
        line-height: 28px;
        position: relative;
        margin-bottom: 50px;

        i {
          position: absolute;
          left: 0;
          top: 0;
          width: 28px;
          height: 28px;
          display: inline-block;
          background-size: cover;
        }

        span {
          margin-left: 50px;
          font-size: 30px;
          font-family: Source Han Sans CN;
          color: rgba(54, 56, 58, 1);
        }

        .i1 {
          background-size: cover;
          background-image: url("../../assets/img/tingche.png");
        }

        .i2 {
          background-size: cover;
          background-image: url("../../assets/img/tofindthe.png");
        }

        .i3 {
          width: 28px;
          height: 28px;
          // margin-left: 6px;
          background-size: cover;
          background-image: url("../../assets/img/shenghe.png");
        }

        .arrow {
          position: absolute;
          left: 465px;
          top: -10px;
          // display: inline-block;
          // content: "";
          // width: 16px;
          // height: 16px;
          // border: solid #999;
          // border-width: 1px 1px 0 0;
          // -webkit-transform: translate(0, -50%) rotate(45deg);
          // transform: translate(0, -50%) rotate(45deg);
          width: 50px;
          height: 50px;
          display: inline-block;
          background-size: cover;
          background-image: url("../../assets/img/arrowRight.png");
        }
      }
    }

    /*无数据*/
    .content {
      margin-top: 100px;
      height: 100%;
      padding-top: 200px;

      .content-item {
        margin: 0 auto;
        text-align: center;

        img {
          margin: 0 auto;
          margin-bottom: 43px;
        }

        p {
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 44px;
        }

        .content-button {
          width: 320px;
          height: 88px;
          background: linear-gradient(
              90deg,
              rgba(162, 96, 164, 1),
              rgba(199, 119, 201, 1)
          );
          border-radius: 44px;
          margin: 0 auto;
          margin-top: 60px;
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(245, 246, 248, 1);
          line-height: 88px;
          text-align: center;
        }

        .content-none {
          width: 320px;
          height: 88px;
          border-radius: 44px;
          margin: 0 auto;
          margin-top: 60px;
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(245, 246, 248, 1);
          line-height: 88px;
          text-align: center;
        }
      }
    }
  }
</style>
<style type="text/scss" lang="scss">
  .myVehicle {
    .cube-slide {
      .cube-slide-dots {
        span {
          width: 20px;
          height: 20px;
          background: rgba(226, 217, 226, 1);
          border-radius: 50%;
          margin: 0 4px;
        }

        .active {
          background: rgba(188, 112, 191, 1);
        }
      }
    }

    .cube-dialog-title-def {
      overflow: auto !important;
      white-space: inherit !important;
      line-height: 30px;
    }
  }

  .cube-dialog-title-def {
    text-align: left !important;
  }
</style>
