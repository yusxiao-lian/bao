<template>
    <div id="paySelect">
      <div class="zfb" id='alipay'>
        <div class="left">
          <i></i>
          <div>
            <div style="font-weight: 700">支付宝支付</div>
            <div>推荐有支付宝账号使用</div>
          </div>
        </div>
        <div class="right">
          <input id="zhf" type="checkbox" v-model="payActive" value="1" @change="checkboxChange(1)">
          <label for="zhf">
          </label>

        </div>
      </div>
      <div class="wx" id='wechat'>
        <div class="left">
          <i></i>
          <div>
            <div style="font-weight: 700">微信支付</div>
            <div>微信快捷支付</div>
          </div>
        </div>
        <div class="right">
          <input id="wx" type="checkbox" v-model="payActive" value="2" @change="checkboxChange(2)">
          <label for="wx">
          </label>
        </div>
      </div>
    </div>
</template>

<script>
  import zfb from '../../../assets/ad_pay_ico_zfb.png'
  import wx from '../../../assets/ad_pay_ico_wx.png'
  export default {
    name: "paySelect",
    data(){
      return{
        payActive:[],
        active:''
      }
    },
    watch:{
    },
    methods:{
      checkboxChange(index){
        if(index==this.active){
          this.payActive=[]
          this.active=''
        }else {
          this.payActive=[index]
          this.active=index
        }
        this.$emit('getPayType',this.active)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #paySelect{
    background-color: white;
    width: 100%;
    >div{
      height: 150px;
      border-bottom: 1px solid #dcdcdc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      .left{
        display: flex;
        align-items: center;
        line-height: 20Px;/*no*/
      }
      .right{
        width: 40px;
        height: 40px;
        border-radius: 100%;
        border: 1px solid #dcdcdc;/*no*/
        box-sizing: content-box;
        position: relative;
        overflow: hidden;
        label{
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
        input{
          width: 100%;
          height: 100%;
          opacity: 0;
          background-color: transparent;
        }
        input:checked + label{
          transition: all .3s;
          background-color: #00b1f1;
        }
        input:checked + label:before{
          transition: all .3s;
          position: absolute;
          left: 55%;
          top: 36%;
          content: '';
          width: 28px;
          height: 13px;
          border-left: 2px solid white;/*no*/
          border-bottom: 2px solid white;/*no*/
          transform: translate(-50%,-50%) rotate(-45deg);
        }
      }
      i{
        width: 85px;
        height: 85px;
        display: inline-block;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 85px;
        margin-right: 20px;
      }
    }
    div:first-of-type{
      i{
        background-image: url("../../../assets/ad_pay_ico_zfb.png");
      }
    }
    div:last-of-type{
      border-bottom: none;
      i{
        background-image: url("../../../assets/ad_pay_ico_wx.png");
      }
    }
  }
</style>
