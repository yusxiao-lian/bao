<template>
  <div class="StoreName-select">
    <input id="commodityl" type="checkbox" v-model="checkboxValue" @change="changecheckboxValue">
    <label for="commodityl"></label>
  </div>
</template>

<script>
  export default {
    name: "checkbox",
    props:['value'],
    watch:{
      checkboxValue(){
        // this.$emit('input',this.checkboxValue)
        // this.$emit('change')
      },
      value(){
        this.checkboxValue=this.value
      }
    },
    data(){
      return{
        checkboxValue:false
      }
    },
    methods:{
      changecheckboxValue(){
        this.$emit('input',this.checkboxValue)
        this.$emit('change')
      }
    },
    mounted(){
      this.checkboxValue=this.value
    }
  }
</script>

<style lang="scss" scoped>
  .StoreName-select{
    width: 44px;
    height: 44px;
    border: 1px solid #dcdcdc;/*no*/
    overflow: hidden;
    position: relative;
    border-radius: 100%;
    input{
      position: absolute;
      opacity: 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    input:checked + label{
      transition: .3s;
      background-color: #A260A4;
      &:before{
        content: '';
        width: 10px;
        height: 25px;
        border-bottom: 2px solid #ffffff;/*no*/
        border-right: 2px solid #ffffff;/*no*/
        position: absolute;
        left: 45%;
        top: 45%;
        transition: all .3s 2s;
        transform: scale(1) translate(-50%,-50%) rotateZ(35deg);
      }
    }
    label{
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      background-color: #fff;
      &:before{
        content: '';
        width: 10px;
        height: 25px;
        border-bottom: 2px solid #ffffff;/*no*/
        border-right: 2px solid #ffffff;/*no*/
        position: absolute;
        left: 45%;
        top: 45%;
        transform: scale(1) translate(-50%,-50%) rotateZ(35deg);
      }
    }
  }
</style>
