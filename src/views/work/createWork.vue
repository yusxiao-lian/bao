<template>
  <div id="createWork">
    <headerTab :title="$route.meta.title" />
    <div class="createWork-content">
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>来源</span>
        </div>
        <div class="rightContent">
          <!-- <span class="selectBtn currentBtn">业主工单</span>
          <span class="selectBtn">员工自查</span> -->
          <span v-for="(item,index) in workorder.source" :key="index" :class="[selectBtn,{currentBtn: index === currentBtn}]" @click="handleSource(index)">{{item}}</span>

        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>渠道</span>
        </div>
        <div class="rightContent">
          <!-- <span class="selectBtn currentBtn">业主来访</span>
          <span class="selectBtn">业主来电</span>
          <span class="selectBtn">微信沟通</span> -->
          <span v-for="(item,index) in workorder.channel" :key="index" :class="[selectBtn,{currentBtn: index === currentBtn2}]" @click="handleChannel(index)">{{item.name}}</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>种类</span>
        </div>
        <div class="rightContent">
          <!-- <span class="selectBtn currentBtn">入户维修</span> -->
          <span v-for="(item,index) in workorder.type" :key="index" :class="[selectBtn,{currentBtn: index === currentBtn3}]" @click="handleType(index)">{{item.name}}</span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>位置</span>
        </div>
        <div class="rightContent">
          <span class="contentArea" @click="choosePosition">{{position?position:'请选择位置'}}</span>
          <!-- <router-link to='/selectPosition' class="contentArea">{{workorder.position?workorder.position:'请选择位置'}}</router-link> -->
          <span class="rightArrow"></span>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>报单人</span>
        </div>
        <div class="rightContent">
          <!-- <span class="contentArea">陶大然</span> -->
          <input type="text" class="contentArea" v-model="workorder.repairName">
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>联系电话</span>
        </div>
        <div class="rightContent">
          <!-- <span class="contentArea">13535353535</span> -->
          <input type="text" v-model="workorder.phone" class="contentArea">
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i>*</i>
          <span>详情</span>
        </div>
        <div class="rightContent2">
          <textarea placeholder="请在此填写您需要登记的问题详情" v-model="workorder.detail"></textarea>
        </div>

        <div class="rightContent"></div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>上传照片</span>
        </div>
        <div class="rightContent">
          <div class="repairApply-content-img">
            <div class="repairApply-content-img-item">
              <img alt />
              <i></i>
            </div>
            <div class="repairApply-content-img-item">
              <label for="male">
                <input id="male" type="file" accept="image/*" @change="uploadImg"/>
                <img src="../../assets/upload.png" alt />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="cells">
        <div class="leftContent">
          <i></i>
          <span>上传视频</span>
        </div>
        <div class="rightContent">
          <div class="repairApply-content-img">
            <div class="repairApply-content-img-item">
              <img alt />
              <i></i>
            </div>
            <div class="repairApply-content-img-item">
              <label for="male">
                <input  type="file" accept="audio/*"  id="video"/>
                <img src="../../assets/upload.png" alt />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <bottomButton2 class="operation" bgcolor="white">提交</bottomButton2>
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";
import { appGetRepairSource,appGetRepairType } from "@/service/work"


export default {
  name: "createWork",
  components: {
    headerTab,
    bottomButton2
  },
  data() {
    return {
      currentBtn: 0,
      currentBtn2: 0,
      currentBtn3: 0,
      selectBtn: 'selectBtn',
      position: '',
      workorder: {
        source: [ "业主工单","员工工单" ], // 来源
        channel: [], // 渠道
        type: [], //种类
        position: '', // 位置
        repairName: '',
        phone: '',
        detail: ''
      },
      // 存储选择信息
      workInfo: {
        source: 0,
        channel: 0,
        type: 0
      }
    };
  },
  methods: {
    handleSource (index) {
      this.currentBtn = index
      this.workInfo.source = index
    },
    handleChannel(index){

      this.currentBtn2 = index
      this.workInfo.channel = index
    },
    handleType(index){
      this.currentBtn3 = index
      this.workInfo.type = index
    },
    choosePosition () {
      this.$router.push({
        path: '/selectProject',
        query: {
          workInfo: this.workInfo
        }
      })
    },
    uploadImg ($event) {
      var vid = document.getElementById('video')
      console.log($event)
      console.log($event.target.files)
    }
    
  },
  async mounted () {
    // await this.appGetRepairSource()
    // 报修渠道
    let source = await appGetRepairSource()
    this.workorder.channel = source.list
    // 工单种类
    let type = await appGetRepairType()
    this.workorder.type = type.list
    console.log(this.workorder)
    console.log(this.$route.query)

    // 判断状态
    console.log(this.$route.query.workInfo.source)
    if (this.$route.query.allInfo.toname) {
      this.position = this.$route.query.allInfo.toname
    }
    if(this.$route.query.workInfo.source || this.$route.query.workInfo.channel || this.$route.query.workInfo.type) {
      this.workInfo = this.$route.query.workInfo
      this.currentBtn = this.workInfo.source
      this.currentBtn2 = this.workInfo.channel
      this.currentBtn3 = this.workInfo.type
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
#createWork {
  height: calc(100% - 100px);
  overflow: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 80px;
  .createWork-content {
    width: 750px;
    background: #ffffff;
    overflow: hidden;
    .cells {
      padding: 30px 30px 10px 30px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      flex-wrap: wrap;
      .leftContent {
        width: 160px;
        height: 60px;
        line-height: 60px;
        display: flex;
        flex-wrap: wrap;
        i {
          width: 15px;
          font-size: 30px;
          color: rgba(253, 99, 72, 1);
          vertical-align: middle;
        }
        span {
          font-size: 28px;
          color: rgba(117, 117, 117, 1);
        }
      }
      .rightContent {
        position: relative;
        width: 530px;
        display: flex;
        flex-wrap: wrap;
        .selectBtn {
          margin-right: 20px;
          margin-bottom: 20px;
          width: 160px;
          height: 60px;
          line-height: 60px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(204, 204, 204, 1);
          border-radius: 30px;
          font-size: 26px;
          color: #1a1a1a;
          text-align: center;
        }
        .selectBtn:nth-child(3n) {
          margin-right: 0;
        }
        .currentBtn {
          width: 160px;
          height: 60px;
          background: #29b0f9;
          border: 1px solid #29b0f9;
          border-radius: 30px;
          font-size: 26px;
          color: #ffffff;
        }
        .contentArea {
          margin-bottom: 20px;
          width: 480px;
          // height: 60px;
          line-height: 60px;
          color: #1a1a1a;
        }
        .rightArrow {
          position: absolute;
          right: 10px;
          top: 40%;
          display: inline-block;
          content: "";
          width: 20px;
          height: 20px;
          border: solid #999;
          border-width: 3px 3px 0 0;
          -webkit-transform: translate(0, -50%) rotate(45deg);
          transform: translate(0, -50%) rotate(45deg);
        }
        .repairApply-content-img {
          .repairApply-content-img-item {
            width: 150px;
            height: 150px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 20px;
            position: relative;
            img {
              width: 154px;
              height: 154px;
              position: absolute;
              top: 0;
            }
            i {
              width: 32px;
              height: 32px;
              display: inline-block;
              background-image: url("../../assets/img/cha.png");
              position: absolute;
              right: -16px;
              top: -16px;
              z-index: 2;
              background-size: cover;
            }
            label {
              width: 154px;
              height: 154px;
              input {
                width: 154px;
                height: 154px;
                display: inline-block;
                position: absolute;
                top: 0;

                z-index: 3;
                display: none;
              }
            }
          }
          .repairApply-content-img-item:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
      .rightContent2 {
        width: 650px;
        padding: 30px 20px;
        line-height: 1.5;
        color: #b6b6b6;
        font-size: 28px;
        display: block;
        textarea {
          width: 100%;
        }
      }
    }
        .cells:last-child{
        border-bottom: 0;
    }
  }
}
</style>
