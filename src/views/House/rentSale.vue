<template>
  <div class="rentSale">
    <!--顶部菜单-->
    <div class="headerSearch">
      <div class="back-arrow" @click="clickBack"></div>
      <div class="headerSearch-box">
        <input
          type="text"
          autofocus="true"
          placeholder="请输入小区名"
          readonly
          :value="title"
          @click="showSearch"
        />
      </div>
      <div class="right shareBtn" @click="showPage"></div>
    </div>

    <div class="rentSale-com">
      <!--tab切换-->
      <cube-tab-bar v-model="selectedLabel" show-slider class="rentSale-tab">
        <cube-tab v-for="item in tabs" :label="item.label" :key="item.label"></cube-tab>
      </cube-tab-bar>

      <!--条件过滤-->
      <div class="filtration">
        <div class="item" @click="selectCommunity">
          小区
          <i></i>
        </div>
        <div class="item" @click="selectHouseType">
          房屋类型
          <i></i>
        </div>
        <div class="item" @click="selectApartmentLayout">
          户型
          <i></i>
        </div>
        <div class="item" @click="priceSort">
          价格
          <i></i>
          <!-- <i class="arrowIcon arrowUp"></i> -->
        </div>
      </div>
      <!--房屋列表-->
      <div class="tab-slide-container">
        <ul class="rentSaleList">
          <template v-for="item in rentSaleList">
            <li @click="detail(item)" :key="item.leaseId" v-if="selectedLabel == '租房'">
              <div class="photo">
                <img :src="item.imgUrl" />
              </div>
              <div class="infomation">
                <div class="them">{{ item.title }}</div>
                <div class="summarize">
                  <span v-show="item.houseLayout">
                    {{
                    item.houseLayout
                    }}
                  </span>
                  <span v-show="item.grossArea">{{ item.grossArea }}m²</span>
                  <span v-show="item.floor">{{ item.floor.replace('楼','') }}/{{item.totalFloor}}</span>
                  <span v-show="item.decorationStandard">
                    {{
                    item.decorationStandard
                    }}
                  </span>
                </div>
                <div class="price">
                  <span>{{ item.rentOrTotal }}</span>元/月
                </div>
              </div>
            </li>
            <li @click="detail(item)" :key="item.leaseId" v-if="selectedLabel == '买房'">
              <div class="photo">
                <img :src="item.imgUrl" />
              </div>
              <div class="infomation">
                <div class="them">{{ item.title }}</div>
                <div class="summarize">
                  <span v-show="item.houseLayout">
                    {{
                    item.houseLayout
                    }}
                  </span>
                  <span v-show="item.grossArea">{{ item.grossArea }}m²</span>
                  <span v-show="item.floor">{{ item.floor.replace('楼','') }}/{{item.totalFloor}}</span>
                  <span v-show="item.decorationStandard">
                    {{
                    item.decorationStandard
                    }}
                  </span>
                </div>
                <div class="price">
                  <span>{{ item.totalAmount | amountFilter}}</span>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <div class="search" v-show="searchFlag">
      <div class="headerSearch">
        <div class="back-arrow" @click="searchFlag = false"></div>
        <div class="headerSearch-box">
          <input ref="searbox" type="text" autofocus="true" placeholder="请输入小区名" v-model="title" />
        </div>
        <div class="right searchBtn" @click="searchHouse">搜索</div>
      </div>
      <div class="mark" @click="searchFlag = false"></div>
    </div>
    <priceRange ref="priceRange" @getDate="getpriceDate" />
    <downSelect
      ref="downSelect1"
      :dataList="communityList"
      @getActSelect="getCommunityAct"
      key="1"
    />
    <downSelect
      ref="downSelect2"
      :dataList="HouseTypeList"
      @getActSelect="getHouseTypeAct"
      key="2"
    />
    <downSelect
      ref="downSelect3"
      :dataList="apartmentLayoutList"
      @getActSelect="getApartmentLayoutAct"
      key="3"
    />
    <div class="shareCom" v-show="shareFlag" @click="shareFlag = false">点击右上角分享</div>
  </div>
</template>

<script>
import { bottomButton } from "../../components/index";
import { appGetLeaseList } from "@/service/housingSale";

import { baseUrl } from "@/service/configUrl";
import priceRange from "./components/priceRange";
import downSelect from "./components/downSelect";
export default {
  name: "rentSale",
  components: {
    bottomButton,
    priceRange,
    downSelect
  },
  data() {
    return {
      selectedLabel: "租房",
      tabs: [
        {
          label: "租房",
          value: "租房"
        },
        {
          label: "买房",
          value: "买房"
        }
      ],
      searchFlag: false,
      communityList: [], //小区列表，
      pickerCommunity: null,
      HouseTypeList: [], //房屋类型
      pickerHouseType: null,
      apartmentLayoutList: [], //户型
      pickerApartmentLayout: null,
      rentSaleList: [],
      acthouseType: [], //房屋类型
      actcommunityId: [], //
      acthouseLayout: [], ////户型
      amountStart: "",
      amountEnd: "",
      title: "",
      shareFlag: false,
      selectList: [],
      changeFlag: false, //是否改变下拉选项的值
      orderBy: "",
      shareParams: {
        title: "上吉祥E+，更多好房源等你，一起去看看吧！",
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
        this.shareWx_(this.shareParams);
      }
    },
    selectedLabel() {
      this.acthouseType = [];
      this.actcommunityId = [];
      this.acthouseLayout = [];
      this.amountStart = "";
      this.amountEnd = "";
      this.amountEnd = "";
      this.orderBy = "";
      if (this.selectedLabel) {
        let query = { type: this.selectedLabel };
        if (this.$route.query.fromApp) {
          query.fromApp = 1;
        }
        this.$router.replace({
          query: {
            ...query
          }
        });
        this.changeFlag = true;
        this.appGetLeaseList();
      }
    }
  },

  methods: {
    getCommunityAct(val) {
      console.log(val);
      this.actcommunityId = val;
      this.appGetLeaseList();
    },
    getHouseTypeAct(val) {
      this.acthouseType = val;
      this.appGetLeaseList();
    },
    getApartmentLayoutAct(val) {
      this.acthouseLayout = val;
      this.appGetLeaseList();
    },
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
    //显示搜索
    showSearch() {
      this.searchFlag = true;
    },
    //点击分享
    async showPage() {
      let ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.shareFlag = true;
        this.shareWx_(this.shareParams);
      } else {
        this.shareApp(this.shareParams);
      }
    },
    // 微信分享
    shareWx_(shareParams, type) {
      wx.updateTimelineShareData({
        title: shareParams.content, // 分享标题
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath // 分享图标
      });
      wx.updateAppMessageShareData({
        title: shareParams.title, // 分享标题
        desc: shareParams.content, // 分享描述
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath // 分享图标
      });

      wx.onMenuShareTimeline({
        title: shareParams.content, // 分享标题
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath // 分享图标
      });
      wx.onMenuShareQZone({
        title: shareParams.title, // 分享标题
        desc: shareParams.content, // 分享描述
        link: shareParams.href, // 分享链接
        imgUrl: shareParams.imgPath // 分享图标
      });
    },

    //获取价格区间
    getpriceDate(data) {
      this.amountStart = data.amountStart;
      this.amountEnd = data.amountEnd;
      this.orderBy = "asc";
      this.appGetLeaseList();
    },
    searchHouse() {
      this.searchFlag = false;
      this.acthouseType = []; //房屋类型
      this.actcommunityId = []; //小区
      this.acthouseLayout = []; //户型
      this.amountStart = "";
      this.amountEnd = "";
      this.appGetLeaseList();
    },
    detail(item) {
      let type = "";
      switch (this.selectedLabel) {
        case "租房":
          type = "1";
          break;

        case "买房":
          type = "2";
          break;
      }
      this.$router.push(
        "/rentSaleDetail?leaseId=" + item.leaseId + "&type=" + type
      );
    },
    //选择小区
    selectCommunity() {
      this.selectList = this.communityList;
      console.log(this.communityList);
      this.$refs.downSelect1.show();
    },
    //选择房屋类型
    selectHouseType() {
      this.selectList = this.HouseTypeList;
      this.$refs.downSelect2.show();
    },
    //选择户型
    selectApartmentLayout() {
      this.selectList = this.apartmentLayoutList;
      this.$refs.downSelect3.show();
    },
    //价格区间
    priceSort() {
      this.$refs.priceRange.show();
    },

    //查询租售信息列表
    async appGetLeaseList() {
      return await appGetLeaseList({
        leaseStyle: this.selectedLabel == "租房" ? 1 : 2, // 租售方式 （1=出租；2=出售）
        houseType: this.acthouseType.join(",") || "", //房屋类型
        communityId: this.actcommunityId.join(",") || "", //小区
        houseLayout: this.acthouseLayout.join(";") || "", //户型
        amountStart: this.amountStart,
        amountEnd: this.amountEnd,
        communityName: this.title,
        orderColumn:
          this.selectedLabel == "租房" ? "rentAmount" : "totalAmount", //rentAmount
        orderBy: this.orderBy //"asc"
      })
        .then(res => {
          if (res.error.err_code === "0") {
            this.rentSaleList = res.obj.data.map(v => {
              return {
                ...v,
                imgUrl: baseUrl + v.imageAttachments.split(",")[0]
              };
            });
            if (this.changeFlag) {
              this.changeFlag = false;
              this.HouseTypeList = (res.obj.houseTypeHomeQuery || []).map(v => {
                return {
                  ...v,
                  text: v.name,
                  value: v.id
                };
              });
              this.apartmentLayoutList = (res.obj.houseLayoutQuery || []).map(
                v => {
                  return {
                    ...v,
                    text: v.name,
                    value: v.id
                  };
                }
              );
              let communityList = [];
              (res.obj.communityQuery || []).forEach(v => {
                if (v.list) {
                  v.list.forEach(k => {
                    communityList.push({
                      ...k,
                      text: k.name,
                      value: k.id
                    });
                  });
                }
              });
              this.communityList = communityList;
            }
          } else {
            this.Toast(res.error.err_msg);
            this.rentSaleList = [];
          }
        })
        .catch(err => {
          this.Toast(err);
        });
    }
  },

  async mounted() {
    this.changeFlag = true;
    document.title = this.shareParams.title;
    if (this.wxJsSdkFlag) {
      this.shareWx_(this.shareParams);
    }
    if (this.$route.query.type) {
      if (this.selectedLabel == this.$route.query.type) {
        await this.appGetLeaseList();
      } else {
        this.selectedLabel = this.$route.query.type || "租房";
      }
    } else {
      await this.appGetLeaseList();
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.rentSale {
  position: relative;
  padding: 100px 0 0px 0;
  height: 100%;
  background: #fff;
  overflow: hidden;
  .search {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(51, 51, 51, 0.664);
    z-index: 99999999;
    padding: 100px 0 0px 0;
    .mark {
      height: 100%;
    }
  }
  .rentSale-com {
    height: 100%;
    overflow-y: auto;
  }
  .headerSearch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    background-color: #fff;
    z-index: 3;
    border-bottom: 2px solid #dcdcdc;
    //box-shadow: 0 0 10px #ccc;
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
      width: calc(100% - 200px);
      height: 70px;
      line-height: 70px;
      border-radius: 6px;
      background: rgba(248, 248, 248, 1);
      padding-right: 30px;
      display: flex;
      align-items: center;
      justify-content: start;
      overflow: hidden;
      &:before {
        content: "";
        width: 60px;
        height: 100%;
        background: url("../../assets/searchIcon.png") no-repeat;
        background-size: 30px 30px;
        background-position: center;
      }
      > input {
        display: block;
        width: 100%;
        text-indent: 6px;
        line-height: 70px;
        font-size: 30px;
        outline: none;
      }
    }
    .shareBtn {
      width: 100px;
      height: 100%;
      background: url("../../assets/share.png") no-repeat center;
      background-size: 40px 40px;
      font-size: 0;
    }
    .searchBtn {
      width: 100px;
      text-align: center;
      line-height: 53px;
      color: #333;
    }
  }
  .rentSale-tab {
    // position: fixed;
    // top: 100px;
    // left: 0;
    width: 100%;
    display: flex;
    background-color: #fff;

    > div {
      flex: 1;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 28px;
    }

    .divBorderBottom {
      border-bottom: 4px solid #a260a4;
      color: #a260a4;
    }
  }

  .filtration {
    // position: fixed;
    // top: 200px;
    // left: 0;
    height: 100px;
    line-height: 100px;
    display: flex;
    flex-wrap: wrap;
    .item {
      flex: 1;
      text-align: center;
      font-size: 30px;
      color: rgba(52, 52, 52, 1);
      i {
        margin-left: 15px;
        width: 14px;
        height: 26px;
        background-image: url("../../assets/right-arrow.png");
        background-size: cover;
        display: inline-block;
        transform: rotateZ(90deg);
      }
      .arrowIcon {
        width: 25px;
        height: 25px;
        transform: rotateZ(180deg);
      }
      .arrowUp {
        background-image: url("../../assets/arrowUp.png");
        background-size: cover;
      }
      .arrowDown {
        background-image: url("../../assets/arrowDown.png");
        background-size: cover;
      }
    }
  }
  .tab-slide-container {
    width: 100%;
    .rentSaleList {
      padding: 0 20px 0 20px;
      margin-bottom: 50px;
      li {
        padding: 30px 0;
        border-bottom: 1px solid rgba(221, 221, 221, 1); /*no*/
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        .photo {
          width: 200px;
          height: 200px;
          img {
            width: 200px;
            height: 200px;
          }
        }
        .infomation {
          width: calc(100% - 220px);
          min-height: 200px;
          .them {
            font-size: 34px;
            line-height: 1.3;
            color: rgba(26, 26, 26, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            white-space: normal;
            word-wrap: break-word;
          }
          .summarize {
            margin: 15px 0 0px 0px;
            display: flex;
            flex-wrap: wrap;
            span {
              margin-right: 8px;
              padding: 0 8px;
              height: 42px;
              line-height: 42px;
              background: rgba(162, 96, 164, 0.1);
              border-radius: 8px;
              font-size: 24px;
              color: rgba(162, 96, 164, 1);
              margin-bottom: 15px;
            }
            span:last-child {
              margin-right: 0;
            }
          }
          .price {
            font-size: 24px;
            color: rgba(253, 70, 0, 1);
            span {
              font-size: 34px;
              font-weight: bold;
            }
          }
        }
      }
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
