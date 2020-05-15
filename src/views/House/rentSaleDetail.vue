<template>
  <div class="rentSale">
    <!--顶部菜单-->
    <div class="headerSearch">
      <div class="back-arrow" @click="clickBack"></div>
      <div class="headerSearch-box">
        <!-- <input ref="searbox" type="text" autofocus="true" placeholder="请输入小区名" /> -->
      </div>
      <div class="right shareBtn" @click="showPage"></div>
    </div>

    <!--房屋详情-->
    <div class="rentSaleDetail">
      <div class="part1">
        <div class="photo">
          <cube-slide ref="slide" :data="items">
            <cube-slide-item
              v-for="(item, index) in items"
              :key="index"
              @click.native="showImagePreview(item, index)"
            >
              <img :src="item" />
            </cube-slide-item>
          </cube-slide>
        </div>
        <div class="infomation">
          <div class="them">{{houseInfo.title}}</div>
          <div class="remark">
            <div class="price" v-if="$route.query.type=='1'">
              <span>{{houseInfo.rentAmount}}</span>元/月
            </div>
            <div class="price" v-if="$route.query.type=='2'">
              <span>{{houseInfo.totalAmount | amountFilter}}</span>
            </div>
            <div class="summarize">
              <span v-show="houseInfo.houseLayout">{{houseInfo.houseLayout}}</span>
              <span v-show="houseInfo.grossArea">{{houseInfo.grossArea}}㎡</span>
              <span v-show="houseInfo.floor">{{houseInfo.floor}}</span>
              <span v-show="houseInfo.decorationStandard">{{houseInfo.decorationStandard}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 出租 -->
      <div class="part2" v-if="$route.query.type=='1'">
        <li>
          <label>户 型:</label>
          <span>{{houseInfo.houseLayout}}</span>
        </li>
        <li>
          <label>建筑面积:</label>
          <span>{{houseInfo.grossArea}}㎡</span>
        </li>
        <li>
          <label>楼 层:</label>
          <span>{{houseInfo.floor}}</span>
        </li>
        <li>
          <label>朝 向:</label>
          <span>{{houseInfo.orient}}</span>
        </li>
        <li>
          <label>押付方式:</label>
          <span>{{houseInfo.depositType}}</span>
        </li>
      </div>
      <!-- 出售 -->
      <div class="part2" v-if="$route.query.type=='2'">
        <li class="part2Width100">
          <label>单 价:</label>
          <span>{{houseInfo.unitPriceAmount | priceRound}}元/平米</span>
        </li>
        <li>
          <label>楼 层:</label>
          <span>{{houseInfo.floor}}</span>
        </li>
        <li>
          <label>建筑面积:</label>
          <span>{{houseInfo.grossArea}}㎡</span>
        </li>
        <li>
          <label>室内面积:</label>
          <span>{{houseInfo.grossArea}}㎡</span>
        </li>
        <li>
          <label>朝 向:</label>
          <span>{{houseInfo.orient}}</span>
        </li>
        <li>
          <label>建筑年代:</label>
          <span v-if="houseInfo.constructionTime">{{houseInfo.constructionTime}}年</span>
        </li>

        <li class="part2Width100">
          <label>学 区:</label>
          <span>{{houseInfo.hasSchool?'有':'无'}}</span>
        </li>

        <li class="part2Width100">
          <label>红 本:</label>
          <span>{{houseInfo.hasBook?'有':'无'}}</span>
        </li>
      </div>
      <div class="part3">
        <div class="classify">房屋配置</div>
        <div
          class="explain"
        >{{houseInfo.supportingFacilities?houseInfo.supportingFacilities.join('、'):''}}</div>
      </div>
      <div class="part3">
        <div class="classify">房屋描述</div>
        <div class="explain">{{houseInfo.miaoshu}}</div>
      </div>
    </div>

    <!--脚部按钮-->
    <div class="footer">
      <div class="btn1" @click="showLook">预约看房</div>
      <div class="btn2">
        <a :href="'tel:'+houseInfo.clerkPhone"></a>电话咨询
      </div>
    </div>
    <cube-popup type="my-popup" ref="myPopup">
      <div class="bookHouse">
        <div class="title">填写预约信息</div>
        <div class="bookHouse-item">
          <div class="left">姓名：</div>
          <div class="right">
            <input type="text" placeholder="输入姓名" v-model="userName" />
          </div>
        </div>
        <div class="bookHouse-item">
          <div class="left">手机号：</div>
          <div class="right">
            <input type="tel" placeholder="输入手机号" v-model="phone" />
          </div>
        </div>
        <div class="btn">
          <button class="btn1" @click="$refs.myPopup.hide()">取消</button>
          <button class="btn2" @click="bookHouse">确定</button>
        </div>
      </div>
    </cube-popup>
    <div class="shareCom" v-show="shareFlag" @click="shareFlag = false">点击右上角分享</div>
  </div>
</template>

<script>
import { bottomButton } from "../../components/index";
import { appGetLeaseDetail, bookHouse } from "@/service/housingSale";
import { baseUrl } from "@/service/configUrl";
export default {
  name: "rentSale",
  components: {
    bottomButton
  },
  data() {
    return {
      items: [],
      houseInfo: {},
      userName: "",
      phone: "",
      shareFlag: false,
      shareParams: {
        title: "上吉祥E+，更多好房源等你！一起去看看吧！",
        imgPath: baseUrl + "/static/h5/wechat/static/logo.png",
        href: window.location.href,
        content:
          "吉祥租售直属吉祥服务集团旗下，专属置业服务，点击查看更多房源！"
      }
    };
  },
  filters: {
    amountFilter(num) {
      num = Number(num);
      if (num > 10000) {
        return num / 10000 + "万";
      } else {
        return num + "元";
      }
    },
    priceRound(num) {
      num = Number(num);
      return Math.round(num);
    }
  },
  computed: {
    wxJsSdkFlag() {
      return this.$store.state.wxJsSdkFlag;
    }
  },
  watch: {
    wxJsSdkFlag() {
      if (this.wxJsSdkFlag) {
        this.shareWx(this.shareParams);
      }
    }
  },
  methods: {
    clickBack() {
      if (this.$route.query.fromApp) {
        //返回app
        try {
          window.webkit.messageHandlers.goBack.postMessage("");
          return;
        } catch (e) {}
        try {
          window.jsObject.goBack();
          return;
        } catch (e) {}
      }
      console.log(this.$route.query.fromApp, "返回");
      this.$router.goBack();
    },
    showImagePreview(val, index) {
      this.$createImagePreview({
        imgs: this.items,
        initialIndex: index
      }).show();
    },
    //点击分享
    async showPage() {
      let ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.shareFlag = true;
        this.shareWx(this.shareParams);
      } else {
        this.shareApp(this.shareParams);
      }
    },

    clickHandler(item, index) {
      console.log(item, index);
    },

    showLook() {
      // this.userName = "";
      // this.phone = "";
      this.$refs.myPopup.show();
    },
    bookHouse() {
      if (!this.userName) {
        this.Toast("请输入姓名");
        return;
      }
      if (!this.phone) {
        this.Toast("请输入手机号");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.Toast("手机号不合法");
        return;
      }
      let toast = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      });
      toast.show();
      return bookHouse({
        communityId: this.houseInfo.communityId, //社区id
        userName: this.userName, //预约人姓名
        phone: this.phone, //预约人手机号
        leaseId: this.$route.query.leaseId, //租售id
        communityName: "", //项目名
        houseName: this.houseInfo.houseName, //房间名
        clerkerPhone: this.houseInfo.clerkerPhone //业务员手机
      })
        .then(res => {
          toast.hide();
          if (res.error.err_code === "0") {
            this.$refs.myPopup.hide();
            this.$createDialog({
              type: "alert",
              title: "预约提交成功!",
              content: "顾问将尽快联系您",
              icon: ""
            }).show();
          } else {
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          toast.hide();
          this.Toast(err);
        });
    },
    async appGetLeaseDetail() {
      let toast = this.$createToast({
        time: 0,
        txt: "加载中",
        mask: true
      });
      toast.show();
      return await appGetLeaseDetail({
        leaseId: this.$route.query.leaseId
      })
        .then(res => {
          toast.hide();
          if (res.error.err_code === "0") {
            this.houseInfo = res.obj;
            this.items = this.houseInfo.imageAttachments.split(",").map(v => {
              return baseUrl + v;
            });
            this.shareParams = {
              title:
                this.houseInfo.title ||
                "上吉祥E+，更多好房源等你！一起去看看吧！",
              imgPath:
                this.items[0] || baseUrl + "/static/h5/wechat/static/logo.png",
              href: window.location.href,
              content:
                "吉祥租售直属吉祥服务集团旗下，专属置业服务，点击查看更多房源！"
            };
            document.title = this.shareParams.title;
            if (this.wxJsSdkFlag) {
              this.shareWx(this.shareParams);
            }
          } else {
            this.Toast(res.error.err_msg);
          }
        })
        .catch(err => {
          toast.hide();
          this.Toast(err);
        });
    }
  },
  async mounted() {
    await this.appGetLeaseDetail();
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {
      phoneJson: { phone: "" },
      nameJson: {}
    };
    console.log(userInfo, "userInfo");
    this.phone = userInfo.phoneJson.phone || "";
    this.userName = userInfo.nameJson.name || "";
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.rentSale {
  position: relative;
  padding: 100px 0 130px 0;
  height: 100%;
  background: #fff;

  .headerSearch {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    z-index: 3;
    padding: 0 20px 0 0;
    box-shadow: 0 0 10px #dcdcdc;
    .back-arrow {
      height: 100%;
      width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:before {
        content: "";
        width: 13px; /*no*/
        height: 13px; /*no*/
        border-bottom: 1px solid #000000; /*no*/
        border-left: 1px solid #000000; /*no*/
        transform: rotateZ(45deg);
      }
    }
    .headerSearch-box {
      width: 560px;
      height: 56px;
      line-height: 53px;
      border-radius: 6px;
      background: rgba(248, 248, 248, 1);
      padding-right: 30px;
      display: flex;
      align-items: center;
      justify-content: start;
      overflow: hidden;
      display: none;
      &:before {
        content: "";
        width: 30px; /*no*/
        height: 30px; /*no*/
        background: url("../../assets/searchIcon.png") no-repeat 20px 15px;
        background-size: 30px 30px;
      }
      > input {
        display: block;
        width: 100%;
        text-indent: 20px;
        line-height: 30px;
        font-size: 30px;
        outline: none;
      }
    }
    .shareBtn {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 40px;
      height: 40px;
      background: url("../../assets/share.png") no-repeat center;
      background-size: 40px 40px;
      font-size: 0;
    }
  }
  .rentSaleDetail {
    background: #ffffff;
    height: 100%;
    overflow-y: auto;
    .part1 {
      border-bottom: 30px solid #f8f8f8;
      .photo {
        width: 750px;
        height: 500px;
        img {
          width: 750px;
          height: 500px;
        }
      }
      .infomation {
        padding: 40px 30px;
        .them {
          margin-bottom: 35px;
          font-size: 34px;
          line-height: 1.3;
          color: rgba(26, 26, 26, 1);
        }
        .remark {
          display: flex;
          flex-wrap: wrap;
          line-height: 1.3;
          .price {
            margin-right: 35px;
            font-size: 24px;
            color: rgba(253, 70, 0, 1);
            margin-bottom: 20px;
            span {
              font-size: 36px;
              font-weight: bold;
            }
          }
          .summarize {
            display: flex;
            flex-wrap: wrap;
            span {
              margin-right: 15px;
              padding: 0 10px;
              height: 42px;
              line-height: 46px;
              background: rgba(162, 96, 164, 0.1);
              border-radius: 6px;
              font-size: 26px;
              color: rgba(162, 96, 164, 1);
            }
          }
        }
      }
    }
    .part2 {
      border-bottom: 30px solid #f8f8f8;
      padding: 40px 30px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        line-height: 44px;
        display: flex;
        flex-wrap: wrap;
        padding: 8px 0;
        overflow: hidden;
        label {
          width: 130px;
          font-size: 28px;
          color: rgba(153, 153, 153, 1);
          display: inline-block;
        }
        span {
          font-size: 28px;
          color: rgba(26, 26, 26, 1);
        }
      }
      // .part2Width100{
      //   width: 100%;
      // }
    }
    .part3 {
      border-bottom: 30px solid #f8f8f8;
      padding: 40px 30px;
      .classify {
        margin-bottom: 35px;
        font-size: 30px;
        color: rgba(162, 96, 164, 1);
      }
      .explain {
        font-size: 30px;
        color: rgba(26, 26, 26, 1);
        line-height: 1.5;
      }
    }
  }
  .footer {
    padding: 20px 40px;
    width: 750px;
    height: 130px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -5px 9px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-shadow: 0 0 10px #ccc;

    .btn1 {
      width: 320px;
      height: 88px;
      line-height: 88px;
      background: #fff;
      border: 2px solid rgba(162, 96, 164, 1);
      border-radius: 44px;
      font-size: 32px;
      color: rgba(162, 96, 164, 1);
      text-align: center;
    }
    .btn2 {
      width: 320px;
      height: 88px;
      line-height: 88px;
      background: linear-gradient(
        90deg,
        rgba(162, 96, 164, 1),
        rgba(199, 119, 201, 1)
      );
      border: 2px solid rgba(162, 96, 164, 1);
      border-radius: 44px;
      font-size: 32px;
      color: rgba(245, 246, 248, 1);
      text-align: center;
      position: relative;
      > a {
        position: absolute;
        display: block;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2222;
        opacity: 0;
        background: transparent;
      }
    }
  }
}
.bookHouse {
  background: white;
  padding: 30px 60px;
  border-radius: 10px;
  .title {
    text-align: center;
    line-height: 1.1;
    font-size: 34px;
    color: black;
    margin-bottom: 40px;
    margin-top: 20px;
  }
  .bookHouse-item {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    .left {
      width: 120px;
      line-height: 1.3;
      font-size: 30px;
    }
    .right {
      width: calc(100% - 120px);
      > input {
        display: block;
        outline: none;
        border: 2px solid #ccc;
        border-radius: 10px;
        height: 60px;
        text-indent: 0.5em;
        font-size: 30px;
        width: 400px;
      }
    }
  }
  .btn {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    > button {
      padding: 15px 60px;
      font-size: 32px;
      border-radius: 100px;
      line-height: 1.1;
    }
    .btn1 {
      margin-right: 60px;
      border: 2px solid rgba(162, 96, 164, 1);
      background: #fff;
      color: rgba(162, 96, 164, 1);
    }
    .btn2 {
      background: linear-gradient(
        90deg,
        rgba(162, 96, 164, 1),
        rgba(199, 119, 201, 1)
      );
      color: white;
    }
  }
}
.shareCom {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 30px;
  font-size: 40px;
  z-index: 9999;
  text-align: right;
  line-height: 1.2;
}
</style>
