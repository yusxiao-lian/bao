<template>
  <div class="goodsItem" @click="$emit('click')">
    <div class="projectImg-box">
      <img v-if="goodsInfo.employee && staffFlag" class="yuangong" src="../../assets/yuanggongpai.png" alt="">
      <img class="projectImg" v-lazy="baseUrl+goodsInfo.imageUrl.split(',')[0]" alt="">
    </div>
    <div class="goodsItemCon">
      <h5>{{goodsInfo.name}}</h5>
      <div class="direc">{{goodsInfo.productDescription}}</div>
      <div class="tags-box" v-if="goodsInfo.border">
        <span>跨境</span>
      </div>
      <div class="price-box">
        <div class="left-price">
          <span class="red">￥<b>{{Number(goodsInfo.salesPrice).toFixed(2)}}</b> </span>
          <span class="hui" v-if='goodsInfo.salesPrice<goodsInfo.marketPrice'>￥{{(Number(goodsInfo.marketPrice).toFixed(2))}}</span>
        </div>
        <div class="right-price">已售{{goodsInfo.sold}}</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {baseUrl}from '../../service/configUrl'
  import { mapState} from 'vuex'
  export default {
    name: "longGoodsItem",
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
    overflow: hidden;
    background-color: white;
    padding: 30px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .projectImg-box{
      width: 200px;
      height: 200px;
      position: relative;
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
    }
    .goodsItemCon{
      width: calc(100% - 220px);
      min-height: 200px;
      >h5{
        height: 60px;
        width: 100%;
        color: #1A1A1A;
        font-weight: 500;
        line-height: 60px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size: 32px;
        vertical-align: middle;
      }
      >h5:before{
        content: '';
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
      }
      .direc{
        color: #989898;
        font-size: 24px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-bottom: 16px;
        line-height: 44px;
      }
      .tags-box{
        >span{
          display: inline-block;
          color: white;
          font-size: 24px;
          padding: 0 16px;
          height: 40px;
          border-radius: 40px;
          background: #0EACAB;
          line-height: 40px;
          text-align: center;
          margin-bottom: 10px;
          margin-right: 14px;
        }
      }
      .price-box{
        overflow: hidden;
        height: 40px;
        .left-price{
          width: 70%;
          float: left;
          line-height: 42px;
          height: 42px;
          .red{
            color: red;
          }
          .hui{
            text-decoration:line-through;
            color: #969696;
          }
        }
        .right-price{
          text-align: right;
          height: 42px;
          float: right;
          font-size: 28px;
          color: #000;
          width: 30%;
          overflow: hidden;
          line-height: 42px;
        }
      }
    }
  }
</style>
