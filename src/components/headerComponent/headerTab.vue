<template>
  <div class="headerTab" :style="{'background-color':bgColor}">
    <div v-if="showBackArrow" class="back-arrow" @click="clickBack(fn)"></div>
    <slot name="middle">
      <span class="title">{{titleName}}</span>
    </slot>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerTab",
  props: {
    title: {
      default: ""
    },
    bgColor: {
      default: ""
    },
    fn: {
      type: Function
    },
    showBackArrow: {
      default: true
    }
  },
  data() {
    return {
      titleName: ""
    };
  },
  created() {
    this.titleName = this.title || this.$route.meta.title;
  },
  methods: {
    clickBack(fn) {
      if (!fn) {
        if (this.$route.query.fromApp) {
          //返回app
          try {
            window.webkit.messageHandlers.goBack.postMessage("");
            return;
          } catch (e) {}
          try {
            window.jsObject.goBack();
            return;
          } catch (e) {}
        }
        this.$router.goBack();
      } else {
        fn();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.headerTab {
  height: 100px;
  width: 100%;
  background-color: white; //#A260A4
  display: flex;
  align-items: center;
  text-align: center;
  position: absolute;
  justify-content: center;
  color: #000;
  font-size: 36px;
  z-index: 3;
  top: 0;
  left: 0;
  border-bottom: 1px solid #f1f1f1; /*no*/
  .back-arrow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
      content: "";
      width: 12px; /*no*/
      height: 12px; /*no*/
      border-bottom: 1px solid #333; /*no*/
      border-left: 1px solid #333; /*no*/
      transform-origin: center;
      transform: rotateZ(45deg);
      margin-left: -10px;
    }
  }
  .title {
    display: inline-block;
    width: 520px;
    overflow: hidden;
    text-align: center;
    line-height: 50px;
    font-weight: 500;
    color: black;
    height: 50px;
  }
  .right {
    height: 100%;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 10px;
    color: black;
  }
}
</style>
