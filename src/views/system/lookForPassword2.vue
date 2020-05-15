<template>
  <main id="lookForPassword2">
    <ul class="lookForPassword-form">
      <li v-for="(item,key) in lookForPasswordRules" :key="key" @click="popupSelect(key)">
        <input :type="item.type" :placeholder="item.placeholder" v-model="lookForPasswordForm[key]">
        <div class="code"
             v-if="key=='verificationCode'"
             @click.stope="getCode"
             :class="{'active':codeLabel!=='获取验证码'}">
          <span>{{codeLabel}}</span>
        </div>
        <i class="arrow" v-if="key=='address'"></i>
      </li>
    </ul>
    <div class="lookForPassword-btn-label">
      <span>记得密码，立即<a style="color:  #00B0F0;font-weight: 700" @click="toLogin">登录</a></span>
      <span class="btn" @click="toOk">确认</span>
    </div>
  </main>
</template>

<script>
  import  *as system from '@/service/system'
  export default {
    name: "lookForPassword2",
    data() {
      return {
        codeLabel:'获取验证码',
        lookForPasswordForm:{
          password:'',
          twoPassword:'',
        },
        lookForPasswordRules:{
          password:{
            type:'password',
            placeholder:'请设置新密码',
            require:true,
            orEnd(str){
              return str==''?'请输入密码':false
            }
          },
          twoPassword:{
            type:'password',
            placeholder:'请确认新密码',
            require:true,
            orEnd(twoPassword,password) {
              if(twoPassword=='') {
                return '请输入确认密码'
              } else {
                if(twoPassword!==password) {
                  return '确认密码不正确'
                } else {
                  return false
                }
              }
            }
          },
        },
        queryData:null
      }
    },
    methods: {
      toLogin() {
        window.location.href = '/wechat/toLogin';
        return ;
      },
      //验证码倒计时
      getCountDown() {
        let num=60;
        this.codeLabel=`已发送${num}S`;
        let time =setInterval(v=> {
          if(num==0) {
            this.codeLabel='获取验证码';
            clearInterval(time);
            time=null;
          } else {
            num--
            this.codeLabel=`已发送${num}S`;
          }
        },1000);
      },
      //获取验证码
      getCode() {
        if(this.codeLabel!=='获取验证码') return ;
        this.getCountDown();
      },
      popupSelect(type){
        if(type!=='address')return;;
        document.activeElement.blur();
      },
      //确认
      async toOk() {
        for(let key in this.lookForPasswordRules) {
          if(this.lookForPasswordRules[key].require) {
            if(key=='twoPassword') {
              if(this.lookForPasswordRules['twoPassword'].orEnd(this.lookForPasswordForm['twoPassword'],this.lookForPasswordForm['password'])){
                this.Toast(this.lookForPasswordRules['twoPassword'].orEnd(this.lookForPasswordForm['twoPassword'],this.lookForPasswordForm['password']));
                return ;
              }
            } else {
              if(this.lookForPasswordRules[key].orEnd(this.lookForPasswordForm[key])){
                this.Toast(this.lookForPasswordRules[key].orEnd(this.lookForPasswordForm[key]));
                return ;
              }
            }
          }
        }
        let params={
          phone:this.queryData.phone,
          newPwd:this.lookForPasswordForm.password,
          confirmPwd:this.lookForPasswordForm.twoPassword,
          authCode:this.queryData.verificationCode
        }
        let res = await system.lookForPassword(params);
        if(res){
          if(res.error.err_code==0){
            window.location.href = '/wechat/toLogin';
            return ;
          } else {
            this.$createDialog({
              type: 'alert',
              title:res.error.err_msg,
              content: '',
            }).show()
            return
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: '网络异常稍后再试稍后再试',
            content: '',
          }).show()
          return
        }

      },
    },
    mounted() {
      this.queryData=this.$route.query;
      if(Object.keys(this.$route.query).length<2) {
        this.$createDialog({
          type: 'alert',
          title: '请先填写手机号获取验证码',
          content: '',
          onConfirm: () => {
            this.$router.replace({path:'/lookForPassword'});
          },
        }).show();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #lookForPassword2{
    height: 100%;
    background-image: url("../../assets/register-bg.png");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: contain;
    overflow: hidden;
    .lookForPassword-form{
      width: 630px;
      margin: 0 auto;
      margin-top: 80px;
      overflow: hidden;
      li{
        border-bottom: 1px solid #ccc;
        box-sizing: content-box;
        position: relative;
        input{
          padding: 34px 0;
          line-height: 22Px;/*no*/
          font-size: 22Px;/*no*/
          width: 100%;
        }
        .code{
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          font-size: 20Px;/*no*/
          padding: 22px 32px;
          border: 1px solid #00B0F0;/*no*/
          border-radius: 100px;
          text-align: center ;
          color: #00B0F0;
          background-color: white;
          right: 0;
          span{
            font-size: 20Px;/*no*/
          }
        }
        .active{
          background-color: #dcdcdc;
          color: #5d5d5d;
          border: none;
          transition: all .3s;
        }

        .arrow{
          position: absolute;
          top: 50%;
          right: 2Px;/*no*/
          width: 12Px;/*no*/
          height: 12Px;/*no*/
          border-right: 1px solid #333;/*no*/
          border-bottom: 1px solid #333;/*no*/
          transform: translateY(-50%) rotateZ(-45deg);
        }
      }
    }
    .lookForPassword-btn-label{
      margin-top: 60px;
      font-size: 18Px;/*no*/
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0px 30px;
      color: #999999;
      span{
        font-weight: 700;
        font-size: 18Px;/*no*/
        a{
          font-weight: 700;
          font-size: 18Px;/*no*/
        }
      }
      .btn{
        width: 200px;
        line-height: 100px;
        border-radius:100px;
        background-color: #00B0F0;
        color: white;
        font-size: 22Px;/*no*/
      }
      .btn:active{
        background-color: #0097ce;
        transition: all .3s;
      }
    }
  }
</style>
