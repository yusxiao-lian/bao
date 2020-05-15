<template>
    <div class="scoreComponent">
      <ul>
        <li :class="{'active':item}" v-for="(item,index) in dataList" @click="$emit('input',index+1)"></li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "scoreComponent",
    props:{
      value:{
        default:5,
      },
    },
    computed:{
      dataList(){
        let arr=[]
        for(let i=0;i<5;i++){
          if(i<this.value){
            arr.push(true)
          }else {
            arr.push(false)
          }
        }
        return arr
      }
    }
  }
</script>

<style lang="scss" scoped>
.scoreComponent{
  overflow: hidden;
  >ul{
    height: 50px;
    li{
      width: 50px;
      height: 50px;
      background:#D9D9D9 url("../../assets/start-ico.png") no-repeat center;
      background-size: 50px;
      float: left;
      margin-right: 15px;
      transition: all .3s;
    }
    li.active{
      background-color: #FD8548;
    }
  }
}
</style>
