<template>
  <div class="sysMsg">
    <headerTab :title="$route.query.businessTypeName"></headerTab>
    <div class="tab-slide-container">
      <cube-scroll ref="scrollObj"
                   :data="dataList"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll">
        <div class="sys-li" v-for="v in dataList" @click="clickMessage(v)">
          <p>【{{$route.query.businessTypeName}}】{{v.content}}</p>
          <span>{{splitItem(v.sendTime)}}</span>
          <i></i>
        </div>
      </cube-scroll>
    </div>

  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import * as api from "../../service/message";
  import {baseUrl} from "../../service/configUrl.js";

  export default {
    components: {
      headerTab
    },
    created() {
      this.businessType()
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {};
    },
    data() {
      return {
        userInfo: '',
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
          cur: 1,
          size: 10,
          businessType: this.$route.query.businessType

        }
      };
    },
    methods: {
      // 消息跳转
      clickMessage(item) {
        switch (this.$route.query.businessType) {
          case '1022':
            this.$router.push('/myVehicle')
            break;
          case '1003':
            this.$router.push('/payHistoryList')
            break;
          case '1002':
            this.$router.push({
              path: '/repairProgress',
              query: {
                id: item.objId,
                formStatus: ''
              }
            })
            break;
          case '1013':
            window.location.href = baseUrl + '/survey/app/wechatDetail?surveyId=' + item.objId + '&Access-Token=' + this.userInfo.accessToken
            break;
          case '1005':
            window.location.href = baseUrl + '/property/notice/webPreview?id=' + item.objId
            break;
          default:
            this.$router.push({
              name: 'messageDetails',
              params: {
                items: item
              }
            })
            break;
        }
      },
      splitItem(item) {
        let arr = item.split(' ')
        return arr[0]
      },
      async businessType() {
        let res = await api.appAllMessageByType(this.params);
        if (res.error.err_code == 0) {
          this.dataList = res.list
          this.$refs.scrollObj.forceUpdate();
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      async onPullingDown(type) {
        console.log('下拉刷新')
        this.$refs.scrollObj.forceUpdate();
      },
      async onPullingUp(type) {
        console.log('上拉加载')
        this.$refs.scrollObj.forceUpdate();
      },
    }
  };
</script>

<style lang="scss" scoped>
  .sysMsg {
    position: relative;
    height: 100%;
    background-color: #F9F9F9;
    padding-top: 100px;

    .tab-slide-container {
      height: calc(100% - 30px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;

      .sys-li {
        height: 120px;
        line-height: 120px;
        background-color: #fff;
        border-bottom: 1Px solid #f1f1f1;
        padding-left: 34px;
        padding-right: 30px;
        position: relative;

        p {
          font-size: 30px;
          width: 492px;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        span {
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(130, 130, 130, 1);
          position: absolute;
          top: 0px;
          right: 60px;
        }

        i {
          position: absolute;
          right: 30px;
          top: 47px;
          width: 14px;
          height: 26px;
          display: inline-block;
          background-image: url("../../assets/right-arrow.png");
          background-size: cover;
        }
      }
    }
  }
</style> 
