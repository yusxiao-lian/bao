<template>
  <div class="searchComponent" :class="type?type:''">
    <input type="text" placeholder="搜索商品名称" v-model="value" readonly>
  </div>
</template>

<script>
  export default {
    name: "searchComponent",
    data() {
      return {
        val:""
      }
    },
    props:["value",'type'],
    mounted(){
      console.log(this.value,'##############@@@@');
    }
  }
</script>

<style lang="scss" scoped>
  .searchComponent {
    width: 100%;
    height: 78px;
    border-radius: 78px;
    background: white;
    background-position: 20px center;
    background-size: 38px;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    align-items: center;
    justify-content: start;
    overflow: hidden;
    > input {
      display: block;
      width: 100%;
      text-indent: 15px;
      line-height: 30px;
      font-size:30px;
      font-family:Source Han Sans CN;
      font-weight:400;
      color:rgba(150,150,150,1);
      outline: none;
    }
  }
  .hui{
    background: #eee;
    background-position: 20px center;
    background-size: 38px;
  }
</style>
