<template>
  <div class="scroll-list-wrap" v-setScrollHeight="{fn:rebuildScroll}">
    <cube-scroll
      ref="scroll"
      :data="dataList"
      :options="options"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp"
    >
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result">未处理</div>
          <div class="operationBtn">待接单</div>
        </div>
      </div>
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result">未处理</div>
          <div class="operationBtn">待接单</div>
        </div>
      </div>
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result result2">已处理</div>
          <!-- <div class="operationBtn">待接单</div> -->
        </div>
      </div>
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result">未处理</div>
          <div class="operationBtn">待接单</div>
        </div>
      </div>
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result">未处理</div>
          <div class="operationBtn">待接单</div>
        </div>
      </div>
      <div class="element">
        <div class="content">
          <div class="cells">
            <div class="type font1">
              <i class="workIcon11"></i>工单
            </div>
            <div class="main font2">【新鼎阁大堂】</div>
          </div>
          <div class="cells">
            <div class="type">工单内容</div>
            <div class="main">此处工单内容灰色字体此处工单内容灰色字体内容灰色字体此处工单处工灰…</div>
          </div>
          <div class="cells">
            <div class="type">报单时间</div>
            <div class="main">2019-06-19 11:02:59</div>
          </div>
        </div>
        <div class="operation">
          <div class="result">未处理</div>
          <div class="operationBtn">待接单</div>
        </div>
      </div>
      <!-- <slot></slot>
      <template v-if="customPullDown" slot="pulldown" slot-scope="props">
        <div
          v-if="props.pullDownRefresh"
          class="cube-pulldown-wrapper"
          :style="props.pullDownStyle"
        >
          <div
            v-show="props.beforePullDown"
            class="before-trigger"
            :style="{paddingTop: props.bubbleY + 'px'}"
          >
            <span :class="{rotate: props.bubbleY > pullDownRefreshThreshold - 40}">↓</span>
          </div>
          <div class="after-trigger" v-show="!props.beforePullDown">
            <div v-show="props.isPullingDown" class="loading">
              <cube-loading></cube-loading>
            </div>
            <div v-show="!props.isPullingDown" class="text">
              <span class="refresh-text"></span>
            </div>
          </div>
        </div>
      </template>-->
    </cube-scroll>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      default() {
        return [];
      }
    },
    pullDownRefresh: {
      default: true //开启下拉刷新
    },
    pullUpLoad: {
      default: true //开启上拉加载
    },
    customPullDown: {
      default: false //自定义下拉刷新效果
    }
  },
  data() {
    return {
      pullDownRefreshThreshold: 60,
      pullDownRefreshStop: 40,
      pullDownRefreshTxt: "刷新成功",
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: "加载更多",
      pullUpLoadNoMoreTxt: "已全部加载完"
    };
  },
  components: {},
  computed: {
    options() {
      return {
        pullDownRefresh: this.pullDownRefreshObj,
        pullUpLoad: this.pullUpLoadObj,
        scrollbar: true
      };
    },
    pullDownRefreshObj: function() {
      return this.pullDownRefresh
        ? {
            threshold: parseInt(this.pullDownRefreshThreshold),
            // Do not need to set stop value, but you can if you want
            // stop: parseInt(this.pullDownRefreshStop),
            txt: this.pullDownRefreshTxt
          }
        : false;
    },
    pullUpLoadObj: function() {
      return this.pullUpLoad
        ? {
            threshold: parseInt(this.pullUpLoadThreshold),
            txt: {
              more: this.pullUpLoadMoreTxt,
              noMore: this.pullUpLoadNoMoreTxt
            }
          }
        : false;
    }
  },
  methods: {
    onPullingDown() {
      console.log("刷新");
      // 模拟更新数据
      // setTimeout(() => {
      //  this.$refs.scroll.forceUpdate();
      // }, 1000);
      this.$emit("onPullingDown", this.$refs.scroll);
    },
    onPullingUp() {
      console.log("加载");
      // 更新数据
      // setTimeout(() => {
      //   this.$refs.scroll.forceUpdate();
      // }, 1000);
      this.$emit("onPullingUp", this.$refs.scroll);
    },
    rebuildScroll() {
      this.$nextTick(() => {
        this.$refs.scroll.destroy();
        this.$refs.scroll.initScroll();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-list-wrap {
  height: 100%;
  border-top: 25px solid #ededed;
  .element {
    padding: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &:nth-child(odd) {      
      background: #fff;//单行
    }
    &:nth-child(even) {      
      background: #f7fafb;//双行
    }
    .content {
      width: 565px;
      .cells {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        .type {
          width: 130px;
          line-height: 1.5;
          font-size: 24px;
          color: #999999;
          .workIcon11 {
            margin-right: 10px;
            width: 24px;
            height: 26px;
            background: url("../assets/workIcon11.png") no-repeat;
            background-size: 24px 26px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        .main {
          width: 430px;
          font-size: 24px;
          line-height: 1.5;
          color: #999999;
        }
        .font1 {
          font-size: 28px;
          color: #29b0f9;
        }
        .font2 {
          font-size: 28px;
          color: #333333;
        }
      }
    }
    .operation {
      width: 125px;
      .result {
        width: 125px;
        font-size: 26px;
        text-align: center;
        color: #fd6348;
        margin-bottom: 20px;
      }
      .result2 {
        color: #AEB2B7;
      }
      .operationBtn {
        width: 125px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: rgba(41, 176, 249, 1);
        border-radius: 30px;
        font-size: 26px;
        color: #fff;
      }
    }
  }
}
</style>