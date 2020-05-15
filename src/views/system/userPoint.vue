<template>
  <div class="personalPoint">
    <div class="header">
      <p class="p1" @click="$router.goBack()"><</p>
      <P @click="$router.push('/pointRule')">查看规则</P>
    </div>
    <div class="point-content">
      <p class="p1">
        <span>{{point}}</span>
      </p>
      <p class="p2">
        <span>能量值总额</span>
      </p>
    </div>
    <cube-tab-bar v-model="selectedLabel" showSlider ref="tabNav" :data="tabLabels"></cube-tab-bar>
    <div class="date-box">
      <div class="top">
        <p class="label">日期</p>
        <div class="date-check" @click="showStartDatePicker">{{formData.startTime}}</div>
        <p class="centerline">至</p>
        <div class="date-check" @click="showEndDatePicker">{{formData.endTime}}</div>
        <div class="btn-search" @click="handleSearch">搜索</div>
      </div>
      <p
        class="point-msg"
      >此期间共{{selectedLabel=='获得记录'?'获得':'兑换'}}{{selectedLabel=='获得记录'?getPointCount:consumePointCount}}能量值</p>
    </div>
    <scrollList
      v-if="selectedLabel=='获得记录'"
      ref="scrollList"
      :dataList="getPointList"
      :pullDownRefresh="false"
      @onPullingUp="onPullingUpGet"
    >
      <div class="point-convertlog">
        <div class="item" v-for="(item,index) in getPointList" :key="index">
          <div class="left">
            <img src="../../assets/userPoint/payIcon2.png" alt />
            <div class="detail">
              <p class="msg">{{item.event}}</p>
              <p class="date">获取时间：{{item.producedDate}}</p>
            </div>
          </div>
          <div class="point-num">+{{item.point}}能量值</div>
        </div>
      </div>
    </scrollList>
    <scrollList
      v-if="selectedLabel=='兑换记录'"
      ref="scrollList"
      :dataList="consumePointList"
      :pullDownRefresh="false"
      @onPullingUp="onPullingUpConsume"
    >
      <div class="point-convertlog">
        <div class="item" v-for="(item,index) in consumePointList" :key="index">
          <div class="left">
            <img src="../../assets/userPoint/payIcon3.png" alt />
            <div class="detail">
              <p class="msg">{{item.event}}</p>
              <p class="date">兑换时间：{{item.consumedDate}}</p>
            </div>
          </div>
          <div class="point-num">-{{item.point}}能量值</div>
        </div>
      </div>
    </scrollList>
  </div>
</template>

<script>
import * as api from "@/service/system";
import scrollList from "@/components/scrollList";
export default {
  components: {
    scrollList
  },
  data() {
    return {
      point: 0,
      getPointList: [],
      getPointCount: 0,
      consumePointList: [],
      consumePointCount: 0,
      formData: {
        startTime: "",
        endTime: "",
        page_no: 0,
        page_size: 10
      },
      // -------------------------
      selectedLabel: "获得记录",
      tabLabels: [
        { label: "获得记录", value: "获得记录" },
        { label: "兑换记录", value: "兑换记录" }
      ],
      startDatePicker: null,
      endDatePicker: null
    };
  },
  created() {
    this.getUserPoint();
    this.getPointRule();
    this.pointgetRecord();
    this.pointConsumeRecord();
  },
  methods: {
    handleSearch() {
      this.getPointCount = 0;
      this.consumePointCount = 0;
      this.getPointList = [];
      this.consumePointList = [];
      this.formData.page_no = 0;
      this.formData.page_size = 10;
      this.pointgetRecord();
      this.pointConsumeRecord();
    },
    onPullingUpGet() {
      this.formData.page_no += 1;
      this.pointgetRecord();
    },
    onPullingUpConsume() {
      this.formData.page_no += 1;
      this.pointConsumeRecord();
    },
    async getUserPoint() {
      let res = await api.getUserPoint();
      if (res.error.err_code === "0") {
        this.point = res.obj.point;
      }
    },
    async getPointRule() {
      let res = await api.pointRule({
        channelCode: "APP_POINT",
        label: "JFGZ"
      });
      if (res.error.err_code === "0") {
        // this.point = res.obj.point;
      }
    },
    async pointgetRecord() {
      let res = await api.pointgetRecord(this.formData);
      if (res.error.err_code === "0") {
        this.getPointList.push(...res.obj.list);
        this.getPointCount = this.getPointCount + res.obj.count;
      }
    },
    async pointConsumeRecord() {
      let res = await api.pointConsumeRecord(this.formData);
      if (res.error.err_code === "0") {
        this.consumePointList.push(...res.obj.list);
        this.consumePointCount = this.consumePointCount + res.obj.count;
      }
    },
    //开始时间
    showStartDatePicker() {
      if (!this.startDatePicker) {
        this.startDatePicker = this.$createDatePicker({
          title: "",
          min: new Date(2019, 7, 8),
          max: new Date(2120, 9, 20),
          value: new Date(),
          onSelect: val => {
            this.formData.startTime = this.dateConvert(val);
          }
        });
      }
      this.startDatePicker.show();
    },
    //结束时间
    showEndDatePicker() {
      if (!this.endDatePicker) {
        this.endDatePicker = this.$createDatePicker({
          title: "",
          min: new Date(2008, 7, 8),
          max: new Date(2120, 9, 20),
          value: new Date(),
          onSelect: val => {
            this.formData.endTime = this.dateConvert(val);
          }
        });
      }
      this.endDatePicker.show();
    },
    dateConvert(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

      let Y = date.getFullYear();

      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let D = date.getDate();

      let h = date.getHours() + ":";

      let m = date.getMinutes() + ":";

      let s = date.getSeconds();

      return Y + "-" + M + "-" + D; //时分秒可以根据自己的需求加上
    }
  }
};
</script>

<style lang="scss" scoped>
.cube-tab_active {
  color: #a260a4 !important;
}
.cube-tab-bar-slider {
  background-color: #a260a4 !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88px;
  background: #a260a4;
  color: #f5f5f5;
  padding-right: 20px;
  .p1 {
    font-size: 44px;
    padding-left: 10px;
  }
}
.point-content {
  box-sizing: border-box;
  width: 100%;
  height: 280px;
  background-image: url("../../assets/userPoint/stop_img_head.png");
  background-size: 100% 280px;
  padding: 45px;
  text-align: center;
  p span {
    // font-size: 129px;
    // font-family: PingFang SC;
    // font-weight: bold;
    // background-image: linear-gradient(0deg, #ec8cef, #ffffff);
    background-image: linear-gradient(0deg, (#ec8cef) 15%, (#ffffff) 50%);
    // font-size: 20px;
    font-weight: bold;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    -moz-box-decoration-break: clone;
    color: transparent;
  }
  .p1 span {
    font-size: 129px;
  }
  .p2 span {
    font-size: 22px;
  }
}
.date-box {
  background-color: #efefef;
  height: 152px;
  padding-top: 26px;

  .top {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    .label {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(46, 46, 46, 1);
    }
    .date-check {
      width: 221px;
      height: 49px;
      background: rgba(255, 255, 255, 1);
      line-height: 49px;
      margin-left: 12px;
    }
    .centerline {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(154, 154, 154, 1);
      margin-left: 12px;
    }
    .btn-search {
      width: 117px;
      height: 49px;
      background: rgba(162, 96, 164, 1);
      border-radius: 6px;
      line-height: 49px;
      text-align: center;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      margin-left: 12px;
    }
  }
  .point-msg {
    margin-top: 28px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(46, 46, 46, 1);
    padding-left: 20px;
  }
}
.point-getlog {
  .item {
    box-sizing: border-box;
    height: 138px;
    margin: 30px;
    margin-bottom: 0px;
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
    }
    img {
      width: 78px;
      height: 78px;
    }
    p {
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(26, 26, 26, 1);
      padding-left: 40px;
    }
    .point-num {
      width: 196px;
      height: 60px;
      background: #a260a4;
      border-radius: 30px;
      line-height: 60px;
      text-align: center;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
.point-convertlog {
  .item {
    box-sizing: border-box;
    height: 138px;
    margin: 30px;
    margin-bottom: 0px;
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
    }
    img {
      width: 78px;
      height: 78px;
    }
    .detail {
      padding-left: 40px;

      .msg {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
      }
      .date {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
        padding-top: 24px;
      }
    }

    .point-num {
      width: 196px;
      height: 60px;
      background: #a260a4;
      border-radius: 30px;
      line-height: 60px;
      text-align: center;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
 <style lang="scss">
.personalPoint {
  .cube-tab_active {
    color: #a260a4 !important;
  }
  .cube-tab-bar-slider {
    background-color: #a260a4 !important;
  }
}
</style>
