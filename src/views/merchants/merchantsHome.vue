<template>
  <section class="merchants-home">
    <merchantsindex v-if="current_tab == 'home'"></merchantsindex>
    <personalmessage :inside_page="true" v-else-if="current_tab == 'user' && is_login"></personalmessage>
    <div class="iframeContent" v-if="current_tab == 'mall'">
      <!--      <iframe class="iframeList" :src="baseUrl+'/static/h5/commerce/index.html#/main'"></iframe>-->
      <mainpage></mainpage>
    </div>
    <entranceIndex v-if="current_tab == 'door'"></entranceIndex>
    <Neighbor :pageFromSelectedLabel='$route.query.pageFromSelectedLabel' v-if="current_tab == 'message'"></Neighbor>
    <!-- 如果有门禁字段的话 -->
    <section class="tabbar-wrapper" v-if="show_open">
      <cube-tab-bar
        class="tab-bar"
        v-model="selectedLabelDefault"
        :data="tabs2"
        @change="changeTabHandler">
        <cube-tab class="tab-item" v-for="(item, index) in tabs2" :label="item.label" :key="item.key">
          <i slot="icon" class="tab-icon" :class="item.flag?item.icon_1:item.icon"></i>
          <span class="tab-text">{{item.label}}</span>
        </cube-tab>
      </cube-tab-bar>
    </section>
    <!-- 没有门禁字段的话 -->
    <section class="tabbar-wrapper" v-else>
      <cube-tab-bar
        class="tab-bar"
        v-model="selectedLabelDefault"
        :data="tabs1"
        @change="changeTabHandler">
        <cube-tab class="tab-item" v-for="(item, index) in tabs1" :label="item.label" :key="item.key">
          <i slot="icon" class="tab-icon" :class="item.flag?item.icon_1:item.icon"></i>
          <span class="tab-text">{{item.label}}</span>
        </cube-tab>
      </cube-tab-bar>
    </section>
  </section>
  </section>
</template>

<script type="text/javascript">
  import {getCity, getCommunityList} from '../../service/system'
  import {entrance} from "../../service/merchants"
  import merchantsindex from './merchantsIndex.vue'
  import personalmessage from '../system/personalMessage.vue'
  import myMessage from '../message/myMessage.vue'
  import {getUserInfo} from "@/service/personalMessage";
  import {baseUrl} from "../../service/configUrl.js"
  import entranceIndex from '../entrance/index.vue'
  import Neighbor from '../neighbor/topicList'
  import mainpage from '../mainPage/index.vue'

  import router from '../../router';

  export default {
    name: 'merchantsHome',
    data() {
      return {
        baseUrl,
        userInfo: {},
        show_open: false, // 是否显示底部手机开门
        selectedLabelDefault: '首页',
        current_tab: 'home',
        tabs1: [
          {
            label: '首页',
            icon: 'page',
            icon_1: 'page_1',
            flag: true,
            key: 'home',
          },
          {
            label: '圈子',
            icon: 'neighborhood',
            icon_1: 'neighborhood_1',
            flag: false,
            key: 'message',
          },
          {
            label: '生活',
            icon: 'mall',
            icon_1: 'mall_1',
            flag: false,
            key: 'mall',
          },
          {
            label: '我的',
            icon: 'user',
            icon_1: 'user_1',
            flag: false,
            key: 'user'
          },
        ],
        tabs2: [
          {
            label: '首页',
            icon: 'page',
            icon_1: 'page_1',
            flag: true,
            key: 'home',
          },
          {
            label: '圈子',
            icon: 'neighborhood',
            icon_1: 'neighborhood_1',
            flag: false,
            key: 'message',
          },
          {
            label: '开门',
            icon: 'door',
            icon_1: 'door_1',
            flag: false,
            key: 'open',
          },
          {
            label: '生活',
            icon: 'mall',
            icon_1: 'mall_1',
            flag: false,
            key: 'mall',
          },
          {
            label: '我的',
            icon: 'user',
            icon_1: 'user_1',
            flag: false,
            key: 'user'
          },
        ],
        city: {id: '', name: ''},
        is_login: false, // 是否登录
        authFlag: false,
        communitys: [],
      }
    },
    components: {
      merchantsindex,
      personalmessage,
      myMessage,
      entranceIndex,
      mainpage,
      Neighbor
    },
    created() {
      router.beforeEach((to, from, next) => {
        console.log(from)
        if ((from.path == '/topicDetail' || from.path == '/relTopic')&&(to.path=='/merchantsHome')) {
          to.query.pageFrom = 'topicDetail'
        }
        if ((from.path == '/myTopic' || from.path == '/myComment')&&(to.path=='/merchantsHome')) {
          to.query.pageFrom = 'myTopic'
        }
        if ((from.path == '/qrCode' )&&(to.path=='/merchantsHome')) {
          to.query.pageFrom = 'qrCode'
        }
        console.log(to)
        return next()
      })
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {}
      if (this.userInfo.communityName) {
        this.address = this.userInfo.address
        this.commu_name = this.userInfo.communityName
      }
      if (!this.userInfo.accessToken && !this.userInfo.communityName) {
        this.getCity()
      } else if (this.userInfo.accessToken) {
        this.is_login = true
        this.getUserInfo()
        this.getentrance()
      }
      // this.getentrance()
      if (window.sessionStorage.getItem("selectedLabelDefault") && window.sessionStorage.getItem("current_tab")) {
        this.selectedLabelDefault = window.sessionStorage.getItem("selectedLabelDefault")
        this.current_tab = window.sessionStorage.getItem("current_tab")
        this.tabs1.forEach((v, i) => {
          if (v.label == this.selectedLabelDefault) {
            v.flag = true
          } else {
            v.flag = false
          }
        })
      }


    },
    mounted() {
      // if(this.$route.query.pageFrom== 'topicDetail'){
      //  /*  this.current_tab = 'message'
      //   this.selectedLabelDefault='圈子' */
      //  this.changeTabHandler('圈子')
      // }
    },
    methods: {
      gotoRouter(path) {
        this.$router.push(path)
      },
      needAllAuth(path) {

        if (!this.is_login) {
          this.showLogin()
        } else if (!this.authFlag) {
          this.showBtn()
        } else {
          this.$router.push(path)
        }
      },
      async getCity() {
        // const toast = this.$createToast({time: 0, txt: ''}).show();
        // toast.hide()
        let res = await getCity()
        console.log(res, '城市列表')
        let city_list = res.list
        city_list.forEach((item) => {
          if (item.name == "深圳市") {
            this.city.name = item.name
            this.city.id = item.id
            return false
          }
        })
        this.getCommunityList()
        console.log(this.city)
      },
      async getCommunityList() {
        let data = {
          cityName: this.city.name,
          communityType: 'notparks'
        }
        let res = await getCommunityList()
        console.log(res, '社区列表')
        let com_list = res.list
        if (com_list.length > 0) {
          let com_default = res.list[0].list
          console.log(com_default[0], '默认社区')
          // this.userInfo.communityName = com_default[0].name
          this.$set(this.userInfo, 'communityName', com_default[0].name)
          this.commu_name = com_default[0].name
          // this.userInfo.address = com_default[0].address
          this.$set(this.userInfo, 'address', com_default[0].address)
          this.address = com_default[0].address
          this.$set(this.userInfo, 'communityId', com_default[0].id)
          console.log(this.userInfo, '用户信息')
          window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo))
          // this.getBasicSetting()
          // this.getBasicInfo()
          // this.getpopularMerchants()
          // this.getcomPhone()
          this.getentrance()
        }
      },
      // 是否有门禁
      async getentrance() {
        let data = {
          communityId: this.userInfo.communityId,
        }
        let res = await entrance(data)
        // console.log(res.obj, '门禁')
        if (res.obj.havaEntrance) {
          // console.log('有门禁')
          this.show_open = true
        } else {
          this.show_open = false
        }
        if (this.$route.query.pageFrom == 'topicDetail') {
          /*  this.current_tab = 'message'
            this.selectedLabelDefault='圈子' */
          this.changeTabHandler('圈子')
          this.selectedLabelDefault = '圈子'
        }
        if (this.$route.query.pageFrom == 'myTopic') {
         
          this.changeTabHandler('我的')
          this.selectedLabelDefault = '我的'
        }
        if (this.$route.query.pageFrom == 'qrCode') {
         
          this.changeTabHandler('开门')
          this.selectedLabelDefault = '开门'
        }
        console.log(this.show_open)
      },
      changeTabHandler(label) {
        if (this.show_open) {
          this.tabs2.forEach((v, i) => {
            if (v.label == label) {
              v.flag = true
            } else {
              v.flag = false
            }
          })
        } else {
          this.tabs1.forEach((v, i) => {
            if (v.label == label) {
              v.flag = true
            } else {
              v.flag = false
            }
          })
        }

        switch (label) {
          case '首页':
            this.current_tab = 'home'
            break
          case '我的':
            if (!this.is_login) {
              this.current_tab = 'home'
              this.selectedLabelDefault = '首页'
              this.showLogin()
              return
            }
            this.current_tab = 'user'
            break
          case '圈子':
            if (!this.is_login) {
              this.current_tab = 'home'
              this.selectedLabelDefault = '首页'
              this.showLogin()
              return
            }
            this.current_tab = 'message'
            break
          case '生活':
            // window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/main'
            this.current_tab = 'mall'
            break
          case '开门':
            this.current_tab = 'door'
            break
        }
        window.sessionStorage.setItem("selectedLabelDefault", this.selectedLabelDefault);
        window.sessionStorage.setItem("current_tab", this.current_tab);
        console.log(this.current_tab)
        console.log(this.selectedLabelDefault)
      },
      //获取列表数据
      async getUserInfo() {
        let useInfo = localStorage.getItem('userInfo')
        useInfo = useInfo ? JSON.parse(useInfo) : {}
        let res = await getUserInfo({communityId: useInfo.communityId});
        if (res && res.error) {
          if ('0' == res.error.err_code) {
            if (!res.obj) {
              this.Toast('没有数据');
              return;
            }
            console.log(res.obj, '用户信息')
            //ownerType : 产权业主 --业主  1 租户  2 家人  3 员工  4 潜在  5 会所会员  6 佣工  7 企业  8 业主--副业主  11;
            // this.personalMessageForm.name = res.obj.nameJson.name;
            // this.personalMessageForm.email = (res.obj.emailJson.email ? res.obj.emailJson.email : '');
            // this.personalMessageForm.phone = res.obj.phoneJson.phone;
            // this.imgFilePath = axios.defaults.baseURL + res.obj.userPic;
            this.communitys = res.obj.communitys
            res.obj.communitys.forEach(v => {
              if (v === useInfo.communityId) {
                this.authFlag = true
                useInfo.authFlag = true
                localStorage.setItem('userInfo', JSON.stringify(useInfo))
                console.log('认证用户')
              }
            })
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      },
      // 去登录
      showLogin() {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          title: '请先登录',
          content: '您当前仍未登录, 请先登录后再进行操作',
          confirmBtn: {
            text: '去登录',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            // sessionStorage.setItem('fromMerch', true)
            this.toLogin()
          },
          onCancel: () => {
          },
        }).show()
      },
      // 去认证
      showBtn() {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          content: '未认证当前社区',
          confirmBtn: {
            text: this.communitys.length > 0 ? '切换房间' : '去认证',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.$router.push({path: '/HouseList', query: {from: 'merchants'}})
          },
          onCancel: () => {
          }
        }).show()
      },
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .merchants-home {
    min-height: 600px;
    height: 100%;
    position: relative;
    padding-bottom: 100px;

    .iframeContent {
      height: 100%;
      width: 100%;

      .iframeList {
        height: 100%;
        width: 100%;
        display: block;
      }

      /*padding-bottom: 120px;*/
    }

    .tabbar-wrapper {
      position: absolute;
      left: -20px;
      right: -20px;
      bottom: -3px;
      z-index: 500;
      background: rgba(255, 255, 255, 1);

      .tab-bar {
        border-top: 1px solid #E3E3E3;
        padding-top: 15px;

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
            font-size: 22px;
            font-family: Source Han Sans CN;
            font-weight: 400;
          }

          .circle-tab {
            width: 80px;
            height: 80px;
            padding: 10px;
            /*border-radius: 50%;*/
            background: #fff;
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translate(-50%);

            .circle-img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              overflow: hidden;
            }

            &:after {
              content: '';
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


    .page {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/page.png");
      background-size: cover;
    }

    .page_1 {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/page_1.png");
      background-size: cover;
    }

    .neighborhood {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/neighborhood.png");
      background-size: cover;
    }

    .neighborhood_1 {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/neighborhood_1.png");
      background-size: cover;
    }

    .door {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/door.png");
      background-size: cover;
    }

    .door_1 {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/door_1.png");
      background-size: cover;
    }

    .mall {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/mall.png");
      background-size: cover;
    }

    .mall_1 {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/mall_1.png");
      background-size: cover;
    }

    .user {
      width: 42px;
      height: 42px;
      margin: 0 auto;
      display: inline-block;
      background-image: url("../../assets/page/user.png");
      background-size: cover;
    }

    .user_1 {
      width: 42px;
      height: 42px;
      margin: 0 auto;;
      display: inline-block;
      background-image: url("../../assets/page/user_1.png");
      background-size: cover;
    }

    .cube-tab {
      height: 98px !important;
    }
  }
</style>
<style lang="scss">
  .merchants-home {
    .cube-tab_active {
      color: #A260A4 !important;
    }
  }

</style>
