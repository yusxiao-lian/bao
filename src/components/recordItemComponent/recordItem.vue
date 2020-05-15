<template>
  <div class="recordItem">
    <div class="wrapper-top">
      <div class="left">
        <i :style="{'background-image': `url(${icoImg})`}"></i>
        <span>{{recordItemData.title.label}}</span>
      </div>
      <div class="right">
        {{recordItemData.title.state}}
      </div>
    </div>
    <ul @click="$emit('click')">
      <li v-for="item in recordItemData.content" class="wrapper-middle">
        <div class="left">
          <span> {{item.label}}:</span>
        </div>
        <div class="right">
          <span> {{item.value}}</span>
        </div>
      </li>
    </ul>

    <div class="recordItem-imgs" v-if="recordItemData.imgList.length>0">
      <publicSlide :slideData="recordItemData.imgList">
        <ul v-setScrollWidth="recordItemData.imgList.length">
          <li v-for="(item,index) in recordItemData.imgList" :key="index">
            <img :src="item" alt="" @click="clickZoom(index,recordItemData.imgList)">
          </li>
        </ul>
      </publicSlide>
    </div>
  </div>
</template>

<script>
  import img from '../../assets/logo.png'
  import ico1 from '../../assets/baoxiu-ico.png'
  import ico2 from '../../assets/PHL-parking.png'
  import ico3 from '../../assets/PHL-property.png'
  export default {
    name: "recordItem",
    props:{
      recordItemData:{
        default(){
          return {
            type:'',
            title:{
              label:'状态类型',
              state:'状态情况'
            },
            content:[
            ],
            imgList:[img,img,img,img,img,img,img,img,img,img,img]
          }
        },
        type:Object
      }
    },
    data(){
      return{
        icoImg:ico1
      }
    },
    methods:{
      clickZoom(index,imgList){
        this.$createImagePreview({
          initialIndex: index,
          imgs:imgList
        }).show()
      },
    },
    mounted(){
      console.log(this.recordItemData,'0000')
      switch (this.recordItemData.type) {
        case 'releaseBarDetailed':
          this.icoImg=ico1
          break
        case 'complaintProgress':
          this.icoImg=ico2
          break
        case 'renovationApplyDetailed':
          this.icoImg=ico3
          break
        case 'repairProgress':
          this.icoImg=ico1
          break
        default:
          this.icoImg=ico1
      }
    }
  }
</script>

<style lang="scss" scoped>
.recordItem{
  padding: 0 25px;
  background-color: white;
  margin-top: 40px;
  overflow: hidden;
  .wrapper-top{
    height: 100px;
    display: flex;
    align-items: center;
    >div{
      width: 50%;
    }
    .left{
      display: flex;
      align-items: center;
      justify-content: start;
      span{
        font-size: 32px;
        color: #333;
      }
    }
    .left i{
      display: inline-block;
      width: 50px;
      height: 50px;
      /*background-image: url("../../../assets/goods_ico.png");*/
      background-repeat: no-repeat;
      background-position: center;
      background-size: 50px;
      margin-right: 20px;
    }
    .right{
      text-align: right;
      font-size:14Px;/*no*/
      color: #A260A4;
    }
  }
  .wrapper-middle{
    min-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .left,.right{
      min-height: 60px;
      display: flex;
      align-items: center;
      font-size: 14Px;/*no*/
      overflow: hidden;
      span{
        line-height: 18Px;/*no*/;
      }
    }
    .right{
      max-width: calc(100% - 232px);
    }
    .left{
      width: 230px;
      text-align: left;
    }

    .left:before{
      content: '';
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 100%;
      background-color: #dcdc;
      margin: 15px;
    }

  }
  .recordItem-imgs{
    width: 100%;
    height: 150px;
    margin-top: 20px;
    margin-bottom: 40px;
    overflow: hidden;
    ul{
      overflow: hidden;
      li{
        float: left;
        height: 150px;
        width: 150px;
        padding-right: 20px;
        box-sizing: content-box;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
