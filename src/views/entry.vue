<template>
  <div id="entry">
    <div @click="abc(item.path)" v-for="(item,key) in List" :key="key">{{item.meta.title}}</div>
    <div style="width:100%">分割线</div>
    <div @click="abc(item.path)" v-for="(item,index) in routers" :key="item.name">
      <p v-if="item.meta">{{item.meta}}</p>
      <p v-else>{{item.name}}</p>
    </div>
  </div>
</template>

<script>
import router from "../router";

export default {
  name: "entry",
  data() {
    return {
      List: [
        {
          path: "/login",
          name: "login",
          meta: { keeplive: true, title: "登录" }
        },
        {
          path: "/MyOrder",
          name: "MyOrder",
          meta: { keeplive: true, title: "我的订单" }
        },
        {
          path: "/personalMessage",
          name: "personalMessage",
          meta: { keeplive: true, title: "个人资料" }
        },
        {
          path: "/wuyePay",
          name: "wuyePay",
          meta: { keeplive: true, title: "物业缴费" }
        },
        {
          path: "/payHistoryList",
          name: "payHistoryList",
          meta: { keeplive: true, title: "缴费记录" }
        },
        {
          path: "/repairApply",
          name: "repairApply",
          meta: { keeplive: true, title: "物业报修" }
        },
        {
          path: "/repairRecord",
          name: "repairRecord",
          meta: { keeplive: true, title: "物业报修记录" }
        },
        // {path:'/parkingMonthPayment',name:'parkingMonthPayment',meta:{keeplive:true,title:'停车月保缴费'}},
        // {path:'/temporaryStopPaySettlementH5',name:'temporaryStopPaySettlementH5',meta:{keeplive:true,title:'H5临停缴费-结算'}},
        // {path:'/paymentCompletion',name:'paymentCompletion',meta:{keeplive:true,title:'临停缴费-支付完成'}},
        {
          path: "/toScanPayQRCode",
          name: "toScanPayQRCode",
          meta: { keeplive: true, title: "生成通道扫码缴费二维码" }
        },
        // {path:'/toScanPay',name:'toScanPay',meta:{keeplive:true,title:'通道扫码缴费'}},
        {
          path: "/createParkingQRCode",
          name: "createParkingQRCode",
          meta: { keeplive: true, title: "生成H5临停缴费二维码" }
        },
        {
          path: "/stopPayQueryH5",
          name: "stopPayQuery",
          meta: { keeplive: true, title: "H5临停缴费-查询" }
        }
      ],
      routers: []
    };
  },
  created() {
    console.log(router.options.routes);
    this.routers = router.options.routes;
  },
  methods: {
    abc(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>

<style lang="scss" scoped>
#entry {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding-top: 60px;
  div {
    display: inline-block;
    padding: 20px 60px;
    background-color: #00b1f1;
    color: white;
    border: 1px solid #dcdcdc;
  }
}
</style>
