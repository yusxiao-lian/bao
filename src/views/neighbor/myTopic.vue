<template>
  <div class="my-topic">
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
            <div class="date">
              <p class="date-d">{{item.createdDateD}}</p>
              <p class="date-m">{{item.createdDateM}}月</p>
            </div>
            <div class="detail">
              <div class="header">
                <p class="nickname">{{item.creatorFullName}}</p>
                <div class="btn-delete" @click="deleteTopicItem(item.id)">删除</div>
              </div>
              <p class="topic-msg" @click="toTopicDetail(item.id)">{{item.contentText}}</p>
              <div class="img-box" @click="toTopicDetail(item.id)">
                <img v-for="(img,index) in item.images" :key="img" :src="img?img:''" alt />
                <!-- <img src="../../assets/neighbor/addPicture.png" alt />
                <img src="../../assets/neighbor/addPicture.png" alt />-->
              </div>
              <div class="read-num">
                <p>{{item.clickSum}}阅读</p>
                <p>{{item.commentSum}}评论</p>
              </div>
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
    this.getTopicList();
  },
  methods: {
    async getTopicList() {
      let res = await api.selfTopic(this.formData);
      if (res.error.err_code === "0") {
        res.obj.datas.map(item => {
          item.createdDateD = this.dateConvertD(item.createdDate);
          item.createdDateM = this.dateConvertM(item.createdDate);
        });
        this.dataList.push(...res.obj.datas);
        this.flag = true;
        if (res.obj.datas.length == 0) {
          this.listOver = true;
        }
      }
    },
    async deleteTopicItem(id) {
      let res = await api.delTopic({ ids: id });
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
        this.getTopicList();
      }
    },
    dateConvertD(timestamp) {
      if (this.iosEndAndroid() == "ios") {
        timestamp = timestamp.replace(/-/g, "/");
      } else {
      }
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

      let Y = date.getFullYear();

      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let D = date.getDate();

      let h = date.getHours() + ":";

      let m = date.getMinutes() + ":";

      let s = date.getSeconds();

      return D;
    },
    dateConvertM(timestamp) {
      if (this.iosEndAndroid() == "ios") {
        timestamp = timestamp.replace(/-/g, "/");
      } else {
      }
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

      let Y = date.getFullYear();

      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let D = date.getDate();

      let h = date.getHours() + ":";

      let m = date.getMinutes() + ":";

      let s = date.getSeconds();

      return M;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-topic {
  .header {
    height: 100px;
  }
  .item {
    padding-top: 30px;
    margin: 0 30px;
    // border-bottom: 1px solid #f8f8f8;
    display: flex;
  }
  .date {
    padding-right: 20px;
    .date-d {
      font-size: 64px;
      font--: bold;
      color: #1a1a1a;
    }
    .date-m {
      font-size: 26px;
      font--: bold;
      color: #969696;
      text-align: center;
      margin-top: 26px;
    }
  }
  .detail {
    width: 100%;
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      .nickname {
        font-size: 32px;
        font--: bold;
        color: #1a1a1a;
      }
      .btn-delete {
        width: 120px;
        height: 54px;
        line-height: 54px;
        text-align: center;
        background: #a260a4;
        border-radius: 27px;
        font-size: 28px;
        font--: bold;
        color: #ffffff;
      }
    }
    .topic-msg {
      font-size: 28px;
      font--: bold;
      color: #646464;
      line-height: 44px;
    }
    .img-box {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0;
      img {
        max-width: 260px;
        max-height: 172px;
        border-radius: 4px;
        margin: 9px;
      }
    }
    .read-num {
      display: flex;
      p {
        padding-right: 40px;
        font-size: 26px;
        font--: bold;
        color: #969696;
      }
    }
  }
}
</style>