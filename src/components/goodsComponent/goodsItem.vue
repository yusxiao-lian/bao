<template>
  <div class="goodsItem" @click="$emit('click')">
    <div class="projectImg-box">
      <img v-if="goodsInfo.employee && staffFlag" class="yuangong" src="../../assets/yuanggongpai.png" alt="">
      <img class="projectImg" v-lazy="baseUrl+goodsInfo.imageUrl.split(',')[0]" alt="">
      <div class="goods-sold" :style="{'background-color':$store.state.bgColor}">已售 {{goodsInfo.sold}}</div>
    </div>
    <h5>{{goodsInfo.name}}</h5>
    <div class="price-box">
      <div class="left-price">
        <span class="red">￥<b>{{Number(goodsInfo.salesPrice).toFixed(2)}}</b> </span>
        <span class="hui" v-if='goodsInfo.salesPrice<goodsInfo.marketPrice'>￥{{Number(goodsInfo.marketPrice).toFixed(2)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {baseUrl}from '../../service/configUrl'
  import { mapState} from 'vuex'
  export default {
    name: "goodsItem",
    data(){
      return{
        baseUrl
      }
    },
    computed: {
      ...mapState({
        staffFlag: state => state.staffFlag,

      })
    },
    props:{
      goodsInfo:{
        default:()=>{return{}}
      }
    },
    mounted(){
    }
  }
</script>

<style lang="scss" scoped>
.goodsItem{
  width: 100%;
  min-height: 440px;
  border-radius: 6px;/*no*/
  box-shadow: 0 0 6px #dcdcdc;/*no*/
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
  padding: 20px;

  .projectImg-box{
    position: relative;
    width: 100%;
    height: 300px;
    img.projectImg{
      display: block;
      width: 100%;
      height: 100%;
    }
    img.yuangong{
      left: 0;
      bottom: 0;
      width: 106px;
      height: 106px;
      position: absolute;
      z-index: 2;
    }
    .goods-sold{
      position: absolute;
      right: 0;
      background: #A260A4;
      color: white;
      height: 45px;
      border-top-left-radius: 45px;
      border-bottom-left-radius: 45px;
      line-height: 45px;
      padding: 0 10px 0 20px;
      bottom: 0;
      z-index: 3;
      font-size: 24px;
    }
  }

  >h5{
    height: 60px;
    width: 100%;
    color: #000;
    margin-top: 10px;
    font-weight: 500;
    line-height: 60px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font-size: 28px;
    vertical-align: middle;
  }
  >h5:before{
    content: '';
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
  .price-box{
    overflow: hidden;
    height: 40px;
    >div{
      margin-top: 10px;
    }
    .left-price{
      width: 100%;
      float: left;
      .red{
        color: red;
      }
      .hui{
        text-decoration:line-through;
        color: #969696;
      }
    }
  }
}
</style>
