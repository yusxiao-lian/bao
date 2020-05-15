<template>
  <div id="myWork">
    <headerTab :title="$route.meta.title" />
    <div class="myWork-content">
      <div class="serach">
        <div class="serachIcon"></div>
        <cube-input v-model="value" :placeholder="placeholder"></cube-input>
      </div>
      <cube-tab-bar v-model="selectedLabel" showSlider ref="tabNav" :data="tabLabels"></cube-tab-bar>
      <myWorkList v-if="selectedLabel=='报单'" ref="scrollList">
      </myWorkList>
      <myWorkList v-if="selectedLabel=='分派'" ref="scrollList">
      </myWorkList>
      <myWorkList v-if="selectedLabel=='处理'" ref="scrollList">
      </myWorkList>
      <myWorkList v-if="selectedLabel=='回访'" ref="scrollList">
      </myWorkList>
      <myWorkList v-if="selectedLabel=='验收'" ref="scrollList">
      </myWorkList>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import myWorkList from "@/components/myWorkList";

export default {
  name: "myWork",
  components: {
    headerTab,
    myWorkList
  },
  data() {
    return {
      selectedLabel: "报单",
      tabLabels: [
        { label: "报单", value: "报单" },
        { label: "分派", value: "分派" },
        { label: "处理", value: "处理" },
        { label: "回访", value: "回访" },
        { label: "验收", value: "验收" }
      ],
      value: "",
      placeholder: "请输入内容"
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
  background-color: #f8f8f8;
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
  /* .cube-tab-bar {
    border-bottom: 22px solid #ededed !important;
  } */
  .cube-tab{
position: relative;
  }
  .cube-tab_active::after {
    position: absolute;
    top: 25px;
    right: 25px;
    content: "";
    width: 14px;
    height: 14px;
    background: #fd6348;
    border-radius: 50%;
  }
</style>
