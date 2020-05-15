<template>
  <div class="chat">
    <headerTab></headerTab>
    <div class="xw-content" ref="xwBody">
      <div class="xw-chat-wrap">
        <ul>
          <li v-for="(messageList,i) in records" :key="i">
            <div v-if="messageList.type==1">
              <div class="xw-chat-time">{{messageList.time}}</div>
              <div class="xw-chat-servicer">
                <div class="xw-servicer-avantar-wrap">
                  <img src="../../assets/chatimg/chat_ico_serv.png" class="xw-servicer-avantar" />
                </div>
                <div class="xw-chat-msg">
                  <span v-html="messageList.content"></span>
                </div>
              </div>
            </div>

            <!-- 用户发送的消息模板-->
            <div v-else>
              <div class="xw-chat-time">{{messageList.time}}</div>
              <div class="xw-chat-customer">
                <div class="xw-customer-avantar-wrap">
                  <img src="../../assets/chatimg/female.jpg" class="xw-customer-avantar" />
                </div>
                <div class="xw-chat-msg" style="display:inline-block">
                  <span v-html="messageList.content"></span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="xw-footer-wrap">
      <div class="xw-footer-content">
        <div class="xw-vmodel-wrap">
          <textarea
            class="xw-content-textarea"
            placeholder="请输入您的问题"
            v-model="content"
            @focus="onFocusText"
          ></textarea>
        </div>
        <div class="xw-chat-tool">
          <div class="xw-chat-tool-item">
            <transition name="fade">
              <span class="xw-send-btn-text" @click="sendMsg">发送</span>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../service/chat";
import { headerTab } from "../../components/index";
import SparkMD5 from "../../unit/spark-md5.js";
import { parseTime } from "../../unit/unit.js";
var JIM;
export default {
  components: { headerTab },
  data() {
    return {
      showEmoji: true, //是否显示表情
      bellStatus: true, //头部区域铃声图标
      myaudio: "../../assets/audio/msg.mp3", //铃音
      testContents: [
        "今天天气不错",
        "这个问题还没遇到过",
        "你说什么，我听不明白",
        "今天周五了",
        "请稍后--",
        "当前客服忙",
        "您还有什么咨询的吗",
        "正在查询",
        "gone with the wind"
      ],
      content: "",
      //聊天记录
      records: [
        // {
        //   type: 1, //对方的消息
        //   time: parseTime(new Date()),
        //   content:
        //     "您好！欢迎来到管家客服，请问有什么能帮到您？如有疑问请在线咨询或者拨打400-926-2012咨询！感谢您的支持!"
        // }
        // {
        //   type: 2, //我的消息
        //   time: new Date().toLocaleTimeString(),
        //   content: "谢谢您的帮助"
        // }
      ],
      EXPS: [], //表情包
      listItems: [1, 2],
      objInfo: {},
      userInfo: {}
    };
  },
  created() {},
  methods: {
    // 发送
    sendMsg() {
      if (!JIM.isLogin()) {
        //如果会话断开，输入框有内容，重新初始化登录发送
        this.init();
        return;
      }
      var content = this.content.trim();
      this.records.push({
        time: new Date().toLocaleTimeString(),
        content: content,
        type: 2
      });
      this.scrollToBottom();
      JIM.sendSingleMsg({
        target_username: this.objInfo.talkId,
        content: content,
        appkey: this.objInfo.talkAppKey
      })
        .onSuccess(data => {
          console.log("消息发送success:");
          this.content = "";
        })
        .onFail(data => {
          console.log("消息发送error:", data);
        });
    },

    //滚动到底
    scrollToBottom() {
      setTimeout(() => {
        //滚动条长度
        var currentDistance =
          this.$refs.xwBody.scrollHeight - this.$refs.xwBody.clientHeight;
        //当前滚动条距离顶部的距离
        var currentScroll_y = this.$refs.xwBody.scrollTop;
        if (currentDistance > 0 && currentDistance > currentScroll_y) {
          currentScroll_y =
            Math.ceil((currentDistance - currentScroll_y) / 10) +
            currentScroll_y;
          currentScroll_y =
            currentScroll_y > currentDistance
              ? currentDistance
              : currentScroll_y;
          this.$refs.xwBody.scrollTop = currentScroll_y;
          this.scrollToBottom();
        }
      }, 13);
    },
    onFocusText() {
      this.scrollToBottom();
    },
    //会话用户登录
    login() {
      let Loding = this.Loding();
      JIM.login({
        username: this.userInfo.talkId,
        password: this.userInfo.talkPwd
      })
        .onSuccess(data => {
          Loding.hide();
          JIM.onSyncConversation(data => {
            //离线消息同步监听
            console.log(data, "离线消息同步监听");
            this.msgChange(data);
            this.scrollToBottom();
            if (this.content) {
              //如果会话断开，输入框有内容，重新初始化登录发送
              this.sendMsg();
            }
          });
          //实时消息同步监听
          JIM.onMsgReceive(data => {
            console.log("实时消息同步监听:", data);
            data.messages.forEach(v => {
              let content = v.content;
              if (content.msg_type == "text") {
                this.records.push({
                  time: parseTime(content.create_time),
                  content: content.msg_body.text,
                  type: "1" //对方发来 type 1
                });
              } else {
                this.records.push({
                  time: parseTime(content.create_time),
                  content:
                    '<div style="color:#999">不支持查看图片/音频/视频</div>',
                  type: 1 //对方发来 type 1
                });
              }
            });
            this.scrollToBottom();
          });
        })
        .onFail(data => {
          Loding.hide();
          this.$createDialog({
            type: "alert",
            title: "",
            content: JSON.stringify(data)
          }).show();
        });
    },
    //消息数据处理
    msgChange(dataList) {
      dataList.forEach(v => {
        v.msgs.forEach(v_ => {
          let content = v_.content;
          if (
            (content.target_id == this.objInfo.talkId &&
              content.from_id == this.userInfo.talkId) ||
            (content.from_id == this.objInfo.talkId &&
              content.target_id == this.userInfo.talkId)
          ) {
            if (content.msg_type == "text") {
              this.records.push({
                time: parseTime(content.create_time),
                content: content.msg_body.text,
                type: content.from_name == this.objInfo.userFullName ? 1 : 2
              });
            } else {
              this.records.push({
                time: parseTime(content.create_time),
                content:
                  '<div style="color:#999">不支持查看图片/音频/视频</div>',
                type: 1 //对方发来 type 1
              });
            }
          }
        });
      });
      // this.records.push({
      //   type: 1,
      //   time: parseTime(new Date()),
      //   content:
      //     "您好！欢迎来到管家客服，请问有什么能帮到您？如有疑问请在线咨询或者拨打400-926-2012咨询！感谢您的支持!"
      // });
    },
    //退出
    loginOut() {
      JIM.loginOut();
    },
    //会话初始化
    init() {
      let Loding = this.Loding();
      JIM = new JMessage({ debug: false });
      let random_str = "12345678901234567890";
      let timestamp = Date.now();
      let spark = new SparkMD5();
      spark.append(
        `appkey=${this.userInfo.talkAppKey}&timestamp=${timestamp}&random_str=${random_str}&key=f0616a872c6e7a90918e07ab`
      );

      let signature = spark.end();
      JIM.init({
        appkey: this.userInfo.talkAppKey,
        random_str: random_str,
        signature: signature,
        timestamp: timestamp,
        flag: 1
      })
        .onSuccess(data => {
          Loding.hide();
          this.records = [];
          this.login();
        })
        .onFail(function(data) {
          Loding.hide();
          this.$createDialog({
            type: "alert",
            title: "",
            content: JSON.stringify(data)
          }).show();
        });
    }
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (!this.userInfo || !this.userInfo.accessToken) {
      this.toLogin();
    }
  },
  mounted() {
    this.objInfo = this.$route.query;
    this.init();
  }
};
</script>
<style scoped>
.chat {
  height: 100%;
  width: 100%;
  padding-top: 100px;
  box-sizing: border-box;
}
.xw-content {
  flex: 1;
  position: relative;
  overflow: auto;
  transition: height 0.8s;
  height: calc(100% - 102px);
}

@-webkit-keyframes bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -3000px, 0);
    transform: translate3d(0, -3000px, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, 25px, 0);
    transform: translate3d(0, 25px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, -10px, 0);
    transform: translate3d(0, -10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, 5px, 0);
    transform: translate3d(0, 5px, 0);
  }

  to {
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(-3000px, 0, 0);
    transform: translate3d(-3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(25px, 0, 0);
    transform: translate3d(25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(5px, 0, 0);
    transform: translate3d(5px, 0, 0);
  }

  to {
    -webkit-transform: none;
    transform: none;
  }
}

@-webkit-keyframes bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }

  to {
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }

  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
</style>

<style scoped>
.xw-chat-servicer:after,
.xw-chat-servicer:before,
.xw-chat-customer:after,
.xw-chat-customer:before,
.xw-chat-wrap:after,
.xw-chat-wrap:before,
.xw-chat-tool:after,
.xw-chat-tool:before,
.xw-chat-ul-box:after,
.xw-chat-ul-box:before {
  display: table;
  content: "";
}
.xw-chat-wrap {
  overflow: auto;
  padding-left: 16px;
  padding-bottom: 20px;
}

.xw-chat-wrap .xw-chat-time,
.xw-chat-wrap time {
  line-height: 1;
  text-align: center;
  display: block;
  margin-bottom: 10px;
  margin-top: 30px;
  font-size: 26px;
  color: #999;
  text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.6);
}

.xw-chat-servicer,
.xw-chat-customer {
  position: relative;
  margin-bottom: 16px;
  padding: 0 10px 0 45px;
}

.xw-servicer-avantar-wrap {
  position: absolute;
  bottom: 0;
  line-height: 0;
}

.xw-send-btn-text {
  padding: 0px 30px;
  background-color: #a260a4;
  color: #fff;
  border-radius: 5px;
  display: block;
  height: 90px;
  display: flex;
  align-items: center;
}

.xw-customer-avantar-wrap {
  position: absolute;
  bottom: 0;
  right: 8px;
  line-height: 0;
}

.xw-chat-servicer .xw-servicer-avantar-wrap,
.xw-customer-avantar-wrap {
  left: 0;
}

.xw-servicer-avantar {
  border-radius: 100%;
}

.xw-servicer-avantar-wrap img,
.xw-customer-avantar-wrap img {
  height: 64px;
  width: 64px;
}

.xw-customer-avantar-wrap img {
  float: right;
}

.xw-chat-msg {
  -webkit-font-smoothing: antialiased;
  hyphens: auto;
  word-wrap: break-word;
  word-break: normal;
  position: relative;
  clear: both;
  padding: 8px 16px;
  border: 1px solid transparent;
  max-width: 100%;
  min-width: 50px;
  min-height: 22px;
  line-height: 1.6em;
  max-width: 70%;
}

.xw-chat-servicer .xw-chat-msg {
  background: #fff;
  border-color: #efefef;
  float: left;
}

.xw-chat-msg :last-child {
  margin-bottom: 0;
}

.xw-chat-msg span {
  white-space: pre-line;
}

.xw-chat-servicer,
.xw-chat-customer {
  position: relative;
  margin-bottom: 16px;
  padding: 0 10px 0 74px;
}

.xw-chat-customer {
  text-align: right;
}

.xw-chat-customer .xw-chat-msg {
  float: right;
  text-align: left;
  background: #a260a4;
  border-color: #a260a4;
  color: #fff;
  margin-right: 74px;
}

.xw-customer-avantar {
  border-radius: 50%;
}

.xw-chat-msg :last-child {
  margin-bottom: 0;
}

.xw-chat-wrap .xw-system-info-time,
.xw-chat-wrap time {
  line-height: 1;
  text-align: center;
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #999;
  text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.6);
}

.xw-system-info {
  margin-bottom: 8px;
}

.xw-chat-wrap > :last-child {
  margin-bottom: 16px;
}

.xw-system-info {
  text-align: center;
  font-size: 12px;
}

.xw-system-info span {
  display: inline-block;
  background: rgba(0, 0, 0, 0.08);
  padding: 4px 8px;
  line-height: 1;
  color: #7c7c7c;
  border-radius: 2px;
  text-shadow: 1px 1px 1px hsla(0, 0%, 100%, 0.6);
}

.xw-footer-wrap {
  position: fixed;
  bottom: 2px;
  justify-content: flex-end;
  width: 100%;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  z-index: 2;
}

.xw-footer-content {
  position: relative;
  width: 100%;
  height: 90px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.05) 0px -1px 4px;
}

.xw-vmodel-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xw-content-textarea {
  box-sizing: border-box;
  z-index: 1;
  overflow-y: auto;
  font-size: 30px;
  line-height: 36px;
  border: none;
  resize: none;
  width: 700px;
  padding: 16px 85px 16px 32px;
  padding-bottom: 0;
  font-family: inherit;
  white-space: pre;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.xw-chat-tool {
  position: absolute;
  right: 0px;
  bottom: 0;
  z-index: 2;
}

.xw-chat-tool-item {
  height: 90px;
  display: flex;
  align-items: center;
  position: relative;
  float: left;
  background: #fff;
}

.xw-chat-tool-btn {
  display: block;
}

.xw-chat-tool-btn {
  margin-top: 20px;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  text-indent: -9999px;
  opacity: 0.5;
  overflow: hidden;
  transform: translateZ(0);
  margin-left: 10px;
}

.xw-chat-tool-btn.xw-face {
  background: url(../../assets/chatimg/smileOn.svg) no-repeat 50%;
}

.xw-chat-tool-btn.xw-face-close {
  background: url(../../assets/chatimg/smileClose.svg) no-repeat 50%;
}

.xw-chat-tool-item .xw-window-text {
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-bottom: -3px;
  -webkit-transform: translateX(-60%);
  transform: translateX(-60%);
  white-space: nowrap;
  box-shadow: 0 3px 18px 2px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.05);
  font-size: 12px;
  background: #fff;
  line-height: 1em;
}

.xw-chat-tool-item .xw-window-text.xw-face-emoji-ul {
  right: -23px;
  left: auto;
  -webkit-transform: none;
  transform: none;
}

.xw-chat-tool-item .xw-window-text h4 {
  font-size: 12px;
  margin: 0;
  font-weight: 400;
  padding: 12px 8px;
  padding-bottom: 0;
}

.xw-chat-ul-box {
  list-style: none;
  margin: 0;
  padding: 0;
}

.xw-chat-ul-box {
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 8px;
  height: 130px;
  overflow: hidden;
  width: 340px;
  margin: 0px auto;
}

.xw-chat-tool-item .xw-window-text .xw-chat-ul-box {
  padding: 8px;
}

.swiper-slide {
  float: left;
}

.xw-chat-ul-box a {
  display: block;
  height: 40px;
  width: 40px;
}

.swiper-pagination {
  display: flex;
  width: 100%;
  justify-content: center;
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  display: inline-block;
  background: #ccc;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
}

.swiper-pagination-bullet-active {
  background: #007aff;
}

.xw-hide-operation {
  background: url(../../assets/chatimg/addOn.svg) no-repeat 50%;
  width: 38px;
  height: 38px;
  margin-right: 10px;
  transform: scale(0.7);
}

.xw-hide-operation-close {
  background: url(../../assets/chatimg/addClose.svg) no-repeat 50%;
  width: 38px;
  height: 38px;
  margin-right: 10px;
  transform: scale(0.7);
}

.xw-chat-tool-item .xw-window-text span {
  display: block;
  padding: 10px 12px;
  background: #fff;
  position: relative;
  z-index: 1;
  font-size: 17px;
  line-height: 16px;
}

.xw-chat-servicer:after,
.xw-chat-customer:after,
.xw-chat-wrap:after,
.xw-chat-tool:after,
.xw-chat-ul-box:after {
  clear: both;
}

.xw-chat-msg:last-child:before {
  bottom: -1px;
}

.xw-chat-msg:last-child:after,
.xw-chat-msg:last-child:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  display: block;
}

.xw-chat-customer .xw-chat-msg:last-child:before {
  display: inline-block;
  height: 0;
  width: 0;
  border: 10px solid transparent;
  border-bottom: 10px solid #a260a4;
  right: -10px;
  border-left-width: 9px;
}

.xw-chat-servicer .xw-chat-msg:last-child:before {
  display: inline-block;
  height: 0;
  width: 0;
  border: 10px solid transparent;
  border-bottom: 10px solid #efefef;
  left: -10px;
  border-left-width: 9px;
}

.xw-chat-servicer .xw-chat-msg:last-child:after {
  display: inline-block;
  height: 0;
  width: 0;
  border: 10px solid transparent;
  border-bottom: 10px solid #fff;
  left: -8px;
  border-left-width: 9px;
  bottom: 0px;
}

.xw-show-info-box {
  height: 200px;
  margin-top: -50px;
  z-index: 1000;
  background: #a260a4;
  color: #fff;
}

.xw-logo {
  text-align: center;
}

.xw-logo img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-top: 20px;
}

.xw-header-info p {
  height: 110px;
  padding: 0 16px;
  line-height: 1.6rem;
  word-wrap: break-word;
  text-align: left;
  overflow: auto;
}

.xw-faceEmoji {
  margin-bottom: 7px;
  width: 20%;
  float: left;
}

.xw-faceEmoji-main {
  text-align: center;
}

.xw-samll-pop-wrap {
  position: absolute;
  height: 160px;
  width: 30%;
  top: 0;
  right: 0;
  background-size: 100% 100%;
  background: url(../../assets/chatimg/s.jpg) no-repeat;
  z-index: 1000;
}

.xw-pop-server {
  background: url(../../assets/chatimg/s.jpg) no-repeat;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.xw-pop-customer {
  position: absolute;
  bottom: 20px;
  width: 80%;
  height: 200px;
  background: url(../../assets/chatimg/c.jpg) no-repeat;
  z-index: 101;
  left: 50%;
  margin-left: -40%;
  text-align: center;
}

.xw-narrow-pop {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 5px;
  top: 5px;
  display: inline-block;
  background: #a260a4;
  color: #fff;
  text-align: center;
}

.xw-big-pop {
  display: block;
  background: #a260a4;
  color: #fff;
  line-height: 40px;
  text-align: center;
}

.xw-hang-up {
  background: #a260a4;
  width: 100px;
  height: 34px;
  display: inline-block;
  border-radius: 20%;
  position: absolute;
  bottom: 10px;
  transform: translateX(-50%);
}

.xw-hang-up-icon {
  position: relative;
  z-index: 1290;
  width: 40px;
  height: 34px;
}

.xw-chat-msg span img {
  vertical-align: middle;
}

.mint-swipe-items-wrap > div {
  text-align: center;
}

.xw-scroll-ul {
  min-height: 340px;
}

.mint-swipe-indicator.is-active {
  background: #a260a4;
  opacity: 1;
}
</style>
