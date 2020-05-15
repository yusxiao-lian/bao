<template>
    <main id="modifyPassword">
      <ul class="lookForPassword-form">
        <li v-for="(item,key) in modifyPasswordRules" :key="key">
          <input :type="item.type" :placeholder="item.placeholder" v-model="modifyPasswordForm[key]">
        </li>
      </ul>
      <div class="modifyPassword-btn">
        <span class="btn" @click="toOk">确认修改</span>
      </div>
    </main>
</template>

<script>
  import  *as system from '@/service/system'
  export default {
    name: "modifyPassword",
    data() {
      return {
        userInfo: null,
        modifyPasswordForm:{
          oldPassword:'',
          password:'',
          twoPassword:'',
        },
        modifyPasswordRules:{
          oldPassword:{
            type:'text',
            placeholder:'请输入旧密码',
            require:true,
            orEnd(str){
              return str==''?'请输入旧密码':false
            }
          },
          password:{
            type:'password',
            placeholder:'请设置新密码',
            require:true,
            orEnd(str){
              return str==''?'请输入新密码':false
            }
          },
          twoPassword:{
            type:'password',
            placeholder:'请确认新密码',
            require:true,
            orEnd(twoPassword,password) {
              if(twoPassword=='') {
                return '请输入确认新密码'
              } else {
                if(twoPassword!==password) {
                  return '新密码不正确'
                } else {
                  return false
                }
              }
            }
          },
        }
      }
    },
    methods: {
      async toOk() {
        for(let key in this.modifyPasswordRules) {
          if(this.modifyPasswordRules[key].require) {
            if(key=='twoPassword'){
              if(this.modifyPasswordRules['twoPassword'].orEnd(this.modifyPasswordForm['twoPassword'],this.modifyPasswordForm['password'])) {
                this.Toast(this.modifyPasswordRules['twoPassword'].orEnd(this.modifyPasswordForm['twoPassword'],this.modifyPasswordForm['password']));
                return ;
              }
            } else {
              if(this.modifyPasswordRules[key].orEnd(this.modifyPasswordForm[key])) {
                this.Toast(this.modifyPasswordRules[key].orEnd(this.modifyPasswordForm[key]));
                return ;
              }
            }
          }
        }
        let params= {
          oldPwd: this.modifyPasswordForm.oldPassword,
          newPwd: this.modifyPasswordForm.password,
          confirmPwd: this.modifyPasswordForm.twoPassword
        }
        const toast = this.$createToast({time: 0, txt: ''}).show();
        let res = await system.modifyPassword(params, this.userInfo.accessToken);
        toast.hide();
        if(res && res.error) {
          if(res.error.err_code==0) {
            this.Toast('修改成功');
            setTimeout(v=>{
              this.$router.replace({path:'/login'});
            },1000);
          } else {
            this.$createDialog({
              type: 'alert',
              title:res.error.err_msg,
              content: '',
            }).show();
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: '修改失败稍后再试',
            content: '',
          }).show();
        }
      }
    },
    async mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if(!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
        return
      }

    }
  }
</script>

<style lang="scss" scoped>
#modifyPassword{
  overflow: hidden;
  height: 100%;
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
  .modifyPassword-btn{
    margin-top: 80px;
    text-align: center;
    span{
      display: inline-block;
      padding: 30px 180px;
      color: white;
      font-weight: 700;
      font-size: 18Px;/*no*/
      background-color: #00B0F0;
      border-radius: 75px;
      text-align: center;
    }
  }
}
</style>
