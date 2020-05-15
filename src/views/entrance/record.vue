<template>
  <div class="record">
    <headerTab></headerTab>
    <div class="record-list">
      <ul>
        <li v-for="(v,i) in dataList">
          <p class="p1">
            <i></i>
            <span class="span1">{{v.visitorName}}</span>
            <span class="span2">{{v.visitorPhone}}</span>
            <span @click="invitation(v)" class="span3">再次邀请</span>
          </p>
          <p class="p2">{{v.startTime}}至{{v.endTime}}</p>
          <div class="div-content">
            {{v.memo}}
          </div>
        </li>
      </ul>
    </div>

    <!-- 引导 -->
    <div id="maskPointer" v-if="isShow" @click="hideShow">
      <div class="arrow">
        <img src="../../assets/img/guide.png">
      </div>
      <div class="text">点击右上角菜单，
        <br>在
        <span>分享</span>链接
      </div>
    </div>


  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import *as api from "../../service/entrance";
  import {baseUrl} from '../../service/configUrl'

  export default {
    name: "record",
    components: {
      headerTab
    },
    data() {
      return {
        isShow: false,
        userInfo: '',
        dataList: [],
        imgItem: require("../../assets/img/dx1.png"),
      }
    },
    created() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.myVisitorApplyList()
    },
    methods: {
      hideShow() {
        this.isShow = false
      },
      invitation(item) {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isiOS) {
          let arr = item.endTime.split('-');
          let endTime = arr[0] + '/' + arr[1] + '/' + arr[2]
          if (new Date(endTime).getTime() < new Date().getTime()) {
            this.$router.push({
              name: 'visitors',
              params: {item: item},
              query: {maxDay: this.$route.query.maxDay}
            })
          } else {
            this.wxPosition(item)
          }
        } else if (isAndroid) {
          if (new Date(item.endTime).getTime() < new Date().getTime()) {
            this.$router.push({
              name: 'visitors',
              params: {item: item},
              query: {maxDay: this.$route.query.maxDay}
            })
          } else {
            this.wxPosition(item)
          }
        }
      },
      async wxPosition(item) {
        wx.updateAppMessageShareData({
          title: '访客邀请', // 分享标题
          desc: item.visitorName + "邀请您于" + item.startTime + '至' + item.endTime + "访问" + this.userInfo.cityName + this.userInfo.communityName, // 分享描述
          link: baseUrl + '/static/h5/commerce/index.html#/openDoorList?applyId=' + item.applyId,
          imgUrl: baseUrl + '/static/h5/wechat/dx.png', // 分享图标
          success: async (res) => {
            this.isShow = true
          }
        });
      },
      cancel() {
        this.isShow = false
      },
      async myVisitorApplyList() {
        let data = {
          communityId: this.userInfo.communityId,
          startTime: '',
          endTime: '',
        }
        let res = await api.myVisitorApplyList(data)
        if (res) {

          if (res.error.err_code == "0") {
            this.dataList = res.list
          } else {
            this.Toast(res.error.err_msg)
          }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .record {
    background-color: #f1f1f1;
    padding-top: 120px;
    .record-list {
      ul {
        li {
          padding: 0 30px;
          margin-top: 20px;
          height: 264px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.02);
          .p1 {
            line-height: 90px;
            i {
              width: 40px;
              height: 40px;
              display: inline-block;
              background-image: url("../../assets/img/txl.png");
              background-size: cover;
              margin-right: 20px;
              vertical-align: sub;
            }
            span {
              font-size: 30px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(26, 26, 26, 1);
            }
            .span1 {
              margin-right: 14px;
            }
            .span3 {
              float: right;
              font-size: 28px;
              font-family: Adobe Heiti Std;
              font-weight: normal;
              color: rgba(162, 96, 164, 1);
            }
          }
          .p2 {
            line-height: 90px;
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
          .div-content {
            font-size: 26px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 48px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    #maskPointer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      text-align: center;
      color: #fff;
      z-index: 1000;
    }

    #maskPointer .arrow {
      clear: both;
      height: 346px;
      padding: 120px 30px 30px 30px;
      text-align: right;
    }

    #maskPointer .arrow img {
      height: 100%;
      float: right;
    }

    #maskPointer .text {
      text-align: center;
      font-size: 28px;
      line-height: 36px;
    }

    #maskPointer .text span {
      color: #fed700;
    }

  }
</style>
