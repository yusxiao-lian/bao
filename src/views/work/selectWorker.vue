<template>
  <div id="myWork">
    <headerTab :title="$route.meta.title" />
    <div class="myWork-content">
      <div class="serach">
        <div class="serachIcon"></div>
        <cube-input v-model="value" :placeholder="placeholder"></cube-input>
      </div>
      <ul class="selectWorkerList">
        <li>
          <div class="information">
            <p class="name">张三</p>
            <p class="post">技术等级 中级</p>
          </div>
          <div class="operation">
            <span class="telephone"></span>
            <span class="message"></span>
            <span class="addBtn"></span>
          </div>
        </li>
        <li>
          <div class="information">
            <p class="name">张三</p>
            <p class="post">技术等级 中级</p>
          </div>
          <div class="operation">
            <span class="telephone"></span>
            <span class="message"></span>
            <span class="addBtn"></span>
          </div>
        </li>
        <li>
          <div class="information">
            <p class="name">张三</p>
            <p class="post">技术等级 中级</p>
          </div>
          <div class="operation">
            <span class="telephone"></span>
            <span class="message"></span>
            <span class="addBtn"></span>
          </div>
        </li>
        <li>
          <div class="information">
            <p class="name">张三</p>
            <p class="post">技术等级 中级</p>
          </div>
          <div class="operation">
            <span class="telephone"></span>
            <span class="message"></span>
            <span class="addBtn"></span>
          </div>
        </li>
        <li>
          <div class="information">
            <p class="name">张三</p>
            <p class="post">技术等级 中级</p>
          </div>
          <div class="operation">
            <span class="telephone"></span>
            <span class="message"></span>
            <span class="addBtn"></span>
          </div>
        </li>
      </ul>
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
  background-color: #ffffff;
  padding-top: 100px;
  //padding-bottom: 80px;
  .myWork-content {
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .serach {
      position: relative;
      margin: 15px auto;
      width: 708px;
      height: 52px;
      line-height: 52px;
      background: #fafafa;
      border-radius: 16px;
      border: 1px solid #d2d2d2;
      display: flex;
      flex-wrap: wrap;
      .serachIcon {
        position: absolute;
        top: 10px;
        left: 20px;
        margin-right: 25px;
        width: 29px;
        height: 29px;
        background: url("../../assets/neighbor/search.png");
        background-size: cover;
      }
      .cube-input {
        position: absolute;
        top: 8px;
        left: 70px;
        width: 620px;
        background: transparent;
      }
    }
    .selectWorkerList {
      width: 750px;
      li {
        margin: 0 auto;
        padding: 25px 0;
        width: 670px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px dotted #e2e2e2;
        .information {
          width: 440px;
          .name {
            margin-bottom: 15px;
            font-size: 28px;
            color: #333333;
          }
          .post {
            font-size: 24px;
            color: #999999;
          }
        }
        .operation {
          width: 230px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          .telephone {
            width: 37px;
            height: 36px;
            background: url("../../assets/workIconTelephone.png") no-repeat;
            background-size: contain;
          }
          .message {
            width: 38px;
            height: 36px;
            background: url("../../assets/workIconMessage.png") no-repeat;
            background-size: contain;
          }
          .addBtn {
            width: 66px;
            height: 36px;
            background: url("../../assets/workIconAddBtn.png") no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>
<style>
.cube-input-field {
  padding: 0 10px !important;
}
.cube-input::after {
  border: 0 !important;
}
</style>
