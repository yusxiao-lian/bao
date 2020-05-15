<template>
  <div class="orderItem">
    <slot name="left"></slot>
    <div class="commodity-info" :class="{'width100':!select}">
      <div class="left-img">
        <img :src="rootPath+goodsInfo.productImg.split(',')[0]" alt="">
      </div>
      <div class="right-con">
        <h5 class="right-con-title">{{goodsInfo.goodsName}}</h5>
        <p class="right-con-detail">{{goodsInfo.description}}</p>
        <div class="right-con-bottom">
                    <span  v-if="goodsInfo.integral!=null">
                      ￥{{(Math.round(goodsInfo.goodsPrice*100)-goodsInfo.integral*100)/100}}
                    </span>
                    <span  v-else>
                      ￥{{goodsInfo.goodsPrice}}
                    </span>
          <div class="Counter-right">
            <slot name="leftBottom"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "orderItem",
    props:{
      select:{
        default:true
      },
      goodsInfo:{
        default:()=>{return{}}
      }
    },
    data(){
      return{
        customIndex:0,
        rootPath: axios.defaults.baseURL
      }
    },
    methods:{
     /* showCustomImagePreview($event) {
        this.$createImagePreview({
          imgs: [$event.target.src],
          initialIndex: this.customIndex,
          loop: false,
          speed: 500,
          onChange: (i) => {
            this.customIndex = i
          },
          onHide: () => {
            console.log('hide')
          }
        }, (h) => {
          return h('div', {
            class: {
              'image-preview-custom-header': true
            },
            slot: 'header'
          }, this.customIndex + 1)
        }).show()
      }*/
    },
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
.orderItem{
  height: 210px;
  display: flex;
  align-items: center;
  padding: 0 20px 0 30px;
  font-size: 34px;
  color: #000;
  border-bottom: 1px solid #f3f3f3;
  justify-content: space-between;
  .commodity-info{
    display: flex;
    align-items: center;
    height: 100%;
    width: calc(100% - 60px);
    .left-img{
      width: 140px;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4Px;/*no*/
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .right-con{
      height: 100%;
      padding: 20px 0;
      position: relative;
      left: 20px;
      width: calc(100% - 160px);
      .right-con-title{
        color: #000;
        font-size: 30px;
        line-height: 45px;
        margin-bottom: 5px;
      }
      .right-con-detail{
        color: #989898;
        font-size: 12Px;/*no*/
        line-height: 32px;
        max-height: 60px;
        overflow: hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        word-break:break-all;
      }
      .right-con-bottom{
        position: absolute;
        bottom: 20px;
        left: 0px;
        padding-right: 0px;
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .Counter-right{

        }
      }
    }
  }
  .commodity-info.width100{
    width: 100%;
  }
}
</style>
