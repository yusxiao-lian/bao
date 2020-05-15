<template>
  <div class="instructions">
    <headerTab></headerTab>
    <div class="instructions-conteng">
      <cube-scroll
        ref="scrollObj"
        :data="myFormList"
        @pulling-up="onPullingUp"
        @pulling-down="onPullingDown"
        :options="optionsScroll"
      >
        <div class="repairRecord-li">
          <div class="repairRecord-li-content" v-for="(item,index) in myFormList">
            <div class="li-house-content">
              <p class="p_tltie">                
                <span><i class="icon-house"></i>停车月保卡：</span>
                <span>{{item.carCode}}</span>
              </p>
              <p class="p_other">
                <span>缴费时间</span>
                <span>{{item.createdDate}}</span>
              </p>
              <p class="p_other">
                <span>缴费房间</span>
                <span>{{item.houseName}}</span>
              </p>
              <p class="p_other">
                <span>缴费金额</span>
                <span>{{item.amount}}</span>
              </p>
              <p class="p_other">
                <span>月卡有效期</span>
                <span>{{item.date}}</span>
              </p>
              <p class="p_other">
                <span>支付方式</span>
                <span>{{item.payMethod}}</span>
              </p>
            </div>
          </div>
          <div class="repairRecord-noData" v-if="myFormList.length<1">暂无缴费记录!</div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import * as api from "../../service/vehicle";

export default {
  name: "instructions",
  components: {
    headerTab
  },
  data() {
    return {
      myFormList: [],
      optionsScroll: {
        pullDownRefresh: {
          threshold: 60,
          txt: "刷新成功"
        },
        pullUpLoad: {
          threshold: 40,
          txt: {
            more: "加载中....",
            noMore: "没有更多内容了"
          }
        },
        click: true,
        scrollbar: true
      },
      params: {
        carCode: this.$route.query.carCode,
        pageNo: 1, //当前页码
        pageSize: 10 //页大小
      }
    };
  },
  created() {
    this.monthlyCarFeeList();
  },
  methods: {
    // 获取月卡缴费记录列表
    async monthlyCarFeeList(type = "") {
      let res = await api.monthlyCarFeeList(this.params);
      if (res.error.err_code == 0) {
        let newList = [];
        if (res.list != null) {
          newList = res.list;
        }
        if (type == "more") {
          //加载更多
          this.myFormList = [...this.myFormList, ...newList];
        } else {
          this.myFormList = newList;
        }
      } else {
        this.$createDialog({
          type: "alert",
          title: res.error.err_msg,
          content: ""
        }).show();
      }
    },
    async onPullingDown(type) {
      console.log("下拉刷新");
      this.params.pageNo = 1;
      await this.monthlyCarFeeList();
      this.$refs.scrollObj.forceUpdate();
    },
    async onPullingUp(type) {
      console.log("上拉加载");
      this.params.pageNo++;
      await this.monthlyCarFeeList("more");
      this.$refs.scrollObj.forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.instructions {
  height: 100%;
  background-color: #f1f1f1;
  padding-top: 100px;

  .instructions-conteng {
    height: calc(100% - 10px);
    width: 100%;
    overflow: hidden;
    overflow-y: auto;

    .repairRecord-li {
      height: 100%;
      // padding-left: 24px;

      .repairRecord-li-content {
        margin-top: 30px;
        padding-right: 50px;
        padding-left: 50px;
        padding-top: 10px;
        position: relative;
        padding-bottom: 24px;
        border-bottom: 1px solid #ddd;
        background-color: white;

        .li-house-content {
          padding-top: 10px;
          .p_tltie {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 15px;
            span {
              display: inline-block;
              font-size: 30px;
              color: rgba(26, 26, 26, 1);
              .icon-house {
                width: 40px;
                height: 40px;
                display: inline-block;
                background-image: url("../../assets/img/money.png");
                background-size: cover;
                margin-right: 20px;
                vertical-align: middle;
              }
              &:first-child {
                display: inline-block;
                width: 49%;
              }
              &:last-child {
                text-align: right;
                color:rgba(162,96,164,1);
              }
            }
          }

          .p_other {
            line-height:50px;
            font-size: 30px;
            overflow: hidden;

            span:nth-child(1) {
              display: inline-block;
              width: 180px;
              color:rgba(153,153,153,1);
              float: left;
            }

            span:nth-child(2) {
              float: right;
              color:rgba(51,51,51,1);
            }
          }
        }
      }
      .repairRecord-noData {
        text-align: center;
        font-size: 40px;
        margin-top: 400px;
      }
    }
  }
}
</style>
