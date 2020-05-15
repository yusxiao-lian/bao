<template>
  <div id="myWork">
    <headerTab :title="$route.meta.title" />
    <div class="myWork-content">
      <div class="topInfo">
        <span class="workIcon12"></span>
        <div class="them">
          <span>工单待分派</span>
          <i class="tips">32</i>
        </div>
      </div>
      <toDoTasksList v-if="selectedLabel=='工单待分派'" ref="scrollList">        
      </toDoTasksList>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import toDoTasksList from "@/components/toDoTasksList";

export default {
  name: "myWork",
  components: {
    headerTab,
    toDoTasksList
  },
  data() {
    return {
      selectedLabel: "工单待分派",
    };
  },
  methods: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
#myWork {
  height: calc(100% - 100px);
  //height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  //padding-bottom: 80px;
  .myWork-content {
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .topInfo {
      position: relative;
      width: 750px;
      height: 75px;
      background: #ffffff;
      // border-bottom: 15px solid #ededed;
      display: flex;
      flex-wrap: wrap;
      .them {
        margin: 0 auto;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        span {
          color: #333333;
          font-size: 32px;
          line-height: 75px;
        }
        .tips {
          margin-top: 25px;
          margin-left: 15px;
          padding: 0 10px;
          height: 24px;
          font-size: 18px;
          color: #ffffff;
          line-height: 24px;
          background: rgba(253, 99, 72, 1);
          border-radius: 30px;
          vertical-align: middle;
        }
      }
      .workIcon12 {
        position: absolute;
        top: 15px;
        left: 20px;
        width: 48px;
        height: 48px;
        background: url("../../assets/workIcon12.png");
        background-size: 100% 100%;
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
.cube-tab-bar {
  border-bottom: 22px solid #ededed !important;
}
.cube-tab {
  position: relative;
}
.cube-tab::after {
  position: absolute;
  top: 25px;
  right: 55px;
  content: "";
  width: 14px;
  height: 14px;
  background: #fd6348;
  border-radius: 50%;
}
</style>
