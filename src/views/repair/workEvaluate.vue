<template>
    <div class="workEvaluate">
      <div class="workEvaluate-main">
        <span class="label-text">选择分数</span>
        <div class="Evaluate-box">
          <div class="Evaluate-box-item" v-for="i in evaluateList">
            <checkbox class="checkbox" v-model="i.flag" @change="changeCheckbox(i)"></checkbox>
            <span>{{i.label}}</span>
          </div>
        </div>
      </div>
      <div class="workEvaluateRemarks">
        <h5 class="workEvaluateRemarks-title">评价内容</h5>
        <textarea name="" id="" placeholder="请输入评价内容(200字以内)" v-model="evaluateContent" maxlength="200"></textarea>
      </div>
      <bottomButton @click="submit"></bottomButton>
    </div>
</template>

<script>
  import checkbox from '../../components/checkbox/checkbox';
  import {bottomButton} from '../../components/index';
  import  *as repair from '@/service/repair';
  export default {
    name: "workEvaluate",
    components:{
      checkbox,
      bottomButton
    },
    data(){
        return {
          repairId: '',
          userInfo: null,
          flag:false,
          evaluateList:[
            {
              flag:false,
              label:'0',
              id:1,
            },
            {
              flag:false,
              label:'30',
              id:2,
            },
            {
              flag:false,
              label:'60',
              id:3,
            },
            {
              flag:false,
              label:'70',
              id:4,
            },
            {
              flag:false,
              label:'80',
              id:5,
            },
            {
              flag:false,
              label:'100',
              id:6,
            },
          ],
          evaluateContent:'',
          actionEvaluate:''
        }
    },
    methods:{
      changeCheckbox(item){
        this.evaluateList.forEach(v=>{
          if(item.id!=v.id){
            v.flag=false
          }
        })
        this.actionEvaluate=item.label ? item.label : ''
      },
      async submit() {
        if(!this.actionEvaluate && !this.evaluateContent) {
          this.Toast("请填写评价信息后再提交");
          return ;
        }
        let loding = this.Loding();
        let params = {id: this.repairId, satisfaction: this.actionEvaluate, remark: this.evaluateContent}
        let res = await repair.voteForm(params, this.userInfo.accessToken);
        loding.hide();
        if(res && res.error) {
          if('0' == res.error.err_code) {
            this.Toast("提交成功");
            this.$router.push({path:'/repairProgress',query:{id: this.repairId}});
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call voteForm interface exception");
        }
      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      console.log(this.userInfo,'userInfouserInfouserInfo')
      if(!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      }
      let id_ = this.$route.query.id;
      if(id_) {
        this.repairId = id_;
      } else {
        this.$router.replace('repairRecord');
      }
    }
  }
</script>

<style lang="scss" scoped>
.workEvaluate{
  height: 100%;
  background-color: white;
  .workEvaluate-main{
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #dcdcdc;
    .label-text{
      height: 60px;
      line-height: 60px;
      width: 150px;
      font-size: 30px;
    }
    .Evaluate-box{
      width: calc(100% - 150px);
      overflow: hidden;
    }
    .Evaluate-box-item{
      float: left;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      width: 33%;
      margin-bottom: 20px;
      .checkbox{
        margin-right: 20px;
      }
    }
  }
  .workEvaluateRemarks{
    padding: 20px;
    h5{
      font-size: 30px;
      margin-bottom: 20px;
    }
    textarea{
      display: block;
      width: 100%;
      min-height: 300px;
      background-color: #f9f9f9;
      padding: 20px;
      line-height: 50px;
    }
  }
}
</style>
