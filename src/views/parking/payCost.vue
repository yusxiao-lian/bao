<template>
  <div id="temporaryStopPaySettlementH5" class="temporaryStopPaySettlement">
    <div class="settlementAmount">
      <span>{{this.plateNumber}}</span>
      <div class="discounts" @click="isShow = true" v-if="Number(parkingInfo.discountAmount)>0">充电优惠</div>
    </div>
    <ul class="stopTime">
      <li>
        <span>入场时间</span>
        <span>{{this.inTime}}</span>
      </li>
      <li>
        <span>出场时间</span>
        <span>{{outTime}}</span>
      </li>
      <li>
        <span>停车时长</span>
        <span>{{this.duration}}</span>
      </li>
      <li>
        <span>订单金额</span>
        <span>{{amount}}元</span>
      </li>
      <li v-if="DiscountAmountFlag">
        <span>优惠金额</span>
        <span>{{this.parkingInfo.discountAmount||''}}元</span>
      </li>
      <li>
        <span>缴费金额</span>
        <span>{{actualAmount}}元</span>
      </li>
    </ul>
    <paySelect @getPayType="getPayType"></paySelect>
    <div class="sc-tip">
      <span>温馨提示：</span>请在缴费完成后，15分钟内出场！
    </div>
    <!-- <button @click="discountClick" class="discount" v-if="Number(parkingInfo.discountAmount)>0">充电优惠</button> -->
    <bottomButton class="operation" @click="toPay" :bgColor="'white'">确定缴费</bottomButton>
    <div class="popBg" v-if="isShow">
      <div class="popWin">
        <div class="them">输入充电订单号查询优惠</div>
        <div>
          <input type="text" class="input" v-model="chargeOrderNum" />
        </div>
        <div class="btn" @click="youhuiOk">确认</div>
      </div>
      <div class="popBg-mask" @click="isShow=false"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import paySelect from "../../components/paySelectComponent/paySelect";
import { bottomButton } from "../../components/index";
// import * as pay from '@/service/pay';
import * as api from "@/service/parking";
import { getParkSettings } from "@/service/vehicle";
export default {
  name: "temporaryStopPaySettlementH5",
  components: {
    paySelect,
    bottomButton
  },
  data() {
    return {
      plateNumber: this.$route.params.plateNumber,
      inTime: this.$route.params.inTime,
      outTime: this.$route.params.outTime,
      duration: this.$route.params.duration,
      amount: this.$route.params.amount,
      openid: this.$route.params.openid ? this.$route.params.openid : "",
      openId: this.$route.params.openId ? this.$route.params.openId : "",
      userAgent: null,
      dataList: {
        orderNo: this.$route.params.orderNo,
        plateNumber: this.$route.params.plateNumber,
        inTime: this.$route.params.inTime,
        outTime: this.$route.params.outTime,
        duration: this.$route.params.duration,
        amount: this.$route.params.amount,
        OrderTime: this.$route.params.OrderTimes,
        openid: this.$route.params.openid ? this.$route.params.openid : "",
        openId: this.$route.params.openId ? this.$route.params.openId : "",
        cid: this.$route.params.cid,
        version: this.$route.params.version,
        usr: this.$route.params.usr,
        psw: this.$route.params.psw,
        communityId: this.$route.params.communityId,
        parkCode: this.$route.params.parkCode,
        type: this.$route.params.type,
        parkingId: this.$route.params.parkingId
      },
      parkingInfo: {},
      chargeOrderNum: "", //南网充电订单号
      DiscountAmount: "", //抵扣金额
      DiscountAmountFlag: false, //是否可以抵扣
      isShow: false
    };
  },
  computed: {
    actualAmount() {
      if (this.DiscountAmountFlag && Object.keys(this.parkingInfo).length > 0) {
        let num =
          Math.round(
            Number(this.amount) * 100 -
              Number(this.parkingInfo.discountAmount) * 100
          ) / 100;
        if (num < 0) {
          return 0;
        } else {
          return num;
        }
      } else {
        return this.amount;
      }
    }
  },
  methods: {
    
    discountClick() {
      this.isShow = true;
      // this.$createDialog({
      //   type: "prompt",
      //   icon: "",
      //   showClose: true,
      //   title: "输入充电订单号查询优惠",
      //   prompt: {
      //     autofocus: true,
      //     placeholder: "输入充电订单号"
      //   },
      //   onConfirm: (e, promptValue) => {
      //     this.chargeOrderNum = promptValue;
      //     console.log(promptValue, "promptValuepromptValue");
      //     if (!promptValue) {
      //       this.Toast("请填写充电订单号");
      //       return;
      //     }
      //     this.h5findChargeOrder();
      //   }
      // }).show();
    },
    //优惠查询确认
    youhuiOk() {
      if (!this.chargeOrderNum) {
        this.Toast("请填写充电订单号");
        return;
      }
      this.h5findChargeOrder();
    },
    // 查询南网订单号判断是否有充电优惠
    h5findChargeOrder() {
      const toast = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      }).show();
      return api
        .h5findChargeOrder({
          orderNo: this.chargeOrderNum, //this.$route.params.orderNo,//充电订单号
          paringkNo: this.parkingInfo.nwParkingNo,
          discountAmount: this.parkingInfo.discountAmount,
          carCode: this.plateNumber, //车牌
          communityId: this.$route.params.communityId
        })
        .then(res => {
          toast.hide();
          this.isShow = false;
          if (res.error.err_code == "0") {
            this.DiscountAmountFlag = true;
            this.$createDialog({
              type: "alert",
              title: "",
              content: `您好，本次停车已优惠${this.parkingInfo.discountAmount}元，请完成停车缴费，谢谢！`,
              icon: ""
            }).show();
          } else {
            this.DiscountAmountFlag = false;
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          toast.hide();
          this.DiscountAmountFlag = false;
          this.Toast(err);
        });
    },
    //查询停车场信息
    getParkSettings() {
      // let communityId = "";
      // try {
      //   communityId = JSON.parse(window.localStorage.getItem("dataList"))
      //     .communityId;
      // } catch (error) {
      //   communityId = JSON.parse(window.localStorage.getItem("userInfo"))
      //     .communityId;
      // }

      return getParkSettings({
        communityId: this.$route.params.communityId
      })
        .then(res => {
          if (res.error.err_code == "0") {
            this.parkingInfo = res.obj;
          } else {
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          this.Toast(err);
        });
    },
    getPayType() {},
    async payFn(obj) {
      let attach = {};
      let _this = this;
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android 终端
      if (isiOS) {
        let arr = obj.inTime.replace(/:/g, "").replace(/ /g, "");
        let arr1 = arr.split("/");
        attach.inTime = arr1[0] + arr1[1] + arr1[2];
      } else if (isAndroid) {
        attach.inTime = obj.inTime
          .replace(/-/g, "")
          .replace(/:/g, "")
          .replace(/ /g, "");
      }

      console.log(attach.inTime, "HHHHHHHHH");
      let wxPay = document.getElementById("wx").checked;
      let alipay = document.getElementById("zhf").checked;
      attach.plateNumber = obj.plateNumber ? obj.plateNumber : "无牌车"; //车牌号
      attach.amount = this.actualAmount; //obj.amount; //缴费金额
      attach.outTime = obj.OrderTime; //出场时间
      attach.orderNo = obj.orderNo;
      attach.parkingId = obj.parkingId;
      attach.onlineOrderNo = obj.OnlineOrderNo;
      attach.cid = obj.cid;
      attach.version = obj.version;
      attach.usr = obj.usr;
      attach.psw = obj.psw;
      attach.communityId = obj.communityId;
      attach.type = obj.type;
      attach.openid = obj.openid;
      attach.openId = obj.openId;
      attach.equipCode = "";
      attach.parkCode = obj.parkCode;
      attach.onlineOrderNo = obj.orderNo;
      if ("micromessenger" == this.userAgent) {
        if (!this.dataList.openid) {
          // window.location.href = '/h5Pay/parkingQueryCard';
          this.$router.push({
            name: "parkingQueryCard"
          });
          return;
        }
        attach.methodName = "weixinJSAPI";
        if (this.DiscountAmountFlag) {
          attach.discountAmount = this.parkingInfo.discountAmount; //南网充电优惠抵扣金额
          attach.nwOrderNo = this.chargeOrderNum; //南网订单号
          attach.nwParkingNo = this.parkingInfo.nwParkingNo; //南网停车场编号
        }

        let res = await api.tempCost(attach);
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            if (!res.obj) {
              this.Toast("没有数据");
              return;
            }
            let data = res.obj.weixinJSAPI;
            let appId = data.appId;
            let timeStamp = data.timeStamp;
            let nonceStr = data.nonceStr;
            let pack = data.package; //'prepay_id=' + data.prepay_id;
            let paySign = data.paySign;
            let prepayid = data.prepayid;
            let signType = data.signType;
            let duration = obj.duration;
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              {
                appId: appId,
                timeStamp: timeStamp,
                nonceStr: nonceStr,
                package: pack,
                signType: signType,
                paySign: paySign
              },
              wxRes => {
                if (wxRes.err_msg == "get_brand_wcpay_request:ok") {
                  //成功
                  // window.location.href = axios.defaults.baseURL + '/h5Pay/toStopPayQueryH5';
                  this.Toast("支付成功");
                  setTimeout(() => {
                    _this.$router.replace({
                      path: "/payResults",
                      query: {
                        amount: _this.actualAmount
                          ? _this.actualAmount
                          : "0.00", //支付金额
                        plateNumber: _this.plateNumber, //车牌号
                        inTime: _this.inTime, //入场时间
                        duration: _this.duration, //停车时长
                        OrderTimes: _this.$route.params.OrderTimes, //出场时间
                        communityName: _this.$route.params.communityName
                        // orderNo:attach.orderNo
                      }
                    });
                  }, 500);
                } else if (wxRes.err_msg == "get_brand_wcpay_request:cancel") {
                  //取消
                  this.Toast("取消支付");
                } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") {
                  //失败
                  this.Toast("支付失败");
                }
              }
            );
          } else if ("01" == res.error.err_code) {
            this.Toast("支付成功");
            setTimeout(() => {
              _this.$router.replace({
                path: "/payResults",
                query: {
                  amount: _this.actualAmount ? _this.actualAmount : "0.00", //支付金额
                  plateNumber: _this.plateNumber, //车牌号
                  inTime: _this.inTime, //入场时间
                  duration: _this.duration, //停车时长
                  OrderTimes: _this.$route.params.OrderTimes, //出场时间
                  communityName: _this.$route.params.communityName
                  // orderNo:attach.orderNo
                }
              });
            }, 500);
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call unifiedOrder interface exception");
        }
      } else {
        if (wxPay) {
          attach.methodName = "weixinJSAPI";
          let res = await api.tempCost(attach);
          if (res && res.error) {
            if ("0" == res.error.err_code) {
              if (!res.obj || !res.obj.weixinH5) {
                this.Toast("没有数据");
                return;
              }
              let data = res.obj.weixinH5;
              window.location.href =
                data.mweb_url +
                "&redirect_url=" +
                axios.defaults.baseURL +
                "/h5Pay/toStopPayQueryH5";
            } else {
              this.Toast(res.error.err_msg);
            }
          } else {
            this.Toast("wxPay call unifiedOrder interface exception");
          }
        } else if (alipay) {
          attach.methodName = "alipayH5";
          let aliPayRes = await api.tempCost(attach);
          if (aliPayRes && aliPayRes.error) {
            if ("0" == aliPayRes.error.err_code) {
              if (!aliPayRes.obj) {
                this.Toast("没有数据");
                return;
              }
              let data = aliPayRes.obj.alipayH5;
              const div = document.createElement("div");
              div.innerHTML = data;
              document.body.appendChild(div);
              document.forms[0].submit();
            } else {
              this.Toast(aliPayRes.error.err_msg);
            }
          } else {
            this.Toast("alipay call unifiedOrder interface exception");
          }
        }
      }
    },
    show() {
      this.isShow = true;
    },
    async toPay() {
      if ("0" == this.amount) {
        this.Toast("不用缴费");
        return;
      }
      // if (!this.plateNumber || !this.amount || !this.inTime || !this.outTime) {
      //   window.location.href = '/h5Pay/parkingQueryCard';
      //   return;
      // }
      if (
        !document.getElementById("wx").checked &&
        !document.getElementById("zhf").checked
      ) {
        this.Toast("请选择支付方式");
        return;
      }
      // let obj = {
      //   plateNumber:this.$route.params.plateNumber,
      //   amount:this.$route.params.UnPayAmount,
      //   inTime:this.$route.params.OrderTime
      // }
      this.payFn(this.dataList);
    },
    async queryParkingFn() {
      const toast = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      }).show();
      let queryRes;
      let data = {
        plateNumber: this.$route.params.plateNumber, //缴费车牌号
        cid: this.$route.params.cid, //捷顺必要参数cid(二维码上获取参数)
        version: this.$route.params.version, //捷顺必要参数version(二维码上获取参数)
        usr: this.$route.params.usr, //捷顺必要参数usr(二维码上获取参数)
        psw: this.$route.params.psw, //捷顺必要参数psw(二维码上获取参数)
        communityId: this.$route.params.communityId, //项目id
        parkCode: this.$route.params.parkCode
      };

      queryRes = await api.h5calculatingTempCost();
      if (queryRes && queryRes.error) {
        if ("0" == queryRes.error.err_code && queryRes.obj) {
          let obj = queryRes.obj;
          if (!obj.OrderTime) {
            this.Toast("没有数据");
            return;
          }
          this.plateNumber = obj.plateNumber;
          // let outT = obj.OrderTime.substring(0, 4) + "-" + obj.OrderTime.substring(4, 6) + "-" + obj.OrderTime.substring(6, 8) + " " + obj.OrderTime.substring(8, 10)
          //   + ":" + obj.OrderTime.substring(10, 12) + ":" + obj.OrderTime.substring(12, 14);
          // this.outTime = outT;
          // this.duration = obj.duration;
          if ("0" == obj.UnPayAmount) {
            toast.hide();
            this.Toast("不用缴费");
            return;
          }
          if (this.amount < obj.UnPayAmount) {
            this.amount = obj.UnPayAmount;
            toast.hide();
            this.$createDialog({
              type: "confirm",
              title: "温馨提示",
              content: "停车时长加长，费用已增加，确定缴费吗？",
              onConfirm: () => {
                this.payFn(obj);
              },
              onCancel: () => {
                window.location.href = "/h5Pay/parkingQueryCard";
              }
            }).show();
          } else {
            this.amount = obj.UnPayAmount;
            toast.hide();
            this.payFn(obj);
          }
        } else {
          this.Toast(queryRes.error.err_msg);
        }
      } else {
        this.Toast("call h5calculatingTempCost interface exception");
      }
      toast.hide();
    }
  },
  mounted() {
    this.getParkSettings();
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.userAgent = "micromessenger";
      document.getElementById("wx").checked = true;
      document.getElementById("alipay").style.display = "none";
    } else if (ua.match(/Alipay/i) == "alipay") {
      this.userAgent = "alipay";
      document.getElementById("zhf").checked = true;
      document.getElementById("wechat").style.display = "none";
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
#temporaryStopPaySettlementH5 {
  background-color: #f8f8f8;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.temporaryStopPaySettlement {
  padding: 0;

  .settlementAmount {
    position: relative;
    width: 750px;
    height: 220px;
    background-image: url("../../assets/img/bannerBg1.jpg");
    background-size: cover;

    span {
      position: absolute;
      top: 89px;
      left: 80px;
      font-size: 48px;
      color: #fff;
    }

    .discounts {
      position: absolute;
      top: 30px;
      right: 0;
      width: 183px;
      height: 60px;
      line-height: 60px;
      font-size: 26px;
      color: #ec5c4f;
      text-indent: 60px;
      background: rgba(255, 255, 255, 1);
      border-radius: 30px 0px 0px 30px;
      &:before {
        position: absolute;
        top: 15px;
        right: 135px;
        content: "";
        width: 30px;
        height: 30px;
        background-image: url("../../assets/img/chargingPile.png");
        background-size: cover;
        display: inline-block;
      }
    }
  }

  .stopTime {
    padding: 0 35px;
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.02);

    li {
      height: 80px;
      line-height: 80px;
      display: flex;
      align-items: center;
      font-size: 32px;
      justify-content: space-between;
      border-bottom: 1px solid #f7f5f6; /*no*/
      &:last-child {
        border-bottom: 0;
      }

      span:nth-of-type(2) {
        color: #000;
      }
    }
  }
  // .discount {
  //   position: absolute;
  //   right: 20px;
  //   top: 20px;
  //   background: #c777c9;
  //   line-height: 50px;
  //   padding: 0px 20px;
  //   height: 60px;
  //   color: white;
  //   font-size: 28px;
  //   border-radius: 8px;
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: center;
  // }
  .sc-tip {
    padding: 40px 32px;
    text-align: left;
    height: 40px;
    line-height: 40px;
    font-size: 28px;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    margin-bottom: 10px;
    span {
      font-weight: bold;
    }
  }
  .popBg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10;
    .popWin {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -215px;
      margin-left: -282px;
      padding: 0 42px;
      width: 564px;
      height: 430px;
      background: rgba(255, 255, 255, 1);
      border-radius: 22px;
      z-index: 11;
      .them {
        padding: 60px 0;
        text-align: center;
        font-size: 30px;
        color: rgba(102, 102, 102, 1);
      }
      .input {
        margin-bottom: 60px;
        padding: 0 10px;
        width: 480px;
        height: 88px;
        line-height: 88px;
        background: rgba(255, 255, 255, 1);
        border: 2px solid rgba(204, 204, 204, 1);
        border-radius: 4px;
        font-size: 34px;
      }
      .btn {
        width: 480px;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        background: linear-gradient(
          90deg,
          rgba(162, 96, 164, 1),
          rgba(199, 119, 201, 1)
        );
        border-radius: 40px;
      }
    }
    .popBg-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
  .operation {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
  }
}
</style>