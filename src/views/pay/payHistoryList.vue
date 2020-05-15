<template>
  <div class="payHistoryList">
    <headerTab></headerTab>
    <div class="PHL-list">
      <div class="PHL-list-content">
        <div class="PHL-list-room" @click="showRoomSelect">
          <i></i>
          <span>{{dataList.houseName}}</span>
          <b></b>
        </div>
        <!--菜单切换-->
        <cube-tab-bar v-model="selectedLabel" showSlider ref="tabNav" :data="tabLabels"></cube-tab-bar>

        <!-- 缴费项目 -->
        <cube-slide-item v-show="selectedLabel == '月度账单'">
          <div class="PHL-content">
            <ul>
              <li class="ul-top" v-for="(v,i) in dataList.objectList">
                <div class="ul-top-level" @click="level1(i)">
                  <div class="span1">
                    <span class="magnify">{{new Date(v.objectName).getMonth()+1}}/</span>
                    <span class="normal">{{new Date(v.objectName).getFullYear()}}</span>
                  </div>
                  <div class="span2">
                    <span v-if="v.money!=0" class="red">￥{{Number(v.money).toFixed(2)}}</span>
                    <span v-if="v.money==0" class="purple">￥{{Number(v.moneyPay).toFixed(2)}}</span>
                    <i :style="v.isShow?'transform: rotateZ(-90deg);':''"></i>
                  </div>
                </div>
                <div v-show="v.isShow">
              <li v-for="(v1,i1) in v.feeList">
                <div
                  class="ul-top-secondary"
                  @click="showInfo(v1)"
                  :style="v1.show?'border-bottom: 1px solid rgba(234, 234, 234, 1);':''"
                >
                  <span class="span1">{{v1.objectName}}</span>
                  <span
                    v-if="!v.falg && v.index!=2"
                    class="span3"
                    :class="{'span3_active':(!v1.fullyPaid&&v1.amount>0)}"
                  >
                    {{(v1.fullyPaid||v1.amount==0)?'已支付':'未缴清'}}
                  </span>
                  <span class="span2" v-if="v1.amount!=0">
                        ￥{{Number(v1.amountItem).toFixed(2)}}
                    <!--<i :style="v1.show?'transform: rotateZ(-90deg);':''"></i>-->
                      </span>
                  <span class="span2" v-else-if="v1.amount==0 && !v1.amountPaid">
                        ￥{{Number(v1.finePaid).toFixed(2)}}
                    <!--<i :style="v1.show?'transform: rotateZ(-90deg);':''"></i>-->
                      </span>
                  <span class="span2" v-else-if="v1.amountPaid!=0">
                        ￥{{Number(v1.amountPaid).toFixed(2)}}
                    <!--<i :style="v1.show?'transform: rotateZ(-90deg);':''"></i>-->
                      </span>
                </div>
                <ul v-show="v1.show" class="info">
                  <li v-for="v2 in v1.memoList">
                    <div class="ul-top-secondary">
                      <span class="span1">{{v2[0]}}</span>
                      <span class="span2">{{v2[1]}}</span>
                    </div>
                  </li>
                </ul>
              </li>
          </div>
          <!--支付状态-->
          <div class="ul-top-state">
            <div class="ul-top-state-content">
              <span :class="{'red':v.index == 1 || 2,'gray':v.index == 3}">{{v.stateName}}</span>
            </div>
          </div>
          </li>
          </ul>
      </div>
      </cube-slide-item>
      <!-- 预缴费用 -->
      <cube-slide-item v-show="selectedLabel == '预缴费用'">
        <div class="PHL-content">
          <ul>
            <li
              class="ul-top"
              v-for="item in yujiaoList"
              :key="item.id"
              style="margin-bottom:5px;"
            >
              <div class="ul-top-level">
                <div class="span1">
                  <span class="magnify">预缴日期</span>
                  <span class="normal">{{item.paymentDate}}</span>
                </div>
                <div class="span2" @click="showLis(item)">
                  <span class="purple">剩余 ￥{{Number(item.paidAmount).toFixed(2)}}</span>
                  <i :style="{transform: item.flag?'rotateZ(-90deg)':'rotateZ(90deg)'}"></i>
                </div>
              </div>
              <template v-if="item.flag">
                <div v-for="item_1 in item.list" :key="item_1.objectId" class="ul-top-level2">
            <li>
              <div class="ul-top-secondary">
                <span class="span1b">预缴费用</span>
                <span class="span1c">{{item_1.feeName}}</span>
                <span class="span2">￥{{Number(item_1.fee).toFixed(2)}}</span>
              </div>
            </li>
            <li v-for="item_2 in item_1.prepaidItems" :key="item_2.objectId">
              <div class="ul-top-secondary">
                <span class="span1b">冲抵日期</span>
                <span class="span1c">{{item_2.receivedDate}}</span>
                <span class="span2 red">￥-{{Number(item_2.fee).toFixed(2)}}</span>
              </div>
            </li>
        </div>
</template>
</li>
</ul>
</div>
</cube-slide-item>
</div>
</div>
<bottomButton
  class="operation"
  :bgColor="'white'"
  @click="toRouter"
>{{selectedLabel == '月度账单'?'去缴费':'预缴费'}}
</bottomButton>
</div>
</template>
<script>
  import {headerTab, bottomButton} from "../../components/index";
  import * as pay from "@/service/pay";
  import * as wuyePay from "@/service/wuyePay";

  export default {
    name: "payHistoryList",
    components: {
      headerTab,
      bottomButton
    },
    data() {
      return {
        dataList: [], //列表数据
        roomList: [], //房间列表
        houseId: "",
        yujiaoList: [],
        selectedLabel: "月度账单",
        disabled: false,
        tabLabels: [
          {label: "月度账单", value: "月度账单"},
          {label: "预缴费用", value: "预缴费用"}
        ],
        loop: false,
        autoPlay: false,
        showDots: false
      };
    },
    watch: {
      selectedLabel() {
        // this.appGetFeeReceivableListNew();
        // this.payHistoryList();
      }
    },
    methods: {
      toRouter() {
        switch (this.selectedLabel) {
          case "月度账单":
            this.$router.push({
              path: "/wuyePay",
              query: {houseId: this.houseId, openid: this.$route.query.openid}
            });
            break;

          case "预缴费用":
            this.$router.push({
              path: "/prepay",
              query: {houseId: this.houseId, openid: this.$route.query.openid}
            });
            break;
        }
      },
      changePage(current) {
        this.selectedLabel = this.tabLabels[current].label;
        console.log(current);
      },
      //显示预缴记录
      async showLis(item) {
        item.flag = !item.flag;
        if (item.flag && item.list.length == 0) {
          let loading = this.$createToast({
            time: 0,
            txt: "加载中",
            mask: true
          });
          loading.show();
          await this.appGetFeeReceivedList(item.id);
          loading.hide();
        }
      },
      scroll(pos) {
        const x = Math.abs(pos.x);
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth;
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth;
        const deltaX = (x / slideScrollerWidth) * tabItemWidth;
        this.$refs.tabNav.setSliderTransform(deltaX);
      },
      showInfo(v1) {
        // v1.show = !v1.show
      },
      // 打开下拉选择房间
      showRoomSelect() {
        this.$createPicker({
          title: "房间号",
          data: [this.roomList],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            if (this.houseId != selectedVal[0]) {
              this.houseId = selectedVal[0];
              this.appGetFeeReceivableListNew();
              this.payHistoryList();
            }
          },
          onCancel: () => {
          }
        }).show();
      },
      // 点击二级展开
      level1(i) {
        this.dataList.objectList[i].isShow = !this.dataList.objectList[i].isShow;
      },
      // 点击二级展开 b
      level2(i) {
        this.dataList.objectList[i].isShow2 = !this.dataList.objectList[i]
          .isShow2;
      },
      // 获取房间列表
      async queryCondition() {
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        if (this.$route.query.openid) {
          userInfo.accessToken = this.$route.query.accessToken
          userInfo.houseId = this.$route.query.houseId
          userInfo.openid = this.$route.query.openid
        }
        if (!userInfo || !userInfo.accessToken) {
          this.toLogin();
          return;
        }
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
            if (userInfo.houseId) {
              this.roomList.forEach(v => {
                if (v.id == userInfo.houseId) {
                  console.log(v);
                  this.houseId = v.id;
                  flag = false;
                }
              });
            }
            if (flag) {
              this.houseId = res.list[0].id;
            }
          } else {
            //this.Toast(res.error.err_msg);
          }
        } else {
        }
      },
      // 我的缴费列表
      async appGetFeeReceivableListNew() {
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        if (!userInfo || !userInfo.accessToken) {
          this.toLogin();
          return;
        }
        let res = await wuyePay.appGetFeeReceivableList(
          {
            houseId: this.houseId,
            billType: this.selectedLabel == "月度账单" ? 1 : 3
          },
          userInfo.accessToken
        );
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            res.obj.objectList.forEach((v, i) => {
              v.isShow = true;
              v.isShow2 = true;
              v.money = 0;
              v.moneyPay = 0; //已经支付的总金额
              v.falg = true; //是否全部支付
              v.flag1 = true; //是否全部未支付
              v.index = 0;
              v.feeList.forEach((v1, i1) => {
                if (v1.fullyPaid) {
                  v1.amount = 0;
                }
                if (v1.amount == 0 && v.index < 1) {
                  v.stateName = "未缴清";
                  v.index = 1;
                } else if (v1.amount != 0 && v.index < 1) {
                  v.stateName = "待支付";
                  v.index = 2;
                }
                // 计算已经支付的金额
                if (v1.amountPaid > 0) {
                  v1.amountPay = Math.round(v1.amountPaid * 100) / 100;
                  v.moneyPay = v.moneyPay * 100 + v1.amountPay * 100;
                  v.moneyPay = v.moneyPay / 100;
                  v.moneyPay = v.moneyPay.toFixed(2);
                }
                // 计算还未缴清的金额
                v1.amountItem = Math.round(v1.amount * 100) / 100;
                v.money = v.money * 100 + v1.amountItem * 100;
                v.money = v.money / 100;
                v.money = v.money.toFixed(2);

                if (!v1.fullyPaid) {
                  v.falg = false;
                }
                v1.memoList = [];
                v1.show = false;
                let arr = (v1.memo || "").split("|");
                arr.forEach(v_ => {
                  v1.memoList.push(v_.split(":"));
                });
              });
              if (v.money == 0) {
                v.stateName = "已支付";
                v.index = 3;
                v.isShow = false;
              }
            });
            res.obj.objectList.sort((a, b) => {
              return (
                new Date(b.objectName.replace("-", "/")).getTime() -
                new Date(a.objectName.replace("-", "/")).getTime()
              );
            });
            // res.obj.objectList.forEach(v => {
            //   v.feeList.forEach(v1 => {
            //     v1.amount = Math.floor(v1.amount * 100) / 100
            //   })
            // })
            this.dataList = res.obj;
            console.log(this.dataList, "wwwwwwwwwwwwww");
          } else {
            this.dataList = [];
            //this.Toast(res.error.err_msg);
          }
        } else {
          this.dataList = [];
        }
      },
      // 预缴记录
      async payHistoryList() {
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        if (this.$route.query.accessToken) {
          userInfo.accessToken = this.$route.query.accessToken
        }
        if (!userInfo || !userInfo.accessToken) {
          this.toLogin();
          return;
        }
        return await pay
          .payHistoryList({
            billType: 3,
            houseId: this.houseId,
          })
          .then(res => {
            if ("0" == res.error.err_code) {
              this.yujiaoList = (res.obj.dataList || []).map(v => {
                return {
                  ...v,
                  flag: false,
                  list: []
                };
              });
            } else {
              this.yujiaoList = [];
              //this.Toast(res.error.err_msg);
            }
          })
          .catch(err => {
            this.yujiaoList = [];
            this.Toast(err);
          });
      },
      //预缴抵扣记录
      appGetFeeReceivedList(id) {
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        if (!userInfo || !userInfo.accessToken) {
          this.toLogin();
        }
        return wuyePay
          .appGetFeeReceivedList({feeReceivedId: id})
          .then(res => {
            if ("0" == res.error.err_code) {
              this.yujiaoList = this.yujiaoList.map(v => {
                if (v.id == id) {
                  try {
                    v.list = res.list[0].accountVoList[0].feeVoList;
                  } catch (error) {
                    v.list = [];
                  }
                }
                return v;
              });
            } else {
              this.yujiaoList = [];
              //this.Toast(res.error.err_msg);
            }
          })
          .catch(err => {
            this.Toast(err);
          });
      }
    },
    computed: {
      initialIndex() {
        let index = 0;
        index = findIndex(
          this.tabLabels,
          item => item.label === this.selectedLabel
        );
        return index;
      }
    },
    async mounted() {
      let loading = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      }).show();

      try {
        await this.queryCondition();
        await this.appGetFeeReceivableListNew();
        await this.payHistoryList();
        loading.hide();
      } catch (error) {
        loading.hide();
      }
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
          width: 50% !important;
        }

        .PHL-content {
          margin-bottom: 30px;

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
                    font-size: 26px;
                  }

                  .magnify {
                    font-size: 36px;
                    color: #1a1a1a;
                  }
                }

                .span2 {
                  float: right;
                  font-size: 32px;
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

              .ul-top-level2 {
                border-bottom: 2px solid #ddd;

                &:last-child {
                  border-bottom: none;
                }
              }

              li {
                padding: 0 65px 0 30px;

                .ul-top-secondary {
                  line-height: 50px;
                  padding: 15px 0;
                  overflow: hidden;

                  .span1 {
                    float: left;
                    font-size: 32px;
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
                    max-width: 280px;
                  }

                  .span3 {
                    float: left;
                    font-size: 24px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #999;
                    margin-left: 20px;
                  }

                  .span3_active {
                    color: red;
                  }

                  .span2 {
                    float: right;
                    font-size: 32px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: rgba(100, 100, 100, 1);

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
      color: gray !important;
    }
  }
</style>

