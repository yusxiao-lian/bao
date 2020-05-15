<template>
    <div class="inputCell">
      <span class="Stars" v-show="required">*</span>
      <div class="inputCell-main">
        <div class="inputCell-label">
          <span>
             {{label}}
          </span>
        </div>
        <div class="inputCell-input" :class="{'switch':elementType=='switch','textarea':elementType=='textarea'}" @click="$emit('clickFn')">
          <slot name="input"></slot>
        </div>
      </div>
      <span class="arrow" v-show="select">

      </span>
    </div>
</template>

<script>
  export default {
    name: "inputCell",
    props:{
      select:{
        default:false,//是否显示右边三角箭头
        type:Boolean
      },
      required:{
        default:true,//是否显示星星表示必选
        type:Boolean
      },
      label:{
        default:'放行的时段放的时段',//输入框的描述
        type:String
      },
      elementType:{
        default:'input',
        type:String
      }
    },
    data(){
      return{
      }
    },
    methods:{

    },
    mounted(){
    }
  }
</script>

<style lang="scss" scoped>
.inputCell{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  position: relative;
  padding: 0 25px 0 40px;
  .Stars{
    position: absolute;
    color: red;
    font-size: 26Px;/*no*/
    left: 5px;
    top:60px;
    margin-top: 12px;
    transform: rotateZ(0deg) translateY(-50%);
  }
  .arrow{
    position: absolute;
    width: 10Px;/*no*/
    height: 10Px;/*no*/
    right: 0px;
    top: 50%;
    transform: rotateZ(-45deg) translateY(-50%);
    border-bottom: 1Px solid #ccc;/*no*/
    border-right: 1Px solid #ccc;/*no*/
  }
  .inputCell-main{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    .inputCell-label{
      width: 150px;
      height: 120px;
      display: flex;
      align-items: center;
      text-align: left;
      span{
        text-align: left;
        line-height: 18Px;/*no*/
        color: #2B2B2B;
        font-size: 15Px;/*no*/

      }
    }
    .inputCell-input{
      width: calc(100% - 150px);
      height: 100%;
      display: flex;
      align-items: center;
      text-align: left;
      input{
        padding: 43px 0 43px 30px;
        font-size: 15Px;/*no*/
        width: 100%;
      }
    }
    .switch{
      flex-direction: row-reverse;
    }
    .textarea{
      padding-top: 40px;
      padding-bottom: 20px;
      line-height: 20Px;/*no*/
      textarea{
        display: block;
        width: 100%;
        padding-left: 30px;
        max-height: 200px;
      }
    }

  }
}
</style>
