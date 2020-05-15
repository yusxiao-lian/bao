<template>
  <div id="myWork">
    <headerTab :title="$route.meta.title" />
    <div class="myWork-content">
      <div class="number">
        工单编号
        <span>242543645</span>
      </div>
      <ul class="materialsList">
        <li>
          <div class="information1">21W三基色方形管荧光2D管</div>
          <div class="information2">
            <span class="quantity">1个</span>
            <span class="price">60元</span>
            <span class="operation">已退料</span>
          </div>
        </li>
        <li>
          <div class="information1">21W三基色方形管荧光2D管</div>
          <div class="information2">
            <span class="quantity">1个</span>
            <span class="price">60元</span>
            <span class="operation">已退料</span>
          </div>
        </li>
        <li>
          <div class="information1">21W三基色方形管荧光2D管</div>
          <div class="information2">
            <span class="quantity">1个</span>
            <span class="price">60元</span>
            <span class="operation">已退料</span>
          </div>
        </li>
        <li>
          <div class="information1">21W三基色方形管荧光2D管</div>
          <div class="information2">
            <span class="quantity">1个</span>
            <span class="price">60元</span>
            <span class="operation">已退料</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <span class="neglect">忽略</span>
      <span class="agree">同意</span>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";

export default {
  name: "myWork",
  components: {
    headerTab
  },
  data() {
    return {
      value: "",
      placeholder: "搜索人员"
    };
  },
  methods: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
#myWork {
  height: calc(100% - 100px);
  // height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: #ededed;
  padding-top: 100px;
  //padding-bottom: 80px;
  .myWork-content {
     margin-top: 25px;
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .number {
      margin: 35px;
      padding: 0 10px;
      width: 310px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border: 1px solid rgba(168, 186, 216, 1);
      border-radius: 6px;
      
      span{
        margin-left: 15px;
      }
    }
    .materialsList {
      //border-top: 25px solid #ededed;
     
      width: 750px;
      background: #ffffff;
      li {
        margin: 0 auto;
        padding: 35px 0;
        width: 670px;
        display: flex;
        flex-wrap: wrap;
        
        border-bottom: 1px dotted #e2e2e2;
        .information1 {
          padding-right: 15px;
          width: 440px;
          font-size: 28px;
          color: #333333;
          line-height: 1.2;
          //   text-overflow:ellipsis; white-space:nowrap; overflow:hidden;
        }
        .information2 {
          width: 230px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          .quantity {
            font-size: 28px;
            color: #999;
          }
          .price {
            font-size: 28px;
            color: #ffb24a;
          }
          .operation {
            width: 90px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #fff;
            font-size: 22px;
            background: rgba(168, 186, 216, 1);
            border-radius: 4px;
          }
        }
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750px;
    height: 110px;
    line-height: 110px;
    background: #fff;
    //   border-top:1px solid #ccc;
    box-shadow: 0 0 10px 0 #ccc;
    display: flex;
    flex-wrap: wrap;
    .neglect {
      width: 266px;
      text-align: center;
      font-size: 32px;
      color: rgba(41, 176, 249, 1);
    }
    .agree {
      width: 484px;
      text-align: center;
      font-size: 32px;
      color: #fff;
      background: rgba(41, 176, 249, 1);
    }
  }
}
</style>

