<template>
  <div id="stopPayQuery">
    <headerTab>
      <div slot="right" class="right" @click="addvehicle">缴费说明</div>
    </headerTab>
    <div class="stopPayQuery-top">
      <div class="title">输入车牌查询停车费</div>
      <ul class="cartNumberBtnALL">
        <template v-for="(item,index) in [1,2,3,4,5,6,7,8]">
          <li @click="clickKey(item)" v-if="item<8" :key="index">{{cartNumber[index]}}</li>
          <li
            @click="clickKey(item)"
            v-if="item==8"
            :class="{'active':keyNumbers==8||cartNumber.length==8}"
            :key="index"
          >{{cartNumber[index]}}</li>
        </template>
      </ul>
      <div class="stopPayQuery-btn">
        <span @click="searchKeyNumber('you')">确认</span>
      </div>

      <div class="unlicensed" @click="searchKeyNumber('wu')">
        <span>无牌出场</span>
      </div>
    </div>
    <div class="history">
      <div class="history-top">
        <i></i>
        <span>历史车牌</span>
        <b @click="deleteArrCar">清除</b>
      </div>
      <div class="history-botton">
        <div v-for="item in arrCar" class="history-content">
          <span @click="plateClick(item)">{{item}}</span>
        </div>
        <div class="history-data" v-if="arrCar.length<1">暂无历史车牌！</div>
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
import { headerTab } from "../../components/index";
import keyboard from "../../components/keyboardComponent/keyboard";
import bottomButton from "../../components/bottomButton/bottomButton";
import * as api from "@/service/parking";

export default {
  name: "stopPayQueryH5",
  components: {
    keyboard,
    bottomButton,
    headerTab
  },
  data() {
    return {
      arrCar: [],
      keyNumbers: 7,
      cartNumber: [],
      keyboardFlag: false,
      openid: null,
      userAgent: null,
      userInfo: {}
    };
  },
  watch: {
    keyboardFlag() {
      this.keyNumbers = 7;
    }
  },
  created() {
    this.arrCar = window.localStorage.getItem("arrCar") || [];
    if (this.arrCar.length > 1) {
      this.arrCar = JSON.parse(this.arrCar);
    }
  },
  methods: {
    // 点击某个车牌直接赋值
    plateClick(item) {
      this.cartNumber = item.split("");
    },
    // 删除所有历史车牌
    deleteArrCar() {
      this.arrCar = [];
      window.localStorage.setItem("arrCar", JSON.stringify(this.arrCar));
    },
    // 缴费说明
    addvehicle() {
      this.$router.push({
        path: "/paymentinstructions",
        query: {
          communityId: this.userInfo.communityId
        }
      });
    },
    delKey() {
      this.keyNumbers = 7;
      if (this.cartNumber.length > 0) {
        let lastIndex = this.cartNumber.length - 1;
        this.cartNumber.splice(lastIndex, 1);
      }
    },
    async clickKey(index) {
      // if('micromessenger' == this.userAgent && !this.openid) {
      //   window.location.href = '/h5Pay/toStopPayQueryH5';
      //   return ;
      // }
      this.keyboardFlag = true;
      if (index == 8) {
        this.keyNumbers = 8;
      }
    },
    // 确认缴费
    async searchKeyNumber(type) {
      console.log(990);
      // 有牌
      if (type == "you") {
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
        // let data = {
        //   plateNumber: numberPlate,//缴费车牌号
        //   cid: this.$route.query.cid,//捷顺必要参数cid(二维码上获取参数)
        //   version: this.$route.query.version,//捷顺必要参数version(二维码上获取参数)
        //   usr: this.$route.query.usr,//捷顺必要参数usr(二维码上获取参数)
        //   psw: this.$route.query.psw,//捷顺必要参数psw(二维码上获取参数)
        //   communityId: this.$route.query.communityId,//项目id
        //   parkCode: this.$route.query.parkCode
        // }
        this.userInfo.plateNumber = numberPlate;

        if (
          this.arrCar.length < 3 &&
          this.arrCar.length > 0 &&
          this.arrCar.indexOf(numberPlate) == -1
        ) {
          this.arrCar.push(numberPlate);
        } else if (this.arrCar.length == 0) {
          this.arrCar.push(numberPlate);
        } else if (
          this.arrCar.length == 3 &&
          this.arrCar.indexOf(numberPlate) == -1
        ) {
          this.arrCar.splice(0, 1);
          this.arrCar.push(numberPlate);
        }
        window.localStorage.setItem("arrCar", JSON.stringify(this.arrCar));

        const toast = this.$createToast({ time: 0, txt: "加载中" }).show();
        let res = await api.h5calculatingTempCost(this.userInfo);
        toast.hide();
        if (res && res.error) {
          if ("0" == res.error.err_code && res.obj) {
            let obj = res.obj;
            if (!obj.entranceTime) {
              this.Toast("没有数据");
              return;
            }

            let outTime;
            let inTime;
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
            if (isiOS) {
              outTime =
                obj.OrderTime.substring(0, 4) +
                "/" +
                obj.OrderTime.substring(4, 6) +
                "/" +
                obj.OrderTime.substring(6, 8) +
                " " +
                obj.OrderTime.substring(8, 10) +
                ":" +
                obj.OrderTime.substring(10, 12) +
                ":" +
                obj.OrderTime.substring(12, 14);
              var arr = obj.entranceTime.split("-");
              inTime = arr[0] + "/" + arr[1] + "/" + arr[2];
            } else if (isAndroid) {
              inTime = obj.entranceTime;
              outTime =
                obj.OrderTime.substring(0, 4) +
                "-" +
                obj.OrderTime.substring(4, 6) +
                "-" +
                obj.OrderTime.substring(6, 8) +
                " " +
                obj.OrderTime.substring(8, 10) +
                ":" +
                obj.OrderTime.substring(10, 12) +
                ":" +
                obj.OrderTime.substring(12, 14);
            }
            var data1 = new Date(inTime);
            var data2 = new Date(outTime);
            var data3 = data2.getTime() - data1.getTime();
            var duration = this.functionDate(data3);
            let params = {
              parkingId: obj.parkingId,
              orderNo: obj.orderNo,
              plateNumber: obj.plateNumber,
              inTime: inTime,
              outTime: outTime,
              duration: duration,
              amount: obj.UnPayAmount,
              OrderTimes: obj.OrderTime,
              openid: this.userInfo.openid ? this.userInfo.openid : "",
              openId: this.userInfo.openId ? this.userInfo.openId : "",
              cid: this.userInfo.cid,
              version: this.userInfo.version,
              usr: this.userInfo.usr,
              psw: this.userInfo.psw,
              communityId: this.userInfo.communityId,
              parkCode: this.userInfo.parkCode,
              type: this.userInfo.parkCode,
              communityName: obj.communityName
            };
            window.localStorage.setItem(
              "cartNumber",
              JSON.stringify(this.cartNumber)
            );
            this.$router.push({
              name: "parkingPayCost",
              path: "/parkingPayCost",
              params: params
            });
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call h5calculatingTempCost interface exception");
        }
        // 无牌
      } else {
        if (this.userInfo.codeType == 1) {
          this.h5EntryOrExit();
        }
        if (this.userInfo.codeType == 2) {
          const toast = this.$createToast({ time: 0, txt: "加载中" }).show();
          let res = await api.h5JSWP(this.userInfo);
          toast.hide();
          if (res && res.error) {
            if ("0" == res.error.err_code && res.obj) {
              let obj = res.obj;
              if (!obj.entranceTime) {
                this.Toast("没有数据");
                return;
              }

              let outTime;
              let inTime;
              var u = navigator.userAgent;
              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
              var isAndroid =
                u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
              if (isiOS) {
                outTime =
                  obj.OrderTime.substring(0, 4) +
                  "/" +
                  obj.OrderTime.substring(4, 6) +
                  "/" +
                  obj.OrderTime.substring(6, 8) +
                  " " +
                  obj.OrderTime.substring(8, 10) +
                  ":" +
                  obj.OrderTime.substring(10, 12) +
                  ":" +
                  obj.OrderTime.substring(12, 14);
                var arr = obj.entranceTime.split("-");
                inTime = arr[0] + "/" + arr[1] + "/" + arr[2];
              } else if (isAndroid) {
                inTime = obj.entranceTime;
                outTime =
                  obj.OrderTime.substring(0, 4) +
                  "-" +
                  obj.OrderTime.substring(4, 6) +
                  "-" +
                  obj.OrderTime.substring(6, 8) +
                  " " +
                  obj.OrderTime.substring(8, 10) +
                  ":" +
                  obj.OrderTime.substring(10, 12) +
                  ":" +
                  obj.OrderTime.substring(12, 14);
              }
              var data1 = new Date(inTime);
              var data2 = new Date(outTime);
              var data3 = data2.getTime() - data1.getTime();
              var duration = this.functionDate(data3);
              let params = {
                parkingId: obj.parkingId,
                orderNo: obj.orderNo,
                plateNumber: "",
                inTime: inTime,
                outTime: outTime,
                duration: duration,
                amount: obj.UnPayAmount,
                OrderTimes: obj.OrderTime,
                openid: this.userInfo.openid ? this.userInfo.openid : "",
                openId: this.userInfo.openId ? this.userInfo.openId : "",
                cid: this.userInfo.cid,
                version: this.userInfo.version,
                usr: this.userInfo.usr,
                psw: this.userInfo.psw,
                communityId: this.userInfo.communityId,
                parkCode: this.userInfo.parkCode,
                type: this.userInfo.codeType,
                communityName: obj.communityName
              };
              window.localStorage.setItem(
                "cartNumber",
                JSON.stringify(this.cartNumber)
              );
              this.$router.push({
                name: "parkingPayCost",
                path: "/parkingPayCost",
                params: params
              });
            } else {
              this.Toast(res.error.err_msg);
            }
          } else {
            this.Toast("call h5calculatingTempCost interface exception");
          }
        }
      }
    },
    // 捷顺跳转页面判断
    async h5EntryOrExit() {
      console.log(9999);
      this.userInfo.plateNumber = "无牌车";
      console.log(this.userInfo);
      let res = await api.h5EntryOrExit(this.userInfo);
      if (res && res.error) {
        if (res.obj) {
          let obj = res.obj;
          if ("1005" == res.error.err_code) {
            let outTime;
            let inTime;
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
            if (isiOS) {
              outTime =
                obj.OrderTime.substring(0, 4) +
                "/" +
                obj.OrderTime.substring(4, 6) +
                "/" +
                obj.OrderTime.substring(6, 8) +
                " " +
                obj.OrderTime.substring(8, 10) +
                ":" +
                obj.OrderTime.substring(10, 12) +
                ":" +
                obj.OrderTime.substring(12, 14);
              var arr = obj.entranceTime.split("-");
              inTime = arr[0] + "/" + arr[1] + "/" + arr[2];
            } else if (isAndroid) {
              inTime = obj.entranceTime;
              outTime =
                obj.OrderTime.substring(0, 4) +
                "-" +
                obj.OrderTime.substring(4, 6) +
                "-" +
                obj.OrderTime.substring(6, 8) +
                " " +
                obj.OrderTime.substring(8, 10) +
                ":" +
                obj.OrderTime.substring(10, 12) +
                ":" +
                obj.OrderTime.substring(12, 14);
            }
            var data1 = new Date(inTime);
            var data2 = new Date(outTime);
            var data3 = data2.getTime() - data1.getTime();
            var duration = this.functionDate(data3);
            let params = {
              inTime: inTime,
              outTime: outTime,
              duration: duration,
              amount: obj.UnPayAmount,
              OrderTimes: obj.OrderTime,
              openid: this.userInfo.openid ? this.userInfo.openid : "",
              openId: this.userInfo.openId ? this.userInfo.openId : "",
              cid: this.userInfo.cid,
              version: this.userInfo.version,
              usr: this.userInfo.usr,
              psw: this.userInfo.psw,
              communityId: this.userInfo.communityId,
              parkCode: this.userInfo.parkCode,
              orderNo: obj.orderNo,
              parkingId: obj.parkingId,
              OnlineOrderNo: obj.OnlineOrderNo
                ? obj.OnlineOrderNo
                : obj.orderNo,
              type: this.userInfo.codeType
            };

            this.$router.push({
              name: "parkingPayCost",
              path: "/parkingPayCost",
              params: params
            });
          } else if ("0" == res.error.err_code) {
            this.Toast(res.error.err_msg);
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    functionDate(mss) {
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (mss % (1000 * 60)) / 1000;
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 && seconds >= 1 ? "0" + seconds : seconds;
      return hours + " :" + minutes + " :" + seconds;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("dataList"))||{};
    // ? JSON.parse(window.localStorage.getItem("dataList")) : {
    //   cid: '880075501006461',
    //   version: '2',
    //   usr: '8880075501006461',
    //   psw: '880075501006461',
    //   communityId: 'db58e56717994fbe9d8fe1aed3adf98e',//cca2c359f220485d8a046619010f81b4
    //   parkCode: '00000063',
    //   plateNumber: '',
    //   codeType: 1,
    //   equipCode: 6,
    //   type: 1,
    //   openid: 'oEQTnt-qGLl9zrJxVab6U4SdwZ1c',
    //   openId: 'oEQTnt-qGLl9zrJxVab6U4SdwZ1c'
    // };
    this.userInfo.plateNumber = "";
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.userAgent = "micromessenger";
    }
    let cartCode = JSON.parse(window.localStorage.getItem("cartNumber"));
    this.cartNumber = cartCode && cartCode.length > 2 ? cartCode : ["粤", "B"];
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
#stopPayQuery {
  height: 100%;
  // background-image: url("../../assets/pay_bg.png");
  background-position: center bottom;
  background-size: 100% auto;
  background-repeat: no-repeat;
  overflow: hidden;
  background-color: #ffffff;

  .right {
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    white-space: nowrap;
  }

  .stopPayQuery-top {
    margin-bottom: 30px;
    padding-top: 100px;
    background-color: #f9f9f9;
    padding-bottom: 40px;

    .title {
      padding-top: 117px;
      margin-bottom: 72px;
      line-height: 36px;
      font-size: 36px;
      // font-weight: 700;
      color: #999999;
      text-align: center;
    }

    .cartNumberBtnALL {
      width: 100%;
      padding: 0 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      li {
        width: 70px;
        height: 90px;
        // border: 1Px solid #CCCCCC; /*no*/
        border: 2px solid rgba(204, 204, 204, 1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      li:last-of-type {
        background-repeat: no-repeat;
        background-position: center;
        border: 0;
        // border: 2px dotted rgba(204,204,204,1);;
        background-image: url("../../assets/add_new.png");
        background-size: cover;
      }

      li:last-of-type.active {
        background: white;
      }
    }

    .stopPayQuery-btn {
      margin: 100px auto;
      height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        background: linear-gradient(
          90deg,
          rgba(162, 96, 164, 1),
          rgba(199, 119, 201, 1)
        );
        color: white;
        height: 88px;
        width: 320px;
        font-size: 32px;
        // font-weight: 700;
        border-radius: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      span:active {
        background-color: rgba(162, 96, 164, 1);
      }
    }

    .unlicensed {
      text-align: center;
      text-decoration: underline;
    }
  }

  .history {
    height: 100%;
    background-color: #f9f9f9;
    padding: 30px;
    color: #1a1a1a;
    font-size: 30px;
    // padding-top: 15px;

    .history-top {
      i {
        width: 42px;
        height: 42px;
        background-image: url("../../assets/img/carManagement.png");
        background-size: cover;
        display: inline-block;
        vertical-align: middle;
        margin-right: 17px;
      }

      b {
        width: 100px;
        height: 42px;
        color: #a260a4;
        font-size: 28px;
        line-height: 42px;
        text-align: right;
        // background-image: url("../../assets/img/delete.png");
        // background-size: cover;
        // display: inline-block;
        // vertical-align: middle;
        float: right;
        // vertical-align: middle;
      }
    }

    .history-botton {
      margin-top: 40px;
      width: 100%;

      .history-content {
        width: 33.33%;
        float: left;
        text-align: center;

        span {
          width: 180px;
          height: 80px;
          line-height: 80px;
          color: #999999;
          font-size: 26px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(109, 109, 109, 0.2);
          border-radius: 4px;
          display: inline-block;
        }
      }

      .history-data {
        padding: 50px 0;
        text-align: center;
        color: #999999;
          font-size: 28px;
      }
    }
  }
}
</style>
<style lang="scss">
// #stopPayQuery {
//   .back-arrow {
//     display: none;
//   }
// }
</style>
