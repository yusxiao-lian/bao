<template>
  <main id="register">
    <div class="title">登录</div>
    <ul class="register-form">
      <li v-for="(item,key) in loginRules" :key="key">
        <i :class="item.icoClass"></i>
        <input :type="item.type" :placeholder="item.placeholder" v-model="loginForm[key]" @input="inputPhone" v-input-scroll>
        <template v-if="key==='phone'">
          <i :class="item.icoClassLast" @click="clickEvent(key,item)" v-if="loginForm[key]"></i>
        </template>
        <template v-else>
          <i :class="item.icoClassLast" @click="clickEvent(key,item)"></i>
        </template>
      </li>
    </ul>
    <div class="register-btn-label">
      <span><a @click="loginClick">验证码登录/注册</a></span>
    </div>
    <div class="register-btn" @click="loginFn">登录</div>
    <!--<div class="xieyi">注册代表您已同意<span>《吉祥E+用户协议》</span></div>-->
  </main>
</template>

<script>
  import *as system from '@/service/system';

  export default {
    name: "login",
    data() {
      return {
        openid: '',
        loginForm: {
          phone: '',
          password: ''
        },
        loginRules: {
          phone: {
            type: 'number',
            placeholder: '请输入手机号',
            icoClass: 'cubeic-mobile-phone',
            icoClassLast: 'cubeic-wrong',
            require: true,
            orEnd(phone) {
              let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
              if (phone == '') {
                return '请输入手机号'
              } else {
                if (!myreg.test(phone)) {
                  return '请输入正确的手机号';
                } else {
                  return null;
                }
              }
            }
          },
          password: {
            icoClass: 'cubeic-lock',
            icoClassLast: 'cubeic-eye-invisible',
            type: 'password',
            placeholder: '请输入密码',
            require: true,
            orEnd(str) {
              return str == '' ? '请输入密码' : false
            }
          }
        },
        from_merch: false,
      }
    },
    components: {},
    methods: {
      inputPhone(){
        sessionStorage.setItem('phone',this.loginForm.phone)
      },
      loginClick() {
        if (this.$route.query.type == 'questionnaire') {
          this.$router.push({
            path: '/login', query: {
              openid: this.openid,
              id: this.$route.query.id,
              type: this.$route.query.type,
            }
          })
        } else {
          this.$router.push({path: '/login', query: {openid: this.openid}})
        }
      },
      clickEvent(type, item) {
        switch (type) {
          case 'phone':
            this.loginForm.phone = ''
             sessionStorage.setItem('phone',this.loginForm.phone)
            break
          case 'password':
            console.log(item)
            item.type = item.type === 'password' ? 'text' : 'password'
            item.icoClassLast = item.icoClassLast === 'cubeic-eye-invisible' ? 'cubeic-eye-visible' : 'cubeic-eye-invisible'
            break
        }
      },

      async loginFn() {
        for (let key in this.loginRules) {
          if (this.loginRules[key].require) {
            if (this.loginRules[key].orEnd(this.loginForm[key])) {
              this.Toast(this.loginRules[key].orEnd(this.loginForm[key]));
              return;
            }
          }
        }

        const toast = this.$createToast({time: 0, txt: '正在登陆'}).show();
        console.log('before login, openid:', this.openid);
        let params = {
          loginName: this.loginForm.phone,
          password: this.loginForm.password,
          appType: 'yezhuApp',
          openid: this.openid
        };
        console.log('params:', params);
        let res = await system.login(params);
        console.log('login res:', res);
        if (res && res.error) {
          if ('0' == res.error.err_code) {
            // this.$createDialog({
            //   type: 'alert',
            //   title: '温馨提示',
            //   content: res.error.err_msg,
            // }).show();
            if (res.obj) {
              console.log('after login, res.obj.openid:', res.obj.openid);
              if (this.openid || this.$route.query.type == 'questionnaire') {
                res.obj.openid = this.openid;
                res.obj.loginName = this.loginForm.phone
                if (this.$route.query.type == 'questionnaire') {
                  this.$router.replace({
                    path: "/questionnaire",
                    query: {
                      id: this.$route.query.id,
                      type: this.$route.query.type,
                    }
                  });
                  window.localStorage.setItem('userInfo', JSON.stringify(res.obj));
                } else {
                  window.localStorage.setItem('userInfo', JSON.stringify(res.obj));
                  this.$router.replace({ path: "/chooseCommunity" });
                  // if(this.from_merch) {
                  //   sessionStorage.removeItem('fromMerch')
                  //   this.$router.replace({path: '/merchantsHome'})
                  // } else {
                  //   this.$router.replace({ path: "/chooseCommunity" });
                  // }
                }
                // let useInfo = localStorage.getItem('userInfo')
                // useInfo = useInfo ? JSON.parse(useInfo) : '{}'
                // if (useInfo != '{}') {
                //   Object.assign(useInfo, res.obj);
                //   window.localStorage.setItem('userInfo', JSON.stringify(useInfo));
                //   this.$router.replace({path: '/personalMessage'});
                // } else {

                // }

              } else {
                this.Toast('openid为空');
              }
            } else {
              this.Toast('没有数据');
            }

          } else {
            this.$createDialog({
              type: 'alert',
              title: '温馨提示',
              content: res.error.err_msg,
            }).show();
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: '登陆失败稍后再试',
            content: '',
          }).show();
        }
        toast.hide();
      }
    },
    mounted() {
      this.loginForm.phone = sessionStorage.getItem('phone')||''
      if (this.$route.query.type == 'questionnaire') {

      } else {
        this.openid = this.$route.query.openid
        if (!this.openid) {
          window.localStorage.removeItem('userInfo');
          window.location.href = '/wechat/toLogin';
        }
      }
      // if(sessionStorage.fromMerch) this.from_merch = true
    },
    // beforeDestroy() {
    //   sessionStorage.removeItem('fromMerch')
    // }
  }
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
          color: #b1b1b1;
        }

        .cubeic-wrong {
          font-size: 40px;
        }

        input {
          display: block;
          height: 60px;
          line-height: 60px;
          font-size: 36px;
          width: 580px;
          text-indent: 10px;
        }

        input::-webkit-input-placeholder {
          color: #E8E8E8
        }

        .code {
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          height: 70px;
          width: 180px;
          border-radius: 100px;
          text-align: center;
          color: white;
          background: linear-gradient(to right, #A260A4, #C777C9);
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            font-size: 20px;
          }

        }
        .active {
          background-color: #dcdcdc;
          color: #5d5d5d;
          border: none;
          transition: all .3s;
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
          color: #A260A4;
          letter-spacing: 4px;
        }

      }
      .btn {
        width: 200px;
        line-height: 100px;
        border-radius: 100px;
        background-color: #A260A4;
        color: white;
        font-size: 22px; /*no*/
      }

      .btn:active {
        background-color: #0097ce;
        transition: all .3s;
      }

    }
    .register-btn {
      width: 630px;
      height: 90px;
      border-radius: 90px;
      background: linear-gradient(to right, #A260A4, #C777C9);
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
        color: #A260A4;
        font-size: 24px;
      }

    }
  }
</style>
