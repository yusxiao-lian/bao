<template>
    <main id="lookForPassword">
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
        <span class="btn" @click="toNextStep">下一步</span>
      </div>
    </main>
</template>

<script>
  import  *as system from '@/service/system'
  export default {
    name: "lookForPassword",
    data(){
      return{
        codeLabel:'获取验证码',
        lookForPasswordForm:{
          phone:'',
          verificationCode:'',
        },
        lookForPasswordRules:{
          phone:{
            type:'number',
            placeholder:'请输入手机号',
            require:true,
            orEnd(phone){
              let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
              if(phone==''){
                return '请输入手机号'
              }else {
                if (!myreg.test(phone)) {
                  return '请输入正确的手机号';
                } else {
                  return null;
                }
              }
            }
          },
          verificationCode:{
            type:'text',
            placeholder:'请输入验证码',
            require:true,
            orEnd(str){
              return str==''?'请输入验证码':false
            }
          },
        }
      }
    },
    methods: {
      toLogin() {
        window.location.href = '/wechat/toLogin';
        return ;
      },
      //验证码倒计时
      async getCountDown() {
        if(!this.isPhone(this.lookForPasswordForm.phone)) {
          this.Toast('请输入手机号码')
          return
        }
        let params={phone: this.lookForPasswordForm.phone, businessType: 2};
        const toast = this.$createToast({time: 0, txt: '正在发送'}).show();
        let res = await system.getCode(params);
        toast.hide();
        if(res && res.error) {
          if('0' == res.error.err_code) {
            // console.log('验证码:',res.obj)
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
          }).show();
          return ;
        }
        let num=60
        this.codeLabel=`已发送${num}S`
        let time =setInterval(v=>{
          if(num==0){
            this.codeLabel='获取验证码'
            clearInterval(time)
            time=null
          }else {
            num--
            this.codeLabel=`已发送${num}S`
          }
        },1000)
      },
      //获取验证码
      getCode(){
        if(this.codeLabel!=='获取验证码')return
        this.getCountDown()
      },
      popupSelect(type){
        if(type!=='address')return
        console.log('tanhcuy')
        document.activeElement.blur()
      },
      //下一步
      toNextStep(){
        for(let key in this.lookForPasswordRules){
          if(this.lookForPasswordRules[key].require){
            if(key=='twoPassword'){
              if(this.lookForPasswordRules['twoPassword'].orEnd(this.lookForPasswordForm['twoPassword'],this.lookForPasswordForm['password'])){
                this.Toast(this.lookForPasswordRules['twoPassword'].orEnd(this.lookForPasswordForm['twoPassword'],this.lookForPasswordForm['password']))
                return
              }
            } else {
              if(this.lookForPasswordRules[key].orEnd(this.lookForPasswordForm[key])){
                console.log(this.lookForPasswordRules[key].orEnd(this.lookForPasswordForm[key]))
                this.Toast(this.lookForPasswordRules[key].orEnd(this.lookForPasswordForm[key]))
                return
              }
            }

          }
        }
        this.$router.push({path:'/lookForPassword2',query:{phone:this.lookForPasswordForm.phone,verificationCode:this.lookForPasswordForm.verificationCode}})
      },
    }
  }
</script>

<style lang="scss" scoped>
#lookForPassword{
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
