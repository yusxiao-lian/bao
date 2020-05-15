<!-- 商户列表页 -->
<template>
  <section class="merchants-list">

    <!--    <section class="input-head">-->
    <!--      <section class="input-wrapper">-->
    <!--        <cube-input class="input" v-model="key_word" :clearable="clearable" placeholder="请输入要搜索的商户名称"-->
    <!--                    @input="changeInput">-->
    <!--          <template slot="prepend">-->
    <!--            <i class="cubeic-search input-icon"></i>-->
    <!--          </template>-->
    <!--        </cube-input>-->
    <!--      </section>-->
    <!--    </section>-->

    <section class="slide-container">
      <cube-scroll ref="scroll"
                   :data="merchants_list"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll">
        <!--        <section class="list-wrapper">-->
        <!--          <div class="list-item" v-for="(item,index) in merchants_list" :class="[index % 2 == 0 ? 'rg-m' : 'lf-m']"-->
        <!--               v-if="item.link">-->
        <!--            <div class="item-img" @click.stop="gotoLink(item.link)">-->
        <!--              <img :src="baseUrl + item.logoPath" class="merchant-img"/>-->
        <!--            </div>-->
        <!--            <div class="item-info">-->
        <!--              <div class="item-name">{{item.name}}</div>-->
        <!--              <div class="item-slogan">{{item.description}}</div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          &lt;!&ndash; 占位 不满双数则凑一个双数 &ndash;&gt;-->
        <!--          <div class="list-item lf-m" style="background: #F8F8FA" v-if="merchants_list.length %2 != 0"></div>-->
        <!--        </section>-->


        <div class="content-bottom">
          <div class="content-bottom-content">
            <section class="slide-container">
              <section class="list-wrapper">
                <div class="list-item" v-for="(item,index) in merchants_list"
                     :class="item.className">
                  <div class="item-img" @click="gotoLink(item.link)">
                    <img :src="baseUrl + item.logoPath" class="merchant-img"/>
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{item.name}}</div>
                    <div class="item-slogan">{{item.description}}</div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>

      </cube-scroll>
    </section>

    <headerSearch
      v-model="searchFlag"
      @getSearchValue="getSearchValue"
    ></headerSearch>
  </section>
</template>

<script type="text/javascript">
  import {baseUrl} from "../../service/configUrl.js"
  import {popularMerchants} from "../../service/merchants"
  import headerSearch from "../../components/headerComponent/headerSearch_top.vue"

  export default {
    name: 'merchantsList',
    data() {
      return {
        baseUrl,
        userInfo: {},
        key_word: '',
        clearable: {
          visible: true,
          blurHidden: true
        },
        optionsScroll: {
          pullDownRefresh: {
            threshold: 60,
            txt: '刷新成功'
          },
          pullUpLoad: {
            threshold: 40,
            txt: {
              more: '加载中....',
              noMore: '没有更多内容了'
            }
          },
          click: true,
          scrollbar: false
        },
        current_page: 1,
        merchants_list: [],
        searchFlag: true,
      }
    },
    components: {
      headerSearch
    },
    created() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      console.log(this.userInfo)
    },
    mounted() {
      this.getpopularMerchants()
    },
    methods: {
      async getSearchValue(searchValue) {
        this.key_word = searchValue;
        this.merchants_list = []
        this.getpopularMerchants()
      },
      gotoLink(item) {
        // console.log(item)
        window.location.href = item
      },
      changeInput(value) {
        // console.log(value)
        console.log(this.key_word)
        this.current_page = 1
        this.merchants_list = []
        this.getpopularMerchants()
      },
      onPullingUp() {
        console.log('上拉加载')
        this.current_page++
        this.getpopularMerchants()
        this.$refs.scroll.forceUpdate()
      },
      onPullingDown() {
        console.log('下拉刷新')
        this.current_page = 1
        this.merchants_list = []
        this.getpopularMerchants()
        this.$refs.scroll.forceUpdate()
      },
      async getpopularMerchants() {
        let data = {
          communityId: this.userInfo.communityId,
          pageNo: this.current_page,
          pageSize: 10,
        }
        if (this.key_word) {
          data.name = this.key_word
        }
        let res = await popularMerchants(data)
        console.log(res, '热门商户')
        if (res && res.error.err_code == 0) {
          // console.log("请求成功")
          res.list.forEach((v, i) => {
            if (i % 2 == 0) {
              v.className = 'rg-m'
            } else {
              v.className = 'lf-m'
            }
          })
          let newList = res.list
          if (this.merchants_list.length == 0 && this.current_page == 1) {
            console.log(111);
            this.merchants_list = newList
          } else if (this.current_page > 1 && this.merchants_list.length >= 10) {
            // 由于没有返回总页码来做限制 以所只能在只有一页 且单页个数少的情况下进行限制
            // 不继续给数组添加
            console.log('22222')
            this.merchants_list = [...this.merchants_list, ...newList]
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: res.error.err_msg,
            content: '',
          }).show();
        }
      },
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .merchants-list {
    height: 100%;
    background: #F8F8FA;
    padding-top: 88px;
    position: relative;

    .input-head {
      width: 100%;
      height: 110px;
      background: #2E88F2;
      padding: 15px 20px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      .input-wrapper {
        width: 100%;
        height: 66px;
        line-height: 66px;
        display: block;

        .input-icon {
          font-size: 42px;
          padding-left: 8px;
          color: #C8C5C6;
        }
      }
    }

    .slide-container {
      height: calc(100% - 30px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;


      .content-bottom {
        margin-top: 20px;
        padding: 0 15px;

        .content-bottom-content {
          background: rgba(255, 255, 255, 1);
          border-radius: 10px;
          padding: 0 25px;

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
                  background: #F8F8FA;
                  /*border-radius: 10px 10px 0px 0px;*/
                  /*overflow: hidden;*/
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
                    width: 100%;
                    min-height: 45px;
                    line-height: 30px;
                    font-size: 26px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: rgba(103, 103, 103, 1);
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
        }
      }

      /*.list-wrapper {*/
      /*  display: flex;*/
      /*  flex-wrap: wrap;*/
      /*  justify-content: center;*/

      /*  .lf-m {*/
      /*    margin-left: 15px;*/
      /*  }*/

      /*  .rg-m {*/
      /*    margin-right: 15px;*/
      /*  }*/

      /*  .list-item {*/
      /*    width: 330px;*/
      /*    height: 450px;*/
      /*    background: #fff;*/
      /*    margin-bottom: 30px;*/

      /*    .item-img {*/
      /*      width: 330px;*/
      /*      height: 330px;*/
      /*      background: #F8F8FA;*/
      /*      border-radius: 10px 10px 0px 0px;*/
      /*      overflow: hidden;*/

      /*      .merchant-img {*/
      /*        width: 100%;*/
      /*        height: auto;*/
      /*      }*/
      /*    }*/

      /*    .item-info {*/
      /*      padding: 10px;*/

      /*      .item-name {*/
      /*        width: 100%;*/
      /*        height: 45px;*/
      /*        line-height: 45px;*/
      /*        font-size: 28px;*/
      /*        color: #333;*/
      /*        font-weight: 700;*/
      /*        white-space: nowrap;*/
      /*        overflow: hidden;*/
      /*        text-overflow: ellipsis;*/
      /*      }*/

      /*      .item-slogan {*/
      /*        width: 100%;*/
      /*        min-height: 45px;*/
      /*        line-height: 30px;*/
      /*        font-size: 26px;*/
      /*        overflow: hidden;*/
      /*        text-overflow: ellipsis;*/
      /*        display: -webkit-box;*/
      /*        -webkit-box-orient: vertical;*/
      /*        -webkit-line-clamp: 2;*/
      /*      }*/
      /*    }*/
      /*  }*/
      /*}*/
    }
  }
</style>
