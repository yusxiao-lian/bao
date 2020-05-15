<template>

  <div class="questionnaire">
    <headerTab :title="$route.meta.title"/>
    <!--tab切换-->
    <div class="questionnaire-tab">
      <div :class="{'divBorderBottom':current==1}" @click="currentClick(1,'begin')">进行中</div>
      <div :class="{'divBorderBottom':current==2}" @click="currentClick(2,'done')">已过期</div>
    </div>
    <div class="tab-slide-container">
      <cube-scroll ref="scrollObj"
                   :data="myFormList"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll">
        <div class="repairRecord-li" v-for="item in myFormList" v-cloak>
          <div class="survey-option">
            <div class="survey-option-content">
              <div class="survey-option-content-title">{{item.title}}</div>
              <div class="survey-option-content-description">
                {{item.desc}}
              </div>
            </div>
            <div class="survey-option-message clear">
              <div class="survey-option-message-row">
                <div class="survey-option-message-row-option">
                  <span class="survey-option-message-row-option-title">调查单位：</span>
                  <span class="survey-option-message-row-option-content">{{item.deptName}}</span>
                </div>
                <div class="survey-option-message-row-option">
                  <span class="survey-option-message-row-option-title">问卷类型：</span>
                  <span class="survey-option-message-row-option-content">{{item.qnrType}}</span>
                </div>
              </div>
              <div class="survey-option-message-row">
                <div class="survey-option-message-row-option">
                  <span class="survey-option-message-row-option-title">开始日期：</span>
                  <span class="survey-option-message-row-option-content">{{item.startTime}}</span>
                </div>
                <div class="survey-option-message-row-option">
                  <span class="survey-option-message-row-option-title">结束日期：</span>
                  <span class="survey-option-message-row-option-content">{{item.endTime}}</span>
                </div>
              </div>
            </div>
            <div class="survey-option-control clear">
              <span>{{item.completed}}，共<span class="survey-option-control-num">{{item.qcount}}</span>题</span>
              <div v-if="item.answer">
                <button class="survey-option-control-btn" @click="toDelite(item)" v-if="item.completed=='未开始'">开始填写
                </button>
                <button class="survey-option-control-btn" @click="toDelite(item)" v-if="item.completed=='进行中'">继续填写
                </button>
                <button class="survey-option-control-btn" @click="toDelite(item)" v-if="item.completed=='已完成'">查看
                </button>
              </div>
              <div v-else>
                <button class="survey-option-control-btn" @click="toDelite(item)">查看</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dataNo" v-if="myFormList.length==0">
          暂无进行中问卷调查!
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import {headerTab, bottomButton} from "../../components/index";
  import {listForH5, appGetHouseListAll} from "../../service/questionnaire";
  import {baseUrl} from "../../service/configUrl.js";

  export default {
    name: "",
    data() {
      return {
        userInfo: '',
        current: 1,
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
        myFormList: [], //列表数据
        params: {
          pageNo: 1, //当前页码
          pageSize: 10, //页大小
          status: 'begin',
        },
        baseUrl: baseUrl
      }
    },
    created() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      console.log(this.userInfo, 'IIII');
      if (this.userInfo.houseId) {
        this.listForH5()
        return
      }
      this.appGetHouseListAll()
    },
    components: {
      headerTab
    },
    methods: {
      // 获取当前已认证的房屋
      async appGetHouseListAll() {
        let res = await appGetHouseListAll();
        console.log(res, 'PPPPP');
        if (res.error.err_code == 0) {
          if (res.list.length > 0) {
            this.listForH5()
          }
        } else if (res.error.err_code == 5) {
          this.$createDialog({
            type: 'alert',
            content: '完成认证即可填写问卷',
            icon: 'cubeic-alert',
            confirmBtn: {
              text: '去认证',
              active: true,
              disabled: false,
              href: 'javascript:;'
            },
            onConfirm: () => {
              this.$router.push('/HouseList')
            }
          }).show()
        } else {
          this.$createDialog({
            type: 'alert',
            title: res.error.err_msg,
            content: '',
          }).show();
        }
      },
      // 跳转到详情
      toDelite(item) {
        // window.location.href = 'http://o2otest.jixiangit.com/survey/app/wechatDetail?surveyId=7542811c67b94fb6812df7768d9179a9&Access-Token=S3lNS05mV3FvNkhPeDBDanQ4RGhwNllOYXJqWWk1aTNXM0o1aldyeERqOTJEQnJJSVdBRXh3PT0'
        window.location.href = baseUrl + '/survey/app/wechatDetail?surveyId=' + item.sid + '&Access-Token=' + this.userInfo.accessToken
      },
      //获取数据列表
      async listForH5(type = '') {
        let res = await listForH5(this.params);
        if (res.error.err_code == 0) {
          let newList = [];
          if (res.list != null) {
            newList = res.list
          }
          if (type == 'more') {//加载更多
            this.myFormList = [...this.myFormList, ...newList];
          } else {
            this.myFormList = newList;
          }
          console.log(this.myFormList, 'rrrr');
        } else if (res.error.err_msg == '未登录或登录超时') {
          console.log(999);
          this.$createDialog({
            type: 'alert',
            content: res.error.err_msg,
            onConfirm: () => {
              this.$router.push({
                path: '/login',
                query: {
                  type: 'questionnaire'
                }
              })
            }
          }).show()
        } else {
          this.$createDialog({
            type: 'alert',
            title: res.error.err_msg,
            content: '',
          }).show();
        }
      },
      async onPullingDown(type) {
        console.log('下拉刷新')
        this.params.pageNo = 1;
        await this.listForH5();
        this.$refs.scrollObj.forceUpdate();
      },
      async onPullingUp(type) {
        console.log('上拉加载')
        this.params.pageNo++;
        await this.listForH5('more');
        this.$refs.scrollObj.forceUpdate();
      },
      currentClick(index, type) {
        this.params.pageNo = 1;
        this.current = index
        this.params.status = type
        this.listForH5()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .questionnaire {
    position: relative;
    height: 100%;
    background-color: #F9F9F9;
    padding-top: 100px;

    .tab-slide-container {
      height: calc(100% - 80px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;

      .repairRecord-li {
        padding-top: 80px;
      }
    }

    .questionnaire-tab {
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
        border-bottom: 4px solid #008dd2;
        color: #008dd2;
      }
    }

    .survey {
      padding: 0 24px;
      margin-top: 100px;
    }

    .survey-option {
      background-color: #fff;
      border-top: 8px solid #008dd2;
      border-radius: 10px;
      padding: 0 27px;
      position: relative;
    }

    .survey-option:before {
      content: '';
      position: absolute;
      background: url("../../assets/img/survey-clamp.png") no-repeat center;
      background-size: 100% 100%;
      width: 235px;
      margin-left: -117.5px;
      height: 90px;
      left: 50%;
      top: -63px;
    }

    .survey-option-content {
      padding: 75px 30px 50px 30px;
      border-bottom: 1Px solid #eeeeee;
    }

    .survey-option-content-title {
      font-size: 34px;
      font-weight: 600;
      padding-bottom: 30px;
    }

    .survey-option-content-description {
      font-size: 30px;
      color: #666;
      line-height: 50px;
    }

    .survey-option-message {
      font-size: 26px;
      padding-top: 30px;
    }

    .survey-option-message-row-option {
      float: left;
      width: 50%;
      white-space: nowrap;
    }

    .survey-option-message-row-option-title {
      display: inline-block;
      width: 130px;
      color: #999;
      float: left;
      line-height: 2;
    }

    .survey-option-message-row-option-content {
      color: #666;
      overflow: hidden;
      display: inline-block;
      width: 182px;
      text-overflow: ellipsis;
      line-height: 2;
    }

    .survey-option-control {
      font-size: 26px;
      color: #666;
      line-height: 60px;
      padding: 30px 0;
    }

    .survey-option-control-num {
      color: #008dd2;
    }

    .survey-option-control-btn {
      border: none;
      background-color: #ed6d00;
      color: #fff;
      width: 180px;
      height: 60px;
      border-radius: 10px;
      float: right;
    }

    .questionnaire-loding {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.4);

      .questionnaire-content {
        width: 600px;
        height: 800px;
        margin: 0 auto;
        margin-top: 200px;
        background-color: #fff;
      }
    }

    .dataNo {
      text-align: center;
      margin-top: 300px;
      font-size: 30px;
    }
  }

  [v-cloak] {
    display: none;
  }
</style>
<style type="text/scss" lang="scss">
  .questionnaire {
    .back-arrow {
      display: none !important;
    }
  }

</style>
