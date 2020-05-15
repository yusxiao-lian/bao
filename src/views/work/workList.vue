<template>
  <div id="myWork">
    <headerTab :title="$route.meta.title" />
    <div class="myWork-content">
      <ul class="workList">
        <li>
          <div class="information">
            <span class="category">
              <i class="icon icon1"></i>室内装修
            </span>
            <span class="issue">水管保修</span>
            <span class="time">5分钟前</span>
            <span class="state state1">紧急</span>
          </div>
          <div class="explain">樱海园F栋1207厨房水龙头损坏，拧到最大，水还是流不停</div>
          <div class="photo">
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
          </div>
          <div class="location">樱海园F栋1207房</div>
          <div class="operation">
            <span class="neglect">忽略</span>
            <span class="agree">抢单</span>
          </div>
        </li>
        <li>
          <div class="information">
            <span class="category">
              <i class="icon icon2"></i>公共区域
            </span>
            <span class="issue">水管保修</span>
            <span class="time">5分钟前</span>
            <span class="state state2">普通</span>
          </div>
          <div class="explain">樱海园F栋1207厨房水龙头损坏，拧到最大，水还是流不停</div>
          <div class="photo">
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
          </div>
          <div class="location">樱海园F栋1207房</div>
          <div class="operation">
            <span class="neglect">忽略</span>
            <span class="agree">抢单</span>
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
  //height: calc(100% - 100px);
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: #ededed;
  padding-top: 100px;
  //padding-bottom: 80px;
  .myWork-content {
    width: 750px;
    overflow: hidden;
    .workList {
      width: 750px;
      li {
        //border-top: 25px solid #ededed;
        margin-top: 25px;
        padding: 40px 50px;
        width: 100%;
        background: #ffffff;
        .information {
          position: relative;
          margin-bottom: 30px;
          width: 650px;
          font-size: 28px;
          color: #333333;
          line-height: 1.2;
          display: flex;
          flex-wrap: wrap;
          .category {
            font-size: 32px;
            color: #333;
            .icon {
              width: 32px;
              height: 32px;
              margin-right: 15px;
              display: inline-block;
              vertical-align: middle;
            }
            .icon1 {
              background: url("../../assets/typeIcon1.png") no-repeat;
              background-size: contain;
            }
            .icon2 {
              background: url("../../assets/typeIcon2.png") no-repeat;
              background-size: contain;
            }
          }
          .issue {
            margin: 0 15px;
            // width: 128px;
            padding: 0 10px;
            height: 34px;
            line-height: 34px;
            font-size: 24px;
            color: #29b0f9;
            text-align: center;
            background: rgba(230, 246, 255, 1);
            border: 1px solid rgba(41, 176, 249, 1);
            border-radius: 4px;
            vertical-align: middle;
            display: inline-block;
          }
          .time {
            font-size: 24px;
            color: #a0afb7;
            height: 34px;
            line-height: 34px;
          }
          .state {
            position: absolute;
            right: 0;
            top: 0;
            width: 68px;
            height: 34px;
            line-height: 34px;
            color: #fff;
            font-size: 20px;
            text-align: center;
            border-radius: 4px;
          }
          .state1 {
            background: #fd6348;
          }
          .state2 {
            background: #9fb9c7;
          }
        }
        .explain {
          margin-bottom: 30px;
          font-size: 28px;
          color: #999;
          line-height: 1.5;
        }
        .photo {
          margin-bottom: 30px;
          width: 650px;
          display: flex;
          flex-wrap: wrap;
          img {
            margin-right: 15px;
            width: 150px;
            height: 150px;
            background: #ccc;
            &:nth-child(4n) {
              margin-right: 0;
            }
          }
        }

        .location {
          position: relative;
          margin-bottom: 30px;
          width: 650px;
          font-size: 24px;
          line-height: 1.5;
          color: #a0afb7;
          text-indent: 35px;
          &::before {
            position: absolute;
            left: 0;
            top: 5px;
            content: "";
            width: 20px;
            height: 25px;
            background: url("../../assets/loacation.png") no-repeat;
            background-size: contain;
          }
        }
        .operation {
          width: 650px;
          height: 62px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .neglect {
            width: 300px;
            height: 60px;
            line-height: 60px;
            text-align: center;
            font-size: 32px;
            color: #29b0f9;
            border: 1px solid #29b0f9;
            border-radius: 30px;
          }
          .agree {
            width: 300px;
            height: 60px;
            line-height: 60px;
            text-align: center;
            font-size: 32px;
            color: #fff;
            background: rgba(41, 176, 249, 1);
            border: 1px solid #29b0f9;
            border-radius: 30px;
          }
        }
      }
    }
  }
}
</style>

