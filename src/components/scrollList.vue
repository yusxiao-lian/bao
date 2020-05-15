<template>
  <div class="scroll-list-wrap" v-setScrollHeight="{fn:rebuildScroll,dataList:dataList}">
    <cube-scroll
      ref="scroll"
      :data="dataList"
      :options="options"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp"
    >
      <slot></slot>
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
      </template>
    </cube-scroll>
  </div>
</template>
<script>
export default {
  name: "scrollList",
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
      return this.pullUpLoad && this.dataList.length > 0
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
  watch: {
    dataList(val, oldVal) {
      if (val.length == 0 && oldVal.length != 0) {
        this.rebuildScroll();
      }
      if (val.length != 0 && oldVal.length == 0) {
        this.rebuildScroll();
      }
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
    forceUpdate() {
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate();
      });
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
  // height: 100vh;
  border-radius: 5px;
  transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
  overflow: hidden;
}
</style>