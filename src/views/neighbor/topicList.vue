<template>
  <div class="topic-list">
    <headerTab :showBackArrow="false" :title="'话题列表'">
      <div slot="right" @click="toTopicAdd">
        <img class="header-tab-img" src="../../assets/neighbor/chat_ico_add.png" alt />
      </div>
    </headerTab>
    <div class="header"></div>
    <cube-tab-bar
      v-model="selectedLabel"
      showSlider
      ref="tabNav"
      :data="tabLabels"
      @change="changeHandler"
    ></cube-tab-bar>
    <scrollList
      ref="scrollList"
      :dataList="topicList"
      :pullDownRefresh="false"
      @onPullingUp="onPullingUpGet"
    >
      <div v-if="topicList.length>0" class="topic-content">
        <div class="item" v-for="(item,index) in topicList" :key="index">
          <div class="header">
            <div class="left">
              <!-- <img v-if="item.creatorImgSrc" :src="item.creatorImgSrc" alt /> -->
              <!-- <img v-else src="@/assets/neighbor/ste_ico_head.png" alt /> -->
              <div class="header-img-box">
                <!-- <img src="@/assets/chatimg/c.jpg" alt /> -->
                <img v-if="item.creatorImgSrc" :src="item.creatorImgSrc" alt />
                <img v-else src="@/assets/neighbor/ste_ico_head.png" alt />
              </div>
              <p class="nick-name">{{item.creatorFullName}}</p>
            </div>
            <p class="date">{{item.createdDate}}</p>
          </div>
          <div class="msg" @click="toTopicDetail(item.id,selectedLabel)">
            <div class="text">{{item.contentText}}</div>
            <div class="img-box">
              <!-- <div>
                <img src="../../assets/neighbor/addPicture.png" alt />
              </div>
              <div>
                <img src="../../assets/purple.png" alt />
              </div>
              <div>
                <img src="../../assets/photo.jpg" alt />
              </div>-->
              <!-- @click="handleImgsClick(index)" -->
              <div v-for="(itemImg,index) in item.images" :key="index">
                <img :src="itemImg" alt />
              </div>
              <!-- <img v-for="(itemImg,index) in item.images" :key="index" :src="itemImg" alt /> -->
              <!-- <img src="../../assets/neighbor/addPicture.png" alt />
              <img src="../../assets/purple.png" alt />
              <img src="../../assets/photo.jpg" alt />-->
            </div>
          </div>
          <div class="btn-box">
            <div class="item" @click="showPopup('commentPopup',item.id)">
              <img src="../../assets/neighbor/news.png" alt />
              <p class="label">评论</p>
            </div>
            <p class="line">|</p>
            <div class="item" @click="issueThumbsUp(item)">
              <img v-if="item.hasGood" src="../../assets/neighbor/heart_active.png" alt />
              <img v-if="!item.hasGood" src="../../assets/neighbor/heart.png" alt />
              <p class="label">({{item.goodSum}})</p>
            </div>
            <p class="line">|</p>
            <div class="item" @click="shareItem(item)">
              <img src="../../assets/neighbor/share.png" alt />
              <p class="label">分享</p>
            </div>
            <p class="line">|</p>
            <div class="item" @click="showPopup('reportPopup',item.id)">
              <img src="../../assets/neighbor/report.png" alt />
              <p class="label">举报</p>
            </div>
          </div>
          <div v-for="(itemComm,index) in item.comms" :key="index" class="comment">
            <img v-if="itemComm.creatorImgSrc" class="left" :src="itemComm.creatorImgSrc" alt />
            <img v-else class="left" src="@/assets/neighbor/ste_ico_head.png" alt />
            <div class="right">
              <div class="header-comment">
                <p class="nick-name">{{itemComm.creatorFullName?itemComm.creatorFullName:''}}</p>
                <p class="date">{{itemComm.createdDate?itemComm.createdDate:''}}</p>
              </div>
              <p class="comment-msg">{{itemComm.contentText?itemComm.contentText:''}}</p>
            </div>
          </div>
          <div class="bottom-line"></div>
        </div>
      </div>
      <div v-else class="topic-content-nu">
        <p>暂无数据</p>
      </div>
    </scrollList>
    <cube-popup type="comment-popup" ref="commentPopup" @mask-click="commentMaskClick">
      <div class="popup-box">
        <p class="popup-header">发布评论</p>
        <textarea class="msg-input" placeholder="请输入您的评论" v-model="commentValue"></textarea>
        <div class="btn-issue" @click="issueComment">发布</div>
      </div>
    </cube-popup>
    <cube-popup type="report-popup" ref="reportPopup" @mask-click="reportMaskClick">
      <div class="popup-box">
        <p class="popup-header">话题举报</p>
        <textarea class="msg-input" placeholder="请输入举报原因" v-model="reportValue"></textarea>
        <div class="btn-issue" @click="issueReport">发布</div>
      </div>
    </cube-popup>
    <div id="maskPointer" v-if="isShow" @click="hideShow">
      <div class="arrow">
        <img src="../../assets/img/guide.png" />
      </div>
      <div class="text">
        点击右上角菜单，
        <br />在
        <span>分享</span>链接
      </div>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import scrollList from "@/components/scrollList";
import * as api from "../../service/neighbor/index.js";
import { baseUrl } from "../../service/configUrl.js";
export default {
  props: ["pageFromSelectedLabel"],
  components: {
    scrollList,
    headerTab
  },
  data() {
    return {
      listOver: false,
      flag: true,
      isShow: false,
      selectedLabel: "",
      tabLabels: [],
      userInfo: {},
      commentValue: "",
      reportValue: "",
      value: "",
      topicList: [],
      initialIndex: 0,
      listForm: {
        cur: 1,
        size: 10,
        categoryId: "",
        communityId: ""
      },
      currentTopicId: "",
      baseUrl
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.listForm.communityId = this.userInfo.communityId;
    // this.getTopicList();
    this.getCategoryList();
  },
  methods: {
    changeHandler(val) {
      this.listOver = false;
      this.flag = true;
      this.topicList = [];
      this.listForm.cur = 1;
      this.listForm.categoryId = val;
      this.getTopicList();
    },
    async getTopicList() {
      let res = await api.topicList(this.listForm);
      if (res.error.err_code === "0") {
        this.topicList.push(...res.obj.list);
        this.flag = true;
        if (res.obj.list.length == 0) {
          this.listOver = true;
        }
      }
    },
    async getCategoryList() {
      let res = await api.categoryList();
      console.log(res);
      if (res.error.err_code === "0") {
        if (this.pageFromSelectedLabel) {
          this.selectedLabel = this.pageFromSelectedLabel;
        } else {
          this.selectedLabel = res.list[0].id;
        }
        res.list.map(item => {
          item.label = item.name;
          item.value = item.id;
        });
        this.tabLabels = res.list;
        this.listForm.categoryId = this.selectedLabel;
        this.getTopicList();
      }
    },
    toTopicAdd() {
      this.$router.push({ name: "relTopic" });
    },
    shareItem(item) {
      this.isShow = true;
      console.log(this.baseUrl);
      this.shareWx({
        title: item.contentText,
        content: item.contentText,
        href: item.url,
        imgPath: this.baseUrl + "/static/h5/wechat/e.png"
      });
    },
    hideShow() {
      this.isShow = false;
    },
    // 图片放大
    handleImgsClick(index) {
      this.initialIndex = index;
      const params = {
        $props: {
          imgs: this.topicList,
          initialIndex: "initialIndex", // 响应式数据的key名
          loop: false
        },
        $events: {
          change: i => {
            // 必须更新 initialIndex
            this.initialIndex = i;
          }
        }
      };
      this.$createImagePreview({ ...params }).show();
    },
    onPullingUpGet() {
      if (this.listOver) {
        this.flag = false;
        this.$refs.scrollList.forceUpdate();
      }
      if (this.flag) {
        this.flag = false;
        this.listForm.cur += 1;
        this.getTopicList();
      }
    },
    showPopup(refId, id) {
      const component = this.$refs[refId];
      component.show();
      this.currentTopicId = id;
    },
    toTopicDetail(id, selectedLabel) {
      this.$router.push({
        name: "topicDetail",
        query: { topicId: id, selectedLabel: selectedLabel }
      });
    },
    async issueComment() {
      let res = await api.commentSave({
        topicId: this.currentTopicId,
        commentTitle: "",
        contentText: this.commentValue
      });
      if (res.error.err_code === "0") {
        const component = this.$refs["commentPopup"];
        component.hide();
        this.Toast("已提交成功，待审核生效显示！");
        this.commentValue = "";
      }
    },
    async issueReport() {
      let res = await api.reportSave({
        targetId: this.currentTopicId,
        targetType: 0,
        contentText: this.reportValue
      });
      if (res.error.err_code === "0") {
        const component = this.$refs["reportPopup"];
        component.hide();
        this.Toast("举报成功！");
        this.reportValue = "";
      }
    },
    async issueThumbsUp(item) {
      let res = await api.topicThumbsUp({ topicId: item.id });
      if (res.error.err_code === "0") {
        // this.getTopicList();
        if (item.hasGood) {
          item.goodSum = item.goodSum - 1;
          item.hasGood = !item.hasGood;
        } else {
          item.goodSum = item.goodSum + 1;
          item.hasGood = !item.hasGood;
        }
      }
    },
    commentMaskClick() {
      const component = this.$refs["commentPopup"];
      component.hide();
      this.commentValue = "";
    },
    reportMaskClick() {
      const component = this.$refs["reportPopup"];
      component.hide();
      this.reportValue = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.topic-list {
  .header-tab-img {
    width: 46px;
    height: 46px;
  }
  .header {
    height: 100px;
  }
  .item {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 138px;
      box-sizing: border-box;
      margin: 30px;
      margin-bottom: 0;
      padding-bottom: 30px;
      border-bottom: 1px solid #f8f8f8;
      .left {
        display: flex;
        align-items: center;
        .header-img-box {
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          border-radius: 88px;
          overflow: hidden;
        }
        img {
          max-width: 88px;
          height: auto;
          // border-radius: 44px;
        }
        .nick-name {
          font-size: 36px;
          font--: bold;
          color: #1a1a1a;
          padding-left: 20px;
        }
      }
      .date {
        font-size: 24px;
        font--: bold;
        color: #999999;
      }
    }
    .msg {
      padding: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #f8f8f8;
      .text {
        font-size: 32px;
        font--: bold;
        color: rgba(67, 67, 67, 1);
        line-height: 46px;
      }
      .img-box {
        padding-top: 30px;
        display: flex;
        flex-wrap: wrap;
        div {
          width: 210px;
          height: 210px;
          margin: 0px 8px;
          line-height: 210px;
          overflow: hidden;
        }
        img {
          max-width: 210px;
          height: auto;
          display: inline-block;
        }
      }
    }
    .btn-box {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f8f8f8;
      .item {
        height: 100px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 36px;
          height: 32px;
        }
        .label {
          font-size: 28px;
          font-weight: 500;
          color: #888;
        }
      }
      .line {
        color: #dddddd;
      }
    }
    .comment {
      display: flex;
      padding: 30px;
      .left {
        width: 88px;
        height: 88px;
        border-radius: 44px;
      }
      .right {
        flex: 1;
        padding-left: 20px;
        .header-comment {
          display: flex;
          justify-content: space-between;
          .nick-name {
            font-size: 28px;
            font--: bold;
            color: #1a1a1a;
          }
          .date {
            font-size: 24px;
            font--: bold;
            color: #999999;
          }
        }
        .comment-msg {
          padding-top: 30px;
          font-size: 28px;
          font--: bold;
          color: #1a1a1a;
          line-height: 36px;
        }
      }
    }
    .bottom-line {
      height: 30px;
      background-color: #f8f8f8;
    }
  }
  .popup-box {
    width: 630px;
    height: 530px;
    background: #ffffff;
    border-radius: 10px;
    text-align: center;
    .popup-header {
      font-size: 36px;
      font-weight: 400;
      color: #000000;
      line-height: 46px;
      padding-top: 50px;
    }
    .msg-input {
      width: 570px;
      height: 250px;
      margin: 20px;
      border: transparent;
      flex: 1;
      outline: none;
      font-size: 30px;
      font-weight: 500;
      // color: rgba(180, 188, 204, 1);
      line-height: 44px;
      color: #333;
      background-color: #f6f6f6;
    }
    .btn-issue {
      width: 430px;
      height: 70px;
      margin: 0 auto;
      background: #a260a4;
      border-radius: 35px;
      line-height: 70px;
      text-align: center;
      font-size: 32px;
      font-weight: 400;
      color: #ffffff;
      margin-top: 28px;
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
    padding: 50px 30px 30px 30px;
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
  .topic-content-nu {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }
}
</style>
<style lang="scss">
.topic-list {
  .cube-tab_active {
    color: #a260a4 !important;
  }
  .cube-tab-bar-slider {
    background-color: #a260a4 !important;
  }
}
</style>