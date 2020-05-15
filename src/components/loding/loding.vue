<template>
    <div class="loding">
      <div class="loding-box">
        <img src="../../assets/loding.gif" alt="">
        <!--<div>加载中</div>-->
      </div>
    </div>
</template>
<script>
  export default {
    name: "loding"
  }
</script>

<style lang="scss" scoped>
.loding{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: transparent;
  .loding-box{
    width: 120px;
    height: 120px;
    background-color: white;
    img{
      width: 120px;
      height: 120px;
    }
    div{
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 12Px;/*no*/
      color: #cccccc;
    }
  }
}
</style>
