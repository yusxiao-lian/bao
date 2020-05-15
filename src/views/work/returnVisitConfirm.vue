<template>
  <div id="workReturnVisit">
    <headerTab :title="$route.meta.title" />
    <div class="workReturnVisit-content">
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>回访客户</span>
        </div>
        <div class="rightContent">
          <span class="contentArea">陶大然</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>回访时间</span>
        </div>
        <div class="rightContent">
          <span class="contentArea">2019-12-19 15:12:16</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>回访方式</span>
        </div>
        <div class="rightContent">
          <span class="selectBtn currentBtn">电话</span>
          <span class="selectBtn">微信</span>
          <span class="selectBtn">上门</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>回访结果</span>
        </div>
        <div class="rightContent">
          <span class="selectBtn currentBtn">成功</span>
          <span class="selectBtn">不成功</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>客户评价</span>
        </div>
        <div class="rightContent rightContent3">
          <star :size="48" :score="4.5"></star>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>回访详情</span>
        </div>
        <div class="rightContent2">
          <textarea placeholder="请描述回访情况"></textarea>
        </div>
      </div>
    </div>

    <bottomButton2 class="operation" bgcolor="white">提交</bottomButton2>
  </div>
</template>

<script>
import { headerTab, bottomButton2, star } from "../../components/index";

export default {
  name: "workReturnVisit",
  components: {
    headerTab,
    bottomButton2,
    star
  },

  data() {
    return {
    };
  },

};
</script>

<style lang="scss" type="text/scss" scoped>
#workReturnVisit {
  height: calc(100% - 100px);
  overflow: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 80px;
  .workReturnVisit-content {
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .cells {
      padding: 30px 30px 10px 30px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      flex-wrap: wrap;
      .leftContent {
        width: 160px;
        height: 60px;
        line-height: 60px;
        display: flex;
        flex-wrap: wrap;
        i {
          width: 15px;
          font-size: 30px;
          color: rgba(253, 99, 72, 1);
          vertical-align: middle;
        }
        span {
          font-size: 28px;
          color: rgba(117, 117, 117, 1);
        }
      }
      .rightContent {
        position: relative;
        width: 530px;
        display: flex;
        flex-wrap: wrap;        
        .selectBtn {
          margin-right: 20px;
          margin-bottom: 20px;
          width: 160px;
          height: 60px;
          line-height: 60px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(204, 204, 204, 1);
          border-radius: 30px;
          font-size: 26px;
          color: #1a1a1a;
          text-align: center;
        }
        .selectBtn:nth-child(3n) {
          margin-right: 0;
        }
        .currentBtn {
          width: 160px;
          height: 60px;
          background: #29b0f9;
          border: 1px solid #29b0f9;
          border-radius: 30px;
          font-size: 26px;
          color: #ffffff;
        }
        .contentArea {
          margin-bottom: 20px;
          width: 480px;
          height: 60px;
          line-height: 60px;
          color: #1a1a1a;
        }
      }
      .rightContent2 {
        width: 650px;
        padding: 30px 20px;
        line-height: 1.5;
        color: #b6b6b6;
        font-size: 28px;
        display: block;
        textarea {
          width: 100%;
        }
      }
            .rightContent3 {
       width: 530px;
        margin-bottom: 20px;
      }
    }
    .cells:last-child {
      border-bottom: 0;
    }
  }
}
</style>
