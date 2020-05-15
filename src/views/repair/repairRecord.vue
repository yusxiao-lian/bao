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
                   :data="myFormList"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown"
                   :options="optionsScroll"
      >
        <div class="repairRecord-li" v-for="item in myFormList" @click="toDelite(item)">
          <div class="repairRecord-li-top">
            <div class="repairRecord-li-top-left">
              <i class="repairRecord-ico"></i>
              {{item.formType}}
            </div>
            <div
              :class="{'repairRecord-li-top-right':true,'purple':item.formStatus=='待审核','lightBlue':item.formStatus=='待处理','yellow':item.formStatus=='处理中','red':item.formStatus=='待评价'}">
              {{item.formStatus}}
            </div>
          </div>
          <div class="repairRecord-li-i" v-if="myFormList.length>0">
            <div>
              报修时间：{{item.createdDate | filterTime}}
            </div>
            <div v-if="selectedLabel=='3,8'||selectedLabel=='5'">
              处理人：{{item.workerName}}
              <a class="ico-phone" :href="'tel:'+item.workerMobileTel"></a>
            </div>
          </div>
          <div class="repairRecord-li-l">报修问题：{{item.contentText}}</div>
        </div>
      </cube-scroll>
    </div>
    <bottomButton class="operation" bgColor="white" @click="$router.push('/repairApply')">新增报修</bottomButton>
  </div>
</template>

<script>
  import *as system from '@/service/system';
  import *as repair from '@/service/repair';
  import recordItem from '../../components/recordItemComponent/recordItem';
  import {bottomButton, headerTab} from "../../components/index";

  export default {
    name: "repairRecord",
    components: {
      recordItem, bottomButton, headerTab
    },
    data() {
      return {
        tabLabels: [
          {label: '全部', value: ''},
          {label: '待受理', value: '0'},
          {label: '已受理', value: '1,2'},
          {label: '维修中', value: '3,8'},
          {label: '待评价', value: '5'},
        ],
        userInfo: {},
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
        formStatus: '', //报修单状态，为空默认全部
        communityId: '', //社区id
        strCur: 1, //当前页码
        strSize: 10, //页大小
      }
    },
    filters: {
      filterTime(value) {
        return value.split(' ')[0]
      },
      /*filterStatus(value){
        let str = ''
        switch (value){
          case '0':
            str='待受理'
            break
          case '1':
            str='待受理'
            break
          case '2':
            str='待受理'
            break
          case '3':
            str='待受理'
            break
          case '4':
            str='待受理'
            break
          case '5':
            str='待受理'
            break
          case '6':
            str='待受理'
            break
          case '7':
            str='待受理'
            break
        }
      }*/
    },
    methods: {
      fnexit() {
        this.$router.push('/personalMessage')
      },
      //跳转到详细页
      toDelite(item) {
        console.log(item)
        this.$router.push({path: '/repairProgress', query: {id: item.id, formStatus: this.formStatus}})
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
        this.$refs.scrollObj.forceUpdate();
      },
      //获取数据列表
      async getFormList(type = '') {
        let params = {
          communityId: this.userInfo.communityId,
          formStatus: this.formStatus,
          strCur: this.strCur,
          strSize: this.strSize
        };
        let res = await repair.getFormList(params, this.userInfo.accessToken);
        console.log('getFormList', res);
        if (res.error.err_code == 0) {
          let newList = [];
          if (res.obj != null) {
            newList = res.obj.myFormList
          }
          if (type == 'more') {//加载更多
            this.myFormList = [...this.myFormList, ...newList];
          } else {
            this.myFormList = newList;
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: res.error.err_msg,
            content: '',
          }).show();
        }
      },
      clickHandler(value) {
        console.log(value);
        if (this.selectedLabel == value) {//选择当前已选中的tab，则不处理
          return;
        }
        this.selectedLabel = value
        let active = this.tabLabels.find(v => {
          return v.value == value
        });
        this.formStatus = active.value;
        this.strCur = 1;
        this.getFormList();
        console.log(this.selectedLabel, '=====');
      }
    },
    async mounted() {
      if (this.$route.query.formStatus) {
        this.formStatus = this.$route.query.formStatus
        this.selectedLabel = this.$route.query.formStatus
      }
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      } else {
        //await this.getProjectList();
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
      height: calc(100% - 234px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
    }

    .repairRecord-li {
      height: 264px;
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
          width: 50px;
          height: 50px;
          background: url("../../assets/baoxiu-ico.png") no-repeat center;
          background-size:contain;
          display: inline-block;
          vertical-align: middle;
        }
      }

      .repairRecord-li-top-right {
        float: right;
        width: 200px;
        line-height: 80px;
        text-align: right;
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

      .repairRecord-li-i {
        font-size: 28px;
        margin-top: 20px;
        overflow: hidden;

        > div {
          float: left;
          min-width: 50%;
          height: 50px;
          line-height: 50px;
          color: #333333;

          .ico-phone {
            display: inline-block;
            vertical-align: top;
            width: 45px;
            height: 45px;
            background: url("../../assets/shop-phone.png") no-repeat center;
            background-size: 45px;
          }
        }
      }

      .repairRecord-li-l {
        font-size: 28px;
        margin-top: 20px;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 50px;
        line-height: 50px;
        display: block;
        width: 100%;
      }
    }
  }
</style>
