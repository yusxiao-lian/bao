<template>
  <div class="wuyePay" :class="canExchange?'wuyePayPadding220':'wuyePayPadding140'">
    <headerTab>
      <!--<div slot="right" class="head-right-ico" @click="isMask=true"></div>-->
    </headerTab>
    <div class="wuyePay_content_Pay">
      <cube-scroll ref="scroll" :data="dataList" :options="optionsScroll" @pulling-up="onPullingUp">
        <div class="wuyePay_content_Pay_head">
          <div class="wuyePay_content_Pay_head_Level" v-for="(item,index) in dataList" :key="index">
            <div class="wuyePay_content_Pay_head_Level_top" @click="showRoomSelect">
              <i></i>
              <span>{{item.name}}</span>
              <div class="wuyePay_content_Pay_head_Level_top_b">
                <b></b>
              </div>
            </div>
            <div
              class="wuyePay_content_Pay_head_Level_yi"
              v-for="(v,i) in item.next"
              :key="i"
              v-show="item.iSshow"
              v-if="v.price>0"
            >
              <div class="wuyePay_content_Pay_head_Level_yi_checkbox">
                <!--
              <div class="wuyePay_content_Pay_head_Level_yi_checkbox" @click="clickIsChecked(v, index, i)">
                <cube-checkbox v-model="v.checked">
                  {{v.name}}
                </cube-checkbox>-->
                <!--<checkbox class="checkbox" v-model="v.checked" @change="clickIsChecked(v, index, i)"></checkbox>-->
                <!--{{v.name | dateFilter}}-->
                <div class="timeDate">
                  <span class="month">{{dateFilter(v.name).month}}/</span>
                  <span class="year">{{dateFilter(v.name).year}}</span>
                </div>
                <div class="wuyePay_content_Pay_head_Level_yi_checkbox_parice">￥{{v.price}}</div>
              </div>
              <div class="wuyePay_content_Pay_head_Level_yi_list">
                <ul>
                  <li v-for="(v2,i2) in v.next" :key="i2" v-if="v2.money>0">
                    <div class="wuyePay_content_Pay_head_li">
                      <div class="wuyePay_content_Pay_head_li_checkbox">
                        <!--
                      <div class="wuyePay_content_Pay_head_li_checkbox" @click="clickIsCheckedNext(v2, i2, v, index, i)">
                        <cube-checkbox v-model="v2.checked" @click="checkboxFn">
                          {{v2.name}}
                        </cube-checkbox>-->
                        <!--<checkbox class="checkbox" v-model="v2.checked"-->
                        <!--@change="clickIsCheckedNext(v2, i2, v, index, i)"></checkbox>-->
                        {{v2.name}}
                      </div>
                      <div class="wuyePay_content_Pay_head_li_money">
                        <span>￥{{v2.money}}</span>

                        <div class="wuyePay_content_Pay_head_li_money_i">
                          <!--<i :style="v2.iSshow&& 'transform: rotate(-90deg);'"></i>-->
                        </div>
                      </div>
                    </div>
                    <ul v-show="v2.iSshow">
                      <li v-for="(v3,i3) in v2.next" :key="i3">
                        <div class="wuyePay_content_Pay_head_li_san">
                          <div class="wuyePay_content_Pay_head_li_checkbox">
                            <span>{{v3.name}}</span>
                          </div>
                          <div class="wuyePay_content_Pay_head_li_money">
                            <span>{{v3.money}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>

    <!--确认缴费-->
    <div class="wuyePay_bottom">
      <!--能量值-->
      <div class="wuyePay_bottom_energy" v-if="canExchange">
        <span class="energy_span">能量值</span>
        <span class="energy_num">
          共
          <span>{{point}}</span>点能量值，可抵扣
          <span>{{exchangeAmount}}</span>元
        </span>
        <cube-switch v-model="value" @input="exchangeItem"></cube-switch>
      </div>

      <div class="wuyePay_bottom_left">
        <div class="wuyePay_bottom_left_top">
          <!-- <cube-checkbox v-model="checked">
            合计:￥{{sum}}
          </cube-checkbox>-->
          <!--<checkbox class="checkbox" v-model="checked"></checkbox>-->
          <span>合计:</span>
          ￥{{sum}}
        </div>
        <div class="wuyePay_bottom_left_bottom">
          <span class="span2">共 {{checkedSum}} 项类目</span>
        </div>
      </div>

      <div class="wuyePay_bottom_right">
        <button @click="Paycost">确认缴费</button>
      </div>
    </div>
    <!--右侧弹窗-->
    <div class="wuyePay_zhe" v-if="isMask">
      <div class="wuyePay_zhe_left" @click="isHidden()"></div>
      <div class="wuyePay_zhe_right">
        <div class="wuyePay_zhe_right_top">
          <div class="wuyePay_zhe_right_top_content">
            <h3>房间号</h3>
            <div
              class="wuyePay_zhe_right_top_content_div"
              :class="item.flag?'active':''"
              v-for="item in homeList"
              @click="selectActive(item)"
            >{{item.name}}
            </div>
          </div>
        </div>
        <div class="wuyePay_zhe_right_top">
          <div class="wuyePay_zhe_right_top_content">
            <h3>缴纳月份</h3>
            <div
              class="wuyePay_zhe_right_top_content_div"
              :class="item.flag?'active':''"
              v-for="item in timeList"
              @click="selectMouth(item)"
            >{{item.name}}
            </div>
          </div>
        </div>
        <div class="wuyePay_zhe_right_bottom">
          <div class="wuyePay_zhe_right_bottom_reset" @click="resizeData">重置</div>
          <div class="wuyePay_zhe_right_bottom_determine" @click="clickA">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import checkbox from "../../../components/checkboxComponent/checkbox";
  import * as wuyePay from "@/service/wuyePay";
  import {headerTab} from "../../../components/index";

  export default {
    name: "index",
    components: {
      checkbox,
      headerTab
    },
    watch: {
      isMask() {
        if (!this.isMask) {
          this.resizeData();
        }
      },
      checked(val) {
        var sum = 0;
        if (val) {
          var indx = 0;
          this.dataList.forEach((v, i) => {
            v.next.forEach((v1, i1) => {
              v1.checked = true;
              v1.next.forEach((v2, i2) => {
                ++indx;
                v2.checked = true;
                sum = parseFloat(sum) + parseFloat(v2.money);
              });
            });
          });
          this.checkedSum = indx;
        } else {
          this.checkedSum = 0;
          this.dataList.forEach((v, i) => {
            v.next.forEach((v1, i1) => {
              v1.checked = false;
              v1.next.forEach((v2, i2) => {
                v2.checked = false;
              });
            });
          });
        }
        this.sum = sum;
      }
      // value(val) {
      //   if (val) {
      //     this.sum = (((this.sum * 10000) - (this.exchangeAmount * 10000)) / 10000).toFixed(2)
      //   } else {
      //     this.sum = (((this.sum * 10000) + (this.exchangeAmount * 10000)) / 10000).toFixed(2)
      //   }
      // }
    },
    data() {
      return {
        canExchange: false, //判断是否显示能量值抵扣
        exchangePoint: 0,
        point: 0, //总能量值
        exchangeAmount: 0, //可抵扣金额
        value: false,
        isAndroid: false,
        isiOS: false,
        userInfo: null,
        orderByName: {},
        houseId: "",
        accountingDate: "",
        // queryConditionData: [],
        feeReceivableIds: "",
        activeObj: {
          home: "",
          time: ""
        },
        optionsScroll: {
          // pullDownRefresh: {
          //   threshold: 40,
          //   txt: '刷新成功'
          // },
          // pullUpLoad: {
          //   threshold: 40,
          //   txt: {
          //     more: '加载中....',
          //     noMore: '没有更多内容了'
          //   }
          // },
          click: true,
          scrollbar: {
            fade: true,
            interactive: false // 1.8.0 新增
          } //滚动条显示隐藏
          // momentumLimitTime:200,
          // bounceTime:400,
        },
        dataList: [],
        roomList: [],
        homeList: [
          // {name:'房间1', value:'123',flag:false},
        ],
        timeList: [
          // {name:'8月', value:'123',flag:false},
        ],
        checkedSum: 0, //选中的个数
        checked: true,
        isMask: false,
        sum: 0 //总和
      };
    },
    filters: {
      dateFilter: function (value) {
        let arr = value.split("-");
        arr[0] = Number(arr[0]);
        arr[1] = Number(arr[1]);
        return arr[1] + "/" + arr[0];
      }
    },
    methods: {
      exchangeItem(val) {
        if (val || val == 1) {
          this.sum = (
            (this.sum * 10000 - this.exchangeAmount * 10000) /
            10000
          ).toFixed(2);
        } else {
          this.sum = (
            (this.sum * 10000 + this.exchangeAmount * 10000) /
            10000
          ).toFixed(2);
        }
      },
      // 获取能量值
      async exchange() {
        let params = {
          amount: this.sum,
          communityId: this.userInfo.communityId
        };
        let res = await wuyePay.exchange(params, this.userInfo.accessToken);
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            this.exchangeAmount = res.obj.exchangeAmount;
            this.point = res.obj.point;
            this.exchangePoint = res.obj.exchangePoint;
            this.canExchange = res.obj.canExchange;
            // this.canExchange = false
            if (this.canExchange) {
              this.value = true;
              this.exchangeItem(1);
            }
          } else {
          }
        }
      },
      // 打开下拉选择房间
      showRoomSelect() {
        this.$createPicker({
          title: "房间号",
          data: [this.roomList],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.houseId = selectedVal[0];
            this.getFeeReceivableList();
          },
          onCancel: () => {
          }
        }).show();
      },
      dateFilter: function (value) {
        let arr = value.split("-");
        arr[0] = Number(arr[0]);
        arr[1] = Number(arr[1]);
        return {
          month: arr[1],
          year: arr[0]
        };
      },
      Paycost() {
        console.log(this.sum);

        if (this.sum <= 0) {
          this.$createDialog({
            type: "confirm",
            content: "是否使用能量值支付",
            confirmBtn: {
              text: "确定",
              active: true,
              disabled: false,
              href: "javascript:;"
            },
            cancelBtn: {
              text: "取消",
              active: false,
              disabled: false,
              href: "javascript:;"
            },
            onConfirm: () => {
              console.log(999);
              this.submitFn();
            },
            onCancel: () => {
            }
          }).show();
          return;
        } else {
          this.submitFn();
        }
      },
      async submitFn() {
        this.feeReceivableIds = null;
        // if (this.sum === 0) {
        //   this.Toast("请选择账单");
        //   return;
        // }
        const toast = this.$createToast({time: 0, txt: "加载中"}).show();
        console.log(this.dataList[0].next, "this.dataList");
        if (this.dataList && this.dataList.length > 0) {
          this.dataList[0].next.forEach(v => {
            v.next.forEach(k => {
              if (this.feeReceivableIds) {
                this.feeReceivableIds += "," + k.id;
              } else {
                this.feeReceivableIds = k.id;
              }
            });
          });
        }
        let params = {
          openid: this.userInfo.openid,
          billType: 1,
          feeReceivableIds: this.feeReceivableIds,
          methodName: this.sum > 0 ? "weixinJSAPI" : "platform",
          exchangeAmount: 0,
          exchangePoint: 0
        };
        if (this.value) {
          params.exchangeAmount = this.exchangeAmount;
          params.exchangePoint = this.exchangePoint;
        }
        let res = await wuyePay.appFee(params, this.userInfo.accessToken);
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            if (this.sum <= 0) {
              this.Toast("支付成功");
              this.$router.push("/payHistoryList");
              return;
            }
            if (!res.obj) {
              this.Toast("没有数据");
              return;
            }
            let data = res.obj.weixinJSAPI;
            let appId = data.appId;
            let timeStamp = data.timeStamp;
            let nonceStr = data.nonceStr;
            let pack = data.package; //'prepay_id=' + data.prepay_id;
            let paySign = data.paySign;
            let prepayid = data.prepayid;
            let signType = data.signType;
            let duration = this.duration;
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              {
                appId: appId,
                timeStamp: timeStamp,
                nonceStr: nonceStr,
                package: pack,
                signType: signType,
                paySign: paySign
              },
              wxRes => {
                if (wxRes.err_msg == "get_brand_wcpay_request:ok") {
                  this.$router.push("/payHistoryList");
                } else if (wxRes.err_msg == "get_brand_wcpay_request:cancel") {
                  //取消
                  this.Toast("取消支付");
                } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") {
                  //失败
                  this.Toast("支付失败");
                }
              },
              wxErr => {
                toast.hide();
              }
            );
          } else {
            toast.hide();
            this.Toast(res.error.err_msg);
          }
        } else {
          toast.hide();
        }
        toast.hide();
      },
      async queryCondition() {
        this.homeList = [];
        this.timeList = [];
        const toast = this.$createToast({time: 0, txt: "加载中"}).show();
        let res = await wuyePay.appQueryFeeCondition(
          {},
          this.userInfo.accessToken
        );
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            if (res.list && res.list.length > 0) {
              let list = res.list;
              this.roomList = res.list.map(v => {
                return Object.assign(v, {
                  text: v.houseName,
                  value: v.id
                });
              });
              let houseData = [],
                timeData = [];
              for (let i = 0; i < list.length; i++) {
                let houseItem = {};
                houseItem.name = list[i].houseName;
                houseItem.value = list[i].id;
                houseData.push(houseItem);
                if (i == 0) {
                  houseItem.flag = true;
                  this.houseId = list[i].id;
                  let dates = list[i].accountingDates.split(",");
                  for (let j = 0; j < dates.length; j++) {
                    if (dates[j]) {
                      let timeItem = {};
                      timeItem.name = dates[j];
                      timeItem.value = dates[j]
                        .replace("年", "-")
                        .replace("月", "-");
                      timeItem.flag = false;
                      timeData.push(timeItem);
                    }
                  }
                } else {
                  houseItem.flag = false;
                }
              }
              this.homeList = houseData;
              this.timeList = timeData;
              let flag = true;
              if (this.$route.query.houseId) {
                this.roomList.forEach(v => {
                  if (v.id == this.$route.query.houseId) {
                    this.houseId = v.id;
                    flag = false;
                  }
                });
              }
              if (flag) {
                if (this.userInfo.houseId) {
                  this.roomList.forEach(v => {
                    if (v.id == this.userInfo.houseId) {
                      this.houseId = v.id;
                      flag = false;
                    }
                  });
                }
              }

              if (flag) {
                this.houseId = this.roomList[0].id;
              }
            } else {
              this.Toast("没有数据");
              return;
            }
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call appGetFeeReceivableList interface exception");
        }
        toast.hide();
      },
      async getFeeReceivableList() {
        this.sum = 0;
        this.checkedSum = 0;
        this.dataList = [];
        const toast = this.$createToast({time: 0, txt: "加载中"}).show();
        let params = {houseId: this.houseId};
        let res = await wuyePay.appGetFeeReceivableList(
          params,
          this.userInfo.accessToken
        );
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            if (!res.obj) {
              this.Toast("没有数据");
              return;
            }
            let obj = res.obj;
            let data = [];
            res.obj.objectList.sort((a, b) => {
              return (
                new Date(b.objectName.replace("-", "/")).getTime() -
                new Date(a.objectName.replace("-", "/")).getTime()
              );
            });
            let objectList = obj.objectList;
            let item = {};
            item.name = obj.houseName;
            item.iSshow = true;
            item.next = new Array();
            let nextItemNext = new Array();
            for (let i = 0; i < objectList.length; i++) {
              let nextItem = {};
              nextItem.name = objectList[i].objectName;
              nextItem.iSshow = false;
              nextItem.checked = true;
              nextItem.next = new Array();
              let price = 0;
              let feeList = objectList[i].feeList;
              for (let j = 0; j < feeList.length; j++) {
                if (!feeList[j].fullyPaid) {
                  let nextItemNextItem = {};
                  nextItemNextItem.id = feeList[j].id;
                  // let moneyItem = feeList[j].amount.toFixed(3)
                  // moneyItem.substring(0,moneyItem.lastIndexOf('.')+3)
                  let amountItem = Math.round(feeList[j].amount * 100) / 100;
                  nextItemNextItem.money = amountItem;
                  this.sum += nextItemNextItem.money * 1000000;
                  price += feeList[j].amount * 1000000;
                  this.checkedSum += 1;
                  nextItemNextItem.name = feeList[j].objectName;
                  //"memo": "工单号:gxsp2018WX0052|报修时间:2018-08-06 20:48:27|基础费:20|工时费:44.00|物料费:0"
                  nextItemNextItem.memo = feeList[j].memo;
                  nextItemNextItem.iSshow = false;
                  nextItemNextItem.checked = true;
                  // nextItemNext.push(nextItemNextItem);
                  nextItem.next.push(nextItemNextItem);
                }
              }
              nextItem.price = (price / 1000000).toFixed(2);
              item.next.push(nextItem);
            }
            data.push(item);
            this.sum = (this.sum / 1000000).toFixed(2);
            this.dataList = data;
            this.exchange();
          }
        } else {
          this.Toast("call appGetFeeReceivableList interface exception");
        }
        toast.hide();
      },
      isHidden() {
        this.isMask = false;
      },
      // 点击筛选弹出
      isScreening() {
        this.homeList[0].flag = true;
        this.isMask = true;
        // this.queryCondition();
      },
      // 点击一级显示二级
      clickIsShow(index) {
        this.dataList[index].iSshow = !this.dataList[index].iSshow;
      },
      // 点击二级显示三级
      clickIsShowNext(index, i, i2) {
        this.dataList[index].next[i].next[i2].iSshow = !this.dataList[index].next[
          i
          ].next[i2].iSshow;
        //"memo": "工单号:gxsp2018WX0052|报修时间:2018-08-06 20:48:27|基础费:20|工时费:44.00|物料费:0"
        let memo = this.dataList[index].next[i].next[i2].memo;
        if (memo && memo.split("|").length > 0) {
          let next = [];
          let memos = memo.split("|");
          for (let j = 0; j < memos.length; j++) {
            let item = {};
            if (memos[j] && memos[j].split(":").length == 2) {
              let itemNext = memos[j].split(":");
              item.name = itemNext[0];
              item.money = itemNext[1];
              next.push(item);
            }
          }
          this.dataList[index].next[i].next[i2].next = next;
        } else {
          this.Toast("没有数据");
        }
      },
      // 点击第一级选中全部
      clickIsChecked(v, index, i) {
        let chck = v.checked;
        v.next.forEach((item, j) => {
          if (chck) {
            if (!item.checked) {
              if (0 === j) {
                this.checkedSum += v.next.length;
              }
              item.checked = true;
              this.sum = parseFloat(this.sum) + parseFloat(item.money);
            }
          } else {
            if (item.checked) {
              if (0 === j) {
                this.checkedSum -= v.next.length;
              }
              item.checked = false;
              this.sum = parseFloat(this.sum) - parseFloat(item.money);
            }
          }
        });
        if ("0.00" == this.sum) {
          this.sum = 0;
        }
      },
      // 点击第二级选中
      clickIsCheckedNext(v2, i2, v, index, i) {
        // let index = 0;
        let allNextSelected = true;
        v.next.forEach((item, i) => {
          if (!item.checked) {
            allNextSelected = false;
          }
        });
        if (v2.checked) {
          if (allNextSelected) {
            v.checked = true;
          }
          this.sum = parseFloat(this.sum) + parseFloat(v2.money);
          this.checkedSum++;
        } else {
          this.dataList[index].next[i].checked = false;
          this.sum = parseFloat(this.sum) - parseFloat(v2.money);
          this.checkedSum--;
        }
        if ("0.00" == this.sum) {
          this.sum = 0;
        }
      },
      // 上拉加载
      onPullingUp() {
        // 模拟更新数据
        setTimeout(() => {
          this.$refs.scroll.forceUpdate();
        }, 1000);
      },
      // 选中方式
      showActive() {
        this.$createActionSheet({
          title: "请选择物业缴费方式",
          active: 0,
          data: [
            {
              value: "feeItem.name",
              content: "按收费项目"
            },
            {
              value: "accountingDate",
              content: "按应收日期"
            }
          ],
          onSelect: (item, index) => {
            this.orderByName = item;
            this.accountingDate = null;
            this.getFeeReceivableList();
          },
          onCancel: () => {
            // this.Toast('canceled');
          }
        }).show();
      },
      //选择房间
      selectActive(item) {
        if (item.flag) return;
        this.homeList.forEach(v => {
          v.flag = false;
        });
        item.flag = true;
        this.activeObj.home = item.value;
      },
      //选择时间
      selectMouth(item) {
        if (item.flag) return;
        this.timeList.forEach(v => {
          v.flag = false;
        });
        item.flag = true;
        this.activeObj.time = item.value;
      },
      //重置
      resizeData() {
        this.timeList.forEach(v => {
          v.flag = false;
        });
        this.homeList.forEach(v => {
          v.flag = false;
        });
        this.activeObj = {
          home: "",
          time: ""
        };
      },
      //确定
      clickA() {
        this.isMask = false;
        if (this.activeObj.home) {
          this.houseId = this.activeObj.home;
        } else {
          this.houseId = this.homeList[0].value;
        }
        this.accountingDate = this.activeObj.time;
        this.getFeeReceivableList();
      }
    },
    async mounted() {
      // if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger') {
      //   alert('请在微信公众号打开此页面');
      //   window.close();
      //   return;
      // }
      let u = navigator.userAgent;
      this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //android终端或者uc浏览器
      this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.orderByName = {value: "accountingDate", content: "按应收日期"};
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if (this.$route.query.openid) {
        this.userInfo.openid = this.$route.query.openid
      }
      if (!this.userInfo || !this.userInfo.openid) {
        this.$createDialog({
          type: 'alert',
          title: '登录失效请重新登录',
          onConfirm: () => {
            this.toLogin();
          }
        }).show()
      } else {
        await this.queryCondition();
        await this.getFeeReceivableList();
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .wuyePay {
    height: 100%;
    width: 100%;
    background-color: rgb(248, 248, 248);
    position: relative;
    padding-top: 100px;

    .head-right-ico {
      width: 40px;
      height: 56px;
      display: inline-block;
      background-image: url("../../../assets/screening.png");
      background-size: 40px 50px;
      background-repeat: no-repeat;
      background-position: right center;
      vertical-align: middle;
      transform: translateX(50%);
    }

    .wuyePay_content {
      position: fixed;
      width: 100%;
      padding: 0 30px;
      border-top: 1px solid rgb(219, 219, 219);
      border-bottom: 1px solid rgb(219, 219, 219);
      background-color: #fff;

      .wuyePay_head {
        display: flex;
        height: 96px;

        .wuyePay_head_charge,
        .wuyePay_head_screening {
          flex: 1;
          display: inline-block;
          line-height: 96px;

          span {
            margin-right: 16px;
            font-size: 32px;
            font-family: PingFang-SC-Medium;
            font-weight: normal;
            color: rgba(26, 26, 26, 1);
          }
        }

        .wuyePay_head_charge {
          i {
            width: 16px;
            height: 10px;
            display: inline-block;
            background-image: url("../../../assets/polygon.png");
            background-size: cover;
            vertical-align: middle;
          }
        }

        .wuyePay_head_screening {
          i {
            width: 26px;
            height: 28px;
            display: inline-block;
            background-image: url("../../../assets/screening.png");
            background-size: cover;
            vertical-align: middle;
          }
        }
      }
    }

    .wuyePay_content_Pay {
      height: 100%;
      /*padding-top: 97px;*/
      .wuyePay_content_Pay_head {
        text-align: left;
        position: relative;

        .wuyePay_content_Pay_head_Level {
          position: relative;
          padding-top: 20px;

          .wuyePay_content_Pay_head_Level_top {
            line-height: 100px;
            position: relative;
            background-color: #fff;
            padding-left: 30px;
            margin-bottom: 20px;
            box-shadow: 0 0 10px #eee;

            i {
              width: 60px;
              height: 55px;
              margin-right: 10px;
              display: inline-block;
              background-image: url("../../../assets/build.png");
              background-size: cover;
              vertical-align: middle;
            }

            span {
              font-size: 32px;
              font-family: PingFang-SC-Medium;
              font-weight: bold;
              color: rgba(26, 26, 26, 1);
              vertical-align: middle;
              display: inline-block;
              max-width: calc(100% - 200px);
              line-height: 1.3;
            }

            .wuyePay_content_Pay_head_Level_top_b {
              width: 100px;
              height: 100px;
              float: right;

              b {
                width: 14px;
                height: 26px;
                position: absolute;
                right: 30px;
                top: 37px;
                display: inline-block;
                background-image: url("../../../assets/right-arrow.png");
                background-size: cover;
                vertical-align: middle;
                transform: rotate(0deg);
              }
            }
          }

          .wuyePay_content_Pay_head_Level_yi {
            margin-bottom: 20px;
            box-shadow: 0 0 10px #eee;

            .wuyePay_content_Pay_head_Level_yi_checkbox {
              height: 104px;
              line-height: 104px;
              padding: 0 30px;
              display: flex;
              align-items: center;
              background: white;
              border-bottom: 2px solid rgba(234, 234, 234, 1);
              justify-content: space-between;

              .timeDate {
                display: flex;
                align-items: center;

                > span {
                  display: inline-block;
                }

                .month {
                  font-size: 48px;
                  color: #1a1a1a;
                }
              }

              .year {
                font-size: 28px;
                display: table-cell;
                vertical-align: bottom;
                line-height: 30px;
                transform: translateY(12px);
                color: #1a1a1a;
              }

              .wuyePay_content_Pay_head_Level_yi_checkbox_parice {
                color: red;
              }
            }

            .wuyePay_content_Pay_head_Level_yi_list {
              background-color: #fff;
              padding-left: 30px;

              ul {
                li {
                  .wuyePay_content_Pay_head_li {
                    display: flex;
                    font-size: 32px;
                    font-family: PingFang-SC-Medium;
                    font-weight: normal;
                    /*border-bottom: 1px solid rgba(234, 234, 234, 1);*/
                    .wuyePay_content_Pay_head_li_checkbox {
                      flex: 1;
                      line-height: 104px;
                      display: flex;
                      align-items: center;
                    }

                    .wuyePay_content_Pay_head_li_money {
                      flex: 1;
                      text-align: right;
                      position: relative;
                      line-height: 104px;

                      span {
                        /*color: rgba(240, 65, 52, 1);*/
                      }

                      .wuyePay_content_Pay_head_li_money_i {
                        width: 80px;
                        height: 104px;
                        padding-right: 30px;
                        display: inline-block;
                        float: right;

                        i {
                          width: 14px;
                          height: 26px;
                          position: absolute;
                          right: 30px;
                          top: 37px;
                          display: inline-block;
                          background-image: url("../../../assets/right-arrow.png");
                          background-size: cover;
                          vertical-align: middle;
                          transform: rotate(90deg);
                        }
                      }
                    }
                  }

                  ul {
                    border-top: 2px solid rgba(234, 234, 234, 1);

                    li {
                      .wuyePay_content_Pay_head_li_san {
                        display: flex;
                        font-size: 24px;
                        padding-left: 80px;
                        font-family: PingFang-SC-Medium;
                        font-weight: normal;
                        color: #999;

                        .wuyePay_content_Pay_head_li_checkbox {
                          flex: 1;
                          line-height: 80px;
                        }

                        .wuyePay_content_Pay_head_li_money {
                          flex: 1;
                          text-align: right;
                          position: relative;
                          line-height: 80px;
                          padding-right: 30px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .wuyePay_bottom {
      width: 100%;
      background-color: #fff;
      /*padding: 20px 30px;*/
      position: absolute;
      bottom: 0;
      display: flex;
      box-shadow: 0 0 10px #ddd;
      z-index: 10;

      .wuyePay_bottom_left {
        padding: 20px 30px;
        flex: 1;
        height: 100%;

        .wuyePay_bottom_left_top {
          font-size: 36px;
          font-family: PingFang-SC-Bold;
          font-weight: normal;
          color: rgba(26, 26, 26, 1);
          display: flex;
          align-items: center;
          line-height: 50px;
          color: red;

          > span {
            color: black;
            font-size: 42px;
            line-height: 50px;
            font-weight: 600;
          }
        }

        .wuyePay_bottom_left_bottom {
          text-align: left;
          line-height: 50px;

          .span1 {
            font-size: 24px;
            /*margin-right: 10px;*/
          }

          .span2 {
            font-size: 24px;
            font-family: PingFang-SC-Bold;
            font-weight: normal;
            color: rgba(150, 150, 150, 1);
          }
        }
      }

      .wuyePay_bottom_right {
        padding: 20px 30px;
        flex: 1;
        height: 100%;

        button {
          float: right;
          width: 240px;
          height: 88px;
          line-height: 88px;
          text-align: center;
          background: rgba(240, 65, 52, 1);
          border-radius: 6px;
          font-size: 32px;
          font-family: PingFang-SC-Bold;
          font-weight: normal;
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .wuyePay_bottom_energy {
      height: 80px;
      width: 100%;
      background-color: #fff;
      position: absolute;
      bottom: 150px;
      z-index: 99;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      box-shadow: 0 0 10px #ddd;
      padding: 0px 30px;
      line-height: 80px;
      font-size: 28px;
      font-weight: 700;
      z-index: 10;

      .energy_span {
        margin-right: 40px;
      }
    }

    .wuyePay_zhe {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background-color: rgba(0, 0, 0, 0.3);
      overflow-x: hidden;

      .wuyePay_zhe_left {
        height: 100%;
        width: 100px;
        float: left;
      }

      .wuyePay_zhe_right {
        height: 100%;
        width: calc(100% - 100px);
        margin-left: 100px;
        background-color: #fff;

        .wuyePay_zhe_right_top {
          padding-top: 40px;
          padding-left: 40px;

          .wuyePay_zhe_right_top_content {
            border-bottom: 1px solid #ccc;
            overflow: hidden;
            padding-bottom: 30px;

            h3 {
              text-align: left;
            }

            .wuyePay_zhe_right_top_content_div {
              padding: 0 12px;
              margin-top: 10px;
              display: inline-block;
              height: 50px;
              line-height: 50px;
              float: left;
              margin-right: 10px;
              border-radius: 10px;
              color: #000;
            }

            .active {
              border: 1px solid #a260a4; /*no*/
              background-color: #fff;
              color: #a260a4;
            }
          }
        }

        .wuyePay_zhe_right_bottom {
          line-height: 100px;
          height: 100px;
          position: fixed;
          bottom: 0;
          font-size: 32px;
          text-align: center;
          display: flex;
          background-color: #fff;
          width: 100%;
          padding-right: 100px;

          .wuyePay_zhe_right_bottom_reset {
            border-top: 1px solid #cccccc;
            flex: 1;
          }

          .wuyePay_zhe_right_bottom_determine {
            background-color: #a260a4;
            flex: 1;
            color: #ffffff;
          }
        }
      }
    }
  }
</style>

<style lang="scss" type="text/scss">
  .checkbox {
    margin-right: 10px;
  }

  .wuyePay {
    .wuyePay_content_Pay {
      .cube-scroll-list-wrapper {
      }

      .cube-pullup-wrapper {
        background-color: #fff;
      }
    }

    .cube-checkbox {
      padding: 0;
      height: 100%;
      line-height: 100%;
    }

    .cube-checkbox-ui {
      margin-right: 30px;
      font-size: 32px;
      font-family: PingFang-SC-Bold;
      font-weight: normal;
      color: rgba(100, 100, 100, 1);
    }

    .cube-checkbox-wrap {
      padding: 0;
    }

    .cube-switch {
      display: inline-block;
      position: absolute;
      right: 30px;
      top: 8px;
    }
  }

  .wuyePayPadding220 {
    padding-bottom: 220px;
  }

  .wuyePayPadding140 {
    padding-bottom: 140px;
  }
</style>
