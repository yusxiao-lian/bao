<template>
  <div class="my-comment">
    <headerTab :title="$route.meta.title" />
    <div class="header"></div>
    <div class="content">
      <scrollList
        ref="scrollList"
        :dataList="dataList"
        :pullDownRefresh="false"
        @onPullingUp="onPullingUpGet"
      >
        <div class="comment-msg">
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <div class="msg-header">
              <div class="left">
                <!-- <img :src="item.creatorImgSrc" alt /> -->
                <div class="header-img-box">
                  <!-- <img src="@/assets/chatimg/c.jpg" alt /> -->
                  <img v-if="item.creatorImgSrc" :src="item.creatorImgSrc" alt />
                  <img v-else src="@/assets/neighbor/ste_ico_head.png" alt />
                </div>
                <div class="date">
                  <p class="f-28">{{item.creatorFullName}}</p>
                  <p class="f-24">{{item.createdDate}}</p>
                </div>
              </div>
              <div class="btn-delete" @click="deleteCommentItem(item.id)">删除</div>
            </div>
            <div class="reply">{{item.contentText}}</div>
            <div class="proplastid" @click="toTopicDetail(item.topicId)">原帖：{{item.topicText}}</div>
            <div class="read-num">
              <p>{{item.topicCommentSum}}评论</p>
              <!-- <p>62阅读</p> -->
            </div>
          </div>
        </div>
      </scrollList>
    </div>
  </div>
</template>

<script>
import scrollList from "@/components/scrollList";
import { headerTab } from "../../components/index";
import * as api from "../../service/neighbor/index.js";

export default {
  components: {
    scrollList,
    headerTab
  },
  data() {
    return {
      dataList: [],
      formData: {
        cur: 1,
        size: 5,
        listOver: false,
        flag: true
      }
    };
  },
  created() {
    this.getSelfComment();
  },
  methods: {
    async getSelfComment() {
      let res = await api.selfComment(this.formData);
      if (res.error.err_code === "0") {
        this.dataList.push(...res.obj.datas);
        this.flag = true;
        if (res.obj.datas.length == 0) {
          this.listOver = true;
        }
      }
    },
    async deleteCommentItem(id) {
      let res = await api.delComment({ ids: id });
      this.Toast("删除成功！");
      if (res.error.err_code === "0") {
        this.dataList.map((item, index) => {
          if (item.id == id) {
            console.log(index);
            this.dataList.splice(index, 1);
          }
        });
      }
    },
    toTopicDetail(id) {
      this.$router.push({ name: "topicDetail", query: { topicId: id } });
    },
    onPullingUpGet() {
      if (this.listOver) {
        this.flag = false;
        this.$refs.scrollList.forceUpdate();
      }
      if (this.flag) {
        this.flag = false;
        this.formData.cur += 1;
        this.getSelfComment();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.my-comment {
  .header {
    height: 100px;
  }
  .item {
    padding-top: 30px;
    margin: 0 30px;
    border-bottom: 1px solid #f8f8f8;
    .msg-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        .header-img-box {
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          border-radius: 88px;
          overflow: hidden;
        }
        img {
          height: auto;
          max-width: 88px;
        }
        .date {
          p {
            font--: bold;
            color: #999999;
            line-height: 44px;
            padding-left: 20px;
          }
        }
      }
      .btn-delete {
        width: 120px;
        height: 54px;
        line-height: 54px;
        text-align: center;
        background: #a260a4;
        border-radius: 27px;
        font-size: 28px;
        color: #ffffff;
      }
    }
    .reply {
      font-size: 32px;
      font--: bold;
      color: #1a1a1a;
      line-height: 48px;
      padding: 10px 0;
    }
    .proplastid {
      font-size: 32px;
      font--: bold;
      color: #1a1a1a;
      line-height: 48px;
      background-color: #f8f8f8;
      padding: 10px 0;
    }
    .read-num {
      height: 88px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      font-size: 26px;
      font--: bold;
      color: #969696;
      p {
        padding-left: 30px;
      }
    }
  }
  .f-28 {
    font-size: 28px;
  }
  .f-24 {
    font-size: 24px;
  }
}
</style>