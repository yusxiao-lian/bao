<template>
  <div class="visitors">
    <headerTab>
      <div slot="right" class="right" @click="record()">邀请记录</div>
    </headerTab>
    <div class="addVehicle-content-item">
      <ul>
        <li>
          <span class="span1">访客名称</span>
          <input type="text" v-model="objList.name" placeholder="请输入访客名称" />
        </li>
        <li>
          <span class="span1">联系方式</span>
          <input type="number" v-model="objList.phone" placeholder="请输入联系方式" />
        </li>
        <li>
          <span class="span1">有效日期</span>
          <span v-if="end" class="span2" @click="showMinPicker()">{{startArr}}至{{endArr}}</span>
          <span v-else class="span2" @click="showMinPicker()">请选择有效日期</span>
          <i></i>
        </li>
        <li>
          <span class="span1">授权门禁</span>
          <span class="span2" @click="open(2)">{{communityName}}</span>
          <i></i>
        </li>
      </ul>
    </div>

    <!--<div class="invitation" v-if="isShow">-->
    <!--<div class="invitation-zhezhao" @click="cancel"></div>-->
    <!--<div class="invitation-content">-->
    <!--<h2>邀请方式</h2>-->
    <!--<div class="invitation-content-way">-->
    <!--<div @click="share">-->
    <!--<span class="span1"></span>-->
    <!--<p>微信</p>-->
    <!--</div>-->
    <!--<div>-->
    <!--<span class="span2"></span>-->
    <!--<p>短信</p>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="invitation-content-button" @click="cancel">-->
    <!--取消-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <bottomButton class="HouseList-btn" @click="share">邀请</bottomButton>

    <choose :dataList="dataList" @confirm="confirm" @down="down" :invitation="invitation"></choose>

    <!-- 引导 -->
    <div id="maskPointer" v-if="isShow" @click="hideShow">
      <div class="arrow">
        <img src="../../assets/img/guide.png" />
      </div>
      <div class="text">
        点击右上角菜单，
        <br />在
        <span>分享</span>链接
      </div>
    </div>
  </div>
</template>

<script>
import { headerTab, bottomButton } from "../../components/index";
import choose from "./choose";
import * as api from "../../service/entrance";
import { judge } from "../../unit/unit.js";
import { baseUrl } from "../../service/configUrl";

export default {
  name: "visitors",
  data() {
    return {
      communityName: "", //小区门禁
      entranceIds: "", //门禁id
      start: "",
      end: "",
      userInfo: "",
      objList: {
        name: "",
        phone: ""
      },
      isShow: false,
      checked: false,
      invitation: false,
      dataList: [],
      communityList: [],
      startArr: "", //开始日期
      endArr: "", //结束日期
      imgItem: require("../../assets/img/dx.png"),
      judge: judge()
    };
  },
  components: { headerTab, bottomButton, choose },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.userEntranceList();
    if (this.$route.params.item) {
      this.objList.name = this.$route.params.item.visitorName;
      this.objList.phone = this.$route.params.item.visitorPhone;
    }

    console.log(this.getDate());
    this.start = this.getDate();
    let arr1;
    let arr2;
    if (this.judge) {
      arr1 = this.start.split("/");
    } else {
      arr1 = this.start.split("-");
    }
    this.startArr = arr1[1] + "-" + arr1[2];
    this.end = this.getNextDate(this.start, 1);
    console.log(this.judge);
    if (this.judge) {
      arr2 = this.end.split("/");
    } else {
      arr2 = this.end.split("-");
    }
    console.log(arr2, "wwwww");
    this.endArr = arr2[1] + "-" + arr2[2];
    console.log(this.endArr);
  },
  methods: {
    hideShow() {
      this.isShow = false;
    },
    // 获取当前日期
    getDate() {
      // 获取当前日期
      var date = new Date();
      // 获取当前月份
      var nowMonth = date.getMonth() + 1;
      // 获取当前是几号
      var strDate = date.getDate();
      // 获取当前小时
      var getHours = date.getHours();
      // 获取当前秒
      var getMinutes = date.getMinutes();

      // 对月份进行处理，1-9月在前面添加一个“0”
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
      }
      // 对月份进行处理，1-9号在前面添加一个“0”
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      // 对月份进行处理，1-9号在前面添加一个“0”
      if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
      }
      // 对月份进行处理，1-9号在前面添加一个“0”
      if (getMinutes >= 0 && getMinutes <= 9) {
        getMinutes = "0" + getMinutes;
      }

      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期

      if (this.judge) {
        var nowDate =
          date.getFullYear() +
          "/" +
          nowMonth +
          "/" +
          strDate +
          " " +
          getHours +
          ":" +
          getMinutes;
      } else {
        var nowDate =
          date.getFullYear() +
          "-" +
          nowMonth +
          "-" +
          strDate +
          " " +
          getHours +
          ":" +
          getMinutes;
      }
      return nowDate;
    },
    showMinPicker() {
      if (!this.minPicker) {
        this.minPicker = this.$createTimePicker({
          showNow: false,
          title: "选择开始时间",
          min: +Date.parse(new Date()),
          max: +new Date(this.getNext()).getTime(),
          onSelect: this.selectHandler
        });
      }
      this.minPicker.show();
    },
    selectHandler(selectedTime, selectedText, formatedTime) {
      this.minPicker = "";
      console.log(formatedTime);
      this.start = formatedTime;
      let arr1 = formatedTime.split("/");
      this.startArr = arr1[1] + "-" + arr1[2];
      this.showMinPicker1();
    },
    showMinPicker1() {
      let max = new Date(
        this.getNextDate(this.start, this.$route.query.maxDay - 1)
      ).getTime();
      let min = new Date(this.start).getTime();
      console.log(new Date(this.start).getTime(), "哈哈哈哈哈哈哈哈");
      if (!this.minPicker) {
        this.minPicker = this.$createTimePicker({
          showNow: false,
          title: "选择结束时间",
          min: +min,
          max: +max,
          onSelect: this.selectHandler1
        });
      }
      this.minPicker.show();
    },
    selectHandler1(selectedTime, selectedText, formatedTime) {
      this.end = formatedTime;
      let arr2 = formatedTime.split("/");
      this.endArr = arr2[1] + "-" + arr2[2];
      this.minPicker = "";
    },
    record() {
      this.$router.push({
        path: "/record",
        query: { maxDay: this.$route.query.maxDay }
      });
    },
    // 获取下个月今天
    getNext() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1; //0-11表示1-12月
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      // day =31 // 默认下个月最后一天
      if (parseInt(month) < 10) {
        month = "0" + month;
      }
      if (parseInt(day) < 10) {
        day = "0" + day;
      }
      now = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      if (parseInt(month) == 12) {
        //如果是12月份，则取下一年的1月份
        return parseInt(year) + 1 + "-01-" + day;
      }

      let nextDays = new Date(year, parseInt(month) + 1, 0).getDate(); //下月总天数

      if (nextDays < parseInt(day)) {
        console.log(month);
        //下月总天数<本月日期，比如1月的31日，在2月中没有31

        return year + "-" + month + "-" + nextDays + " " + hour + ":" + minute;
      }

      if (parseInt(month) <= 10) {
        return (
          year +
          "-0" +
          (parseInt(month) + 1) +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute
        );
      } else {
        return (
          year +
          "-" +
          (parseInt(month) + 1) +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute
        );
      }
    },

    // 微信分享
    async share() {
      if (!this.objList.name) {
        this.Toast("请填写访客名称");
        return;
      }
      if (!this.objList.phone) {
        this.Toast("请填写联系方式");
        return;
      }
      if (
        !/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
          this.objList.phone
        )
      ) {
        this.Toast("手机号码有误，请重填");
        return;
      }
      if (!this.start) {
        this.Toast("请选择有效开始日期");
        return;
      }
      if (!this.end) {
        this.Toast("请选择有效结束日期");
        return;
      }
      if (!this.communityName) {
        this.Toast("请填写授权门禁");
        return;
      }
      while (this.start.indexOf("/") >= 0)
        this.start = this.start.replace("/", "-");
      while (this.end.indexOf("/") >= 0) this.end = this.end.replace("/", "-");
      let data = {
        communityId: this.userInfo.communityId,
        entranceIds: this.entranceIds,
        visitorName: this.objList.name,
        visitorPhone: this.objList.phone,
        startTime: this.start,
        endTime: this.end,
        houseId: this.userInfo.houseId //房间id
      };
      const toast = this.$createToast({ time: 0, txt: "" }).show();
      toast.hide();
      let res = await api.visitorEntranceApply(data);
      if (res) {
        if (res.error.err_code === "0") {
          this.wxPosition(res.obj.applyId);
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    async wxPosition(applyId) {
      console.log(applyId);
      let desc =
        (this.userInfo.fullName ? this.userInfo.fullName + "邀请您于" : "") +
        (this.start ? this.start + "至" : "") +
        (this.end ? this.end + "访问" : "") +
        (this.userInfo.communityName ? this.userInfo.communityName : ""); // 分享描述

      console.log(desc);
      const toast = this.$createToast({ time: 0, txt: "" }).show();
      await wx.updateAppMessageShareData({
        title: "访客邀请", // 分享标题
        desc: desc,
        // this.userInfo.fullName +
        // "邀请您于" +
        // this.start +
        // "至" +
        // this.end +
        // "访问" +
        // this.userInfo.cityName +
        // this.userInfo.communityName, // 分享描述
        link:
          baseUrl +
          "/static/h5/commerce/index.html#/openDoorList?applyId=" +
          applyId,
        imgUrl: baseUrl + "/static/h5/wechat/dx.png", // 分享图标
        success: async res => {
          this.isShow = true;
          toast.hide();
        }
      });
    },
    // 获取前几天或者后几天的时间戳
    getNextDate(date, day) {
      let dd = new Date(date);
      dd.setDate(dd.getDate() + day);
      let hour = dd.getHours();
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      let minute = dd.getMinutes();
      if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
      }
      let y = dd.getFullYear();
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      if (this.judge) {
        return y + "/" + m + "/" + d + " " + hour + ":" + minute;
      } else {
        return y + "-" + m + "-" + d + " " + hour + ":" + minute;
      }
    },
    cancel() {
      this.isShow = false;
    },
    open(type) {
      this.invitation = true;
      if (type == 1) {
      } else if (type == 2) {
        this.dataList = JSON.parse(JSON.stringify(this.communityList));
      }
    },
    down() {
      this.invitation = false;
    },
    confirm(val) {
      this.communityName = "";
      this.entranceIds = "";
      this.communityList = val;
      let index = 0;
      this.communityList.forEach((v, i) => {
        if (v.checked) {
          if (index == 0) {
            this.communityName += v.name;
            this.entranceIds += v.id;
          } else {
            this.communityName += "," + v.name;
            this.entranceIds += "," + v.id;
          }
          index++;
        }
      });
      this.invitation = false;
    },
    async userEntranceList() {
      let data = {
        communityId: this.userInfo.communityId
      };
      let res = await api.userEntranceList(data);
      if (res) {
        if (res.error.err_code === "0") {
          res.list.forEach((v, i) => {
            if (i > 0) {
              this.communityName += "," + v.name;
              this.entranceIds += "," + v.id;
            } else {
              this.communityName += v.name;
              this.entranceIds += v.id;
            }
            v.checked = true;
          });
          this.communityList = res.list;
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.visitors {
  height: 100%;
  padding-top: 120px;
  background-color: #f1f1f1;
  position: relative;
  overflow: hidden;
  .right {
    font-size: 24px !important;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
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
          height: 60px;
          line-height: 60px;
          margin-top: 14px;
        }
        .span2 {
          width: 480px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
    }
  }
  .invitation {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    .invitation-zhezhao {
      position: absolute;
      bottom: 0;
      top: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 11;
    }
    .invitation-content {
      position: absolute;
      bottom: 0;
      height: 388px;
      width: 100%;
      z-index: 12;
      background: rgba(245, 245, 245, 1);
      h2 {
        padding: 0 35px;
        height: 88px;
        line-height: 88px;
        border-bottom: 1px solid rgba(240, 242, 245, 1);
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(54, 56, 58, 1);
        text-align: center;
        background-color: #fff;
      }
      .invitation-content-way {
        height: 199px;
        background-color: #fff;
        display: flex;
        margin-bottom: 20px;
        div {
          flex: 1;
          padding-top: 30px;
          text-align: center;
          span {
            display: inline-block;
            width: 96px;
            height: 96px;

            margin-bottom: 20px;
          }
          .span1 {
            background-image: url("../../assets/img/wx.png");
            background-size: cover;
          }
          /*.span2 {*/
          /*background-image: url("../../assets/img/dx.png");*/
          /*background-size: cover;*/
          /*}*/
          p {
            font-size: 24px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(54, 56, 58, 1);
          }
        }
      }
      .invitation-content-button {
        height: 88px;
        background: rgba(255, 255, 255, 1);
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 88px;
        text-align: center;
      }
    }
  }
  .HouseList-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
  }
  .visitors-check {
    position: absolute;
    z-index: 999999;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    .visitors-zhezhao {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .visitors-content {
      position: absolute;
      bottom: 0px;
      z-index: 2;
      height: 550px;
      width: 100%;
      overflow-y: auto;
      background-color: #fff;
      padding-top: 80px;
      .visitors-content-top {
        height: 80px;
        text-align: center;
        line-height: 80px;
        padding: 0 20px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 26px;
        width: 100%;
        position: fixed;
        bottom: 470px;
        background-color: #fff;
        z-index: 1;
        .span1 {
          width: 80px;
          font-size: 26px;
          color: #999;
          float: left;
          text-align: center;
        }
        .span2 {
          width: 80px;
          font-size: 26px;
          color: #a260a4;
          float: right;
          text-align: center;
        }
      }
    }
  }

  #maskPointer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    color: #fff;
    z-index: 1000;
  }

  #maskPointer .arrow {
    clear: both;
    height: 346px;
    padding: 50px 30px 30px 30px;
    text-align: right;
  }

  #maskPointer .arrow img {
    height: 100%;
    float: right;
  }

  #maskPointer .text {
    text-align: center;
    font-size: 28px;
    line-height: 36px;
  }

  #maskPointer .text span {
    color: #fed700;
  }
}
</style>
<style lang="scss" type="text/scss">
.visitors {
  .cube-checkbox_checked .cube-checkbox-ui i,
  .cube-checkbox-ui::before,
  .cube-checkbox-ui::before,
  .cube-checkbox-ui i {
    transform: scale(3.23);
  }
  .cube-checkbox-label {
    margin-left: 30px;
  }
}
</style>
