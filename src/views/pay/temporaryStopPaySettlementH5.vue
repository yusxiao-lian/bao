<template>
  <div id="temporaryStopPaySettlementH5" class="temporaryStopPaySettlement">
    <div class="settlementAmount">
      <p>您的应缴费用为</p>
      <div>￥{{this.amount}}</div>
    </div>
    <ul class="stopTime">
      <li>
        <span>车牌号码</span><span>{{this.plateNumber}}</span>
      </li>
      <li>
        <span>入场时间</span><span>{{this.inTime}}</span>
      </li>
      <li>
        <span>计费截止</span><span>{{this.outTime}}</span>
      </li>
      <li>
        <span>停车时长</span><span>{{this.duration}}</span>
      </li>
    </ul>
    <div class="sc-tip">温馨提示：请在缴费完成后，15分钟内出场！</div>
    <paySelect @getPayType="getPayType"></paySelect>
    <bottomButton class="jsapi_ticket" @click="toPay" :bgColor="`white`">确定缴费</bottomButton>
  </div>
</template>

<script>
  import axios from "axios";
  import paySelect from '../../components/paySelectComponent/paySelect';
  import bottomButton from '../../components/bottomButton/bottomButton';
  import * as pay from '@/service/pay';

  export default {
    name: "temporaryStopPaySettlementH5",
    components: {
      paySelect,
      bottomButton
    },
    data() {
      return {
        gateID: this.$route.params.gateID,
        plateNumber: this.$route.params.plateNumber,
        inTime: this.$route.params.inTime,
        outTime: this.$route.params.outTime,
        duration: this.$route.params.duration,
        amount: this.$route.params.amount,
        openid: this.$route.params.openid,
        userAgent: null
      }
    },
    methods: {
      getPayType() {
      },
      async payFn(obj) {
        let wxPay = document.getElementById('wx').checked;
        let alipay = document.getElementById('zhf').checked;
        let attach = {};
        attach.plateNumber = obj.plateNumber;
        attach.amount = obj.UnPayAmount;
        attach.inTime = obj.entranceTime;//.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
        attach.outTime = obj.OrderTime;
        attach.orderNo = obj.OrderNo;
        attach.parkingId = obj.parkingId;
        attach.onlineOrderNo = obj.OnlineOrderNo;
        if ('micromessenger' == this.userAgent) {
          if (!this.openid) {
            window.location.href = '/h5Pay/toStopPayQueryH5';
            return;
          }
          attach.methodName = 'weixinJSAPI';
          attach.openid = this.openid;
          let res = await pay.tempCost(attach);
          if (res && res.error) {
            if ('0' == res.error.err_code) {
              if (!res.obj) {
                this.Toast('没有数据');
                return;
              }
              let data = res.obj.weixinJSAPI;
              let appId = data.appId;
              let timeStamp = data.timeStamp;
              let nonceStr = data.nonceStr;
              let pack = data.package;//'prepay_id=' + data.prepay_id;
              let paySign = data.paySign;
              let prepayid = data.prepayid;
              let signType = data.signType;
              let duration = obj.duration;
              WeixinJSBridge.invoke('getBrandWCPayRequest', {
                appId: appId,
                timeStamp: timeStamp,
                nonceStr: nonceStr,
                package: pack,
                signType: signType,
                paySign: paySign
              }, wxRes => {
                if (wxRes.err_msg == "get_brand_wcpay_request:ok") { //成功
                  window.location.href = axios.defaults.baseURL + '/h5Pay/toStopPayQueryH5';
                } else if (wxRes.err_msg == "get_brand_wcpay_request:cancel") { //取消
                  this.Toast('取消支付');
                } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") { //失败
                  this.Toast('支付失败');
                }
              });
            } else {
              this.Toast(res.error.err_msg);
            }
          } else {
            this.Toast("call unifiedOrder interface exception");
          }
        } else {
          if (wxPay) {
            attach.methodName = 'weixinH5';
            let res = await pay.tempCost(attach);
            if (res && res.error) {
              if ('0' == res.error.err_code) {
                if (!res.obj || !res.obj.weixinH5) {
                  this.Toast('没有数据');
                  return;
                }
                let data = res.obj.weixinH5;
                window.location.href = data.mweb_url + '&redirect_url=' + axios.defaults.baseURL + '/h5Pay/toStopPayQueryH5';
              } else {
                this.Toast(res.error.err_msg);
              }
            } else {
              this.Toast("wxPay call unifiedOrder interface exception");
            }
          } else if (alipay) {
            attach.methodName = 'alipayH5';
            let aliPayRes = await pay.tempCost(attach);
            if (aliPayRes && aliPayRes.error) {
              if ('0' == aliPayRes.error.err_code) {
                if (!aliPayRes.obj) {
                  this.Toast('没有数据');
                  return;
                }
                let data = aliPayRes.obj.alipayH5;
                const div = document.createElement('div');
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
      async toPay() {
        if ('0' == this.amount) {
          this.Toast('不用缴费');
          return;
        }
        if (!this.plateNumber || !this.amount || !this.inTime || !this.outTime) {
          window.location.href = '/h5Pay/toStopPayQueryH5';
          return;
        }
        if (!document.getElementById('wx').checked && !document.getElementById('zhf').checked) {
          this.Toast('请选择支付方式');
          return;
        }
        this.queryParkingFn();
      },
      async queryParkingFn() {
        const toast = this.$createToast({time: 0, txt: '加载中'}).show();
        let queryRes;
        if (this.gateID) {
          queryRes = await pay.h5scanCalculatingTempCost({gateID: this.gateID});
        } else {
          queryRes = await pay.h5calculatingTempCost({plateNumber: this.plateNumber});
        }
        if (queryRes && queryRes.error) {
          if ('0' == queryRes.error.err_code && queryRes.obj) {
            let obj = queryRes.obj;
            if (!obj.OrderTime) {
              this.Toast('没有数据');
              if (this.gateID) {
                window.location.href = '/h5Pay/toScanPay';
              } else {
                window.location.href = '/h5Pay/toStopPayQueryH5';
              }
              return;
            }
            this.plateNumber = obj.plateNumber;
            let outT = obj.OrderTime.substring(0, 4) + "-" + obj.OrderTime.substring(4, 6) + "-" + obj.OrderTime.substring(6, 8) + " " + obj.OrderTime.substring(8, 10)
              + ":" + obj.OrderTime.substring(10, 12) + ":" + obj.OrderTime.substring(12, 14);
            this.outTime = outT;
            this.duration = obj.duration;
            if ('0' == obj.UnPayAmount) {
              toast.hide();
              this.Toast('不用缴费');
              return;
            }
            if (this.amount < obj.UnPayAmount) {
              this.amount = obj.UnPayAmount;
              toast.hide();
              this.$createDialog({
                type: 'confirm',
                title: '温馨提示',
                content: '停车时长加长，费用已增加，确定缴费吗？',
                onConfirm: () => {
                  this.payFn(obj);
                },
                onCancel: () => {
                  window.location.href = '/h5Pay/toStopPayQueryH5';
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
          if (this.gateID) {
            this.Toast("call h5scanCalculatingTempCost interface exception");
          } else {
            this.Toast("call h5calculatingTempCost interface exception");
          }
        }
        toast.hide();
      }
    },
    mounted() {
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        this.userAgent = 'micromessenger';
        document.getElementById('wx').checked = true;
        document.getElementById('alipay').style.display = 'none';
      } else if (ua.match(/Alipay/i) == 'alipay') {
        this.userAgent = 'alipay';
        document.getElementById('zhf').checked = true;
        document.getElementById('wechat').style.display = 'none';
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  #temporaryStopPaySettlementH5 {
    background-color: white;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }

  .sc-tip {
    text-align: left;
    color: red;
    font-size: 24px;
    line-height: 40px;
    margin-bottom: 40px;
  }

  .temporaryStopPaySettlement {
    padding: 0 60px;
    .settlementAmount {
      text-align: center;
      > p {
        color: #000;
        margin: 120px 0 0px 0;
      }
      > div {
        margin: 30px 0 150px 0;
        font-size: 26Px; /*no*/
        color: red;
        font-weight: 700;
      }
    }
    .stopTime {
      border-bottom: 1Px solid #dcdc; /*no*/
      border-top: 1Px solid #dcdc; /*no*/
      margin-bottom: 20px;
      li {
        height: 100px;
        display: flex;
        align-items: center;
        font-size: 16Px;
        justify-content: space-between;
        span:nth-of-type(2) {
          color: #000;
        }
      }
    }
  }
</style>
<style type="text/scss" lang="scss">
  #temporaryStopPaySettlementH5 {
    .chargeProject-btn {
      box-shadow: 0 0 0 0 ;
      span {
        width: 70%;
        background: linear-gradient(to right, #00B0F3, #00B0F3);
      }
    }
  }
</style>
