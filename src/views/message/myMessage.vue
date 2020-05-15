<template>
  <div class="my-msg">
    <headerTab :title="$route.meta.title"></headerTab>

    <div class="tab-slide-container">
      <cube-scroll ref="scrollObj"
                   :data="dataList"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll">
        <div class="sys-li" v-for="v in dataList">
          <div class="item" @click="clickItem(v)">
            <div class="left">
              <img v-if="v.businessType!='1013'" class="img-tip" src="../../assets/system.png" alt/>
              <img v-else class="img-tip" src="../../assets/survey.png" alt="">
            </div>
            <div class="right">
              <div class="header">
                <div class="title">
                  <span>{{v.businessTypeName}}</span>
                </div>
                <p class="date">更多消息</p>
              </div>
              <div class="msg">
                <p class="p1"><span>【{{v.businessTypeName}}】</span>{{v.content}}</p>
                <span class="span2">{{splitItem(v.sendTime)}}</span>
                <i></i>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dataList.length<1" class="dataNo">
          暂无消息
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import * as api from "../../service/message";

  export default {
    components: {
      headerTab
    },
    data() {
      return {
        dataList: [],//列表数据
        optionsScroll: {
          pullDownRefresh: {
            threshold: 60,
            txt: '刷新成功'
          },
          click: true,
          scrollbar: true
        },
      };
    },
    created() {
      this.myMessageList()
    },
    methods: {
      splitItem(item) {
        let arr = item.split(' ')
        return arr[0]
      },
      async clickRead() {
        let params = {
          allReaded: 'type'
        }
        let res = await api.batchReaded(params);
        if (res.error.err_code == 0) {
          this.Toast('操作成功');
          this.myMessageList()
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      clickItem(v) {
        this.$router.push({
          name: 'parkMessage',
          query: {
            businessType: v.businessType,
            businessTypeName: v.businessTypeName,
            businessType: v.businessType,
            unreadCount: v.unreadCount,
          }
        })
      },
      // 消息列表
      async myMessageList() {
        let res = await api.appMessageType();
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
        this.myMessageList()
      },
    }
  };
</script>

<style lang="scss" scoped>
  .my-msg {
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
        .item {
          background-color: #fff;
          padding-top: 28px;
          padding-bottom: 28px;
          padding-left: 130px;
          padding-right: 32px;
          margin-bottom: 20px;
          height: 145px;
          border-bottom: 1px solid #eee;
          position: relative;

          .left {
            position: absolute;
            left: 38px;
            top: 48px;

            .img-tip {
              width: 50px;
              height: 50px;
            }
          }

          .right {
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .title {
              font-family: PingFang SC;
              font-weight: 500;
              color: #1a1a1a;
              position: relative;

              span {
                font-size: 36px;
              }
            }

            .date {
              font-size: 26px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #989898;
            }

            .msg {
              font-size: 26px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #646464;
              margin-top: 22px;
              line-height: 36px;
              position: relative;

              .p1 {
                display: inline-block;
                width: 396px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                span {
                  font-weight: 600;
                }
              }

              .span2 {
                position: absolute;
                right: 15px;
                font-size: 24px;
              }

              i {
                position: absolute;
                right: -10px;
                top: 4px;
                width: 15px;
                height: 26px;
                display: inline-block;
                background-image: url("../../assets/right-arrow.png");
                background-size: cover;
              }
            }
          }
        }
      }

      .dataNo {
        text-align: center;
        font-size: 40px;
        margin-top: 300px;
      }
    }
  }
</style>
