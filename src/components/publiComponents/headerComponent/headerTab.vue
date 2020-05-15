<template>
    <div class="headerTab">
      <div class="back-arrow" @click="clickBack(fn)"></div>
      <slot name="middle">
        <span class="title">{{title}}</span>
      </slot>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: "headerTab",
    props:{
      title:{
        default:'标题'
      },
      fn: {
        type: Function
      },
    },
    methods:{
      clickBack(fn){
        if(!fn){
          if(this.$route.query.fromApp){
            //返回app
            try {
              window.webkit.messageHandlers.goBack.postMessage('');
              return
            }catch (e) {

            }
            try {
              window.jsObject.goBack()
              return
            }catch (e) {

            }
          }
          console.log(this.$route.query.fromApp,'返回')
          this.$router.goBack()
        }else {
         fn()
        }
      }
    },
    data(){
      return{

      }
    }
  }
</script>

<style lang="scss" scoped>
.headerTab{
  height: 100px;
  width: 100%;
  background-color: #A260A4;
  display: flex;
  align-items: center;
  text-align: center;
  position: absolute;
  justify-content: center;
  color: #000;
  font-size: 36px;
  z-index: 3;
  top: 0;
  left: 0;
  border-bottom: 1Px solid #e3e3e3;/*no*/
  .back-arrow{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before{
      content: '';
      width: 13Px;/*no*/
      height: 13Px;/*no*/
      border-bottom: 1px solid #fff;/*no*/
      border-left: 1px solid #fff;/*no*/
      transform: rotateZ(45deg);
    }
  }
  .title{
    display: inline-block;
    width: 520px;
    overflow: hidden;
    text-align: center;
    line-height:50px ;
    font-weight: 500;
    color: #fff;
    height: 50px;
  }
  .right{
    height: 100%;
    min-width:100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 10px;
    color: #fff;
  }
}
</style>
