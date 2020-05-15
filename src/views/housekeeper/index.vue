<template>
  <div class="housekeeper_index">
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
                   :options="optionsScroll"
                   @change="clickHandler">
        <div class="repairRecord-li" v-for="(item,index) in myFormList" :key="index">
          <merchants :item="item" v-if="selectedLabel=='2'"></merchants>
          <convenience :item="item"  v-if="selectedLabel=='1'"></convenience>
          <housekeeper :item="item"  v-if="selectedLabel==''"></housekeeper>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";
  import merchants from "./merchants.vue";//周边商家
  import convenience from "./convenience.vue";//便民服务
  import housekeeper from "./housekeeper.vue";//联系管家
  import * as api from "../../service/merchants";

  export default {
    name: "housekeeper_index",
    components: {
      headerTab,
      merchants,
      convenience,
      housekeeper
    },
    data() {
      return {
        userInfo: '',
        selectedLabel: '',
        tabLabels: [
          {label: '管家服务', value: ''},
          {label: '便民电话', value: '1'},
          {label: '周边商家', value: '2'},
        ],
        optionsScroll: {
          // pullDownRefresh: {
          //   threshold: 60,
          //   txt: '刷新成功'
          // },
          // pullUpLoad: {
          //   threshold: 40,
          //   txt: {
          //     more: '加载中....',
          //     noMore: '没有更多内容了'
          //   }
          // },
          click: true,
          scrollbar: true
        },
        myFormList: [
        ], //列表数据
      }
    },
    created() {
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if(!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      }
      this.agreement()
    },
    methods: {
      clickHandler(type) {
        this.selectedLabel = type
        this.myFormList=[]
        this.agreement()
      },

      // 获取周边商家与便民服务
      async agreement() {
        let params = {
          cid: this.userInfo.communityId,
          type: this.selectedLabel,
        };
        let res
        if (this.selectedLabel) {
          res = await api.communityConvenience(params);
        } else {
          res = await api.myHousekeeper(params);
        }
        if (res.error.err_code == 0) {
          console.log(res);
          this.myFormList = res.list
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
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .housekeeper_index {
    height: 100%;
    background-color: rgba(249, 249, 249, 1);
    padding-top: 100px;

    .tab-slide-container {
      height: calc(100% - 104px);
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
  }
</style>

