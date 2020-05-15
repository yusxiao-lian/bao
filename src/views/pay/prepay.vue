<template>
  <div class="payHistoryList">
    <headerTab></headerTab>
    <div class="PHL-list">
      <div class="PHL-list-content">
        <div class="PHL-list-room" @click="showRoomSelect">
          <i></i>
          <span>{{houseName}}</span>
          <b></b>
        </div>
        <!-- 预缴费用 -->
        <div class="PHL-content">
          <ul>
            <li class="ul-top">
              <div class="ul-top-level">
                <div class="span1">
                  <span class="magnify">预缴项目</span>
                </div>
                <div class="span2" @click="showProject">
                  <span
                    class="gray"
                    :style="{color:this.actProject.name?'#333':''}"
                  >{{this.actProject.name||'请选择'}}</span>
                  <i></i>
                </div>
              </div>
              <div>
                <li>
                  <div class="ul-top-secondary flex1">
                    <span class="span1">预缴金额</span>
                    <span class="span2">
                      ￥
                      <input type="number" placeholder="输入预缴金额" class="input1" v-model="amount" />
                    </span>
                  </div>
                </li>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <bottomButton class="operation" :bgColor="'white'" @click="toFee">确认预缴</bottomButton>
  </div>
</template>
<script>
import { headerTab, bottomButton } from "../../components/index";
import * as pay from "@/service/pay";
import * as wuyePay from "@/service/wuyePay";

export default {
  name: "prepay",
  components: {
    headerTab,
    bottomButton
  },
  data() {
    return {
      dataList: [], //列表数据
      roomList: [], //房间列表
      houseId: "",
      houseName: "",
      disabled: false,
      loop: false,
      autoPlay: false,
      showDots: false,
      projectFeeList: [],
      roomPick: null,
      projectPick: null,
      actProject: {},
      amount: "",
      userInfo: {}
    };
  },
  methods: {
    // 打开下拉选择房间
    showRoomSelect() {
      if (!this.roomPick) {
        this.roomPick = this.$createPicker({
          title: "房间号",
          data: [this.roomList],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            if (this.houseId != selectedVal[0]) {
              this.houseId = selectedVal[0];
              this.getFeeReceivedProject();
            }
          }
        });
      }
      this.roomPick.show();
    },
    //选择预缴项目
    showProject() {
      if (!this.projectPick) {
        this.projectPick = this.$createPicker({
          title: "预缴项目",
          data: [this.projectFeeList],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.actProject = this.projectFeeList[selectedIndex[0]];
            console.log(this.actProject);
          }
        });
      }
      this.projectPick.show();
    },

    async toFee() {
      if (!this.actProject.id) {
        this.Toast("请选择预缴项目");
        return;
      }
      if (this.amount == "") {
        this.Toast("请填写预缴金额");
        return;
      }
      if (this.amount - 0 <= 0) {
        this.Toast("预缴金额必须大于0");
        return;
      }
      var ua = navigator.userAgent.toLowerCase();
      let loading = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      });
      loading.show();
      return await wuyePay
        .advancePayment({
          methodName: "weixinJSAPI",
          billType: 3,
          amount: this.amount,
          houseId: this.houseId,
          feeItemId: this.actProject.id,
          openid: this.userInfo.openid
        })
        .then(res => {
          loading.hide();
          if ("0" == res.error.err_code) {
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
              let data = res.obj.weixinJSAPI;
              WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                  appId: data.appId,
                  timeStamp: data.timeStamp,
                  nonceStr: data.nonceStr,
                  package: data.package,
                  signType: data.signType,
                  paySign: data.paySign
                },
                wxRes => {
                  if (wxRes.err_msg == "get_brand_wcpay_request:ok") {
                    this.Toast("支付成功");
                    setTimeout(() => {
                      window.history.back(-1);
                    }, 500);
                  } else if (
                    wxRes.err_msg == "get_brand_wcpay_request:cancel"
                  ) {
                    //取消
                    this.Toast("取消支付");
                  } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") {
                    //失败
                    this.Toast("支付失败");
                  }
                }
              );
            } else {
              this.Toast("请在微信内打开");
            }
          } else {
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          loading.hide();
          this.Toast(err);
        });
    },

    // 获取房间列表
    async queryCondition() {
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      this.houseId = this.$route.query.houseId || userInfo.houseId;
      let res = await wuyePay.appQueryFeeConditionH5({}, userInfo.accessToken);
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.roomList = res.list.map(v => {
            return Object.assign(v, {
              text: v.houseName,
              value: v.id
            });
          });
          let flag = true;
          if (this.houseId) {
            this.roomList.forEach(v => {
              if (v.id == this.houseId) {
                this.houseName = v.houseName;
                flag = false;
              }
            });
          }
          if (flag) {
            this.houseId = res.list[0].id;
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
      }
    },

    //查询预缴项目
    async getFeeReceivedProject() {
      return await wuyePay
        .getFeeReceivedProject({
          houseId: this.houseId
        })
        .then(res => {
          if (res.error.err_code == "0") {
            this.projectFeeList = (res.list || []).map(v => {
              return {
                ...v,
                text: v.name,
                value: v.id
              };
            });
            this.actProject = this.projectFeeList[0]||{}
            if (this.projectPick) {
              this.projectPick.setData([this.projectFeeList]);
            }
          } else {
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          this.Toast(err);
        });
    }
  },

  async mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
    this.houseId = this.$route.query.houseId || this.userInfo.houseId;
    await this.queryCondition();
    this.getFeeReceivedProject();
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.payHistoryList {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 130px;

  .operation {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
  }

  .PHL-tab-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #eeeeee; /*no*/
    background-color: #fff;

    .PHL-tab {
      width: 50%;
      height: 100px;
      line-height: 100px;
      color: #1a1a1a;
      font-size: 32px;
    }

    .PHL-tab.active {
      color: #1a1a1a;
      border-bottom: 6px solid rgb(0, 176, 240);
      color: rgb(0, 176, 240);
    }
  }

  .PHL-list {
    overflow: hidden;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 30px;

    .PHL-list-content {
      .PHL-list-room {
        margin-top: 30px;
        margin-bottom: 30px;
        height: 90px;
        background: rgba(255, 255, 255, 1);
        line-height: 90px;
        padding-left: 32px;
        position: relative;
        box-shadow: 0 0 10px #eee;
        i {
          width: 38px;
          height: 35px;
          background-image: url("../../assets/build.png");
          background-size: cover;
          display: inline-block;
          vertical-align: text-bottom;
          margin-right: 28px;
        }

        span {
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(26, 26, 26, 1);
        }

        b {
          width: 14px;
          height: 26px;
          background-image: url("../../assets/right-arrow.png");
          background-size: cover;
          display: inline-block;
          position: absolute;
          top: 32px;
          right: 30px;
        }
      }
      .cube-tab-bar-slider {
        width: 50%;
      }
      .PHL-content {
        margin-bottom: 30px;
        .flex1 {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        ul {
          height: 100%;

          .ul-top {
            background-color: #fff;
            // margin-top: 20px;
            box-shadow: 0 0 10px #eee;
            .ul-top-level {
              padding: 0 30px;
              min-height: 98px;
              line-height: 98px;
              border-bottom: 1px solid rgba(234, 234, 234, 1);
              font-size: 36px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(26, 26, 26, 1);
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              .span1 {
                flex: 1;
                .normal {
                  font-size: 32px;
                }
                .magnify {
                  font-size: 36px;
                  color: #1a1a1a;
                }
              }

              .span2 {
                float: right;
                font-size: 36px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(240, 65, 52, 1);
                
                i {
                  margin-left: 15px;
                  width: 14px;
                  height: 26px;
                  background-image: url("../../assets/right-arrow.png");
                  background-size: cover;
                  display: inline-block;
                  transform: rotateZ(90deg);
                }
              }
            }

            li {
              padding: 0 65px 0 30px;
              .ul-top-secondary {
                min-height: 90px;
                line-height: 90px;
                .span1 {
                  float: left;
                  font-size: 36px;
                  font-family: Source Han Sans CN;
                  font-weight: 400;
                  color: rgba(26, 26, 26, 1);
                }
                .span1b {
                  float: left;
                  font-size: 28px;
                  color: #646464;
                }
                .span1c {
                  float: left;
                  font-size: 28px;
                  color: #1a1a1a;
                  margin-left: 20px;
                }
                .span3 {
                  float: left;
                  font-size: 24px;
                  color: #999;
                  margin-left: 20px;
                }
                .span3_active {
                  color: red;
                }
                .span2 {
                  float: right;
                  font-size: 32px;
                  color: rgba(100, 100, 100, 1);
                  color: #A260A4;
                  .input1 {
                    width: 200px;
                    text-align: right;
                  }

                  i {
                    margin-left: 15px;
                    width: 14px;
                    height: 26px;
                    background-image: url("../../assets/right-arrow.png");
                    background-size: cover;
                    display: inline-block;
                    transform: rotateZ(90deg);
                  }
                }
              }
              .info .ul-top-secondary {
                span {
                  color: #999;
                }
              }
            }

            .ul-top-state {
              margin-bottom: 30px;
              height: 95px;
              border-top: 1px solid rgba(234, 234, 234, 1);
              background-color: #fff;

              .ul-top-state-content {
                padding-left: 28px;
                padding-right: 71px;
                line-height: 95px;
                font-size: 26px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(100, 100, 100, 1);
                .red {
                  font-size: 30px;
                }
                .span1 {
                  float: left;
                }

                .span2 {
                  float: right;
                }

                .colorRed {
                  color: rgba(240, 65, 52, 1);
                }
              }
            }
          }
        }
      }
    }
  }

  .bottom {
    transform: rotate(90deg);
  }

  .red {
    color: #fc4500 !important;
  }
  .purple {
    color: #a260a4 !important;
  }
  .gray {
    color: gray;
  }
}
</style>
