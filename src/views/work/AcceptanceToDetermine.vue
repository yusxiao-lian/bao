<template>
  <div id="AcceptanceToDetermine">
    <headerTab :title="$route.meta.title" />
    <div class="AcceptanceToDetermine-content">
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>来源</span>
        </div>
        <div class="rightContent">
          <span class="selectBtn currentBtn">已解决</span>
          <span class="selectBtn">未解决</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>验收图片</span>
        </div>
        <div class="rightContent">
          <div class="repairApply-content-img">
            <div class="repairApply-content-img-item">
              <img alt />
              <i></i>
            </div>
            <div class="repairApply-content-img-item">
              <label for="male">
                <input id="male" type="file" accept="image/*" />
                <img src="../../assets/upload.png" alt />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>验收说明</span>
        </div>
        <div class="rightContent2">
          <textarea placeholder="请在此填写您的验收说明"></textarea>
        </div>
      </div>
    </div>

    <bottomButton2 class="operation" bgcolor="white">提交</bottomButton2>
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";

export default {
  name: "AcceptanceToDetermine",
  components: {
    headerTab,
    bottomButton2
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
#AcceptanceToDetermine {
  height: calc(100% - 100px);
  overflow: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 80px;
  .AcceptanceToDetermine-content {
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
        .currentBtn {
          width: 160px;
          height: 60px;
          background: #29b0f9;
          border: 1px solid #29b0f9;
          border-radius: 30px;
          font-size: 26px;
          color: #ffffff;
        }
        .repairApply-content-img {
          .repairApply-content-img-item {
            width: 150px;
            height: 150px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 20px;
            position: relative;
            img {
              width: 154px;
              height: 154px;
              position: absolute;
              top: 0;
            }
            i {
              width: 32px;
              height: 32px;
              display: inline-block;
              background-image: url("../../assets/img/cha.png");
              position: absolute;
              right: -16px;
              top: -16px;
              z-index: 2;
              background-size: cover;
            }
            label {
              width: 154px;
              height: 154px;
              input {
                width: 154px;
                height: 154px;
                display: inline-block;
                position: absolute;
                top: 0;

                z-index: 3;
                display: none;
              }
            }
          }
          .repairApply-content-img-item:nth-child(4n) {
            margin-right: 0;
          }
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
    }
    .cells:last-child{
        border-bottom: 0;
    }
  }
}
</style>

function newFunction() {
  return "checkAccept";
}
