<template>
  <div class="headerSearchPage" @click.stop="clickPage" @touchmove="clickPage">
    <div class="headerSearch">
      <div class="back-arrow" @click="clickBack(fn)"></div>
      <div class="headerSearch-box">
        <input ref="searbox"
               type="text"
               @input="searchInput"
               autofocus="true"
               v-model="searchValue"
               placeholder="搜索商家名称">
        <!--<input ref="searbox" type="text" autofocus="true" v-model="searchValue" placeholder="搜索商品名称" @blur="$emit('input',false)">-->
        <i class="cubeic-wrong" v-show="searchValue.length>0" @click="deleteValue"></i>
      </div>
      <div class="headerSearch-btn" @click="clickSearch">
        <span>搜索</span>
      </div>
    </div>
    <div class="search-history" v-show="historyValue.length>0">
      <div class="search-history-top">
        <span>历史搜索</span>
        <i class="cubeic-delete" @click="clearHistory"></i>
      </div>
      <div class="search-history-bot">
        <div v-for="item in historyValue" @click="clickHistory(item)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "headerSearch",
    props: ['value', 'fn'],
    data() {
      return {
        searchValue: '',
        historyValue:[],
        keyCode:'',

      }
    },
    // watch: {
    //   value() {
    //     if (this.value) {
    //       this.$nextTick((v) => {
    //         this.$refs.searbox.focus()
    //       })
    //     }
    //   }
    // },
    // activated() {
    //   if (this.value) {
    //     this.$nextTick((v) => {
    //       this.$refs.searbox.focus()
    //     })
    //   }
    // },
    methods: {

      keypressClick(e){
        this.keyCode=e.keyCode
      },
      deleteValue() {
        this.searchValue = ''
      },
      searchInput() {
        this.$emit('searchInput', this.searchValue)
      },
      clickBack(fn) {
        if (!fn) {
          if (this.$route.query.fromApp) {
            //返回app
            try {
              window.webkit.messageHandlers.goBack.postMessage('');
              return
            } catch (e) {}
            try {
              window.jsObject.goBack()
              return
            } catch (e) {}
          }
          this.$router.goBack()
        } else {
          fn()
        }
      },
      clickPage($event) {
        if ($event.target.className == 'headerSearchPage') {
          this.$emit('input', false)
          this.$emit('getSearchValue_', this.searchValue)
        }
      },
      clickSearch() {
        function unique1(hash,item){
          let flag = true
          for (var i = 0; i < hash.length; i++) {
            if(item === hash[i]){
              flag= false
            }
          }
          return flag;
        }
        this.$emit('input', false)
        this.$emit('getSearchValue', this.searchValue)
        if(!this.searchValue)return
        let historyValue_ = localStorage.getItem('historyValue')
        if(historyValue_){
          if(unique1(this.historyValue,this.searchValue)){
            if(this.historyValue.length>=5){
              let arr= []
              this.historyValue.forEach((v,i)=>{
                if(i>0&&i<5){
                  arr.push(v)
                }
              })
              arr.push(this.searchValue)
              this.historyValue = arr
            }else {
              this.historyValue.push(this.searchValue)
            }
            localStorage.setItem('historyValue',JSON.stringify(this.historyValue))
          }
        }else {
          this.historyValue.push(this.searchValue)
          localStorage.setItem('historyValue',JSON.stringify(this.historyValue))
        }
        // this.historyValue
      },
      clickHistory(item){
        this.searchValue = item
        // this.$emit('input', false)
        // this.$emit('getSearchValue', this.searchValue)
      },
      clearHistory(){
        localStorage.removeItem('historyValue')
        this.historyValue = []
      }
    },
    mounted() {
      let historyValue_ = localStorage.getItem('historyValue')
      if(historyValue_){
        let arr = []
        JSON.parse(historyValue_).forEach((v,i)=>{
          if(i<5){
            arr.push(v)
          }
        })
        this.historyValue = arr
      }
      // if (this.value) {
      //   this.$nextTick((k) => {
      //     setTimeout(v => {
      //       this.$refs.searbox.focus()
      //     }, 500)
      //   })
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .headerSearchPage {
    /*height: 100%;*/
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.35);
    padding-top: 88px;
    .headerSearch {
      width: 100%;
      height: 88px;
      display: flex;
      align-items: center;
      overflow: hidden;
      position: absolute;
      justify-content: space-between;
      top: 0;
      left: 0;
      background-color: white;
      z-index: 3;
      padding: 0 0px 0 0;
      .back-arrow {
        height: 100%;
        width: 88px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:before {
          content: '';
          width: 13px; /*no*/
          height: 13px; /*no*/
          border-bottom: 1px solid #000; /*no*/
          border-left: 1px solid #000; /*no*/
          transform: rotateZ(45deg);
        }
      }
      .headerSearch-box {
        width: calc(100% - 210px);
        height: 70px;
        border-radius: 70px;
        background: #eee;
        background-position: 20px center;
        background-size: 38px;
        padding-left: 30px;
        padding-right: 30px;
        display: flex;
        align-items: center;
        justify-content: start;
        overflow: hidden;
        border: 1px solid #E2E2E2; /*no*/
        > input {
          display: block;
          width: 100%;
          text-indent: 15px;
          line-height: 30px;
          font-size: 30px;
          outline: none;
        }
        .cubeic-wrong {
          font-size: 40px;
          color: #666;
        }
      }
      .headerSearch-btn {
        width: 88px;
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 100%;
        justify-content: center;
        border-radius: 60px;
        span {
          color: black;
          font-size: 32px;
        }
      }
    }
    .search-history {
      min-height: 100px;
      background: white;
      box-shadow: 0px 0px 31px 0px rgba(4, 0, 0, 0.2);
      animation: showS 0.3s;
      padding: 20px 30px 0 30px;
      overflow: hidden;
      .search-history-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        color: #989898;
        .cubeic-delete {
          font-size: 44px;
        }

      }
      .search-history-bot{
        margin: 20px 0;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        div{
          padding: 0 20px;
          height: 52px;
          background: rgba(241, 241, 241, 1);
          border-radius: 26px;
          font-size: 24px;
          line-height: 52px;
          color: #1A1A1A;
          margin-right: 15px;
          margin-bottom: 20px;
        }
      }
    }
  }

  @keyframes showS {
    0% {
      transform: translateY(300px);
    }
    0% {
      transform: translateY(0px);
    }
  }
</style>
