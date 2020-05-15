<template>
  <div class="complaints">
    <headerTab :title="$route.meta.title"/>

    <!--投诉和建议-->
    <div class="repairApply-complaints">
      <div :class="{'div-bottom':flag==true}" @click="isFlag(1)">投诉</div>
      <div :class="{'div-bottom':flag==false}" @click="isFlag(2)">建议</div>
    </div>
    <!--提交投诉和建议-->
    <div class="repairApply-content">
      <textarea name="" cols="30" rows="10" v-model="repairApplyForm.repairContent"
                :placeholder="flag==true?'请输入您要投诉的内容':'请输入您要建议的内容'"></textarea>

      <div class="repairApply-content-img">
        <div class="repairApply-content-img-item" v-for="(v,i) in imgFilePath">
          <img :src="v.url" alt="">
          <i @click="deleteItem(i)"></i>
        </div>
        <div class="repairApply-content-img-item">
          <label for="male">
            <input id="male" type="file" accept="image/*" @change="fileLoadChange">
            <img src="../../assets/upload.png" alt="">
          </label>
        </div>
      </div>
    </div>
    <!--联系人-->
    <div class="repairApply-content-contact">
      <div class="repairApply-content-contact-title">
        联系人
      </div>
      <ul>
        <li>
          <i class="i1"></i>
          <input type="text" v-model="repairApplyForm.repairPeople">
        </li>
        <li>
          <i class="i2"></i>
          <input type="text" v-model="repairApplyForm.contactsPhone">
        </li>
        <li @click="showRoomSelect()">
          <i class="i3"></i>
          <span>{{repairApplyForm.roomNumber}}</span>
          <b></b>
        </li>
      </ul>
    </div>

    <bottomButton class="operation" bgColor="white" @click="submit">提交</bottomButton>
  </div>
</template>

<script>
  import *as system from '@/service/system';
  import *as complaints from '@/service/complaints';
  import *as personalMessage from '@/service/personalMessage';
  import {headerTab, bottomButton} from "../../components/index";

  export default {
    name: "complaints",
    components: {
      headerTab,
      bottomButton
    },
    data() {
      return {
        flag: true,//切换投诉和建议
        communityId: '',
        userInfo: null,
        repairApplyForm: {
          roomNumber: '',
          repairPeople: '',
          contactsPhone: '',
          repairContent: '',
        },
        imgFile: [],//提交的图片数据
        imgFilePath: [],//上传的图片列表
        roomList: [],
        houseId: '', //选择的房间id
      }
    },
    methods: {
      // 投诉建议切换
      isFlag(type) {
        this.getUserInfo();//获取个人所有信息
        this.getRoomList();//获取房间列表数据
        this.repairApplyForm.repairContent = ''
        if (type == 1) {
          this.flag = true
        } else {
          this.flag = false
        }
      },
      // 删除某张图片
      deleteItem(i) {
        this.imgFilePath.splice(i, 1)
        this.imgFile.splice(i, 1)
      },
      // 打开下拉选择房间
      showRoomSelect() {
        this.$createPicker({
          title: '房间号',
          data: [this.roomList],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.communityId = this.roomList[selectedIndex[0]].data.community.id
            this.repairApplyForm.roomNumber = selectedText[0];
            this.houseId = selectedVal[0];
          },
          onCancel: () => {
            // this.Toast('canceled');
          }
        }).show();
      },
      // 获取个人所有信息
      async getUserInfo() {
        let res = await personalMessage.getUserInfo(this.userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code && res.obj) {
            console.log(res);
            this.reporterId = res.obj;
            this.repairApplyForm.repairPeople = res.obj.nameJson.name;
            this.repairApplyForm.contactsPhone = res.obj.phoneJson.phone;
            console.log(this.repairApplyForm, ')(*&^7777');
          } else {
            this.communityId = '';
            //this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call getUserInfo interface exception");
        }
      },
      //获取房间列表
      async getRoomList() {
        let res = await system.getRoomList(this.userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code && res.list) {
            let flag = true
            this.roomList = res.list.map(v => {
              Object.assign(v,{
                text: v.community.name + v.building.name + v.house.name,
                value: v.house.id,
                data: v
              })
              return v
            });
            if(this.userInfo.houseId){
              this.roomList.forEach(v=>{
                if(v.house.id == this.userInfo.houseId){
                  this.repairApplyForm.roomNumber = v.text;
                  this.houseId = v.value;
                  this.communityId = v.community.id
                  flag = false
                }
              })
            }
            if(flag){
              if(this.userInfo.communityId){
                this.roomList.forEach(v=>{
                  if(v.community.id == this.userInfo.communityId){
                    this.repairApplyForm.roomNumber = v.text;
                    this.houseId = v.value;
                    this.communityId = v.community.id
                    flag = false
                  }
                })
              }
            }
            if(flag){
              this.repairApplyForm.roomNumber = this.roomList[0].text;
              this.houseId = this.roomList[0].value;
              this.communityId = this.roomList[0].data.community.id
            }
            console.log(this.roomList);
          } else {
            this.roomList = [];
            //this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call getRoomList interface exception");
        }
      },
      //文件上传
      fileLoadChange($event) {
        let url = null, file = $event.target.files[0];
        if (window.createObjectURL != undefined) {
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(file);
        }
        if(file.type.indexOf('image')===-1){
          this.Toast('只能上传图片')
          return
        }
        if( this.imgFile.length>=6){
          this.Toast('最多只能上传6张图片')
          return
        }
        this.imgFile.push(file);
        let list = {
          url: url
        }
        this.imgFilePath.push(list)
        $event.target.value = null;
      },
      //提交
      async submit() {
        let params = {}
        let res
        let toast
        console.log(this.imgFile)

        if (this.flag) {
          if (!this.repairApplyForm.repairContent) {
            this.$createDialog({
              type: 'alert',
              title: '',
              content: '请填写投诉内容',
            }).show();
            return
          }
          params = {
            houseId: this.houseId,  //房间号用户关联表id
            complainantName: this.repairApplyForm.repairPeople, //投诉人
            phone: this.repairApplyForm.contactsPhone,  //投诉人电话
            contentText: this.repairApplyForm.repairContent,  //投诉内容
            imageAttachment: this.imgFile
          }
          toast = this.$createToast({time: 0, txt: '正在提交'}).show();
          res = await complaints.complaintSubmit(params,  ['imageAttachment'])
        } else {
          if (!this.repairApplyForm.repairContent) {
            this.$createDialog({
              type: 'alert',
              title: '',
              content: '请填写建议内容',
            }).show();
            return
          }
          params = {
            userName: this.repairApplyForm.repairPeople, //投诉人
            mobileTel: this.repairApplyForm.contactsPhone,  //投诉人电话
            content: this.repairApplyForm.repairContent,  //投诉内容
            imageAttachment: this.imgFile
          }
          toast = this.$createToast({time: 0, txt: '正在提交'}).show();
          res = await complaints.suggestion(params, ['imageAttachment'])
        }
        toast.hide();
        if (res && res.error) {
          console.log(res.error.err_code);
          if ('0' == res.error.err_code) {
            this.Toast('添加成功');
            setTimeout(v => {
              this.$router.push({path: '/complaintsList'})
            }, 800);
          } else {
            this.$createDialog({
              type: 'alert',
              title: res.error.err_msg,
              content: '',
            }).show();
          }
        } else {
          this.$createDialog({
            type: 'alert',
            title: '操作失败稍后再试',
            content: '',
          }).show()
        }
      },
    },
    async mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      } else {
        await this.getUserInfo();//获取个人所有信息
        await this.getRoomList();//获取房间列表数据
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .complaints {
    height: calc(100% - 140px);
    overflow: hidden;
    overflow-y: auto;
    background-color: #F8F8F8;
    padding-top: 100px;
    /*投诉建议*/
    .repairApply-complaints {
      display: flex;
      height: 98px;
      line-height: 98px;
      background-color: #fff;
      div {
        flex: 1;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(26, 26, 26, 1);
        text-align: center;
      }
      .div-bottom {
        color: rgba(162, 96, 164, 1);
        border-bottom: 5px solid rgba(162, 96, 164, 1);
      }
    }
    /*新增的样式*/
    .repairApply-content {
      width: 750px;
      background: rgba(255, 255, 255, 1);
      padding: 20px 30px;
      padding-bottom: 30px;
      margin-top: 20px;
      margin-bottom: 20px;
      textarea {
        width: 100%;
        font-size: 32px;
        font-family: Source Han Sans CN;
        height: 280px;
        margin: 10px 0;
      }
      .repairApply-content-img {
        .repairApply-content-img-item {
          width: 154px;
          height: 154px;
          display: inline-block;
          border-radius: 4px;
          margin-right: 20px;
          margin-top: 20px;
          position: relative;
          img {
            width: 154px;
            height: 154px;
            position: absolute;
            top: 0;
          }
          i {
            width: 32px;
            height: 32px;
            display: inline-block;
            background-image: url("../../assets/img/cha.png");
            position: absolute;
            right: -16px;
            top: -16px;
            z-index: 2;
            background-size: cover;
          }
          label {
            width: 154px;
            height: 154px;
            input {
              width: 154px;
              height: 154px;
              display: inline-block;
              position: absolute;
              top: 0;
              z-index: 3;
              display: none;
            }
          }
        }
        .repairApply-content-img-item:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
    .repairApply-content-contact {
      width: 750px;
      height: 352px;
      background: rgba(255, 255, 255, 1);
      .repairApply-content-contact-title {
        padding: 0 30px;
        height: 88px;
        border-bottom: 1Px solid rgba(234, 234, 234, 1);
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(26, 26, 26, 1);
        line-height: 88px;
      }
      ul {
        padding: 0 30px;
        background-color: #fff;
        li {
          height: 87px;
          line-height: 87px;
          position: relative;
          padding-left: 67px;
          i {
            width: 48px;
            height: 48px;
            display: inline-block;
            position: absolute;
            left: 0px;
            top: 19.5px;
          }
          b {
            width: 64px;
            height: 64px;
            display: inline-block;
            background-image: url("../../assets/img/right.png");
            vertical-align: middle;
            background-size: cover;
            position: absolute;
            top: 11.5px;
            right: 30px;
          }
          .i1 {
            background-image: url("../../assets/lianxi.png");
            vertical-align: middle;
            background-size: cover;
          }
          .i2 {
            background-image: url("../../assets/phone.png");
            vertical-align: middle;
            background-size: cover;

          }
          .i3 {
            background-image: url("../../assets/house.png");
            vertical-align: middle;
            background-size: cover;
          }
          .i4 {
            background-image: url("../../assets/img/History.png");
            vertical-align: middle;
            background-size: cover;
          }

          input {
            width: 400px;
            height: 100%;
            font-size: 30px;
            line-height: 87px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(54, 56, 58, 1);
          }
          span {
            width: 400px;
            height: 100%;
            font-size: 30px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(54, 56, 58, 1);
          }
        }
      }
    }
    .operation {
      position: absolute;
    }
  }
</style>
