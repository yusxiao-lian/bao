<template>
  <div class="orderItemNav">
    <slot name="left">
      <span class="shop-ico"></span>
    </slot>
    <span class="name">{{storeName}}</span>
    <span class="right"> <slot name="right"></slot></span>
  </div>
</template>

<script>
  export default {
    name: "orderItemNav",
    props:{
      storeName:{
        default:'浪卡西餐馆宝能城'
      }
    }
  }
</script>

<style lang="scss" scoped>
.orderItemNav{
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  font-size: 34px;
  color: #000;
  border-bottom: 1Px solid #dcdcdc;/*no*/
  position: relative;
  .shop-ico{
    display: inline-block;
    width: 46px;
    height: 46px;
    background: url("../../../assets/shop-ico.png") no-repeat center;
    background-size: 46px;
  }
  .name{
    display: inline-block;
    max-width: 500px;
    overflow: hidden;
    line-height: 50px;
    margin-left: 15px;
    font-weight: 600;
  }
  .right{
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
