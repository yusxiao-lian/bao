<template>
  <div id="assignWork">
    <headerTab :title="$route.meta.title" />
    <div class="assignWork-content">
      <ul class="assignWorkList1">
        <div class="tag tag1">业主工单</div>
        <li>
          <div class="type">工单编号</div>
          <div class="content">
            <p>SZBBC20191212001</p>
          </div>
        </li>
        <li>
          <div class="type">报工单人</div>
          <div class="content">
            <p>
              陶大然
              <span class="tel"></span>
            </p>
          </div>
        </li>
        <li>
          <div class="type">报单时间</div>
          <div class="content">
            <p>2019-12-14 14:00</p>
          </div>
        </li>
        <li>
          <div class="type">预约时间</div>
          <div class="content">
            <p>立刻</p>
          </div>
        </li>
        <li>
          <div class="type">工单位置</div>
          <div class="content">
            <p>3栋B座</p>
          </div>
        </li>
        <li>
          <div class="type">工单内容</div>
          <div class="content">
            <p>于2017年10月份入住以后,单元楼的两部电梯出过五六次故障,其中西侧一部电梯最近一段时间又坏了，出过五六次故障,其中西侧一部电梯</p>
          </div>
        </li>
        <li>
          <div class="picture">
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/photo.jpg" />
            <img src="../../assets/video.jpg" />
          </div>
        </li>
        <li>
          <div class="type">工单种类</div>
          <div class="content">
            <p>
              公共设施维修 > 停车系统 > 车牌...
              <span class="add"></span>
            </p>
            <p class="remark">标准工时：0时15分 人工费：20元</p>
          </div>
        </li>
      </ul>
      <div class="personnel">
        <div class="them">增员人员：2名</div>
        <ul class="list">
          <li>
            <div class="name">曾小仙</div>
            <div class="time">工时比例：70%</div>
            <div class="tel"></div>
            <div class="message"></div>
            <div class="result">待接受</div>
          </li>
          <li>
            <div class="name">曾小仙</div>
            <div class="time">工时比例：70%</div>
            <div class="tel"></div>
            <div class="message"></div>
            <div class="result">待接受</div>
          </li>
        </ul>
      </div>
      <div class="schedule">
        <div class="cells">
          <div class="icon icon4"></div>
          <div class="explain">
            <div class="main">
              <span class="state font1">待处理</span>
              <span class="time font2">时限：2019-12-14 14:00</span>
            </div>
          </div>
        </div>
        <div class="cells">
          <div class="icon icon5"></div>
          <div class="explain">
            <div class="main">
              <span class="state">工单接单</span>
              <span class="time">2019-12-14 8:00</span>
            </div>
            <div class="detail">
              接单人：【关羽】
              <span class="tel"></span>
            </div>
          </div>
        </div>
        <div class="cells">
          <div class="icon icon2"></div>
          <div class="explain">
            <div class="main">
              <span class="state">工单分派</span>
              <span class="time">2019-12-14 8:00</span>
            </div>
            <div class="detail">
              分派人：【关羽】
              <span class="tel"></span>
            </div>
          </div>
        </div>
        <div class="cells">
          <div class="icon icon3"></div>
          <div class="explain">
            <div class="main">
              <span class="state">工单生成</span>
              <span class="time">2019-12-14 8:00</span>
            </div>
            <div class="detail">
              创建人：【刘备】
              <span class="tel"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="operation">
        <span class="unselected selected apply">物料</span>
        <span class="unselected cancel">费用</span>
        <span class="unselected cancel">挂单</span>
        <span class="unselected chargeback">增援</span>
        <span class="unselected chargeback">转派</span>
      </div>
    </div>

    <bottomButton2 class="operation" bgcolor="white">接单</bottomButton2>
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";

export default {
  name: "assignWork",
  components: {
    headerTab,
    bottomButton2
  },

  data() {
    return {};
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
#assignWork {
  height: calc(100% - 100px);
  overflow: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 30px;
  .assignWork-content {
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .assignWorkList1 {
      position: relative;
      padding: 40px 30px 0 30px;
      .tag {
        position: absolute;
        right: 0;
        top: 23px;
        width: 159px;
        height: 66px;
        line-height: 56px;
        color: #fff;
        font-size: 26px;
        text-align: right;
        padding-right: 15px;
      }
      .tag1 {
        background: url("../../assets/tagBg1.png") no-repeat;
        background-size: contain;
      }
      .tag2 {
        background: url("../../assets/tagBg2.png") no-repeat;
        background-size: contain;
      }
      li {
        margin-bottom: 35px;
        display: flex;
        flex-wrap: wrap;
        .picture {
          display: flex;
          flex-wrap: wrap;
          img {
            margin-right: 20px;
            width: 154px;
            height: 154px;
            border-radius: 10px;
            &:nth-child(4n) {
              margin-right: 0;
            }
          }
        }
        .type {
          margin-right: 35px;
          width: 112px;
          font-size: 28px;
          color: #757575;
          vertical-align: top;
          line-height: 1.5;
        }
        .content {
          position: relative;
          width: 540px;
          font-size: 28px;
          color: #333333;
          line-height: 1.5;
          .tel {
            position: absolute;
            width: 50px;
            height: 50px;
            background: url("../../assets/tel.png") no-repeat;
            background-size: contain;
          }
          .add {
            position: absolute;
            right: 10px;
            width: 40px;
            height: 40px;
            background: url("../../assets/add.png") no-repeat;
            background-size: contain;
          }
          .remark {
            margin-top: 10px;
            font-size: 26px;
            color: #999999;
            line-height: 1.5;
          }
        }
      }
    }
    .assignWorkList2 {
      position: relative;
      padding: 0 30px;
      border-top: 20px solid #ededed;
      border-bottom: 20px solid #ededed;
      li {
        display: flex;
        flex-wrap: wrap;
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid #d9d9d9;
        &:last-child {
          border-bottom: 0;
        }
        .type {
          margin-right: 35px;
          width: 112px;
          font-size: 28px;
          color: #757575;
          vertical-align: top;
        }
        .content {
          position: relative;
          width: 540px;
          font-size: 28px;
          color: #333333;
          .rightArrow {
            position: absolute;
            right: 10px;
            top: 50%;
            display: inline-block;
            content: "";
            width: 20px;
            height: 20px;
            border: solid #999;
            border-width: 3px 3px 0 0;
            -webkit-transform: translate(0, -50%) rotate(45deg);
            transform: translate(0, -50%) rotate(45deg);
          }
          .rightArrow2 {
            position: absolute;
            right: 10px;
            top: 50%;
            display: inline-block;
            content: "";
            width: 20px;
            height: 20px;
            border: solid #fd6348;
            border-width: 3px 3px 0 0;
            -webkit-transform: translate(0, -50%) rotate(45deg);
            transform: translate(0, -50%) rotate(45deg);
          }
        }
        .orange {
          color: #fd6348;
          font-weight: 700;
        }
      }
    }
    .personnel {
      border-top: 1px solid #d9d9d9;
      padding: 30px;
      .them {
        font-size: 28px;
        color: rgba(117, 117, 117, 1);
        line-height: 1.5;
      }
      .list li {
        margin-top: 25px;
        display: flex;
        flex-wrap: wrap;
        .name {
          width: 115px;
          line-height: 40px;
          font-size: 28px;
          color: #36383a;
        }
        .time {
          width: 290px;
          line-height: 40px;
          font-size: 28px;
          color: #36383a;
        }
        .tel {
          margin-right: 24px;
          width: 50px;
          height: 50px;
          background: url("../../assets/tel.png") no-repeat;
          background-size: 50px 50px;
        }
        .message {
          margin-right: 24px;
          width: 50px;
          height: 50px;
          background: url("../../assets/message.png") no-repeat;
          background-size: 50px 50px;
        }
        .result {
          width: 130px;
          line-height: 40px;
          font-size: 28px;
          text-align: right;
          color: #757575;
        }
      }
    }
    .schedule {
      border-top: 20px solid #ededed;
      position: relative;
      padding: 30px 30px 0 30px;
      background: #fff;
      &::before {
        position: absolute;
        top: 30px;
        left: 55px;
        content: "";
        width: 1px;
        height: 100%;
        background: #d1d1d1;
        display: block;
        z-index: 1;
      }
      .cells {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 40px;
        .icon {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          vertical-align: top;
          z-index: 10;
        }
        .icon1 {
          background: url("../../assets/workIcon1.png") no-repeat;
          background-size: contain;
        }
        .icon2 {
          background: url("../../assets/workIcon2.png") no-repeat;
          background-size: contain;
        }
        .icon3 {
          background: url("../../assets/workIcon3.png") no-repeat;
          background-size: contain;
        }
        .icon4 {
          background: url("../../assets/workIcon4.png") no-repeat;
          background-size: contain;
        }
        .icon5 {
          background: url("../../assets/workIcon5.png") no-repeat;
          background-size: contain;
        }
        .explain {
          width: 630px;
          line-height: 50px;
          .main {
            display: flex;
            flex-wrap: wrap;
            .state {
              margin-right: 20px;
              font-size: 30px;
              font-weight: bold;
              color: #999999;
            }
            .time {
              font-size: 26px;
              color: #999999;
            }
            .font1 {
              color: #000000;
            }
            .font2 {
              color: #fd6348;
            }
          }
          .detail {
            position: relative;
            margin-top: 15px;
            font-size: 26px;
            color: #999999;
            .tel {
              position: absolute;
              width: 50px;
              height: 50px;
              background: url("../../assets/tel.png") no-repeat;
              background-size: contain;
            }
          }
        }
      }
    }
    .operation {
      border-top: 20px solid #ededed;
      background: #ffffff;
      padding: 30px;
      min-height: 130px;
      display: flex;
      flex-wrap: wrap;
      .unselected {
        margin-right: 20px;
        flex: 1;
        // width: 230px;
        height: 88px;
        line-height: 88px;
        background: rgba(255, 255, 255, 1);
        border: 2px solid rgba(204, 204, 204, 1);
        border-radius: 10px;
        font-size: 32px;
        text-align: center;
        color: rgba(26, 26, 26, 1);
        &:last-child {
          margin-right: 0;
        }
      }
      .selected {
        background: rgba(255, 255, 255, 1);
        border: 2px solid rgba(41, 176, 249, 1);
        color: #29b0f9;
      }
    }
  }
}
</style>
