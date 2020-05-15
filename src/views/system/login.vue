<template>
  <main id="register">
    <div id="register1">
      <div class="title">登录/注册</div>
      <ul class="register-form">
        <li v-for="(item,key) in registerRules" :key="key" @click="popupSelect(key)">
          <i :class="item.icoClass"></i>
          <input
            :type="item.type"
            :placeholder="item.placeholder"
            v-model="registerForm[key]"
            v-input-scroll
            @input="inputPhone"
            v-if="key!=='verificationCode'"
          />
          <input
            :type="item.type"
            :placeholder="item.placeholder"
            v-model="registerForm[key]"
            v-input-scroll
            maxlength="4"
            v-if="key==='verificationCode'"
          />
          <div
            class="code"
            v-if="key=='phone'"
            @click.stop="getCode"
            :class="{'active':codeLabel!=='获取验证码'}"
          >
            <span>{{codeLabel}}</span>
          </div>
          <!-- <i class="arrow" v-if="key=='address'"></i> -->
        </li>
      </ul>
      <div class="register-btn-label">
        <span>
          <a @click="toLogin">密码登录</a>
        </span>
      </div>
      <div class="register-btn" @click="toRegister">登录/注册</div>
      <div class="xieyi">
        注册代表您已同意
        <span @click="clickToXIEYI">《吉祥E+用户协议》</span>
      </div>
    </div>
  </main>
</template>

<script>
import * as system from "@/service/system";

export default {
  name: "register",
  data() {
    return {
      baseUrl: "http://" + window.location.host,
      codeLabel: "获取验证码",
      registerForm: {
        phone: "",
        verificationCode: "",
        password: 123456
      },
      registerRules: {
        phone: {
          type: "number",
          placeholder: "请输入手机号",
          icoClass: "cubeic-mobile-phone",
          require: true,
          orEnd(phone) {
            let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (phone == "") {
              return "请输入手机号";
            } else {
              if (!myreg.test(phone)) {
                return "请输入正确的手机号";
              } else {
                return null;
              }
            }
          }
        },
        verificationCode: {
          type: "text",
          placeholder: "请输入验证码",
          icoClass: "cubeic-message",
          require: true,
          orEnd(str) {
            return str == "" ? "请输入验证码" : false;
          }
        }
      },
      ActionSheetNumber: -1,
      openid: "",
      from_merch: false,
    };
  },
  methods: {
    inputPhone() {
      sessionStorage.setItem("phone", this.registerForm.phone);
    },
    clickToXIEYI() {
      location.href = this.baseUrl + "/static/h5/commerce/index.html#/xieyi";
    },
    toLogin() {
      if (this.$route.query.type == "questionnaire") {
        this.$router.push({
          path: "/passwordLogin",
          query: {
            openid: this.openid,
            id: this.$route.query.id,
            type: this.$route.query.type
          }
        });
      } else {
        this.$router.push({
          path: "/passwordLogin",
          query: { openid: this.openid }
        });
      }
    },
    showActive(key) {
      this.$createActionSheet({
        title: "",
        pickerStyle: true,
        active: this.ActionSheetNumber,
        onSelect: (item, index) => {
          this.registerForm[key] = item.content;
          this.ActionSheetNumber = index;
        },
        onCancel: () => {}
      }).show();
    },
    //验证码倒计时
    async getCountDown() {
      if (!this.isPhone(this.registerForm.phone)) {
        this.Toast("请输入手机号码");
        return;
      }
      let params = { phone: this.registerForm.phone };
      const toast = this.$createToast({ time: 0, txt: "正在发送" }).show();
      let res = await system.getCode(params);
      toast.hide();
      console.log(res);
      if (res) {
        if (res.error.err_code == 0) {
          console.log("验证码:", res.obj);
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
          return;
        }
      } else {
        this.$createDialog({
          type: "alert",
          title: "网络异常稍后再试稍后再试",
          content: ""
        }).show();
        return;
      }
      let num = 60;
      this.codeLabel = `已发送${num}S`;
      let time = setInterval(v => {
        if (num == 0) {
          this.codeLabel = "获取验证码";
          clearInterval(time);
          time = null;
        } else {
          num--;
          this.codeLabel = `已发送${num}S`;
        }
      }, 1000);
    },
    //获取验证码
    getCode() {
      if (this.codeLabel !== "获取验证码") return;
      this.getCountDown();
    },
    popupSelect(type) {
      if (this.registerRules[type].select) {
        document.activeElement.blur();
        this.showActive(type);
        return;
      }
      console.log("tanhcuy");
    },
    //注册
    async toRegister() {
      for (let key in this.registerRules) {
        if (this.registerRules[key].require) {
          if (this.registerRules[key].orEnd(this.registerForm[key])) {
            this.Toast(this.registerRules[key].orEnd(this.registerForm[key]));
            return;
          }
        }
      }
      let params = {
        phone: this.registerForm.phone,
        password: this.registerForm.password,
        authCode: this.registerForm.verificationCode,
        appType: "yezhuApp",
        openid: this.openid
      };
      const toast = this.$createToast({ time: 0, txt: "正在注册" }).show();
      let res = await system.loginAndRegister(params);
      toast.hide();
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          res.obj.openid = this.openid;
          res.obj.loginName = this.registerForm.phone;
          if (this.$route.query.type == "questionnaire") {
            this.$router.replace({
              path: "/questionnaire",
              query: {
                id: this.$route.query.id,
                type: this.$route.query.type
              }
            });
            window.localStorage.setItem("userInfo", JSON.stringify(res.obj));
          } else {
            window.localStorage.setItem("userInfo", JSON.stringify(res.obj));
            this.$router.replace({ path: "/chooseCommunity" });
            // if(this.from_merch) {
            //   sessionStorage.removeItem('fromMerch')
            //   this.$router.replace({path: '/merchantsHome'})
            // } else {
            //   this.$router.replace({ path: "/chooseCommunity" });
            // }
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      } else {
        this.$createDialog({
          type: "alert",
          title: "注册失败稍后再试",
          content: ""
        }).show();
      }
    }
  },
  mounted() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.registerForm.phone = sessionStorage.getItem("phone") || "";
    this.openid = this.$route.query.openid || ""|| "oEQTnt-qGLl9zrJxVab6U4SdwZ1c";
    console.log(this.openid,'this.openid')
    if (this.$route.query.type == "questionnaire") {
      if (userInfo.accessToken) {
        this.$router.replace({
          path: "/questionnaire",
          query: {
            id: this.$route.query.id,
            type: this.$route.query.type
          }
        });
      }
    } else {
      if (!this.openid) {
        window.localStorage.removeItem("userInfo");
        window.location.href = "/wechat/toLogin";
      }
    }
    // if(sessionStorage.fromMerch) this.from_merch = true
  },
  // beforeDestroy() {
  //   sessionStorage.removeItem('fromMerch')
  // }
};
</script>

<style lang="scss" type="text/scss" scoped>
#register {
  height: 100%;
  background-image: url("../../assets/register-bg.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: contain;
  overflow: hidden;
  overflow-y: auto;

  .title {
    text-align: left;
    padding: 130px 0px 80px 0px;
    width: 630px;
    font-size: 52px;
    margin: 0 auto;
    color: black;
    line-height: 60px;
  }

  .register-form {
    width: 630px;
    margin: 0 auto;
    margin-top: 30px;
    overflow: hidden;

    li {
      border-bottom: 2px solid rgba(218, 218, 218, 0.65);
      box-sizing: content-box;
      position: relative;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      height: 120px;

      > i {
        font-size: 50px;
        line-height: 60px;
        color: #999999;
      }

      input {
        display: block;
        height: 60px;
        line-height: 60px;
        font-size: 36px;
        width: 400px;
        text-indent: 10px;
      }

      input::-webkit-input-placeholder {
        color: #e8e8e8;
      }

      .code {
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        height: 60px;
        width: 180px;
        border-radius: 60px;
        text-align: center;
        color: white;
        background: linear-gradient(to right, #a260a4, #c777c9);
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 24px;
        }
      }
      .active {
        background: #dcdcdc;
        color: white;
        border: none;
        transition: all 0.3s;
      }

      .arrow {
        position: absolute;
        top: 50%;
        right: 2px; /*no*/
        width: 12px; /*no*/
        height: 12px; /*no*/
        border-right: 1px solid #333; /*no*/
        border-bottom: 1px solid #333; /*no*/
        transform: translateY(-50%) rotateZ(-45deg);
      }
    }
  }
  .register-btn-label {
    width: 630px;
    margin: 0 auto;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999999;

    span {
      a {
        font-size: 30px;
        text-decoration: underline;
        line-height: 35px;
        color: #a260a4;
        letter-spacing: 4px;
      }
    }
    .btn {
      width: 200px;
      line-height: 100px;
      border-radius: 100px;
      background-color: #a260a4;
      color: white;
      font-size: 22px; /*no*/
    }

    .btn:active {
      background-color: #0097ce;
      transition: all 0.3s;
    }
  }
  .register-btn {
    width: 630px;
    height: 90px;
    border-radius: 90px;
    background: linear-gradient(to right, #a260a4, #c777c9);
    color: white;
    font-size: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0px 7px 15px 0px rgba(199, 119, 201, 0.4);
    margin-top: 40px;
  }

  .xieyi {
    text-align: center;
    color: #999999;
    margin-top: 40px;
    font-size: 24px;

    > span {
      color: #a260a4;
      font-size: 24px;
    }
  }
}
</style>
