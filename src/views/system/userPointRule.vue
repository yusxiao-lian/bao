<template>
  <div class="point-rule">
    <div class="header">
      <p class="p1" @click="$router.goBack()"><</p>
      <p>规则</p>
      <p></p>
    </div>
    <div class="conetnt">
      <div v-html="conetnt">{{conetnt}}</div>
    </div>
  </div>
</template>

<script>
import * as api from "@/service/system";
export default {
  data() {
    return {
      conetnt: ""
    };
  },
  created() {
    this.getPointRule();
  },
  methods: {
    async getPointRule() {
      let res = await api.pointRule({
        channelCode: "APP_POINT",
        label: "JFGZ"
      });
      if (res.error.err_code === "0") {
        this.conetnt = res.obj.content;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
  }
}
.conetnt {
  padding: 20px;
  overflow: auto;
}
</style>