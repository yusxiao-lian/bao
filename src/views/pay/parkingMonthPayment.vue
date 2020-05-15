<template>
  <div id="parkingMonthPayment">
    <ul class="parkingMonthPayment-main">
      <li v-for="(item,key) in parkingMonthPaymentRules" :key="key">
        <!-- <inputCell :label="item.label" @clickFn="clickFn(item,key)" :required="item.require" :select="item.select"> -->
        <inputCell :label="item.label" :required="item.require" :select="item.select">
          <template slot="input">
            <input :type="item.type" :placeholder="item.placeholder" v-model="parkingMonthPaymentForm[key]"
              @keyup="keyupFn(key, parkingMonthPaymentForm[key])" :readonly="item.readonly">
          </template>
        </inputCell>
      </li>
    </ul>
    <div class="paySelect">
      <paySelect @getPayType="(v)=>{payType=v}"></paySelect>
    </div>

    <bottomButton @click="submit">确定缴费</bottomButton>
  </div>
</template>

<script>
  import paySelect from '../../components/paySelectComponent/paySelect'
  import bottomButton from '../../components/bottomButton/bottomButton'
  import * as pay from '@/service/pay'
  export default {
    name: "parkingMonthPayment",
    components: {
      paySelect,
      bottomButton
    },
    data() {
      return {
        userInfo: null,
        expirydate: '',
        newexpirydate: '',
        payType:'',
        ActionSheetNumber:-1,
        parkingMonthPaymentForm:{
          cartNumber: this.$route.params.numberPlate,
          // cartPositionNumber:'',
          payMonth:'',
          payAmount:''
        },
        parkingMonthPaymentRules:{
          cartNumber:{
            readonly: true,
            type:'text',
            label:'车牌号码',
            placeholder:'请输入',
            require:true,
            select:false,
            orEnd:(str)=>{
              return str==''?'请填写车牌号码':false
            }
          },
          // cartPositionNumber:{
          //   type:'text',
          //   label:'车位号码:',
          //   placeholder:'请输入',
          //   require:true,
          //   select:false,
          //   orEnd:(str)=>{
          //     return str==''?'请填写车位号码':false
          //   }
          // },
          payMonth:{
            readonly: false,
            type:'text',
            label:'缴纳月数',
            placeholder:'请输入要缴纳几个月',
            require:true,
            select:false,
            orEnd:(str)=> {
              return str==''?'请输入要缴纳几个月':false
            }
          },
          payAmount: {
            readonly: true,
            type:'text',
            label:'缴纳金额',
            placeholder:'',
            require:true,
            select:false,
            orEnd:(str)=>{
              return str==''?'缴纳金额不能为空':false
            }
          }
        },
      }
    },

    methods: {
      async keyupFn(key, val) {
        if(!this.userInfo || !this.userInfo.accessToken) {
          this.toLogin();
          return ;
        }
        if('payMonth' == key) {
          let reg = /^\+?[1-9][0-9]*$/;
          if(!reg.test(val)) {
            this.Toast('请输入正整数');
            this.parkingMonthPaymentForm.payMonth = '';
            this.parkingMonthPaymentForm.payAmount = '';
            return ;
          }
        }
        let numberPlate = this.$route.params.numberPlate;
        let payMonth = this.parkingMonthPaymentForm.payMonth;
        if(numberPlate) {
          let res = await pay.queryMonthly({carCode: numberPlate, parkCode: 1}, this.userInfo.accessToken);
          if(res && res.error) {
            if('0' == res.error.err_code) {
              if(!res.obj || !res.obj.monthlyrent) {
                this.Toast('没有数据'); return ;
              }
              this.expirydate = res.obj.expirydate;
              this.newexpirydate = res.obj.newexpirydate;
              if(payMonth) {
                this.parkingMonthPaymentForm.payAmount = (res.obj.monthlyrent * payMonth);
              } else {
                this.parkingMonthPaymentForm.payAmount = '';
              }
            } else {
              this.parkingMonthPaymentForm.payAmount = '';
              this.Toast(res.error.err_msg);
            }
          } else {
            this.Toast("call queryMonthly interface exception");
          }
        } else {
          this.parkingMonthPaymentForm.payAmount = '';
        }
      },

      async submit() {
        for(let key in this.parkingMonthPaymentRules) {
          if(this.parkingMonthPaymentRules[key].require) {
            if(this.parkingMonthPaymentRules[key].orEnd(this.parkingMonthPaymentForm[key])) {
              this.Toast(this.parkingMonthPaymentRules[key].orEnd(this.parkingMonthPaymentForm[key]));
              return;
            }
          }
        }
        if(this.payType == '') {
          this.Toast('请选择支付方式');
          return ;
        }

        const toast = this.$createToast({time: 0, txt: '加载中'}).show();
        let attach = {};
        // attach.tpye = 'monthPay';
        // let res = await pay.unifiedOrder({attach: JSON.stringify(attach), item: '月保卡续期', orderNo: Date.parse(new Date()), totalFee: this.parkingMonthPaymentForm.payAmount}, this.userInfo.accessToken);
        // let res = await pay.unifiedOrder({item: '月保卡续期', orderNo: this.$route.params.orderNo, totalFee: this.parkingMonthPaymentForm.payAmount}, this.userInfo.accessToken);
        attach.methodName = 'weixinJSAPI';
        attach.openid = this.userInfo.openid;
        attach.carCode = this.$route.params.numberPlate;
        attach.preExpireDate = this.expirydate;
        attach.newexpirydate = this.newexpirydate;
        attach.parkCode = '1';
        attach.amount = this.parkingMonthPaymentForm.payAmount;
        let res = await pay.monthlyReNewPay(attach, this.userInfo.accessToken);
        if(res && res.error) {
          if('0' == res.error.err_code) {
            if(!res.obj) {
              this.Toast('没有数据');
              return ;
            }
            let data = res.obj.weixinJSAPI;
            let appId = data.appId;
            let timeStamp = data.timeStamp;
            let nonceStr = data.nonceStr;
            let pack = data.package;//'prepay_id=' + data.prepay_id;
            let sign = data.paySign;
            let signType = data.signType;
            let duration = this.$route.params.duration;
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
              appId : appId,
              timeStamp : timeStamp,
              nonceStr : nonceStr,
              package : pack,
              signType : signType,
              paySign : sign
            }, wxRes => {
              if (wxRes.err_msg == "get_brand_wcpay_request:ok") { //成功
                window.location.href = 'http://h5.eipss.com.cn/static/h5/wechat/index.html#/myCart';
              } else if (wxRes.err_msg == "get_brand_wcpay_request:cancel") { //取消
                this.Toast('取消支付');
              } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") { //失败
                this.Toast('支付失败');
              }
            });
          } else {
            if('login' == res.error.err_code) {
              this.toLogin();
            } else {
              this.Toast(res.error.err_msg);
            }
          }
        } else {
          this.Toast("call unifiedOrder interface exception");
        }
        toast.hide();

      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if(!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      }
      document.getElementById('wx').checked = true;
      this.payType = 2;
      document.getElementById("alipay").style.display='none';
    }
  }
</script>

<style lang="scss" scoped>
  #parkingMonthPayment{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background-color: #F8F8F8;
    .parkingMonthPayment-main{
      margin: 40px 0px;
      padding: 0 41px;
      background-color: white;
      li{
        height: 120px;
        border-bottom: 1Px solid #dcdcdc;/*no*/
      }
      li:last-of-type{
        border-bottom: 0px;
      }
    }
    .paySelect{
      background-color: white;
      padding: 0 25px;
    }
  }
</style>
