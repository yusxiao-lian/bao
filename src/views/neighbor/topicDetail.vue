<template>
  <div class="topic-detail">
    <headerTab :title="$route.meta.title" />
    <div class="header"></div>
    <div class="topic-content">
      <div class="item">
        <scrollList
          ref="scrollList"
          :dataList="topicList"
          :pullDownRefresh="false"
          @onPullingUp="onPullingUpGet"
        >
          <div>
            <div class="header">
              <div class="left">
                <!-- <img v-if="topicDetail.creatorImgSrc" :src="topicDetail.creatorImgSrc" alt />
                <img v-else src="@/assets/neighbor/ste_ico_head.png" alt />-->
                <div class="header-img-box">
                  <!-- <img src="@/assets/chatimg/c.jpg" alt /> -->
                  <img v-if="topicDetail.creatorImgSrc" :src="topicDetail.creatorImgSrc" alt />
                  <img v-else src="@/assets/neighbor/ste_ico_head.png" alt />
                </div>
                <p class="nick-name">{{topicDetail.creatorFullName}}</p>
              </div>
              <p class="date">{{topicDetail.createdDate}}</p>
            </div>
            <div class="msg">
              <div class="text">{{topicDetail.contentText}}</div>
              <div class="img-box">
                <!-- <img
                  :src="img"
                  v-for="(img, index) in imgs"
                  :key="img"
                  @click="handleImgsClick(index)"
                />-->
                <!-- <div>
                  <img src="../../assets/neighbor/addPicture.png" alt />
                </div>
                <div>
                  <img src="../../assets/purple.png" alt />
                </div>
                <div>
                  <img src="../../assets/chatimg/new.gif" alt />
                </div>-->
                <div v-for="(img, index) in imgs" :key="img" @click="handleImgsClick(index)">
                  <img :src="img" alt />
                </div>
                <!-- <img src="../../assets/neighbor/addPicture.png" alt /> -->
              </div>
            </div>
            <div class="btn-box">
              <div class="item" @click="showPopup('commentPopup',topicDetail.id)">
                <img src="../../assets/neighbor/news.png" alt />
                <p class="label">评论</p>
              </div>
              <p class="line">|</p>
              <div class="item" @click="issueThumbsUp(topicDetail.id)">
                <img v-if="!topicDetail.hasGood" src="../../assets/neighbor/heart.png" alt />
                <img v-if="topicDetail.hasGood" src="../../assets/neighbor/heart_active.png" alt />
                <p class="label">({{topicDetail.goodSum}})</p>
              </div>
              <p class="line">|</p>
              <div class="item" @click="shareItem">
                <img src="../../assets/neighbor/share.png" alt />
                <p class="label">分享</p>
              </div>
            </div>
            <div class="bottom-line"></div>
          </div>
          <div class="comment" v-for="(item,index) in topicDetail.comms" :key="index">
            <img v-if="item.creatorImgSrc" class="left" :src="item.creatorImgSrc" alt />
            <img v-else src="@/assets/neighbor/ste_ico_head.png" alt />

            <div class="right">
              <div class="header-comment">
                <p class="nick-name">{{item.creatorFullName}}</p>
                <p class="date">{{item.createdDate}}</p>
              </div>
              <p class="comment-msg">{{item.contentText?item.contentText:''}}</p>
            </div>
          </div>
          <div class="bottom-line"></div>
        </scrollList>
        <!-- <div class="bot-box">
          <input v-model="commentValue" placeholder="我要评论" type="text" />
          <div class="comment-btn" @click="issueComment">发送</div>
        </div>-->
      </div>
    </div>
    <cube-popup type="comment-popup" ref="commentPopup" @mask-click="commentMaskClick">
      <div class="popup-box">
        <p class="popup-header">发布评论</p>
        <textarea class="msg-input" placeholder="请输入您的评论" v-model="commentValue"></textarea>
        <div class="btn-issue" @click="issueComment">发布</div>
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
import router from "../../router";
import { baseUrl } from "../../service/configUrl.js";

export default {
  components: {
    scrollList,
    headerTab
  },
  data() {
    return {
      baseUrl,
      isShow: false,
      commentValue: "",
      selectedLabel: "",
      // --------------------------
      topicDetail: {},
      topicList: [1, 2, 3],
      initialIndex: 0,
      imgs: [
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0mpd5uj21hc0tyws2.jpg",
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0ncnnej21hc0zetxo.jpg",
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0ncnnej21hc0zetxo.jpg",
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0ncnnej21hc0zetxo.jpg",
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0ncnnej21hc0zetxo.jpg",
        // "https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0mqvu5j21hc0zkgzz.jpg"
      ]
    };
  },
  created() {
    router.beforeEach((to, from, next) => {
      console.log(from);
      if (from.path == "/topicDetail" || from.path == "/relTopic") {
        to.query.pageFrom = "topicDetail";
        if (this.selectedLabel) {
          console.log(this.selectedLabel);
          to.query.pageFromSelectedLabel = this.selectedLabel;
        }
      }
      if (from.path == "/myTopic" || from.path == "/myComment") {
        to.query.pageFrom = "myTopic";
      }
      console.log(to);
      return next();
    });
    // ---------------------
    this.getTopicDetail(this.$route.query.topicId);
    if (this.$route.query.selectedLabel) {
      this.selectedLabel = this.$route.query.selectedLabel;
    }
  },
  methods: {
    async getTopicDetail(id) {
      let res = await api.topicDetail({ tid: id });
      if (res.error.err_code === "0") {
        this.topicDetail = res.obj;
        this.imgs = res.obj.images;
        this.flag = true;

        if (res.obj.list.length == 0) {
          this.$refs.scrollList.forceUpdate();
        }
      }
    },
    async issueThumbsUp(id) {
      let res = await api.topicThumbsUp({ topicId: id });
      if (res.error.err_code === "0") {
        this.getTopicDetail(this.$route.query.topicId);
      }
    },
    async issueComment() {
      let res = await api.commentSave({
        topicId: this.topicDetail.id,
        commentTitle: "",
        contentText: this.commentValue
      });
      if (res.error.err_code === "0") {
        this.Toast("已提交成功，待审核生效显示！");
        this.commentValue = "";
        this.getTopicDetail(this.$route.query.topicId);
        const component = this.$refs["commentPopup"];
        component.hide();
      }
    },
    shareItem() {
      this.isShow = true;
      console.log(this.topicDetail);
      this.shareWx({
        title: this.topicDetail.contentText,
        content: this.topicDetail.contentText,
        href: this.topicDetail.url,
        imgPath: this.baseUrl + "/static/h5/wechat/e.png"
      });
    },
    hideShow() {
      this.isShow = false;
    },
    // goBack() {
    //   this.$router.push("/top");
    // },
    showPopup(refId, id) {
      const component = this.$refs[refId];
      component.show();
      this.currentTopicId = id;
    },
    commentMaskClick() {
      const component = this.$refs["commentPopup"];
      component.hide();
      this.commentValue = "";
    },
    onPullingUpGet() {
      this.$refs.scrollList.forceUpdate();
    },
    handleImgsClick(index) {
      this.initialIndex = index;
      const params = {
        $props: {
          imgs: this.imgs,
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
    }
  }
};
</script>

<style lang="scss" scoped>
.topic-detail {
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
          line-height: 210px;
          margin: 8px 8px;
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
      border-top: 1px solid #f8f8f8;
      .left {
        display: block;
        width: 88px;
        height: 88px;
        border-radius: 88px;
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
            float: right;
            font-size: 24px;
            color: #999999;
          }
        }
        .comment-msg {
          padding-top: 30px;
          font-size: 28px;
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
  .bot-box {
    height: 120px;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background-color: #fff;
    input {
      flex: 1;
    }
    .comment-btn {
      width: 180px;
      height: 80px;
      background: rgba(240, 65, 52, 1);
      border-radius: 4px;
      font-size: 32px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 80px;
      text-align: center;
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
}
</style>