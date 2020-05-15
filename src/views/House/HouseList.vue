<template>
  <div class="HouseList">
    <headerTab>
      <div slot="right" class="right" @click="bounced">深i您</div>
    </headerTab>
    <div class="HouseList-com">
      <ul class="HouseList-list">
        <li
          :class="item.approveStatus === 1?'auth':'authNo'"
          v-for="item in houseList"
          v-if="item.approveStatus !== -1"
        >
          <div class="li-div" @click="clickHouse(item)">
            <div class="House-commity">{{item.communityName}}</div>
            <div class="House-name">{{item.buildingName+item.houseName}}</div>
            <span class="spanTitle" v-if="item.houseId===activeHouse.houseId">当前房屋</span>
            <div class="House-s">
              <span
                :class="{'tag1':item.approveStatus === 1,'tag2':item.approveStatus === 0,'tag3':item.approveStatus === -1 || item.approveStatus === 2}"
              >{{item.approveStatus | filterStatus}}</span>
            </div>
          </div>

          <div
            class="registration"
            v-if="item.approveStatus === 1"
            @click="registrationClick(item)"
          >体温登记</div>
          <div
            class="registration declare"
            v-if="item.approveStatus === 1"
            @click="declare(item)"
          >信息申报</div>
          <div class="roleType">{{item.applyType | filtersRoleType}}</div>
        </li>
      </ul>
      <div class="noHouse" v-show="houseList.length<1">
        <img src="../../assets/house-bg.png" alt />
        <div>未添加房屋</div>
        <p>
          添加房屋后可使用物业保修、物业缴费、
          <br />停车管理等多项便利服务
        </p>
      </div>
    </div>
    <bottomButton class="HouseList-btn" @click="$router.push('/addHouse/city')">添加房屋</bottomButton>
    <!--   小程序入口-->
    <div class="bounced" v-if="isBounced">
      <div class="bounced-zhezhao" @click="zhezhao"></div>
      <div class="bounced-conteng">
        <img src="../../assets/img/shenIni.png" />
        <p>长按识别小程序进入</p>
      </div>
    </div>
    <!--    体温登记-->
    <div class="bounced" v-if="isRegistration">
      <div class="bounced-zhezhao" @click="cancelRegistration"></div>
      <div class="bounced-conteng bounced-conteng-radius">
        <p>体温登记</p>
        <div class="div-date">
          <span>日期：</span>
          {{getFullYear}}年{{getMonth}}月{{getDate}}日
        </div>
        <div class="div-input">
          <span>体温：</span>
          <input type="number" v-model="temperature" />°C
        </div>
        <div class="div-input">
          <span>姓名：</span>
          <input type="text" v-model="item.customerName" />
        </div>
        <div class="div-button">
          <span class="span1" @click="cancelRegistration">返回</span>
          <span class="span2" @click="registrationDetermine">登记</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { headerTab, bottomButton } from "../../components/index";
import { getHouseList, checkTemp } from "../../service/House";
import { getUserInfo } from "@/service/personalMessage";

export default {
  name: "HouseList",
  components: {
    headerTab,
    bottomButton
  },
  data() {
    return {
      houseList: [],
      activeHouse: {},
      isBounced: false,
      isRegistration: false,
      item: "", //保存点击登记的数据
      temperature: "", //体温
      getFullYear: "",
      getMonth: "",
      getDate: "",
      from: false, // 选择完后是返回原来流程页还是商户首页
    };
  },
  filters: {
    filterStatus(value) {
      let str = "";
      switch (value) {
        case 0:
          str = "审核中";
          break;
        case 1:
          str = "已认证";
          break;
        case 2:
          str = "认证未通过";
          break;
        case -1:
          str = "已失效";
          break;
        default:
          str = "";
      }
      return str;
    },
    filtersRoleType(value) {
      let str = "";
      switch (value) {
        case 1:
          str = "产权业主";
          break;
        case 2:
          str = "租户";
          break;
        case 3:
          str = "家人";
          break;
        case 4:
          str = "员工";
          break;
        case 8:
          str = "企业";
          break;
        case 11:
          str = "业主";
          break;
        default:
          str = "其他";
      }
      return str;
    }
  },
  methods: {
    // 信息申报跳转
    declare() {
      this.$router.push("/questionnaire");
    },
    // 获取年月日
    dateAll() {
      let date = new Date();
      this.getFullYear = date.getFullYear(); //获取完整的年份(4位)
      this.getMonth = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      this.getDate = date.getDate(); //获取当前日(1-31)
    },
    // 点击弹出登记框
    registrationClick(item) {
      this.isRegistration = true;
      this.item = item;
      console.log(item, "YYYY");
    },
    async registrationDetermine() {
      let data = {
        houseId: this.item.houseId,
        houseName: this.item.houseName,
        customerName: this.item.customerName,
        customerId: this.item.customerId,
        temperature: this.temperature
      };
      if (!this.temperature) {
        this.Toast("请填写您的体温");
        return;
      }
      if (this.temperature < 1) {
        this.Toast("体温必须大于1");
        return;
      }
      if (!this.item.customerName) {
        this.Toast("请填写您的姓名");
        return;
      }
      let res = await checkTemp(data);
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.Toast("登记成功！");
          this.isRegistration = false;
          this.item = "";
          this.temperature = "";
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    // 取消登记
    cancelRegistration() {
      this.isRegistration = false;
      this.item = "";
      this.temperature = "";
    },
    // 深i您小程序入口
    bounced() {
      this.isBounced = true;
    },
    zhezhao() {
      this.isBounced = false;
    },
    async clickHouse(item) {
      console.log(item);
      const toast = this.$createToast({ time: 0, txt: "" }).show();
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));

      userInfo.communityId = item.communityId;
      userInfo.communityName = item.communityName;
      userInfo.buildingName = item.buildingName;
      userInfo.houseId = item.houseId;
      userInfo.houseName = item.houseName;
      userInfo.address = item.address ? item.address : ''
      userInfo.authFlag = false;
      this.activeHouse = item;
      let res = await getUserInfo({ communityId: userInfo.communityId });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          res.obj.communitys.forEach(v => {
            if (v === userInfo.communityId) {
              userInfo.authFlag = true;
              this.Toast("切换房屋成功");
            }
          });
        }
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      toast.hide();
    },
    async getHouseList() {
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let data = {
        // communityId:'73a539aca84843a19115fa5422a805ed'
      };
      let res = await getHouseList(data);
      if (res) {
        if (res.error.err_code === "0") {
          let index = 0,
            flag = true,
            flag2 = true;
          // this.houseList = res.list
          res.list.forEach((v, i) => {
            if (userInfo.communityId == v.communityId) {
              if (userInfo.houseId && userInfo.houseId === v.houseId) {
                console.log(userInfo.houseId, v.houseId);
                this.activeHouse = v;
                flag2 = flag = false;
              }
            }
          });
          if (flag2) {
            res.list.forEach((v, i) => {
              if (userInfo.communityId == v.communityId) {
                if (
                  (v.approveStatus == 1 || v.approveStatus == 0) &&
                  index < 1
                ) {
                  this.activeHouse = v;
                  index++;
                  flag2 = flag = false;
                }
              }
            });
          }
          if (flag) {
            res.list.forEach((v, i) => {
              if ((v.approveStatus == 1 || v.approveStatus == 0) && index < 1) {
                this.activeHouse = v;
                index++;
              }
            });
          }
          this.houseList = [];
          res.list.forEach((v, i) => {
            if (v.houseId != this.activeHouse.houseId) {
              this.houseList.push(v);
            } else if (v.houseId == this.activeHouse.houseId) {
              this.houseList.unshift(v);
            }
          });
          console.log(this.houseList, "%%%%%%");
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    }
  },
  async mounted() {
    if(this.$route.query.from) {
      this.from = true
    }
    this.$store.dispatch("setActiveHouseObj", {});
    const toast = this.$createToast({ time: 0, txt: "" }).show();
    await this.getHouseList();
    this.dateAll();
    toast.hide();
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.HouseList {
  position: relative;
  height: 100%;
  padding: 100px 0 130px 0;
  background: #f9f9f9;

  .HouseList-com {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }

  .HouseList-list {
    padding: 0 30px;
    padding-bottom: 30px;

    > li {
      margin-top: 20px;
      height: 200px;
      border-radius: 10px;
      background-color: #ececee;
      background-image: url("../../assets/img/houseBg.png");
      background-repeat: no-repeat;
      background-position: left bottom;
      background-size: 100%;
      padding-left: 20px;
      display: flex;
      align-items: center;
      align-content: center;
      flex-wrap: wrap;
      position: relative;

      & .auth {
        border-top: 10px solid #73d171;
      }

      & .authNo {
        border-top: 10px solid #ffd04f;
      }

      .li-div {
        width: 100%;
        height: 100%;
      }

      .spanTitle {
        position: absolute;
        right: 5px;
        top: 20px;
      }

      .House-commity {
        font-size: 36px;
        color: black;
        width: 70%;
        line-height: 50px;
        height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .House-name {
        margin-top: 20px;
        font-size: 24px;
        color: #333333;
        width: 80%;
        line-height: 40px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .House-s {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 50px;
        font-size: 12px;
        line-height: 50px;
        z-index: 1;
      }

      .House-s > span {
        display: inline-block;
        font-size: 20px;
        position: relative;
      }

      .House-s > span.tag1 {
        width: 120px;
        height: 50px;
        background: url("../../assets/img/tag1.png") no-repeat center;
        background-size: 120px 50px;
        color: white;
        text-align: center;
      }

      .House-s > span.tag2 {
        width: 120px;
        height: 50px;
        background: url("../../assets/img/tag2.png") no-repeat center;
        background-size: 120px 50px;
        color: white;
        text-align: center;
      }

      .House-s > span.tag3 {
        width: 120px;
        height: 50px;
        background-color: #ccc;
        color: white;
        text-align: center;
      }
    }
  }

  .noHouse {
    > img {
      width: 180px;
      height: 180px;
      display: block;
      margin: 0 auto;
      margin-top: 200px;
    }

    > div {
      color: black;
      font-size: 32px;
      line-height: 60px;
      text-align: center;
      transform: translateY(-35px);
    }

    > p {
      text-align: center;
      color: #7a7a7a;
      font-size: 28px;
      line-height: 44px;
      transform: translateY(-20px);
      opacity: 0.5;
    }
  }

  .HouseList-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
  }

  .right {
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    white-space: nowrap;
  }

  .bounced {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;

    .bounced-zhezhao {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 15;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .bounced-conteng {
      width: 600px;
      height: 600px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      margin-left: -300px;
      margin-top: 350px;
      z-index: 16;

      img {
        width: 500px;
        margin: 0 auto;
        margin-top: 10px;
      }

      p {
        margin-top: 30px;
        font-size: 36px;
        text-align: center;
      }
    }

    .bounced-conteng-radius {
      height: auto;
      border-radius: 15px;
      padding-bottom: 30px;

      p {
        font-size: 34px;
        font-weight: 500;
        margin-bottom: 40px;
      }

      .div-date {
        padding-left: 130px;
        font-size: 30px;
        height: 36px;
        margin-bottom: 20px;

        span {
          margin-right: 5px;
        }
      }

      .div-input {
        height: 36px;
        padding-left: 130px;
        font-size: 30px;
        margin-bottom: 20px;

        span {
          margin-right: 10px;
        }

        input {
          padding-left: 5px;
          width: 205px;
          margin-right: 15px;
          border: 1px solid #ccc;
        }
      }

      .div-button {
        height: 50px;
        margin-top: 50px;
        text-align: center;

        span {
          width: 200px;
          height: 50px;
          display: inline-block;
          text-align: center;
          color: #fff;
          line-height: 50px;
          border-radius: 10px;
          background-color: rgb(98, 98, 98);
        }

        .span1 {
          margin-right: 10px;
        }

        .span2 {
          margin-left: 10px;
        }
      }
    }
  }

  .registration {
    width: 150px;
    height: 50px;
    position: absolute;
    right: 0;
    bottom: 10px;
    background-color: rgb(14, 156, 214);
    text-align: center;
    line-height: 50px;
    color: #fff;
    border-radius: 5px;
    font-size: 28px;
    z-index: 1;
  }
  .roleType {
    position: absolute;
    left: 20px;
    bottom: 20px;
    line-height: 40px;
    font-size: 28px;
    color: #333333;
  }
  .declare {
    right: 165px;
  }
}
</style>
