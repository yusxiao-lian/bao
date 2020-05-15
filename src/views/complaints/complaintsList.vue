<template>
  <div id="repairRecord">
    <headerTab :title="$route.meta.title"/>
    <cube-tab-bar v-model="selectedLabel"
                  showSlider
                  ref="tabNav"
                  @click="clickHandler"
                  :data="tabLabels">
    </cube-tab-bar>
    <div class="tab-slide-container">
      <cube-scroll ref="scrollObj"
                   :data="dataList"
                   @pulling-up="onPullingUp()"
                   @pulling-down="onPullingDown()"
                   :options="optionsScroll">
        <div class="repairRecord-li" v-for="item in myFormList" @click="toDelite(item)">
          <div class="repairRecord-li-top">
            <div class="repairRecord-li-top-left">
              <i class="repairRecord-ico"></i>
              {{item.formType}}
            </div>
            <div
              :class="{'repairRecord-li-top-right':true,'purple':item.status=='0','lightBlue':item.status=='2','yellow':item.status=='3','red':item.status=='4'}">
              {{item.formStatus}}
            </div>
          </div>

          <div class="repairRecord-content">
            <div class="repairRecord-li-i">
              <i></i>
              <span> 房间号：</span>
              <span class="title">{{item.houseName}}</span>
            </div>
            <div class="repairRecord-li-i">
              <i></i>
              <span>    投诉人：</span>
              <span class="title">{{item.complainantName}}</span>
            </div>

            <div class="repairRecord-li-i">
              <i></i>
              <span>  投诉时间：</span>
              <span class="title">{{item.createTime}}</span>
            </div>

            <div class="repairRecord-li-i">
              <i></i>
              <span> 投诉内容：</span>
              <span class="title">{{item.contentText}}</span>
            </div>
            <div class="repairRecord-img">
              <div v-for="(v,i) in item.imgs">
                <img :src="baseUrl+v.filePath" alt="">
              </div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import *as system from '@/service/system';
  import *as complaints from '@/service/complaints';
  import recordItem from '../../components/recordItemComponent/recordItem';
  import {headerTab} from "../../components/index";
  import {baseUrl} from "../../service/configUrl.js";
  let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  export default {
    name: "repairRecord",
    components: {
      recordItem, headerTab
    },
    data() {
      return {
        baseUrl,
        tabLabels: [
          {label: '全部', value: ''},
          {label: '待受理', value: '0'},
          {label: '处理中', value: '2'},
          {label: '待回访', value: '3'},
          {label: '已完成', value: '4'},
        ],
        selectedLabel: '',
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
        myFormList: [], //列表数据
        formStatus: '-1', //报修单状态，为空默认全部
        communityId: '', //社区id
        strCur: 1, //当前页码
        strSize: 20, //页大小
      }
    },
    filters: {
      filterTime(value) {
        return value.split(' ')[0]
      },
    },
    methods: {
      //跳转到详细页
      toDelite(item) {
        console.log(item)
        this.$router.push({path: '/complaintDetails', query: {id: item.complaintId}})
      },
      //获取项目列表id
      async getProjectList() {
        let res = await system.getProjectList();
        if (res.error.err_code == 0) {
          this.communityId = res.list[0].list[0].id;
        } else {
          this.communityId = ''
        }
      },
      async onPullingDown(type) {
        console.log('下拉刷新')
        this.strCur = 1;
        await this.getFormList();
        this.$refs.scrollObj.forceUpdate();
      },
      async onPullingUp(type) {
        console.log('上拉加载')
        this.strCur++;
        await this.getFormList('more');
        await this.$refs.scrollObj.forceUpdate();
      },
      //获取数据列表
      async getFormList(type = '') {
        let params = {
          status: this.formStatus,//当前状态
          pageNo: this.strCur,//当前页数
          pageSize: this.strSize//当前条数
        };
        let res = await complaints.myComplaintList(params, userInfo.accessToken);
        console.log('getFormList', res);
        if (res.error.err_code == 0) {
          let newList = [];
          if (res.list != null) {
            newList = res.list
          }
          newList.forEach((v, i) => {
            this.tabLabels.forEach(v1 => {
              v.imgs = JSON.parse(v.imageAttachment)
              if (v.status == v1.value) {
                v.formStatus = v1.label
              }
            })
          })
          console.log(newList);
          if (type == 'more') {//加载更多
            this.myFormList = [...this.myFormList, ...newList];
          } else {
            this.myFormList = newList;
          }
          console.log(this.myFormList);
        } else {
          if(res.error.err_msg!=='暂无数据'){
            this.$createDialog({
              type: 'alert',
              title: res.error.err_msg,
              content: '',
            }).show();
          }
        }
      },
      clickHandler(value) {
        if (this.selectedLabel == value) {//选择当前已选中的tab，则不处理
          return;
        }
        console.log(value, this.selectedLabel);
        let active = this.tabLabels.find(v => {
          return v.value == value
        });
        if (active.value) {
          this.formStatus = active.value;
        } else {
          this.formStatus = -1
        }

        this.strCur = 1;
        this.getFormList();
      }
    },
    async mounted() {
      if (!userInfo || !userInfo.accessToken) {
        this.toLogin();
      } else {
        await this.getProjectList();
        this.getFormList();
      }
    }

  }
</script>

<style lang="scss" type="text/scss" scoped>
  #repairRecord {
    position: relative;
    height: 100%;
    background-color: #F9F9F9;
    padding-top: 100px;
    .operation {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10;
    }
    .tab-slide-container {
      height: calc(100% - 20px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
    }

    .repairRecord-li {
      padding: 24px;
      background-color: white;
      margin-top: 26px;
      .repairRecord-li-top {
        overflow: hidden;
      }
      .repairRecord-li-top-left {
        float: left;
        width: calc(100% - 200px);
        height: 80px;
        line-height: 80px;
        text-align: left;
        .repairRecord-ico {
          width: 60px;
          height: 60px;
          background: url("../../assets/record_ico_comp.png") no-repeat center;
          background-size: 50px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .repairRecord-li-top-right {
        float: right;
        width: 200px;
        line-height: 80px;
        text-align: right;
        font-size: 26px;
      }
      .purple {
        color: #A260A4;
      }
      .lightBlue {
        color: #06A9A8;
      }
      .yellow {
        color: #DAAC01;
      }
      .red {
        color: #E44C40;
      }

      .repairRecord-content {
        padding-left: 24px;
        .repairRecord-li-i {
          font-size: 28px;
          overflow: hidden;
          min-height: 50px;
          line-height: 50px;
          color: #333333;
          i {
            width: 12px;
            height: 12px;
            background: rgba(153, 153, 153, 1);
            opacity: 0.2;
            border-radius: 50%;
            display: inline-block;
            margin-right: 28px;
          }
          .title {
            float: right;
          }
        }
        .repairRecord-img {
          div {
            width: 150px;
            height: 150px;
            display: inline-block;
            margin-top: 14px;
            margin-right: 14px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          div:nth-child(n+4) {
            margin-right: 0;
          }
        }
      }

    }
  }
</style>
