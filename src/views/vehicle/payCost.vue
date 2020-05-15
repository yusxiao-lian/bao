<template>
  <div class="payCost">
    <headerTab></headerTab>
    <div class="addVehicle-content">
      <div class="addVehicle-content-img">
        <p class="span1">
          <span v-for="v in dataList.numberPlateS">{{v}}</span>
        </p>
        <p class="span2">
          <span>{{dataList.carBrand}}</span>
          <span>{{dataList.typeCar}}</span>
          <span>{{dataList.color}}</span>
        </p>
      </div>
      <div class="addVehicle-content-item">
        <ul>
          <li>
            <span class="span1">停车场</span>
            <span class="span2">{{dataList.parkingName}}</span>
          </li>
          <li>
            <span class="span1">当前有效期</span>
            <!--<span class="span2">{{dataList.state}}</span>-->
            <span class="span2" v-if="!isShow">{{dateArr[0]}}-{{dateArr[1]}}-{{dateArr[2]}}</span>
            <span class="span2" v-else>已到期</span>
          </li>
          <li @click="showRoomSelect">
            <span class="span1">缴费月数</span>
            <span class="span2">
              {{num}}
              <span v-if="num">个月</span>
            </span>
            <i></i>
          </li>
          <li>
            <span class="span1">缴费后有效期</span>
            <span class="span2" v-if="invalid">{{invalid}}至{{effective}}</span>
          </li>
          <li>
            <span class="span1">应付金额</span>
            <span class="span2">{{dataList.amount}}元</span>
          </li>
          <li class="tixing" v-if="showPrompt">
            <a :href="'tel://'+phoneNum" v-if="lastDate">
              <p v-for="item in xyMemo" v-if="xyMemo">{{item}}</p>
            </a>
          </li>
        </ul>
      </div>
      <div class="addVehicle-content-item">
        <ul>
          <li>
            <span class="span-top">支付方式</span>
          </li>
          <paySelect @getPayType="getPayType"></paySelect>
        </ul>
      </div>
    </div>
    <div
      class="judgeLast"
      v-if="judgeLastDay"
    >您好，每月最后一天23:57至次日00:03为系统维护时段，续缴功能暂不可用，请在次日00:04起进行缴费，谢谢！
    </div>
    <bottomButton :isDisabled="btnJudge" class="HouseList-btn" @click="determine()">确认缴费</bottomButton>
    <div class="popBg" v-if="isShow1" @click="isShow1=!isShow1"></div>
    <div class="popWin" v-if="isShow1">
      <div class="title">温馨提示</div>
      <div class="content">{{ccjfMemo}}</div>
      <div class="operationDiv">
        <span class="btn" @click="toPay">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {headerTab, bottomButton} from "../../components/index";
  import * as api from "../../service/vehicle";

  import paySelect from "../../components/payment";

  export default {
    name: "payCost",
    data() {
      return {
        prompt: "",
        chargType: "2", //1表示是自然月缴费，2是表示整月缴费
        checked: "",
        dataList: [], //当前数据
        userInfo: "", //用户信息
        dateObj: {
          getFullYear: "2019", //当前年份
          getMonth: "09", //当前月份
          getDate: "03" //当前日
        },
        num: "", //续卡月数
        arr: [], //当前续卡可续月数
        dateArr: "", //当前过期时间
        effective: "", //有效日期
        invalid: "", //有效日期
        isShow: false,
        chargeNew: false, //判断是否是新卡
        maxMonths: 0,
        xyMemo: "", //月卡提醒
        lastDate: "", //月卡缴费最大时间限制
        ccjfMemo: "", //支付超出2个月提醒
        showPrompt: false,
        judgeLastDay: false, //判断是否是每月最后1天23点57分
        phoneNum: this.$route.query.phoneNum, //电话号码
        platformType: "", //判断是哪个平台
        isShow1: false
      };
    },
    components: {headerTab, bottomButton, paySelect},
    computed: {
      btnJudge() {
        if (this.judgeLastDay) {
          return true;
        } else {
          return this.showPrompt;
        }
      }
    },
    async mounted() {
      let _this = this;
      this.judgeMounth();
      window.payCallback = type => {
        if (type == "true") {
          setTimeout(function () {
            _this.$router.push("/myVehicle");
          }, 1000);
        }
      };
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if (this.$route.query.openid) {
        this.userInfo.openid = this.$route.query.openid
      }
      if (!this.userInfo || !this.userInfo.openid) {
        this.$createDialog({
          type: 'alert',
          title: '登录失效请重新登录',
          onConfirm: () => {
            window.localStorage.removeItem('userInfo');
            window.localStorage.removeItem('toGoURL');
            window.location.href = '/wechat/toLogin';
          }
        }).show()

      }
      this.dataList = this.$route.params.items;

      let arr = [];
      for (let i = 0; i < this.dataList.numberPlate.length; i++) {
        if (i == 2) {
          arr.push("·");
        }
        arr.push(this.dataList.numberPlate[i]);
      }
      this.dataList.numberPlateS = arr;
      await this.getInfoById();
      await this.getParkSettings();
      await this.parkingEnable();

      this.dateArr = this.dataList.monthlyValidity.split("-");

      let date = new Date();
      let year = date.getFullYear() + ""; //获取完整的年份(4位)
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.dateObj.getFullYear = year;
      this.dateObj.getMonth = month;
      this.dateObj.getDate = strDate;

      // 判断年不相等的时候
      if (this.dateArr[0] != this.dateObj.getFullYear) {
        // 判断有效期年份大于当前年份
        if (this.dateArr[0] > this.dateObj.getFullYear) {
          let date1 = parseInt(this.dateArr[0]) * 12 + parseInt(this.dateArr[1]);
          let date2 =
            parseInt(this.dateObj.getFullYear) * 12 +
            parseInt(this.dateObj.getMonth);
          var m = Math.abs(date1 - date2);
          if (m <= 3) {
            this.numAll(m);
          } else {
            this.arr = [];
          }
          // 判断有效期年份小于当前年份
        } else {
          this.numAll(3);
        }
      }
      // 判断年相等的时候
      else if (this.dateArr[0] == this.dateObj.getFullYear) {
        // 判断过期月份等于当前月份，并且过期月份大于当前月份
        if (parseInt(this.dateArr[1]) > parseInt(this.dateObj.getMonth)) {
          let num =
            3 - (parseInt(this.dateArr[1]) - parseInt(this.dateObj.getMonth) + 1);
          console.log(num, "月数");
          if (num <= 3) {
            this.numAll(num);
          } else {
            this.arr = [];
          }
        } else if (parseInt(this.dateArr[1]) == parseInt(this.dateObj.getMonth)) {
          // 判断当前年月相等并且当前日不相等
          if (parseInt(this.dateArr[2]) < parseInt(this.dateObj.getDate)) {
            this.numAll(3);
          }
          // 判断当前年月相等并且当前日相等
          else {
            this.numAll(2);
          }
        } else {
          this.numAll(3);
        }
      }
      //以下是调试信息参数部分
      // this.dataList.isNewCard = false//是不是新卡，true是新卡，false是旧卡
      // this.chargType = 1//是不是自然月，1是自然月，2是整月
      // this.dateArr = ["2020", "05", "31"]; //这个是过期时间
      // this.maxMonths = 12
      // this.dateObj = {  //这个是当前时间
      //   getFullYear: "2020",
      //   getMonth: "05",
      //   getDate: "02"
      // };
      // console.log(this.dataList.isNewCard, "是否新卡？true是新卡, false是旧卡");
      // console.log(this.chargType, "1是自然月，2是整月");
      // console.log(this.dateArr[0] + '-' + this.dateArr[1] + '-' + this.dateArr[2], "这个是过期时间");
      // console.log(this.dateObj.getFullYear + '-' + this.dateObj.getMonth + '-' + this.dateObj.getDate, "这个是当前时间");
      // ··············································调试结束部分·······················································································

      let dateDangqian =
        this.dateObj.getFullYear +
        "-" +
        this.dateObj.getMonth +
        "-" +
        this.dateObj.getDate;
      let dateGuoqi =
        this.dateArr[0] + "-" + this.dateArr[1] + "-" + this.dateArr[2];
      var T = new Date(dateGuoqi);
      if (
        T.getTime() <=
        new Date(this.YesterdayTomorrow("今天", dateDangqian)).getTime()
      ) {
        if (this.dataList.isNewCard) {
          this.isShow = true;
        } else {
          if (
            T.getTime() ==
            new Date(this.YesterdayTomorrow("今天", dateDangqian)).getTime()
          ) {
            this.isShow = false;
          } else {
            this.isShow = true;
          }
        }
      } else {
        this.isShow = false;
      }
      if (this.dataList.isNewCard && this.platformType == 0) {
        this.isShow = true;
      }
      this.calculate()
    },
    methods: {
      // 算出还有多少个月可以续费
      calculate() {
        // 到期时间
        let shiji = this.dateArr[0] + "-" + this.dateArr[1] + "-" + this.dateArr[2]; //当前后端返回日期
        // 当前时间
        let dangqian = this.dateObj.getFullYear +
          "-" +
          this.dateObj.getMonth +
          "-" +
          this.dateObj.getDate; //当前实际日期
        let shijiNum = new Date(shiji); //当前后端返回日期
        let dangqianNum = new Date(dangqian); //当前实际日期
        // 判断过期时间是否大于等于当前缴费时间
        if (shijiNum.getTime() > dangqianNum.getTime()) {
          let getFullYear = parseInt(this.dateArr[0]) - this.dateObj.getFullYear
          let getMonth = parseInt(this.dateArr[1]) - this.dateObj.getMonth
          let getDate = parseInt(this.dateArr[2]) - this.dateObj.getDate
          console.log(getFullYear, '这个是年');
          console.log(getMonth, '这个月份');
          console.log(getDate, '这个是日期');
          if (this.chargType == 1) {
            console.log('自然月');
            getMonth = getMonth + 1
            if (getFullYear > 0) {
              getMonth = (12 * getFullYear + parseInt(this.dateArr[1]) + 1) - parseInt(this.dateObj.getMonth)
            }

          } else {
            console.log('整月');


            if (getFullYear > 0) {
              getMonth = (12 * getFullYear + parseInt(this.dateArr[1])) - parseInt(this.dateObj.getMonth)
            }
            if (this.dateArr[1] != this.dateObj.getFullYear && getDate >= 0) {
              getMonth = getMonth + 1
            }
          }
          this.maxMonths = parseInt(this.maxMonths) - getMonth
          if (this.maxMonths <= 0) {
            this.maxMonths = 0
          }
        }
      },
//判断是否是每月最后1天23点57分，则缴费按钮置灰， 提示文案：您好，每月最后一天23:57至次日00:03为系统维护时段，续缴功能暂不可用，请在次日00:04起进行缴费，谢谢！
      judgeMounth() {
        let nowDay = new Date(),
          nextDay = new Date(nowDay.getTime() + 1000 * 60 * 60 * 24);
        if (nextDay.getDate() !== 1) {
          let nowTime = nowDay.getTime(),
            startTime = new Date(
              `${nowDay.getFullYear()}/${nowDay.getMonth() +
              1}/${nowDay.getDate()} 23:57:00`
            ).getTime(),
            endTime = new Date(
              `${nextDay.getFullYear()}/${nextDay.getMonth() +
              1}/${nextDay.getDate()} 00:03:00`
            ).getTime();

          if (nowTime >= startTime && nowTime <= endTime) {
            this.judgeLastDay = true;
          }
        }
      },
      // 获取车辆详情
      async getInfoById() {
        let params = {infoId: this.$route.query.infoId};
        let res = await api.getInfoById(params);
        if (res.error.err_code == 0) {
          this.maxMonths = res.obj.maxMonths ? res.obj.maxMonths : 24
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      getPayType(val) {
        this.checked = val;
      },
      // 判断当前停车场
      async getParkSettings() {
        let params = {
          communityId: this.userInfo.communityId //项目id
        };
        let res = await api.getParkSettings(params);
        if (res.error.err_code == 0) {
          this.chargeNew = res.obj.chargeNew;
          this.xyMemo = res.obj.xyMemo ? res.obj.xyMemo.split("\r\n") : "";
          this.lastDate = res.obj.lastDate ? res.obj.lastDate : "";
          this.ccjfMemo = res.obj.ccjfMemo ? res.obj.ccjfMemo : "";
          this.platformType = res.obj.platformType ? res.obj.platformType : "";

          if (res.obj.platformType == 1 || res.obj.platformType == 2) {
            this.prompt = "续费成功";
          } else {
            this.prompt = "续费成功！待管理处确认后生效";
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 确认
      toPay() {
        this.isShow1 = false;
        this.payCost();
      },
      // 确认缴费
      determine() {
        if (!this.num) {
          this.Toast("请选择续卡月数");
          return;
        }
        if (!this.checked) {
          this.Toast("请勾选支付类型");
          return;
        }
        if (this.num > 1 && this.ccjfMemo) {
          this.isShow1 = true;
          return;
        }
        this.payCost();
      },
      // 确认缴费
      async payCost() {
        let params = {
          openid: this.userInfo.openid, //openId
          plateNumber: this.dataList.numberPlate, //车牌号码
          methodName: "weixinJSAPI",
          amount: this.dataList.amount, //支付金额
          preExpireDate: this.dataList.monthlyValidity, //缴费前的过期时间
          newexpirydate: this.effective, //缴费后的过期时间
          parkingId: this.$route.params.items.parkingId, //停车场Id
          monthCount: this.num, //缴费月数
          communityId: this.userInfo.communityId, //项目id
          houseId: this.userInfo.houseId //房间id
        };
        if (this.$route.params.fromApp) {
          if (this.checked == 1) {
            params.methodName = "alipayApp";
          } else {
            params.methodName = "weixinApp";
          }

          params.billType = "1";
          //返回app
          try {
            window.webkit.messageHandlers.selectParkingPay.postMessage(params);
            return;
          } catch (e) {
          }
          try {
            window.jsObject.selectParkingPay(
              params.plateNumber,
              params.methodName,
              params.amount,
              params.preExpireDate,
              params.newexpirydate,
              params.parkingId,
              params.monthCount,
              params.communityId,
              params.houseId,
              params.billType
            );
            return;
          } catch (e) {
          }
        } else {
          let res = await api.monthlyReNewPay(params);
          if (res.error.err_code == 0) {
            let data = res.obj.weixinJSAPI;
            let appId = data.appId;
            let timeStamp = data.timeStamp;
            let nonceStr = data.nonceStr;
            let pack = data.package; //'prepay_id=' + data.prepay_id;
            let paySign = data.paySign;
            let signType = data.signType;
            let _this = this;

            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              {
                appId: appId, // 必填，公众号的唯一标识
                timeStamp: timeStamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                package: pack, //统一下单接口返回的prepay_id参数值，提交格式如：prepay_id=***
                signType: signType, // 签名类型，默认为MD5，支持HMAC-SHA256和MD5。注意此处需与统一下单的签名类型一致
                paySign: paySign //签名，详见签名生成算法
              },
              wxRes => {
                if (wxRes.err_msg == "get_brand_wcpay_request:ok") {
                  //成功
                  _this.Toast(_this.prompt);
                  setTimeout(() => {
                    _this.$router.push({
                      path: "/results",
                      query: {
                        amount: _this.dataList.amount
                          ? _this.dataList.amount
                          : "0.00", //支付金额
                        numberPlate: _this.dataList.numberPlate, //车牌号
                        parkingName: _this.dataList.parkingName, //停车场名称
                        buildingName:
                          _this.userInfo.communityName +
                          _this.userInfo.buildingName +
                          _this.userInfo.houseName, //缴费房间号
                        num: _this.num + "个月", //续卡月数
                        validity: _this.invalid + "至" + _this.effective //缴费有效期
                      }
                    });
                  }, 500);
                } else if (wxRes.err_msg == "get_brand_wcpay_request:cancel") {
                  //取消
                  this.Toast("取消支付");
                } else if (wxRes.err_msg == "get_brand_wcpay_request:fail") {
                  //失败
                  this.Toast("支付失败");
                }
              }
            );
          } else {
            this.$createDialog({
              type: "alert",
              title: res.error.err_msg,
              content: ""
            }).show();
          }
        }
      },
      GetNextMonthDay(date, monthNum) {
        var dateArr = date.split("-");
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + parseInt(monthNum);
        if (month2 > 12) {
          year2 =
            parseInt(year2) +
            parseInt(parseInt(month2) / 12 == 0 ? 1 : parseInt(month2) / 12);
          month2 = parseInt(month2) % 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = "0" + month2;
        }
        var t2 = year2 + "-" + month2 + "-" + this.days(year2, month2);
        return t2;
      },
      // 获取月份最后一天
      getCurrentMonthLast(date1) {
        if (date1) {
          var date = new Date(date1);
        } else {
          var date = new Date();
        }
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        var lastTime = new Date(nextMonthFirstDay - oneDay);
        var month = parseInt(lastTime.getMonth() + 1);
        var day = lastTime.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        console.log(month);
        console.log(date.getFullYear());
        let s1 = date.getFullYear() + "-" + month + "-" + day
        return s1;
      },
      // 获取当前时间的昨天或者明天
      YesterdayTomorrow(type, date) {
        let day1;
        if (date) {
          day1 = new Date(date);
        } else {
          day1 = new Date();
        }
        if (type == "昨天") {
          day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000); //年份
        } else if (type == "明天") {
          day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000); //年份
        } else if (type == "今天") {
          day1.setTime(day1.getTime());
        }
        let years = day1.getFullYear()
        let month = day1.getMonth() + 1; //月份
        let strDate = day1.getDate(); //日期
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let s1 = years + "-" + month + "-" + strDate;
        return s1;
      },
      // 循环算出动态月数
      numAll(m) {
        for (let i = 0; i <= m; i++) {
          let list = {
            value: i + 1,
            text: i + 1 + "个月"
          };
          list.text = list.text + "";
          this.arr.push(list);
        }
      },
      // 获取月份最后一天
      lastDay(getFullYear, getMonth, type) {
        let lastDay = new Date(getFullYear, getMonth, 0);
        let curYear = lastDay.getFullYear();  //获取完整的年份
        let curMonth = lastDay.getMonth() + 1;  //获取当前月份
        let curDay = lastDay.getDate();       //获取当前日
        if (curMonth < 10) {
          curMonth = '0' + curMonth
        }
        if (curDay < 10) {
          curDay = '0' + curDay
        }
        if (type == 'years') {
          return curYear + '-' + curMonth + '-' + curDay
        } else if (type == 'month') {
          return curMonth
        } else {
          return curDay
        }
      },
      // 算出当前过期时间是否大于当前时间和当前年份算出是否加上一个月
      monthNum(getFullYear, getMonth, getDate, numAll) {
        let last = this.lastDay(getFullYear, getMonth);
        let num;
        if (this.chargType == 1) {
          if (getDate == last && !this.dataList.isNewCard && !this.isShow) {
            num = parseInt(getMonth) + numAll;
          } else {
            num = parseInt(getMonth) + numAll - 1;
          }
        } else {
          if (getDate == last && !this.dataList.isNewCard && !this.isShow) {
            num = parseInt(getMonth) + numAll;
          } else {
            num = parseInt(getMonth) + numAll - 1;
          }
          // num = parseInt(getMonth) + numAll;
        }
        return num;
      },
      // 获取当前属于自然月缴费还是整月缴费
      async parkingEnable() {
        let params = {
          communityId: this.userInfo.communityId //项目id
        };
        let res = await api.parkingEnable(params);
        if (res.error.err_code == 0) {
          if (this.chargeNew && this.dataList.isNewCard) {
            //判断是否是新卡
            this.chargType = 1;
          } else {
            this.chargType = res.obj.chargType;
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取N个月的日期
      monthDate(data, num) {
        var d = new Date(data);
        d.setMonth(d.getMonth() + num);
        var yy1 = d.getFullYear();
        var mm1 = d.getMonth() + 1; //因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
        var dd1 = d.getDate();
        if (mm1 < 10) {
          mm1 = "0" + mm1;
        }
        if (dd1 < 10) {
          dd1 = "0" + dd1;
        }
        return yy1 + "-" + mm1 + "-" + dd1;
      },
      // 获取某个月的总天数
      days(year, month) {
        let dayCount;
        let now = new Date(year, month, 0);
        dayCount = now.getDate();
        return dayCount;
      },
      // 选择缴费几个月
      showRoomSelect() {
        if (this.maxMonths == 0) {
          this.$createDialog({
            type: "alert",
            title: "暂无可缴费月份",
            content: ""
          }).show();
          return;
        }
        if (this.maxMonths > 0) {
          this.arr = [];
          for (let i = 1; i <= this.maxMonths; i++) {
            let list = {
              text: i + "个月",
              value: i
            };
            this.arr.push(list);
          }
        }
        if (this.arr.length < 1) {
          this.$createDialog({
            type: "alert",
            title: "最多支持预缴4个月",
            content: ""
          }).show();
          return;
        }
        this.$createPicker({
          title: "续卡月数",
          data: [this.arr],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.num = selectedVal[0];
            // 1表示是自然月缴费，2是表示整月缴费
            // 到期时间
            let shiji =
              this.dateArr[0] + "-" + this.dateArr[1] + "-" + this.dateArr[2]; //当前后端返回日期
            // 当前时间
            let dangqian =
              this.dateObj.getFullYear +
              "-" +
              this.dateObj.getMonth +
              "-" +
              this.dateObj.getDate; //当前实际日期
            let shijiNum = new Date(shiji); //当前后端返回日期
            let dangqianNum = new Date(dangqian); //当前实际日期
            if (this.chargType == 1) {
              console.log("自然月");
              let num;
              // 判断过期时间是否大于等于当前缴费时间
              if (shijiNum.getTime() > dangqianNum.getTime()) {
                num = this.monthNum(
                  parseInt(this.dateArr[0]),
                  parseInt(this.dateArr[1]),
                  this.dateArr[2],
                  this.num
                );
              } else {
                num = this.monthNum(
                  parseInt(this.dateObj.getFullYear),
                  parseInt(this.dateObj.getMonth),
                  this.dateObj.getDate,
                  this.num
                );
              }

              if (num < 10) {
                num = "0" + num;
              }
              console.log(num, "UUIJJJJ");
              // 开始日期
              // 判断当前时间是否大于过期时间，如果大于就取当前日期，如果小于就取过期时间的明天
              if (dangqianNum.getTime() >= shijiNum.getTime()) {
                if (this.dataList.isNewCard) {
                  this.invalid = this.YesterdayTomorrow("今天", dangqian);
                } else {
                  if (this.isShow) {
                    this.invalid = this.YesterdayTomorrow("今天", dangqian);
                  } else {
                    this.invalid = this.YesterdayTomorrow("明天", dangqian);
                  }
                }
              } else {
                this.invalid = this.YesterdayTomorrow("明天", shiji);
              }
              console.log(this.invalid);
              // this.invalid = "2020-01-31"   //这里是自然月的
              // 结束日期
              // 判断跨年月份是否大于12
              if (parseInt(num) > 12) {
                // 判断过期时间是否大于等于当前缴费时间
                if (shijiNum.getTime() > dangqianNum.getTime()) {
                  this.effective = this.lastDay(parseInt(this.dateArr[0]), num, 'years');
                } else {
                  this.effective = this.lastDay(parseInt(this.dateObj.getFullYear), num, 'years');
                }
              } else {
                if (this.num < 2) {
                  this.effective = this.GetNextMonthDay(this.invalid, 0);
                } else {
                  this.effective = this.GetNextMonthDay(
                    this.invalid,
                    this.num - 1
                  );
                }
              }
              console.log(this.effective);
            } else {
              console.log("整月");
              let num;
              let arr = this.dateArr;
              // 判断过期时间是否大于等于当前缴费时间
              if (shijiNum.getTime() >= dangqianNum.getTime()) {
                num = this.monthNum(
                  parseInt(this.dateArr[0]),
                  parseInt(this.dateArr[1]),
                  this.dateArr[2],
                  this.num
                );
                console.log(num);
                let last;
                let currentAll;
                if (this.dataList.isNewCard) {
                  currentAll = this.YesterdayTomorrow("今天", shiji);
                } else {
                  if (this.isShow) {
                    currentAll = this.YesterdayTomorrow("今天", shiji);
                  } else {
                    currentAll = this.YesterdayTomorrow("明天", shiji);
                  }
                }
                let currentArr = currentAll.split("-");
                if (currentArr[2] == "01") {
                  this.invalid = currentAll;
                  if (this.num == 1) {
                    this.effective = this.getCurrentMonthLast(currentAll);
                    // console.log(last,'pppp');
                    // let arrdate = last[0].split("/");
                    // this.effective =
                    //   arrdate[0] + "-" + arrdate[1] + "-" + arrdate[2];
                  } else {
                    let nian = parseInt(currentArr[0]);
                    let yue = parseInt(currentArr[1]) + parseInt(this.num) - 1;
                    if (yue > 12) {
                      nian = parseInt(currentArr[0])
                      for (let i = 0; i < 100; i++) {
                        if (yue > 12) {
                          yue = parseInt(yue) - 12;
                          nian = nian + 1
                        } else {
                          break;
                        }
                      }
                    }
                    if (yue < 10) {
                      yue = "0" + yue;
                    }
                    let nianAll = nian + "-" + yue + "-" + currentArr[2];
                    this.effective = this.getCurrentMonthLast(nianAll);
                    // let arrdate = last[0].split("/");
                    // this.effective =
                    //   arrdate[0] + "-" + arrdate[1] + "-" + arrdate[2];
                  }
                } else {
                  console.log("没有到期续卡");
                  if (this.dataList.isNewCard) {
                    this.invalid = this.YesterdayTomorrow("今天", shiji);
                  } else {
                    if (this.isShow) {
                      this.invalid = this.YesterdayTomorrow("今天", shiji);
                    } else {
                      this.invalid = this.YesterdayTomorrow("明天", shiji);
                    }
                  }
                  this.effective = this.YesterdayTomorrow(
                    "今天",
                    this.monthDate(shiji, this.num)
                  );
                }
              } else {

                if (this.dataList.isNewCard) {
                  this.invalid = this.YesterdayTomorrow("今天", dangqian);
                } else {
                  if (this.isShow) {
                    this.invalid = this.YesterdayTomorrow("今天", dangqian);
                  } else {
                    this.invalid = this.YesterdayTomorrow("明天", dangqian);
                  }
                }
                this.effective = this.YesterdayTomorrow(
                  "昨天",
                  this.monthDate(this.invalid, this.num)
                );
              }
            }

            if (
              new Date(this.effective).getTime() >
              new Date(this.lastDate).getTime()
            ) {
              this.showPrompt = true;
            } else {
              this.showPrompt = false;
            }

            // 新卡第一个月按天算出金额
            let amount = this.$route.query.amount;
            console.log(this.chargeNew);
            console.log(this.dataList.isNewCard);
            if (this.chargeNew && this.dataList.isNewCard) {

              let invalid = this.invalid.split("-");
              let Numberdays = this.days(invalid[0], invalid[1]); //获取开始日期的总天数
              let priceNum = (amount / Numberdays).toFixed(4); //获取每天的单价
              let totalNum = amount - (Number(invalid[2]) - 1) * priceNum; //获取当前剩余天数的总数
              if (this.num > 1) {
                this.dataList.amount = (
                  totalNum +
                  amount * (this.num - 1)
                ).toFixed(2);
              } else {
                this.dataList.amount = totalNum.toFixed(2);
              }
            } else {
              this.dataList.amount = (amount * this.num).toFixed(2); //续卡总金额
            }
          },
          onCancel: () => {
          }
        }).show();
      }
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  .payCost {
    background-color: #f1f1f1;
    position: relative;
    height: 100%;

    .addVehicle-content {
      padding-top: 100px;
      // padding-bottom: 120px;

      .addVehicle-content-img {
        position: relative;
        height: 220px;
        background-image: url("../../assets/img/addcheliang.png");
        background-size: cover;
        font-size: 48px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding-left: 80px;

        .span1 {
          position: absolute;
          top: 58px;
          left: 80px;
          font-size: 48px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }

        .span2 {
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          position: absolute;
          top: 133px;
          left: 80px;
        }
      }

      .addVehicle-content-item {
        padding-left: 35px;
        padding-right: 45px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.02);
        margin-bottom: 28px;

        ul {
          li {
            height: 88px;
            line-height: 88px;
            border-bottom: 1px solid rgba(240, 242, 245, 1);
            position: relative;

            .span-top {
              font-size: 24px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }

            .span1 {
              font-size: 28px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 89px;
            }

            .span2,
            input {
              font-size: 30px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              line-height: 89px;
              position: absolute;
              right: 50px;
            }

            input {
              text-align: right;
            }

            i {
              width: 50px;
              height: 50px;
              display: inline-block;
              background-size: cover;
              background-image: url("../../assets/img/arrowRight.png");
              position: absolute;
              right: 0;
              top: 19px;
            }
          }

          .tixing {
            height: auto;
            padding: 5px 0 5px 0;

            p {
              font-size: 26px;
              line-height: 1.2;
              color: #333333;
              font-weight: 700;

              &:last-child {
                margin-bottom: 0;
              }
            }

            .p1 {
              color: rgb(101, 101, 251);
              line-height: 50px;
            }
          }

          .payCost-way {
            .span1 {
              padding-left: 74px;
              font-size: 28px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);

              i {
                width: 54px;
                height: 54px;
                display: inline-block;
                background-image: url("../../assets/img/weixin.png");
                background-size: cover;
                position: absolute;
                left: 0;
                top: 17px;
              }
            }

            .span2 {
              top: 50%;
              right: 0;
              transform: translateY(-50%);
            }
          }

          .payCost-zfb {
            .span1 {
              padding-left: 74px;
              font-size: 28px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);

              i {
                width: 54px;
                height: 54px;
                display: inline-block;
                background-image: url("../../assets/img/pay.png");
                background-size: cover;
                position: absolute;
                left: 0;
                top: 17px;
              }
            }

            .span2 {
              top: 50%;
              right: 0;
              transform: translateY(-50%);
            }
          }
        }
      }

      .addVehicle-content-check {
        padding-left: 30px;

        .checkbox-span {
          font-size: 28px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          color: #a260a4;
        }
      }
    }

    .HouseList-btn {
      position: inherit;
      bottom: 0;
      left: 0;
      z-index: 10;
    }

    .popBg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 10;
    }

    .popWin {
      position: fixed;
      top: 50%;
      left: 50%;
      margin-left: -282px;
      margin-top: -275px;
      width: 564px;
      padding-bottom: 50px;
      background: rgba(255, 255, 255, 1);
      border-radius: 22px !important;
      z-index: 11;

      .title {
        padding-top: 60px;
        padding-bottom: 72px;
        font-size: 34px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }

      .content {
        padding: 0 40px;
        color: #666666;
        font-size: 30px;
        line-height: 1.5;
      }

      .operationDiv {
        margin-top: 123px;

        .btn {
          margin: 0 auto;
          width: 480px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          font-size: 28px;
          color: #fff;
          background: linear-gradient(
              90deg,
              rgba(162, 96, 164, 1),
              rgba(199, 119, 201, 1)
          );
          border-radius: 40px;
          display: block;
        }
      }
    }

    .judgeLast {
      padding: 0px 30px 30px 30px;
      line-height: 1.6;
      color: #333;
      font-size: 28px;
    }
  }
</style>
<style lang="scss" type="text/scss">
  .payCost {
    .cube-dialog-title-def{
      text-align: center !important;
    }
    .cube-checkbox-label {
      display: none !important;
    }

    .cubeic-right {
      transform: scale(2.23) !important;
    }

    .cube-checkbox-ui::before {
      transform: scale(2.23) !important;
    }
  }
</style>
