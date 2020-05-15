<!-- 商户首页 -->
<template>
  <section class="merchants-index">
    <!--    头部-->
    <section class="local-head">
      <div class="location-info">
        <div
          class="community-name"
          @click="gotoRouter({name: 'chooseCommunity', query:{from: 'merchants'}})"
        >
          {{commu_name}}
        </div>
        <i
          class="cubeic-pulldown pull-icon"
          style="color: rgb(50,50,50);font-size: 24px;"
        ></i>
      </div>
      <div class="message" v-if="show_phone" @click="showPhoneConfirm">
        <i class="message-icon"></i>
      </div>

      <div class="phone" @click="messageClick">
        <i class="cubeiPhone"></i>
      </div>
    </section>
    <!--    内容-->
    <section class="scroll-wrapper">
      <cube-scroll
        ref="scroll"
        :data="popular_merchants"
        @pulling-up="onPullingUp"
        @pulling-down="onPullingDown"
        :options="optionsScroll"
      >
        <div class="content-top">
          <section class="slide-wrapper">
            <cube-slide ref="slide" :data="slide_items" :interval="freq_time" @change="changePage">
              <!-- <template slot="dots" slot-scope="props">
                <span class="my-dot" :class="{active: props.current === index}" v-for="(item, index) in props.dots">{{index + 1}}</span>
              </template>-->
              <cube-slide-item
                v-for="(item, index) in slide_items"
                :key="index"
                @click.native="clickHandler(item, index)"
              >
                <a :href="item.url">
                  <img :src="item.slideshowImgUrl" style="width: 100%;height: 100%"/>
                </a>
              </cube-slide-item>
            </cube-slide>
          </section>
          <section class="menu-wrapper">
            <div
              class="menuitem-wrapper"
              v-for="(item, index) in menu_list"
              :key="item.id"
              @click="menuLink(item)"
            >
              <div class="menu-img">
                <img :src="baseUrl + item.moduleLogo" class="item-img"/>
              </div>
              <div class="menu-text">{{item.moduleName}}</div>
              <!-- <div class="menu-text">{{baseUrl + item.moduleLogo}}</div> -->
            </div>
          </section>
          <section class="notice-wrapper">
            <div class="notice-wrapper-content">
              <div class="img-wrapper">
                <img src="../../assets/announcement.png"/>
              </div>
              <div
                class="text"
                v-if="!is_login || !authFlag"
                style="height: 35px;line-height: 35px;padding-left: 10px"
              >登录并认证后解锁
              </div>
              <div
                v-if="this.notice.length<1&(is_login & authFlag)"
                class="text"
                style="height: 35px;line-height: 35px;padding-left: 10px"
                @click="clickNotice"
              >暂无最新通知公告
              </div>
              <div v-else>
                <div class="img-wrapper-right"></div>
                <div class="text-wrapper">
                  <div @click="clickNotice" class="text-wrapper-div1" v-if="this.notice.length>0">
                    <span
                      class="i1"
                      :class="this.notice[0].className"
                    >{{this.notice[0].categoryName}}</span>
                    <p>{{this.notice[0].title}}</p>
                  </div>
                  <div @click="clickNotice" class="text-wrapper-div2" v-if="this.notice.length>1">
                    <span
                      class="i2"
                      :class="this.notice[1].className"
                    >{{this.notice[1].categoryName}}</span>
                    <p>{{this.notice[1].title}}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="content-bottom">
          <div class="content-bottom-content">
            <section class="more-title">
              <span class="more-top">热门推荐</span>
              <span class="more-bottom" @click="gotoRouter({name: 'merchantsList'})">
                <span>更多推荐</span>
              </span>
            </section>
            <section class="slide-container">
              <section class="list-wrapper">
                <div
                  class="list-item"
                  v-for="(item,index) in popular_merchants"
                  :class="[index % 2 != 0 ? 'lf-m' : 'rg-m']"
                >
                  <div class="item-img" @click="hrefLink(item)">
                    <img :src="baseUrl + item.logoPath" class="merchant-img"/>
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{item.name}}</div>
                    <div class="item-slogan">{{item.description}}</div>
                  </div>
                </div>
                <!-- 占位 不满双数则凑一个双数 -->
                <!--                <div class="list-item lf-m" style="background: #F8F8FA" v-if="popular_merchants.length %2 != 0"></div>-->
              </section>
            </section>
          </div>
        </div>
      </cube-scroll>
      <!--            &lt;!&ndash; 如果有门禁字段的话 &ndash;&gt;-->
      <!--            <section class="tabbar-wrapper" v-if="show_open">-->
      <!--              <cube-tab-bar-->
      <!--                class="tab-bar"-->
      <!--                v-model="selectedLabelDefault"-->
      <!--                :data="tabs2"-->
      <!--                @click="clickTabHandler"-->
      <!--                @change="changeTabHandler">-->
      <!--                <cube-tab class="tab-item" v-for="(item, index) in tabs2" :label="item.label" :key="item.key">-->
      <!--                  <div class="circle-tab" v-if="item.key == 'open'" @click="gotoRouter({name: 'entrance'})">-->
      <!--                    <img src="../../assets/img/phone-btn.png" class="circle-img"/>-->
      <!--                  </div>-->
      <!--                  <i slot="icon" class="tab-icon" :class="item.icon" v-if="item.key != 'open'"></i>-->
      <!--                  <div class="tab-icon" v-else></div>-->
      <!--                  <span class="tab-text">{{item.label}}</span>-->
      <!--                </cube-tab>-->
      <!--              </cube-tab-bar>-->
      <!--            </section>-->
      <!--            &lt;!&ndash; 没有门禁字段的话 &ndash;&gt;-->
      <!--            <section class="tabbar-wrapper" v-else>-->
      <!--              <cube-tab-bar-->
      <!--                class="tab-bar"-->
      <!--                v-model="selectedLabelDefault"-->
      <!--                :data="tabs1"-->
      <!--                @click="clickTabHandler"-->
      <!--                @change="changeTabHandler">-->
      <!--                <cube-tab class="tab-item" v-for="(item, index) in tabs1" :label="item.label" :key="item.key">-->
      <!--                  <i slot="icon" class="tab-icon" :class="item.icon"></i>-->
      <!--                  <span class="tab-text">{{item.label}}</span>-->
      <!--                </cube-tab>-->
      <!--              </cube-tab-bar>-->
      <!--            </section>-->
    </section>
  </section>
</template>

<script type="text/javascript">
  import {baseUrl} from "../../service/configUrl.js";
  import {getCity, getCommunityList} from "../../service/system";
  import {
    getBasicSetting,
    getBasicInfo,
    popularMerchants,
    entrance,
    comPhone
  } from "../../service/merchants";
  import {getUserInfo} from "@/service/personalMessage";

  export default {
    name: "merchantsIndex",
    data() {
      return {
        baseUrl,
        address: "",
        commu_name: "", // 社区名
        userInfo: {},
        freq_time: 2000,
        slide_items: [], // 轮播图
        menu_list: [], // 菜单项
        notice: "", // 物业公告
        notice_detail: "", // 公告详情链接 跳转用的
        selectedLabelDefault: "首页",
        tabs1: [
          {
            label: "首页",
            // icon: 'cubeic-round-border',
            icon: "cubeic-home",
            key: "home"
          },
          {
            label: "个人中心",
            icon: "cubeic-person",
            key: "user"
          }
        ],
        tabs2: [
          {
            label: "首页",
            icon: "cubeic-home",
            key: "home"
          },
          {
            label: "手机开门",
            icon: "cubeic-home",
            key: "open"
          },
          {
            label: "个人中心",
            icon: "cubeic-person",
            key: "user"
          }
        ],
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
          scrollbar: false
        },
        popular_merchants: [
          // {
          //   name: '宝能生鲜',
          //   slogan: '送货上门, 美味海鲜与你同在',
          // },
          // {
          //   name: '宝能零售宝能零售宝能零售',
          //   slogan: '多种商品任你选择',
          // },
          // {
          //   name: '宝能生鲜',
          //   slogan: '送货上门, 美味海鲜与你同在',
          // },
          // {
          //   name: '宝能零售',
          //   slogan: '多种商品任你选择',
          // },
          // {
          //   name: '宝能生鲜',
          //   slogan: '送货上门, 美味海鲜与你同在',
          // },
          // {
          //   name: '宝能零售',
          //   slogan: '多种商品任你选择',
          // },
        ],
        show_phone: false, // 是否显示顶部电话 有号码则显示
        com_phone: "", // 物业号码
        show_open: false, // 是否显示底部手机开门
        city: {id: "", name: ""},
        is_login: false, // 检查是否已经登录
        authFlag: false, // 检查是否已经验证
        communitys: [], // 是否在该小区认证
        allUserInfo: {}
      };
    },
    created() {
      // this.getCity()
      // console.log(this.baseUrl)
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
      if (this.userInfo.accessToken) {
        this.is_login = true;
      }
      if (this.userInfo.communityName) {
        // let sub_add = ''
        // let index = this.userInfo.address.indexOf('省')
        // console.log(index)
        // if(index > -1 && index < 5) {
        //   sub_add = this.userInfo.address.slice(index+1, this.userInfo.address.length-1)
        // } else {
        //   sub_add = this.userInfo.address
        // }
        // console.log(sub_add)
        this.address = this.userInfo.address;
        this.commu_name = this.userInfo.communityName;
      }
      console.log(this.is_login);
      // 如果没有用户信息的话 就先取默认的城市 - 社区列表
      if (!this.userInfo.communityName) {
        console.log("没地址 执行这里");
        this.getCity();
      } else {
        console.log("有地址 执行这里");
        // this.getUserInfo()
        this.getBasicSetting();
        this.getBasicInfo();
        this.getpopularMerchants();
        // this.getcomPhone()
      }
      if (this.is_login) {
        this.getUserInfo();
        this.getcomPhone();
      }
      console.log(this.userInfo, "用户信息");
    },
    mounted() {
      // this.getBasicSetting()
      // this.getBasicInfo()
      // this.getpopularMerchants()
      // this.getcomPhone()
      // this.getentrance()
    },
    components: {},
    methods: {
      // 点击跳进通知公告列表
      clickNotice() {
        this.$router.push("announcementList");
      },
      // 点击跳进消息列表
      messageClick() {
        this.$router.push("myMessage");
      },
      gotoRouter(path) {
        this.$router.push(path);
      },
      // 不需要做验证的
      hrefLink(item) {
        if (item.link) {
          window.location.href = item.link;
        } else {
          window.location.href =
            baseUrl +
            "/static/h5/commerce/index.html#/moreGoods?shopId=" +
            item.shop.id +
            "&logoPath=" +
            item.logoPath +
            "&name=" +
            item.shop.name +
            "&description=" +
            item.description;
        }
      },
      needNoAuth(path) {
        console.log(this.is_login);
        if (!this.is_login) {
          this.showLogin();
        } else {
          this.$router.push(path);
        }
      },
      needNoAuthHref(path) {
        console.log(this.is_login);
        if (!this.is_login) {
          this.showLogin();
        } else {
          window.location.href = path;
        }
      },
      gotoLink(item) {
        // console.log(item)
        if (!this.is_login) {
          this.showLogin();
        } else if (!this.authFlag) {
          this.showBtn();
        } else {
          window.location.href = item;
        }
      },
      // 点击菜单的跳转, 根据不同情况进行验证
      menuLink(item) {
        console.log(item);
        if (item.loginCertificateStatus) {
          switch (item.loginCertificateStatus) {
            case 0:
              // console.log("0的情况")
              window.location.href = item.jumpLink;
              break;
            case 1:
              // console.log("1的情况")
              if (!this.is_login) {
                this.showLogin();
              } else {
                window.location.href = item.jumpLink;
              }
              break;
            case 2:
              // console.log("2的情况")
              if (!this.is_login) {
                this.showLogin();
              } else if (!this.authFlag) {
                this.showBtn();
              } else {
                window.location.href = item.jumpLink;
              }
              break;
          }
        } else {
          window.location.href = item.jumpLink;
        }
      },
      showPhoneConfirm() {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "拨打电话",
          content: "是否拨打物业管理处电话?",
          confirmBtn: {
            text: "确认拨打",
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
            window.location.href = "tel:" + this.com_phone;
          },
          onCancel: () => {
          }
        }).show();
      },
      async getBasicSetting() {
        let data = {
          communityId: this.userInfo.communityId
        };
        let res = await getBasicSetting(data);
        // console.log(res, '设置')
        if (res && res.error.err_code == 0) {
          let temp_list = res.list;
          if (temp_list.length > 8) {
            this.menu_list = temp_list.slice(0, 8);
          } else {
            this.menu_list = temp_list;
          }
          console.log(this.menu_list);
        }
      },
      async getBasicInfo() {
        let data = {
          community: this.userInfo.communityId
        };
        let res = await getBasicInfo(data);
        // console.log(res, '基础信息')
        if (res && res.error.err_code == 0) {
          // console.log("请求成功")
          // console.log(res.obj, '基础信息')
          console.log(res, "OOIOI");
          this.slide_items = res.obj.slideshowImgsObj;
          if (res.obj.news) {
            // console.log("有公告")
            this.notice = res.obj.newsList;
            this.notice.forEach(v => {
              if (v.noticeLabel == 0) {
                v.className = "i_1";
              } else if (v.noticeLabel == 1) {
                v.className = "i_2";
              } else {
                v.className = "i_3";
              }
            });
          }
        }
      },
      async getpopularMerchants() {
        let data = {
          communityId: this.userInfo.communityId,
          hotSale: true
        };
        let res = await popularMerchants(data);
        // console.log(res, '热门商户')
        if (res && res.error.err_code == 0) {
          // console.log("请求成功")
          let temp_list = res.list;
          if (temp_list.length > 6) {
            this.popular_merchants = temp_list.slice(0, 6);
          } else {
            this.popular_merchants = temp_list;
          }
          // this.popular_merchants = res.list
          // console.log(this.popular_merchants, '热门商户')
        }
      },
      // 是否有门禁
      async getentrance() {
        let data = {
          communityId: this.userInfo.communityId
        };
        let res = await entrance(data);
        // console.log(res.obj, '门禁')
        if (res.obj.havaEntrance) {
          // console.log('有门禁')
          this.show_open = true;
        } else {
          this.show_open = false;
        }
        // console.log(this.show_open)
      },
      // 物业电话
      async getcomPhone() {
        let data = {
          type: 1,
          cid: this.userInfo.communityId
        };
        let res = await comPhone(data);
        // console.log(res, '物业电话')
        if (res.list && res.list.length > 0) {
          this.show_phone = true;
          this.com_phone = res.list[0].tel;
        }
        // console.log(this.com_phone)
      },
      async getCity() {
        // const toast = this.$createToast({time: 0, txt: ''}).show();
        // toast.hide()
        let res = await getCity();
        console.log(res, "城市列表");
        let city_list = res.list;
        city_list.forEach(item => {
          if (item.name == "深圳市") {
            this.city.name = item.name;
            this.city.id = item.id;
            return false;
          }
        });
        this.getCommunityList();
        console.log(this.city);
      },
      async getCommunityList() {
        let data = {
          cityName: this.city.name,
          communityType: "notparks"
        };
        let res = await getCommunityList();
        console.log(res, "社区列表");
        let com_list = res.list;
        if (com_list.length > 0) {
          if (!this.userInfo.communityName) {
            let com_default = res.list[0].list;
            console.log(com_default[0], "默认社区");
            // this.userInfo.communityName = com_default[0].name
            this.$set(this.userInfo, "communityName", com_default[0].name);
            this.commu_name = com_default[0].name;
            // this.userInfo.address = com_default[0].address
            this.$set(this.userInfo, "address", com_default[0].address);
            this.address = com_default[0].address;
            this.$set(this.userInfo, "communityId", com_default[0].id);
            console.log(this.userInfo, "用户信息");
            window.localStorage.setItem(
              "userInfo",
              JSON.stringify(this.userInfo)
            );
          } else {
          }
          this.getBasicSetting();
          this.getBasicInfo();
          this.getpopularMerchants();
          // this.getentrance()
          // 以下为需要token才能有正确返回的接口
          if (this.userInfo.accessToken) {
            this.getcomPhone();
          }
        }
      },
      changePage(current) {
        // console.log('当前轮播图序号为:' + current)
      },
      clickHandler(item, index) {
        console.log(item, index);
        console.log(item.redirectUrl);
        //  if(!this.is_login) {
        //   this.showLogin()
        // } else if(!this.authFlag) {
        //    this.showBtn()
        //  } else {
        //    window.location.href = item.redirectUrl
        // }
        window.location.href = item.redirectUrl;
      },
      clickTabHandler() {
      },
      changeTabHandler() {
      },
      onPullingUp() {
        console.log("上拉加载");
        this.$refs.scroll.forceUpdate();
      },
      onPullingDown() {
        console.log("下拉刷新");
        this.getBasicSetting();
        this.getBasicInfo();
        this.getpopularMerchants();
        this.$refs.scroll.forceUpdate();
      },
      // 去登录
      showLogin() {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "请先登录",
          content: "您当前仍未登录, 请先登录后再进行操作",
          confirmBtn: {
            text: "去登录",
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
            // sessionStorage.setItem('fromMerch', true)
            this.toLogin();
          },
          onCancel: () => {
          }
        }).show();
      },
      // 去认证
      showBtn() {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          content: "未认证当前社区",
          confirmBtn: {
            text: this.communitys.length > 0 ? "切换房间" : "去认证",
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
            this.$router.push({
              path: "/HouseList",
              query: {from: "merchants"}
            });
          },
          onCancel: () => {
          }
        }).show();
      },
      //获取列表数据
      async getUserInfo() {
        let useInfo = localStorage.getItem("userInfo");
        useInfo = useInfo ? JSON.parse(useInfo) : {};
        let res = await getUserInfo({communityId: useInfo.communityId});
        console.log(res, "用户信息");
        if (res && res.error) {
          if ("0" == res.error.err_code) {
            if (!res.obj) {
              this.Toast("没有数据");
              return;
            }
            console.log(res.obj, "用户信息");
            // this.name = res.obj.nameJson.name;
            // this.PMList = [
            //   {label: '昵称', model: 'name', editAble: true},
            //   {label: '邮箱', model: 'email', editAble: true},
            //   {label: '手机号码', model: 'phone', editAble: true},
            // ];
            this.allUserInfo = res.obj;
            //ownerType : 产权业主 --业主  1 租户  2 家人  3 员工  4 潜在  5 会所会员  6 佣工  7 企业  8 业主--副业主  11;
            // this.personalMessageForm.name = res.obj.nameJson.name;
            // this.personalMessageForm.email = (res.obj.emailJson.email ? res.obj.emailJson.email : '');
            // this.personalMessageForm.phone = res.obj.phoneJson.phone;
            // this.imgFilePath = axios.defaults.baseURL + res.obj.userPic;
            this.communitys = res.obj.communitys;
            res.obj.communitys.forEach(v => {
              if (v === useInfo.communityId) {
                this.authFlag = true;
                useInfo.authFlag = true;
                localStorage.setItem("userInfo", JSON.stringify(useInfo));
                console.log("认证用户");
              }
            });
            console.log(this.allUserInfo.ownerType);
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          console.log(res.error);
          this.Toast(res.error.err_msg);
        }
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .merchants-index {
    height: 100%;
    padding-top: 70px;
    position: relative;
    background-color: #f1f1f1;

    .img1 {
      display: block;
      width: 40px;
      height: 40px;
    }

    .img2 {
      display: block;
      width: 40px;
      height: 40px;
    }

    .scroll-wrapper {
      height: 100%;
      position: relative;
    }

    .local-head {
      width: 100%;
      height: 70px;
      background: #fff;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      line-height: 70px;

      .location-info {
        display: flex;
        height: 100%;
        line-height: 100%;
        align-items: center;

        .community-name {
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(35, 35, 35, 1);
          height: 70px;
          max-width: 320px;
          line-height: 70px;
          padding-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;

          .pull-icon {
            position: absolute;
            top: 50%;
            right: -8px;
            transform: translateY(-50%);
          }
        }
      }

      .phone {
        position: absolute;
        right: 20px;
        top: 5px;

        .cubeiPhone {
          width: 60px;
          height: 60px;
          background-size: cover;
          background-image: url("../../assets/page/message.png");
        }
      }

      .message {
        position: absolute;
        right: 100px;
        top: 5px;

        .message-icon {
          width: 60px;
          height: 60px;
          background-size: cover;
          background-image: url("../../assets/page/answer.png");
        }
      }
    }

    .content-top {
      height: 100%;

      .slide-wrapper {
        height: 290px;
        overflow: hidden;
        padding: 0 15px;
        padding-top: 10px;
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }

      .menu-wrapper {
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        padding: 0 15px;

        .menuitem-wrapper {
          width: 25%;
          height: 211px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: column;

          .menu-img {
            width: 82px;
            height: 82px;
            margin: 0 auto;
            margin-bottom: 20px;
            background: #fff;
            border-radius: 50%;
            overflow: hidden;

            .item-img {
              width: 100%;
              height: 100%;
            }
          }

          .menu-text {
            font-size: 30px;
            color: #333333;
          }
        }
      }

      .notice-wrapper {
        height: 137px;
        padding: 0 15px;
        background-color: #fff;
        position: relative;

        .notice-wrapper-content {
          border-top: 1px solid rgba(232, 232, 232, 1);
          padding: 30px 0px;
          padding-left: 120px;

          .img-wrapper {
            position: absolute;
            top: 40px;
            left: 43px;

            img {
              width: 59px;
              height: 62px;
              vertical-align: middle;
              display: inline-block;
            }
          }

          .img-wrapper-right {
            width: 2px;
            height: 62px;
            background: rgba(232, 232, 232, 1);
            position: absolute;
            left: 130px;
            top: 45px;
          }

          .text-wrapper {
            padding-left: 140px;
            height: 100%;
            position: relative;

            .text-wrapper-div1 {
              line-height: 34px;
              margin-bottom: 6px;

              p {
                margin-left: 20px;
                width: 414px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }

            .text-wrapper-div2 {
              line-height: 56px;

              p {
                margin-left: 20px;
                width: 414px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }

            .i1 {
              line-height: 42px;
              text-align: center;
              position: absolute;
              top: -4px;
              left: 17px;
            }

            .i2 {
              line-height: 42px;
              text-align: center;
              position: absolute;
              position: absolute;
              top: 46px;
              left: 17px;
            }

            .i3 {
              width: 126px;
              height: 42px;
              display: inline-block;
              background-image: url("../../assets/gray.png");
              background-size: cover;
              font-size: 22px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(105, 105, 105, 1);
              line-height: 42px;
              text-align: center;
            }

            .i_1 {
              width: 126px;
              height: 42px;
              display: inline-block;
              background-image: url("../../assets/purple.png");
              background-size: cover;
              font-size: 22px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(245, 134, 114, 1);
            }

            .i_2 {
              width: 126px;
              height: 42px;
              display: inline-block;
              background-image: url("../../assets/pink.png");
              background-size: cover;
              font-size: 22px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(161, 96, 164, 1);
            }

            .i_3 {
              width: 126px;
              height: 42px;
              display: inline-block;
              background-image: url("../../assets/gray.png");
              background-size: cover;
              font-size: 22px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(105, 105, 105, 1);
              line-height: 42px;
              text-align: center;
            }

            .text {
              max-height: 100%;
              line-height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
    }

    .content-bottom {
      margin-top: 20px;
      padding: 0 15px;

      .content-bottom-content {
        background: rgba(255, 255, 255, 1);
        border-radius: 10px;
        padding: 0 25px;

        .more-title {
          position: relative;
          width: 100%;
          height: 108px;
          line-height: 108px;
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(35, 35, 35, 1);
          display: flex;

          span {
            flex: 1;
          }

          .more-top {
            font-weight: 700;
          }

          .more-bottom {
            font-size: 24px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(130, 130, 130, 1);
            text-align: right;
          }
        }

        .slide-container {
          height: calc(100% - 642px);
          width: 100%;
          overflow: hidden;
          overflow-y: auto;

          .list-wrapper {
            display: flex;
            flex-wrap: wrap;
            /*justify-content: center;*/

            .lf-m {
              margin-left: 15px;
            }

            .rg-m {
              margin-right: 15px;
            }

            .list-item {
              width: 320px;
              height: 360px;
              background: rgba(255, 255, 255, 1);
              border: 1Px solid rgba(221, 221, 221, 0.8);
              border-radius: 6px;
              margin-bottom: 30px;

              .item-img {
                height: 240px;
                background: #f8f8fa;
                /*border-radius: 10px 10px 0px 0px;*/
                /*overflow: hidden;*/
                margin-bottom: 20px;

                .merchant-img {
                  width: 100%;
                  height: 100%;
                }
              }

              .item-info {
                padding: 10px;

                .item-name {
                  width: 100%;
                  height: 45px;
                  line-height: 45px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 30px;
                  font-family: Source Han Sans CN;
                  font-weight: 700;
                  color: rgba(36, 36, 36, 1);
                }

                .item-slogan {
                  width: 300px;
                  min-height: 45px;
                  line-height: 30px;
                  font-size: 26px;
                  font-family: Source Han Sans CN;
                  font-weight: 400;
                  color: rgba(103, 103, 103, 1);
                  -webkit-box-orient: vertical;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-all;
                }
              }
            }
          }
        }
      }
    }

    .tabbar-wrapper {
      position: absolute;
      left: -20px;
      right: -20px;
      bottom: -3px;
      z-index: 500;
      background: rgba(255, 255, 255, 1);

      .tab-bar {
        border-top: 1px dashed #ddd;
        padding-top: 12px;

        .tab-item {
          display: block;
          text-align: center;
          padding: 12px;
          position: relative;

          .tab-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto;
            font-size: 48px;
          }

          .tab-text {
            display: block;
            margin: 0 auto;
            margin-top: 10px;
            font-size: 26px;
          }

          .circle-tab {
            width: 100px;
            height: 100px;
            padding: 10px;
            border-radius: 50%;
            background: #fff;
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translate(-50%);

            .circle-img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              overflow: hidden;
            }

            &:after {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss" type="text/scss">
  .merchants-index {
    .cube-slide-dots span {
      width: 12px !important;
      height: 12px !important;
      background-color: #fff;
      margin: 0 3px !important;
      border-radius: 50% !important;
    }

    .cube-slide-dots > span.active {
      background-color: rgb(127, 127, 127) !important;
    }
  }
</style>
