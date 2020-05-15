<template>
    <div id="toast">
      <div>
        <span>{{text}}</span>
      </div>
    </div>
</template>

<script>
  export default {
    name: "toast",
    data(){
      return{

      }
    },
    props:{
      text:{
        default:'这是提示信息',
        type:String
      },
    }
  }
</script>

<style lang="scss" scoped>
  #toast{
    position: fixed;
    left: 0%;
    bottom: 15%;
    width: 100%;
    font-size: 14Px;/*no*/
    color: white;
    border-radius: 4Px;/*no*/
    animation: toastSlider .3s 1;
    overflow: hidden;
    text-align: center;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    div{
      max-width: 95%;
      background-color: rgba(117, 117, 117, 1);
      padding: 20px 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4Px;/*no*/
      span{
        line-height: 1.5;
      }
    }

  }
  @-webkit-keyframes toastSlider {
    0%{
      opacity: 0;
      transform: translateY(500%);
    }
    100%{
      opacity: 1;
      transform:translateY(0%);
    }
  }
  @keyframes toastSlider {
    0%{
      opacity: 0;
      transform: translateY(500%);
    }
    100%{
      opacity: 1;
      transform:translateY(0%);
    }
  }
</style>
