<template>
  <div class="footerBtn" :class="color" @click="$emit('click')"><span><slot></slot></span></div>
</template>

<script>
  export default {
    name: "footerBtn",
    props:{
      color:{
        default:'redWhite'//颜色 redWhite  whiteBlack
      }
    }
  }
</script>

<style lang="scss" scoped>
.footerBtn{
  width: 240px;
  height: 90px;
  border-radius: 6px;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  -webkit-justify-content: center;
  justify-content: center;
  align-items: center;
  /*-webkit-box-align: center;*/
  -webkit-align-items: center;
  /*-ms-flex-align: center;*/
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  span{

  }
}
  .redWhite{
    background-color: red;
    color: white;
  }
  .whiteBlack{
    background-color: white;
    border: 1Px solid #7f7f7f;/*no*/
  }
  .addAddressBtn{
    width: 100%;
    border-radius: 90px;
    background-color: #A260A4;
    color: white;
  }
  .deleteAddressBtn{
    width:300px;
    border-radius: 90px;
    background-color: white;
    border: 1Px solid #7f7f7f;/*no*/
  }
  .saveAddressBtn{
    width:300px;
    border-radius: 90px;
    color: white;
    background-color: #A260A4;
  }
</style>
