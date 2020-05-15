<template>
  <main id="mainPage" v-cloak>
    <header class="mainPage-header" :style="{'background-color':$store.state.bgColor}"></header>
    <div class="mainPage-search" @click="clickSearch()">
      <!--<input type="text" placeholder="搜索周边商城或商品">-->
      <div class="mainPage-search-box">
        <i class="cubeic-search" :style="{'color':$store.state.bgColor}"></i>
        <span>全部商品</span>
      </div>
    </div>
    <div class="goodsCart" @click="ShoppingCart">
      <span v-if="cartNumber>0"><span>{{cartNumber| goodsNumberFilter}}</span></span>
    </div>

    <div class="mainPage-tab">
      <publicSlide :slideData="tabList">
        <ul class="list-wrapper" v-setScrollWidth="tabList.length">
          <template v-for="tabListItems in tabList">
            <li
              :class="tabListItems.flag?$store.state.bgColor?'active_':'active':''"
              v-if="tabListItems.flagTrue">
              <div @click="toRouter(tabListItems)">
                <p>{{tabListItems.name}}</p>
              </div>
            </li>
            <li
              :class="tabListItems.flag?$store.state.bgColor?'active_':'active':''" v-else>
              <div @click="toRouter(tabListItems)">
                <p>{{tabListItems.name}}</p>
              </div>
            </li>
          </template>

        </ul>
      </publicSlide>
    </div>

    <div :class="{'mainPageCon':isShow,'mainPageCon1':!isShow}">
      <cube-scroll
        ref="scroll"
        :data="goodsList"
        :scroll-events="scrollEvents"
        :options="options"
        @pulling-down="onPullingDown"
        @scroll="onScrollHandle"
        @pulling-up="onPullingUp">
        <template slot="pulldown" slot-scope="props">
          <div class="cube-pulldown-wrapper">
            <img src="../../assets/loding.png" alt="" :class="{'active':animationFlag}">
            <span>{{animationText}}</span>
          </div>
        </template>

        <div class="mainPage-box">
          <div v-if="isShow">
            <nav class="mainPage-banner">
              <cube-slide :options="options_" ref="slide" :data="bannerList" @change="changePage" :autoPlay="true">
                <cube-slide-item ref="cubeSlideItem" v-for="(bannerListitem, index) in bannerList" :key="index">
                  <a href="javascript:;" @click="clickHandler(bannerListitem, index)">
                    <img style="width: 100%" v-lazy="baseUrl+bannerListitem.imageURL">
                  </a>
                </cube-slide-item>
              </cube-slide>
            </nav>
            <div class="mainPage-classification" v-if="!$route.query.fromApp">

              <cube-slide ref="slide" :data="listItems" @change="changePage" :autoPlay="false">
                <cube-slide-item v-for="(item, index) in listItems" :key="index">
                  <div class="mainPage-classification-item" v-for="(v, i) in item.listItem" @click="clickItem(v)">
                    <img :src="baseUrl+v.logoSmallPath"/>
                    <p>{{v.name}}</p>
                  </div>
                </cube-slide-item>
              </cube-slide>

            </div>
            <!--          热门商品标题-->
            <div class="mainPage-title">
              <p><i></i><span>热销商品</span> <i></i></p>
            </div>
          </div>

          <section class="mainPage-main">
            <ul :class="goodsList.length==0?'defaultBg':''" v-if="isShow">
              <li v-for="(goodsListItem,index) in goodsList" :key="index" @click="togoodsInfo(goodsListItem)"
                  v-if="index<10">
                <goodsItem :goodsInfo="goodsListItem"></goodsItem>
              </li>
            </ul>
            <ul :class="goodsList.length==0?'defaultBg':''" v-else>
              <li v-for="(goodsListItem,index) in goodsList" :key="index" @click="togoodsInfo(goodsListItem)">
                <goodsItem :goodsInfo="goodsListItem"></goodsItem>
              </li>
            </ul>
            <div class="moreBtn"
                 v-if="isShow"
                 v-show="goodsList.length>10"
                 :style="{'color': $store.state.bgColor,'border-color':$store.state.bgColor}"
                 @click="$router.push({path:'/moreGoods',query:{categoryId:categoryId,name:activeTab.name,searchFlag:true}})">
              <span>查看更多</span>
            </div>
            <div class="moreBtn moreBtn_a"
                 v-show="goodsList.length<=10">
              <span>已展示此分类全部商品</span></div>
          </section>
        </div>
      </cube-scroll>
    </div>

  </main>
</template>

<script>
  import {setScrollWidth} from '../../directive/index'
  import {goodsNumberFilter} from '../../filters/index'
  import searchComponent from '../../components/searchComponent/searchComponent'
  import goodsItem from '../../components/goodsComponent/goodsItem'
  import {
    getGoodsList,
    getShoppingCart,
    getGoodsType,
    getMainLunbo,
    judgeStaff,
    externalMerchantList
  } from '../../service/commodity/index'
  import {getCommunityList} from '../../service/commodity/index'
  import {baseUrl} from '../../service/configUrl'
  import {getUserInfo} from '../../unit/unit'
  import {publicSlide} from '../../components/index'
  import quanbufenlei from '../../assets/quanbufenlei.png'
  import yuangong from '../../assets/yuangong.png'
  import {mapState} from 'vuex'

  export default {
    name: "mainPage",
    components: {
      searchComponent,
      goodsItem,
      publicSlide
    },
    directives: {
      setScrollWidth
    },
    computed: {
      ...mapState({
        staffFlag: state => state.staffFlag,
      })
    },
    filters: {
      goodsNumberFilter
    },
    data() {
      return {
        scrollEvents: ['scroll'],
        animationFlag: false,
        animationText: '下拉刷新',
        baseUrl,
        bannerList: [
          {
            url: '',
            image: ''
          }
        ],
        tabberList: [],
        tabList: [],
        goodsList: [],
        optionsTab: {
          click: false,
        },
        options_: {
          click: false,
          tap: true,
        },
        options: {
          pullDownRefresh: {
            threshold: 80,
            txt: '刷新成功'
          },
          pullUpLoad: {
            threshold: 40,
            txt: {
              more: '加载中....',
              noMore: '没有更多内容了'
            }
          },
          // swipeBounceTime:100,
          bounceTime: 300,
          pullUpLoad: false,
          click: true,
          tap: false,
          scrollY: true,
          bounce: {
            top: true,
            bottom: false,
            left: false,
            right: false
          },
        },
        searchFlag: false,
        params: {
          categoryId: '',
          name: '',
          hotSale: true,
          page_no: 0,
          page_size: 20,
          communityId: getUserInfo().communityId ? getUserInfo().communityId : ''
        },
        categoryId: '',
        pageSize: 100,
        cartNumber: 0,//购物车数量
        communityId: getUserInfo().communityId ? getUserInfo().communityId : '',
        searchValue: '首页',
        timeSET: null,//购物车定时器,
        activeTab: {},//选中的分类
        clickFlag: true,
        isShow: true,
        listItems: [],
      }
    },
    activated() {
      this.clickFlag = true
      this.tabList.forEach(v => {
        if (v.name == this.activeTab.name) {
          v.flag = true
        }
      })
      clearInterval(this.timeSET)
      this.timeSET = null
      this.timeSET = setInterval(v => {
        this.getShoppingCart()
      }, 6000)
      history.pushState(null, null, window.location.href); //main级路由下禁止浏览器回退
      this.getShoppingCart()
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timeSET)
      clearInterval(this.timeSET)
      this.timeSET = null
      this.clickFlag = true
      next()
    },
    methods: {
      // 跳进搜索页面
      clickSearch() {
        window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/moreGoods?categoryId=&searchFlag=false'
      },
      // 跳进购物车页面
      ShoppingCart() {
        window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/ShoppingCart'
      },
      clickItem(item) {
        if (item.link) {
          window.location.href = item.link
        } else {
          window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/moreGoods?shopId=' + item.shop.id + "&logoPath=" + item.logoPath + "&name=" + item.shop.name + "&description="
          item.description
          // this.$router.push({
          //     name: 'moreGoods',
          //     query: {
          //       shopId: item.shop.id,
          //       searchFlag: false,
          //       logoPath: item.logoPath,
          //       name: item.shop.name,
          //       description: item.description,
          //     },
          //     params: {
          //       item: item
          //     }
          //   }
          // )

        }
      },
      // 获取第三方分类
      async externalMerchantList() {
        if (!getUserInfo().accessToken || getUserInfo().accessToken.indexOf('null') != -1) {
          this.cartNumber = 0
          return
        }
        let params = {
          communityId: this.communityId
        }
        let res = await externalMerchantList(params)
        if (!res) return
        if (res && res.error.err_code == 0) {
          let arr = res.list
          let index = 0
          let arrItem = []
          arr.forEach((v, i) => {
            if ((i / 7) >= index) {
              let list = {
                listItem: []
              }
              arrItem.push(list)
              index++
            }
          })
          let num = 0
          let indexItem = 0
          arrItem.forEach((v, i) => {
            indexItem++
            for (let y = num; y < arr.length; y++) {
              if ((y / 8) < indexItem) {
                v.listItem.push(arr[y])
              } else {
                num = 8 * indexItem
                break
              }
            }
          })
          this.listItems = arrItem
        }

      },
      onScrollHandle(obj) {
        if (!obj.y) return
        if (0 < obj.y && obj.y < this.options.pullDownRefresh.threshold) {
          if (!this.animationFlag) {
            this.animationText = '下拉刷新'
          }
        }
        if (obj.y >= this.options.pullDownRefresh.threshold) {
          if (!this.animationFlag) {
            this.animationText = '释放刷新'
          }
        }
      },
      //获取轮播图
      async getMainLunbo() {
        let params = {
          typeCode: 'shop_banner'
        }
        let res = await getMainLunbo(params)
        if (res && res.error.err_code == 0) {
          this.bannerList = res.list
        } else {
          this.bannerList = []
        }
        console.log(res, '轮播图')
      },
      async onPullingDown() {
        console.log('下拉刷新')
        this.options.pullUpLoad = true
        this.animationFlag = true
        this.animationText = '拼命加载中...'
        this.getMainLunbo()
        if (this.isShow) {
          await this.getGoodsType()
          this.tabList.forEach(v => {
            v.flag = false
          })
          this.tabList[0].flag = true
          this.searchValue = this.tabList[0].name
          this.activeTab = this.tabList[0]
          this.categoryId = ''
          this.params.categoryId = ''
          this.params.name = ''
        }

        this.params.page_no = 0
        this.params.page_size = 20
        this.getShoppingCart()
        await this.getGoodsList()
        let time = setTimeout(v => {
          this.$refs.scroll.forceUpdate()
          clearTimeout(time)
          time = setTimeout(k => {
            this.animationFlag = false
            this.$refs.scroll.refresh()
            clearTimeout(time)
            time = null
          }, 600)
        }, 500)
      },
      async onPullingUp() {
        console.log('上拉加载')
        // 更新数据
        this.params.page_no++
        await this.getGoodsList('more');
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      async toRouter(item) {
        console.log(item);
        window.sessionStorage.setItem("nameKey", item.name);
        window.sessionStorage.setItem("categoryId", item.categoryId);
        if (item.name == '首页') {
          this.isShow = true
          this.options.pullUpLoad = false
        } else {
          this.isShow = false
          this.options.pullUpLoad = true
        }
        this.searchValue = item.name
        this.params.page_no = 0
        this.tabList.forEach(v => {
          v.flag = false
        })
        if (item.category == 'energy_category') {
          // this.$router.push('/energyList')
          window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/energyList'
        } else {
          item.flag = true
          this.params = {
            categoryId: item.categoryId,
            name: '',
            page_no: 0,
            page_size: 20,
            communityId: this.communityId
          };
          if (item.name == '首页') {
            this.params.hotSale = true
          } else {
            this.params.hotSale = ''
          }
          this.searchValue = item.name
          this.categoryId = item.categoryId
          await this.getGoodsList();
        }
        if (item.flag) {
          this.activeTab = item
        }
      },
      togoodsInfo(goodsListItem) {
        // this.$router.push({path: '/goodsDetail', query: {id: goodsListItem.productId}})
        window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/goodsDetail?id=' + goodsListItem.productId
      },
      changePage(current) {
        // console.log('当前轮播图序号为:' + current)
      },
      validateURL(textval) {
        const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return urlregex.test(textval)
      },
      //轮播图跳转
      clickHandler(item, index) {
        if (item.productId) {
          let id = JSON.parse(item.productId).id
          if (this.clickFlag) {
            this.clickFlag = false
            // this.$router.push({name: 'goodsDetail', query: {id}})
            window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/goodsDetail?id=' + id
            setTimeout(v => {
              this.clickFlag = true
            }, 1500)
          }
        } else {
          if (this.validateURL(item.URL)) {
            if (this.clickFlag) {
              this.clickFlag = false
              // this.$router.push({name: 'externalLinks', query: {url: item.URL}})
              window.location.href = this.baseUrl + '/static/h5/commerce/index.html#/externalLinks?url=' + item.URL
              setTimeout(v => {
                this.clickFlag = true
              }, 1500)
            }
          }
        }
      },
      async getGoodsList(type) {
        if (type != 'more') {
          this.goodsList = []
        }
        let res = await getGoodsList(this.params)
        if (!res) return
        if (res.error.err_code == 0) {
          let arrList = []
          if (this.staffFlag) {
            let arr1 = [], arr2 = []
            res.list.forEach((v) => {
              if (v.employee) {
                arr1.push(v)
              } else {
                arr2.push(v)
              }
            })
            arrList = arr1.concat(arr2)
            arr1 = arr2 = null
          } else {
            arrList = res.list.filter(v => {
              return !v.employee
            })
          }
          if (arrList.length < 1) {
            this.options.pullUpLoad = false
            return
          }
          if (type == 'more') {
            this.goodsList = [...this.goodsList, ...arrList]
          } else {
            this.goodsList = arrList.filter(v => v.Integral == null)
            // this.goodsList = res.list
          }
        } else {
          if (type != 'more') {
            this.goodsList = []
          }
          this.Toast(res.error.err_msg)
        }
        this.$refs.scroll.refresh()
      },
      async getShoppingCart() {
        if (!getUserInfo().accessToken || getUserInfo().accessToken.indexOf('null') != -1) {
          this.cartNumber = 0
          return
        }
        let res = await getShoppingCart()
        let num = 0
        if (!res) return
        if (res && res.error.err_code == 0) {
          res.list.forEach(v => {
            v.list.forEach(k => {
              num += k.goodsNum
            })
          })
        }
        this.cartNumber = num
      },
      async getGoodsType() {
        let params = {
          communityId: this.communityId
        }
        let res = await getGoodsType(params)
        if (res) {
          if (res.error.err_code == 0) {
            let arr = [];
            arr.push({
              name: '首页',
              categoryId: '',
              imageUrl: quanbufenlei,
              flag: true,
              flagTrue: true,
              value: 'all'
            })
            this.activeTab = arr[0]
            res.list.forEach(v => {
              arr.push({...v, flag: false})
            })
            if (window.sessionStorage.getItem("nameKey") && window.sessionStorage.getItem("nameKey") != '首页') {
              this.isShow = false
              if (window.sessionStorage.getItem("nameKey") == '内部专享') {
                this.options.pullUpLoad = true
                this.params = {
                  categoryId: window.sessionStorage.getItem("categoryId"),
                  name: '',
                  page_no: 0,
                  page_size: 20,
                  communityId: this.communityId
                };
              } else {
                arr.forEach((v, i) => {
                  if (window.sessionStorage.getItem("nameKey") == v.name) {
                    v.flag = true
                    this.options.pullUpLoad = true
                    this.params = {
                      categoryId: window.sessionStorage.getItem("categoryId"),
                      name: '',
                      page_no: 0,
                      page_size: 20,
                      communityId: this.communityId
                    };

                  } else {
                    v.flag = false
                  }
                })
              }
            }
            this.tabList = [...arr]
            console.log(this.tabList)
          } else {
            this.Toast(res.error.err_msg)
          }
        }
        let res_ = await judgeStaff()
        if (res_) {
          if (res_.error.err_code == '0') {
            this.$store.dispatch('setStaffFlag', res_.obj)
            let arr = []
            if (res_.obj) {
              this.tabList.forEach((v, i) => {
                if (i === 0) {
                  arr.push(v)
                  if (window.sessionStorage.getItem("nameKey") == '内部专享') {
                    arr[0].flag = false
                    arr.push({
                      name: '内部专享',
                      categoryId: 'employee',
                      imageUrl: yuangong,
                      flag: true,
                      flagTrue: true
                    })
                  } else {
                    arr.push({
                      name: '内部专享',
                      categoryId: 'employee',
                      imageUrl: yuangong,
                      flag: false,
                      flagTrue: true
                    })
                  }
                } else {
                  arr.push(v)
                }
                this.$nextTick(v => {
                  this.tabList = arr;
                  // this.getGoodsList()
                })
              })
            }
          }
        }
        this.$nextTick(v => {
          this.getGoodsList()
        })
      },
      async getCommunityList() {
        let res = await getCommunityList({
          appType: 'yezhuApp',
          //communityType: 'parks'
        })
        if (res) {
          if (res.error.err_code === '0') {
            if (res.list) {
              this.communityId = res.list[0].list[0].id
              this.params.communityId = res.list[0].list[0].id
              var userInfo = getUserInfo()
              userInfo.communityId = res.list[0].list[0].id
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
            }
          } else {
            this.Toast(res.error.err_msg)
          }
        }
      }
    },
    async mounted() {
      this.clickFlag = true
      //await this.getCommunityList()
      // if (this.is_Weixn()) {
      //   if (!getUserInfo().communityId) {
      //     await this.getCommunityList()
      //   }
      // }
      this.getGoodsType()
      this.getMainLunbo()
      this.getShoppingCart()
      this.externalMerchantList()
      // await this.getGoodsList()
      // this.$nextTick(v=>{
      //   this.$refs.scroll.refresh()
      // })
    }
  }
</script>

<style scoped lang="scss">
  #mainPage {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background-color: #f9f9f9;
    width: 100%;
    position: relative;

    .mainPageCon {
      height: calc(100% - 88px);
      width: 100%;
      overflow: hidden;
    }

    .mainPageCon1 {
      height: calc(100% - 188px);
      width: 100%;
      overflow: hidden;
    }

    .mainPage-box {
      position: relative;
      width: 100%;
      background: #f9f9f9;
    }

    .mainPage-header {
      height: 100px;
      background-color: #fff;
    }

    .mainPage-banner {
      height: 300px;
      background-color: white;
      width: 100%;
    }

    .mainPage-tab {
      background-color: white;
      height: 100px;
      transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
      position: relative;
      overflow: hidden;
      border-bottom: 1Px solid #f1f1f1;
      text-shadow: 0.013333rem 0.04rem 0.053333rem #f1f1f1;

      .list-wrapper {
        min-width: 100%;
        white-space: nowrap;
        overflow: hidden;

        li {
          float: left;
          width: 160px;
          height: 100px;
          box-sizing: border-box;

          > div {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            align-content: center;

            img {
              width: 90px;
              height: 90px;
              border-radius: 4px; /*no*/
              border: 1px solid transparent; /*no*/
              box-shadow: 0 0 8px rgba(162, 96, 164, 0); /*no*/
              transition: all .3s;
              transform: translateY(0px); /*no*/
            }

            p {
              height: 55px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
              transform: translateY(2px); /*no*/
              transition: all .3s;
              font-family: Source Han Sans CN;
              text-shadow: 1px 3px 6px rgba(162, 96, 164, 0); /*no*/
            }
          }
        }

        li.active {
          img {
            border: 1px solid rgba(162, 96, 164, 0.77); /*no*/
            box-shadow: 0 0 6px rgba(162, 96, 164, 0.53); /*no*/
          }

          p {
            color: #A260A4;
            text-shadow: 1px 3px 4px rgba(162, 96, 164, 0.51); /*no*/
          }
        }

        li.active_ {
          img {
            border: 1px solid #16a0e9; /*no*/
            box-shadow: 0 0 6px rgba(22, 160, 233, 0.57); /*no*/
          }

          p {
            color: #16a0e9;
            text-shadow: 1px 3px 4px rgba(22, 160, 233, 0.52); /*no*/
          }
        }
      }
    }

    .mainPage-classification {
      background-color: #fff;
      overflow: hidden;

      .mainPage-classification-item {
        width: 25%;
        height: 206px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        float: left;

        img {
          width: 82px !important;
          height: 82px !important;
          border-radius: 50% !important;
        }

        p {
          margin-top: 20px;
          text-align: center;
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(36, 36, 36, 1);
        }
      }
    }

    .mainPage-title {
      height: 110px;
      line-height: 110px;

      p {
        text-align: center;
        font-size: 36px;
        font-family: Source Han Sans CN;
        color: rgba(35, 35, 35, 1);

        span {
          font-weight: 700;
          margin: 0 20px;
        }

        i {
          width: 12px;
          height: 12px;
          display: inline-block;
          vertical-align: middle;
          background: rgba(161, 96, 164, 1);
          border-radius: 50%;
        }
      }
    }

    .mainPage-main {
      /*padding-bottom: 60px;*/
      ul {
        min-height: calc(100vh - 660px);
        padding: 23px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-top: 0px;
        /*align-content: center;*/
        li {
          width: 49%;
          min-height: 440px;
        }
      }

      .moreBtn {
        width: 80%;
        margin: 0 auto;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        -webkit-justify-content: center;
        justify-content: center;
        align-items: center;
        /*-webkit-box-align: center;*/
        -webkit-align-items: center;
        /*-ms-flex-align: center;*/
        display: flex;
        height: 70px;
        font-size: 32px;
        color: #A260A4;
        background-color: white;
        text-align: center;
        border: 1px solid #A260A4; /*no*/
        border-radius: 70px;
        margin-bottom: 1.8rem;
        outline: none;
      }

      .moreBtn_a {
        color: #ddd;
        border: transparent;
        background: transparent;
      }
    }

    .mainPage-search {
      /*width: calc(100% - 210px);*/
      width: 572px;
      height: 78px;
      position: absolute;
      top: 10px;
      left: 54px;
      z-index: 2;

      .mainPage-search-box {
        background: rgba(238, 238, 238, 1);
        height: 100%;
        border-radius: 78px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1A1A1A;
        font-size: 32px;

        .cubeic-search {
          font-weight: 500;
          font-size: 30px;
          margin-right: 5px;
          color: #A160A4;
        }

        span {
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 75px;
        }
      }
    }

    .goodsCart {
      position: absolute;
      top: 10px;
      right: 31px;
      width: 78px;
      height: 78px;
      border-radius: 78px;
      background: url("../../assets/01_banner_cart.png") no-repeat center;
      background-size: 78px;
      z-index: 3;

      > span {
        right: -5px;
        top: -5px;
        position: absolute;
        z-index: 1;
        height: 35px;
        width: 35px;
        border-radius: 100%;
        color: white;
        background-color: red;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px; /*no*/
      }
    }
  }
</style>
<style lang="scss">
  #mainPage .mainPage-tab .cube-scroll-content {
    display: inline-block !important;
  }

  #mainPage .cube-pulldown {
    position: absolute;
    top: 0;
    width: 100%;
  }

  #mainPage .mainPage-tab .list-wrapper .active > div p {
    font-size: 36px !important;
  }
</style>
