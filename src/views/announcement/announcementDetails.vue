<template>
  <div class="announcementDetails">
    <headerTab :title="$route.meta.title"></headerTab>
    <div class="detailsContent">
      <h5>
        {{this.dataList.title}}
      </h5>
      <p class="content-p" v-html="this.dataList.content">
      </p>
      <p class="content-date">
        {{this.dataList.lastTime}}
      </p>
    </div>
  </div>
</template>


<script>
  import {headerTab} from "../../components/index";
  import {noticeDetail} from "../../service/merchants"
  import {baseUrl} from "../../service/configUrl.js"

  export default {
    name: "announcementDetails",
    components: {
      headerTab
    },
    data() {
      return {
        dataList: [],
        baseUrl
      }
    },
    async created() {
      await this.noticeDetail()
      await this.wxPosition()
      await this.shareData()
    },
    methods: {
      async noticeDetail() {
        let data = {
          noticeId: this.$route.query.noticeId
        }
        let res = await noticeDetail(data)
        if (res && res.error.err_code == 0) {
          this.dataList = res.obj
        }
      },
      async wxPosition() {
        await wx.updateAppMessageShareData({
          title: this.dataList.title, // 分享标题
          desc: this.dataList.noLabelcontent,
          link:
            this.baseUrl +
            "/static/h5/wechat/index.html#/announcementDetails?noticeId=" +
            this.$route.query.noticeId,
          imgUrl: this.baseUrl + "/static/h5/wechat/e.png", // 分享图标
          success: async res => {

          }
        });
      },
      // 分享到朋友圈
      async shareData() {
        //需在用户可能点击分享按钮前就先调用
        await wx.updateTimelineShareData({
          title: this.dataList.title, // 分享标题
          link:
            this.baseUrl +
            "/static/h5/wechat/index.html#/announcementDetails?noticeId=" +
            this.$route.query.noticeId,
          imgUrl: this.baseUrl + "/static/h5/wechat/e.png", // 分享图标
          success: async res => {

          }
        })

      }

    }
  }
</script>

<style lang="scss" scoped>
  .announcementDetails {
    padding-top: 100px;
    height: 100%;
    overflow: auto;

    .detailsContent {
      height: 100%;
      padding: 30px;

      h5 {
        font-size: 36px;
        text-align: left;
        margin-bottom: 60px;
      }

      .content-p {
        text-indent: 2em;
        line-height: 40px;
        text-align: left;
        margin-bottom: 60px;
      }

      .content-date {
        text-align: right;
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
