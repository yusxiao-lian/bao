<template>
  <div class="chargeProject-btn" :style="{'background-color': bgColor}">
        <span @click="$emit('click')">
          <slot>提交</slot>
        </span>
  </div>
</template>

<script>
    export default {
        name: "bottomButton",
      props:{
          bgColor:{
            default:'#F8F8F8',
            type:String
          }
      }
    }
</script>

<style lang="scss" scoped>
  .chargeProject-btn{
    // position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    background-color: #F8F8F8;
    span{
      background-color:#00B0F3;
      color: white;
      height: 80px;
      width: 70%;
      font-size: 14Px;/*no*/
      font-weight: 700;
      border-radius:100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
