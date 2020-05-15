<template>
  <div class="headerSearchPage" @click.stop="clickPage" v-if="value" @touchmove="clickPage">
    <div class="headerSearch">
      <div class="back-arrow" @click="clickBack(fn)"></div>
      <div class="headerSearch-box">
        <input ref="searbox" type="text" autofocus="true" v-model="searchValue" placeholder="搜索周边商城或商品" @blur="$emit('input',false)">
      </div>
      <div class="headerSearch-btn" @click="clickSearch">
        <span>搜索</span>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "headerSearch",
    props:['value','fn'],
    data(){
      return{
        searchValue:''
      }

    },
    watch:{
      value(){
        if(this.value){
          this.$nextTick(()=>{
            this.$refs.searbox.focus()
          })
        }
      }
    },
    activated(){
      if(this.value){
        this.$nextTick(()=>{
          this.$refs.searbox.focus()
        })
      }
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
      },
      clickPage($event){
        if($event.target.className=='headerSearchPage'){
          this.$emit('input',false)
        }
      },
      clickSearch(){
        this.$emit('input',false)
        this.$emit('getSearchValue',this.searchValue)
      }
    },
    mounted(){
      if(this.value){
        this.$nextTick(()=>{
          setTimeout(v=>{
            this.$refs.searbox.focus()
          },500)

        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .headerSearchPage{
    height: 100%;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 4;
    background-color: rgba(255, 255, 255, 0.24);

    .headerSearch{
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      overflow: hidden;
      position: absolute;
      justify-content: space-between;
      top: 0;
      left: 0;
      background-color: #A260A4;
      z-index: 3;
      padding: 0 20px 0 0;
      .back-arrow{
        height: 100%;
        width: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:before{
          content: '';
          width: 13Px;/*no*/
          height: 13Px;/*no*/
          border-bottom: 1Px solid #fff;/*no*/
          border-left: 1Px solid #fff;/*no*/
          transform: rotateZ(45deg);
        }
      }
      .headerSearch-box{
        width: calc(100% - 210px);
        height:78px;
        border-radius: 78px;
        background:white url("../../assets/01_banner_search.png") no-repeat;
        background-position: 20px center;
        background-size: 38px;
        padding-left: 60px;
        padding-right: 30px;
        display: flex;
        align-items: center;
        justify-content: start;
        overflow: hidden;
        border: 1Px solid #E2E2E2;/*no*/
        >input{
          display: block;
          width: 100%;
          text-indent: 20px;
          line-height: 30px;
          font-size: 30px;
          outline: none;
        }
      }
      .headerSearch-btn{
        width: 100px;
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 60px;
        justify-content: center;
        background-color: #A260A4;
        border-radius: 60px;
        span{
          color: white;
          font-size: 32px;
        }
      }
    }
  }
  @keyframes showS {
    0%{
      transform: translateY(300px);
    }
    0%{
      transform: translateY(0px);
    }
  }
</style>
