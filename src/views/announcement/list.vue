<template>
  <div class="sysMsg">
    <headerTab></headerTab>
    <div class="tab-slide-container">
      <cube-scroll ref="scrollObj"
                   :data="dataList"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll">
        <div class="sys-li">
          <div class="sys-li-top">
            <i class="sys-li-i cubeic-search"></i>
            <button @click="newNoticeList">搜索</button>
            <input type="text" placeholder="请输入公告标题查询" v-model="params.title" class="content-input">
          </div>
          <div class="content">
            <div class="sys-li-content" v-for="(item,index) in dataList" @click="clickDetails(item)">
              <div class="item">
                <p class="p-top">
                  <span class="prompt" :class="item.className">{{item.categoryName}}</span>
                  <span class="span-title">{{item.title}}</span>
                </p>

                <p class="p-botton">{{item.content}}...</p>
                <span>{{splitItem(item.lastTime)}}</span>
              </div>
            </div>
            <div class="dataNo" v-if="dataList.length<1">
              暂无数据！
            </div>
          </div>

        </div>
      </cube-scroll>
    </div>

  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import {newNoticeList} from "../../service/merchants"

  export default {
    name: "list",
    components: {
      headerTab
    },
    data() {
      return {
        title: '',
        dataList: [],
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
          scrollbar: true
        },
        params: {
          community: '',
          appType: 'yezhuApp',
          title: '',
          pageNo: 1,
          pageSize: 20
        },
        isShow: false
      };
    },
    created() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {}
      this.params.community = this.userInfo.communityId,
        this.newNoticeList()
    },
    methods: {
      splitItem(item) {
        let arr = item.split(' ')
        return arr[0]
      },
      clickDetails(item) {
        this.$router.push({
          path: '/announcementDetails',
          query: {
            noticeId: item.noticeId
          }
        })
      },
      async newNoticeList(type) {
        let res = await newNoticeList(this.params)
        if (res.error.err_code == 0) {
          let allList
          console.log(type)
          if (type == "more") {
            allList = [...this.dataList, ...res.list];
          } else {
            allList = res.list;
          }

          allList.forEach((v, i) => {
            if (v.noticeLabel == 0) {
              v.className = 'prompt_1'
            } else if (v.noticeLabel == 1) {
              v.className = 'prompt_2'
            } else {
              v.className = 'prompt_3'
            }
          })
          this.dataList = allList
        } else {
          if (type != "more") {
            this.dataList = [];
          }
          // this.Toast(res.error.err_msg);
        }
      },
      // 消息跳转
      clickMessage() {

      },
      async onPullingDown() {
        console.log('下拉刷新')
        this.params.pageNo = 1
        this.$refs.scrollObj.forceUpdate();
      },
      async onPullingUp() {
        this.params.pageNo++
        await this.newNoticeList("more");
        setTimeout(v => {
          this.$refs.scrollObj.forceUpdate();
        }, 500);
        console.log('上拉加载')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .sysMsg {
    position: relative;
    height: 100%;
    background-color: rgb(238, 238, 238);
    padding-top: 100px;

    .tab-slide-container {
      /*padding: 0 30px;*/
      height: calc(100% - 30px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;

      .sys-li {
        position: relative;

        .sys-li-top {
          background-color: #fff;
          padding: 0 30px;

          .sys-li-i {
            width: 30px;
            height: 30px;
            display: inline-block;
            background-size: cover;
            /*background-image: url("../../assets/searchIcon.png");*/
            position: absolute;
            top: 54px;
            left: 40px;
          }
        }

        .content {
          padding: 0 30px;
          margin-top: 20px;

          .dataNo {
            line-height: 800px;
            font-size: 30px;
            text-align: center;
          }
        }


        button {
          width: 80px;
          position: absolute;
          right: 40px;
          height: 76px;
          top: 30px;
          border-radius: 5px;
          color: #000;
          background-color: #fff;
        }

        .content-input {
          margin: 30px 0;
          padding-right: 20px;
          width: 85%;
          height: 78px;
          background-color: #f1f1f1;
          border: 1px solid rgba(229, 229, 229, 1);
          border-radius: 5px;
          padding-left: 50px;
          line-height: 78px;
        }

        .sys-li-content {
          background: rgba(255, 255, 255, 1);
          border-radius: 20px;
          padding-top: 30px;
          padding-bottom: 20px;
          margin-bottom: 20px;

          .item {
            padding: 0 20px;

            .p-top {
              line-height: 40px;
              margin-bottom: 10px;
              position: relative;
              padding-left: 160px;
              padding-top: 4px;

              .prompt {
                vertical-align: middle;
                width: 150px;
                height: 40px;
                text-align: center;
                display: inline-block;
                font-size: 30px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #fff;
                line-height: 40px;
                border-radius: 14px;
                margin-right: 10px;
                position: absolute;
                top: 0;
                left: 0;
              }

              .span-title {
                width: 450px;
                height: 40px;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 30px;
                font-family: PingFang SC;
                font-weight: 500;
                color: rgba(29, 29, 29, 1);
              }

            }

            .p-botton {
              margin-bottom: 20px;
              line-height: 40px;
            }

            .prompt_1 {
              background-color: rgba(245, 134, 114, 1);
            }

            .prompt_2 {
              background-color: rgba(161, 96, 164, 1);
            }

            .prompt_3 {
              background-color: rgba(105, 105, 105, 1);;
            }


            /*p {*/
            /*  font-size: 28px;*/
            /*  font-family: PingFang SC;*/
            /*  font-weight: 500;*/
            /*  color: rgba(94, 94, 94, 1);*/
            /*  line-height: 32px;*/
            /*  margin-bottom: 20px;*/
            /*}*/

            span {
              font-size: 24px;
              font-family: PingFang SC;
              font-weight: 500;
              color: rgba(142, 142, 142, 1);
            }
          }

        }
      }
    }
  }
</style>

