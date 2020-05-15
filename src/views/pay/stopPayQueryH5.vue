<template>
  <div id="stopPayQuery">
    <div class="title">输入车牌查询停车费</div>
    <ul class="cartNumberBtnALL">
      <template v-for="(item,index) in [1,2,3,4,5,6,7,8]">
        <li @click="clickKey(item)" v-if="item<8" :key="index">{{cartNumber[index]}}</li>
        <li @click="clickKey(item)" v-if="item==8" :class="{'active':keyNumbers==8||cartNumber.length==8}" :key="index">
          {{cartNumber[index]}}
        </li>
      </template>
    </ul>
    <div class="stopPayQuery-btn">
        <span @click="searchKeyNumber">
          确认缴费
        </span>
    </div>
    <keyboard v-if="keyboardFlag"
              v-model="cartNumber"
              :keyNumbers="keyNumbers"
              @clearKey="keyNumbers=7"
              @delKey="delKey"
              @closeKey="keyboardFlag=false"></keyboard>
  </div>
</template>

<script>
  import keyboard from '../../components/keyboardComponent/keyboard';
  import bottomButton from '../../components/bottomButton/bottomButton';
  import * as pay from '@/service/pay';

  export default {
    name: "stopPayQueryH5",
    components: {
      keyboard,
      bottomButton
    },
    data() {
      return {
        keyNumbers: 7,
        cartNumber: [],
        keyboardFlag: false,
        openid: null,
        userAgent: null
      }
    },
    watch: {
      keyboardFlag() {
        this.keyNumbers = 7;
      }
    },
    methods: {
      delKey() {
        this.keyNumbers = 7;
        if (this.cartNumber.length > 0) {
          let lastIndex = this.cartNumber.length - 1;
          this.cartNumber.splice(lastIndex, 1);
        }
      },
      async clickKey(index) {
        if ('micromessenger' == this.userAgent && !this.openid) {
          window.location.href = '/h5Pay/toStopPayQueryH5';
          return;
        }
        this.keyboardFlag = true;
        if (index == 8) {
          this.keyNumbers = 8;
        }
      },
      async searchKeyNumber() {
        if (this.cartNumber.length == 0) {
          this.Toast('请填写车牌号码');
          return;
        }
        if (this.cartNumber.length < this.keyNumbers) {
          this.Toast('车牌号码位数不够');
          return;
        }
        let numberPlate = '';
        for (let key in this.cartNumber) {
          numberPlate += this.cartNumber[key];
        }
        const toast = this.$createToast({time: 0, txt: '加载中'}).show();
        let res = await pay.h5calculatingTempCost({plateNumber: numberPlate});
        toast.hide();
        if (res && res.error) {
          if ('0' == res.error.err_code && res.obj) {
            let obj = res.obj;
            if (!obj.entranceTime) {
              this.Toast('没有数据');
              return;
            }
            let inTime = obj.entranceTime.substring(0, 4) + "-" + obj.entranceTime.substring(4, 6) + "-" + obj.entranceTime.substring(6, 8) + " " + obj.entranceTime.substring(8, 10)
              + ":" + obj.entranceTime.substring(10, 12) + ":" + obj.entranceTime.substring(12, 14);
            let outTime = obj.OrderTime.substring(0, 4) + "-" + obj.OrderTime.substring(4, 6) + "-" + obj.OrderTime.substring(6, 8) + " " + obj.OrderTime.substring(8, 10)
              + ":" + obj.OrderTime.substring(10, 12) + ":" + obj.OrderTime.substring(12, 14);
            let params = {
              plateNumber: obj.plateNumber, inTime: inTime, outTime: outTime,
              duration: obj.duration, amount: obj.UnPayAmount, openid: this.openid
            };
            window.localStorage.setItem('cartNumber', JSON.stringify(this.cartNumber));
            this.$router.push({
              name: 'temporaryStopPaySettlementH5',
              path: '/temporaryStopPaySettlementH5',
              params: params
            });
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call h5calculatingTempCost interface exception");
        }
      }
    },
    mounted() {
      this.openid = this.$route.query.openid;
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        this.userAgent = 'micromessenger';
      }
      let cartCode = JSON.parse(window.localStorage.getItem('cartNumber'));
      this.cartNumber = (cartCode && cartCode.length > 2) ? cartCode : ['粤', 'B'];
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  #stopPayQuery {
    height: 100%;
    background-image: url("../../assets/pay_bg.png");
    background-position: center bottom;
    background-size: 100% auto;
    background-repeat: no-repeat;
    overflow: hidden;
    .title {
      margin: 120px 0px;
      font-size: 20Px; /*no*/
      font-weight: 700;
      color: #000;
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
        border: 1Px solid gray; /*no*/
        display: flex;
        align-items: center;
        justify-content: center;
      }
      li:last-of-type {
        background-repeat: no-repeat;
        background-size: 80px 100px;
        background-position: center;
        background-image: url("../../assets/add_new.png");
      }
      li:last-of-type.active {
        background: white;
      }
    }
    .stopPayQuery-btn {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      margin-top: 20px;
      span {
        background-color: #00B0F3;
        color: white;
        height: 80px;
        width: 70%;
        font-size: 14Px; /*no*/
        font-weight: 700;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      span:active {
        background-color: #009edb;
      }
    }
  }
</style>
