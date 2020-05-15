<template>
  <div id="repairApply">
    <headerTab :title="$route.meta.title"/>
    <div class="repairApply-content">
      <textarea name="" v-model="repairApplyForm.repairContent" placeholder="请描述你要报修的情况"></textarea>

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
  import *as repair from '@/service/repair';
  import *as personalMessage from '@/service/personalMessage';
  import icoBg from '../../assets/disc_ico_photo.png';
  import {headerTab, bottomButton} from "../../components/index";

  export default {
    name: "repairApply",
    components: {
      headerTab,
      bottomButton
    },
    data() {
      return {
        actionSheet: Object,
        repairTypeId: '',//报修类型
        repairTypeData: [],
        selectedIndex: [],
        communityId: '',
        userInfo: null,
        icoBg,
        repairApplyForm: {
          roomNumber: '',
          repairPeople: '',
          contactsPhone: '',
          appointmentTime: '',//预约时间
          repairType: '',
          repairContent: '',
        },
        imgFile: [],//提交的图片数据
        imgFilePath: [],//上传的图片列表
        ActionSheetNumber: -1,
        roomList: [],
        houseId: '', //选择的房间id
        planDayList: [[], []], //可预约的日期集合
        planDay: '',   //选择的预约日期
        planTimeId: '',
        planTimeList: [] //可预约时间段
      }
    },
    methods: {


      photoCompress(file, w, objDiv) {
        var _this = this
        var ready = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload = function () {
          var re = this.result;
          _this.canvasDataURL(re, w, objDiv)
        }
      },

      canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
          var that = this;
          // 默认按比例压缩
          var w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          var quality = 0.5;  // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL('image/jpeg', quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },

      /**
       * 将以base64的图片url数据转换为Blob
       * @param urlData
       *            用url方式表示的base64图片数据
       */
      convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
      },


      //上传文件方法
      fileLoadChange($event) {

        const _this = this
        let fileObj = $event.target.files[0]; // js 获取文件对象
        if (!/image\/\w+/.test(fileObj.type)) {
          _this.Toast('请选择图片')
          return false;
        }
        if (fileObj.type.indexOf('image') === -1) {
          _this.Toast('只能上传图片')
          return
        }
        if (_this.imgFile.length >= 6) {
          _this.Toast('最多只能上传6张图片')
          return
        }
        console.log('刚上传的图片大小' + fileObj.size);
        //表单对象可自行添加要发送的参数例如form.append("age"10) 则后台可接收到age=10的参数
        this.photoCompress(fileObj, {
          quality: 0.2
        }, function (base64Codes) {
          //console.log("压缩后：" + base.length / 1024 + " " + base);
          var bl = _this.convertBase64UrlToBlob(base64Codes);
          console.log('压缩过的图片大小' + bl.size);
          _this.imgFilePath.push({url: base64Codes,})
          _this.imgFile.push(bl);

        });

      },

      //文件上传
      // fileLoadChange($event) {
      //   let url = null, file = $event.target.files[0];
      //   var that = this;
      //   if (!/image\/\w+/.test(file.type)) {
      //     this.Toast('请选择图片')
      //     return false;
      //   }
      //   if (file.type.indexOf('image') === -1) {
      //     this.Toast('只能上传图片')
      //     return
      //   }
      //   if (this.imgFile.length >= 6) {
      //     this.Toast('最多只能上传6张图片')
      //     return
      //   }
      //
      //   // 通过canvas压缩图片
      //   var reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   var img = new Image;
      //   reader.onload = function (e) {
      //     var width = 1080, //图像大小
      //       quality = 0.6, //图像质量
      //       canvas = document.createElement("canvas"),
      //       drawer = canvas.getContext("2d");
      //     img.src = this.result;
      //     img.onload = function () {
      //       canvas.width = width;
      //       canvas.height = width * (img.height / img.width);
      //       drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
      //       img.src = canvas.toDataURL("image/png", quality);
      //     }
      //   }
      //   setTimeout(function () {
      //     // 创建form对象
      //     let param = new FormData();
      //     console.log(file.size);
      //     // 通过append向form对象添加数据
      //     param.append('img', file);
      //     // 文件大小
      //     param.append('size', file.size);
      //     for (var n in that.params) {
      //       param.append(n, that.params[n]);
      //     }
      //     console.log(param, '@@@@@');
      //     that.imgFilePath.push({url: img.src,})
      //     that.imgFile.push(file);
      //     console.log(that.imgFilePath);
      //     console.log(that.imgFile);
      //   }, 1000);
      //
      //   // if (window.createObjectURL != undefined) {
      //   //   url = window.createObjectURL(file);
      //   // } else if (window.URL != undefined) {
      //   //   url = window.URL.createObjectURL(file);
      //   // } else if (window.webkitURL != undefined) {
      //   //   url = window.webkitURL.createObjectURL(file);
      //   // }
      //
      //
      //   // let list = {
      //   //   url: url
      //   // }
      //   // this.imgFilePath.push(list)
      //   $event.target.value = null;
      // },

      // 删除某张图片
      deleteItem(i) {
        this.imgFilePath.splice(i, 1)
        this.imgFile.splice(i, 1)
      }
      ,
      async showDrawer() {
        this.setStyle();
        await
          this.getPlanDayList();
        this.$refs.appointmentTimeDrawer.show();
      }
      ,
      async changeHandler(index, item, selectedVal, selectedIndex, selectedText) {
        let data;
        if (item && item.value) {
          data = await
            this.getPlanTimeList(item.value);
          this.$refs.appointmentTimeDrawer.refill(index + 1, data);
        }
      }
      ,
      selectHandler(selectedVal, selectedIndex, selectedText) {
        console.log(999);
        this.repairApplyForm.appointmentTime = selectedText[0] + ' ' + selectedText[1];
        this.planDay = selectedVal[0];
        this.planTimeId = selectedVal[1];
        console.log(this.repairApplyForm.appointmentTime);
      }
      ,
      cancelHandler() {
        // this.Toast('canceled');
      }
      ,
      // 获取报修类型数据
      async getRepairType(params) {
        let res = await
          repair.maintainItemTree(params, this.userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code && res.list) {
            console.log(res, '898888888888888888889');
            this.repairTypeId = res.list[0].id
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call maintainItemTree interface exception");
        }
      }
      ,
      // 获取个人所有信息
      async getUserInfo() {
        let res = await
          personalMessage.getUserInfo(this.userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code && res.obj) {
            console.log(res);
            this.reporterId = res.obj;
            this.repairApplyForm.repairPeople = res.obj.nameJson.name;
            this.repairApplyForm.contactsPhone = res.obj.phoneJson.phone;
            console.log(this.repairApplyForm, ')(*&^7777');
          } else {
            this.communityId = '';
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call getUserInfo interface exception");
        }
      }
      ,
      //获取项目列表id
      async getProjectList() {
        let res = await
          system.getProjectList();
        if (res && res.error) {
          console.log(res, '(&**&&*');
          if (res.error.err_code == 0) {
            this.communityId = res.list[0].list[0].id;
          } else {
            this.communityId = '';
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call getProjectList interface exception");
        }
      }
      ,
      getWeekDay(dateStr) {
        let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
        return weekDay[myDate.getDay()];
      }
      ,
      //获取可预约的日期集合
      async getPlanDayList() {
        let params = {
          communityId: this.communityId
        };
        let res_ = await
          repair.planDayList(params, this.userInfo.accessToken);
        if (res_ && res_.error) {
          if ('0' == res_.error.err_code && res_.list) {
            let len = res_.list.length;
            if (len == 0) {
              this.Toast('没有数据');
              return;
            }
            let data = [];//new Array(len);
            for (let i = 0; i < len; i++) {
              let items = {};
              if (i === 0) {
                items.text = res_.list[i] //+ '[今天]';
                items.value = res_.list[i];
              } else if (i === 1) {
                items.text = res_.list[i] //+ '[明天]';
                items.value = res_.list[i];
              } else {
                items.text = res_.list[i] //+ '['+ this.getWeekDay(res_.list[i]) +']';
                items.value = res_.list[i];
              }
              data.push(items);
            }
            this.planDayList[0] = data;
          } else {
            this.Toast(res_.error.err_msg);
          }
        } else {
          this.Toast("call planDayList interface exception");
        }
      }
      ,
      //获取选中日期下的可预约的时间段
      async getPlanTimeList(dateStr) {
        let params = {
          communityId: this.communityId,
          houseId: this.houseId,
          planDay: dateStr//this.planDay
        };
        let res_ = await
          repair.planTimeList(params, this.userInfo.accessToken);
        console.log(res_, ')*(****');
        if (res_ && res_.error) {
          if ('0' == res_.error.err_code && res_.list) {
            let len = res_.list.length;
            if (len == 0) {
              this.Toast('没有数据');
              return null;
            }
            let data = [];
            for (let i = 0; i < len; i++) {
              let items = {};
              items.text = res_.list[i].startTime + '-' + res_.list[i].endTime;
              items.value = res_.list[i].id;
              data.push(items);
            }
            this.planDayList[1] = data;
            return data;
          } else {
            this.Toast(res_.error.err_msg);
          }
        } else {
          this.Toast("call planTimeList interface exception");
        }
      }
      ,
      //获取房间列表
      async getRoomList() {
        let res = await
          system.getRoomList({communityId: ''}, this.userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code && res.list) {
            let flag = true
            this.roomList = res.list.map(v => {
              Object.assign(v, {
                text: v.community.name + v.building.name + v.house.name,
                value: v.house.id,
                data: v
              })
              return v
            });
            if (this.userInfo.houseId) {
              this.roomList.forEach(v => {
                if (v.house.id == this.userInfo.houseId) {
                  this.repairApplyForm.roomNumber = v.text;
                  this.houseId = v.value;
                  this.communityId = v.community.id
                  flag = false
                }
              })
            }
            if (flag) {
              if (this.userInfo.communityId) {
                this.roomList.forEach(v => {
                  if (v.community.id == this.userInfo.communityId) {
                    this.repairApplyForm.roomNumber = v.text;
                    this.houseId = v.value;
                    this.communityId = v.community.id
                    flag = false
                  }
                })
              }
            }
            if (flag) {
              this.repairApplyForm.roomNumber = this.roomList[0].text;
              this.houseId = this.roomList[0].value;
              this.communityId = this.roomList[0].community.id
            }
            console.log(this.roomList, '-=---==');
          } else {
            this.roomList = [];
            //this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call getRoomList interface exception");
        }
      }
      ,
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

          }
        }).show();
      }
      ,
      createActionSheet() {
        return this.$createActionSheet({
          cancelTxt: '取消',
          title: '报修类型',
          pickerStyle: false,
          data: this.repairTypeData,
          onSelect: (item, index) => {
            this.selectFn(item, index);
          },
          onCancel: () => {
            // this.Toast('canceled');
          }
        });
      }
      ,
      async selectFn(item, index) {
        if (item) {
          if (item.isParent) {
            let data = await
              this.getRepairType({parentId: item.id});
            if (data && data.length > 0) {
              this.repairTypeData = data;
              this.actionSheet = this.createActionSheet();
              if (this.actionSheet) this.actionSheet.show();
            }
          } else {
            this.repairTypeId = item.id;
            this.repairApplyForm.repairType = item.text;
          }
        }
      }
      ,
      async showRepairType() {
        let data = await
          this.getRepairType({parentId: 'ROOT'});
        if (data && data.length > 0) {
          this.repairTypeData = data;
          this.actionSheet = this.createActionSheet();
          if (this.actionSheet) this.actionSheet.show();
        }
      }
      ,
      // 点击打开下拉
      clickFn(item, key) {
        console.log(item)
        if (item.select) {
          document.activeElement.blur()
          switch (key) {
            case 'roomNumber':
              this.showRoomSelect(key);
              break;
            case 'appointmentTime':
              this.showDrawer();
              break;
            case 'repairType':
              this.showRepairType();
              break;
          }
        }
      },
      //提交
      async submit() {
        if (!this.communityId) {
          this.Toast('请选择房间')
          return
        }
        for (let key in this.repairApplyRules) {
          if (this.repairApplyRules[key].require) {
            if (this.repairApplyRules[key].orEnd(this.repairApplyForm[key])) {
              this.Toast(this.repairApplyRules[key].orEnd(this.repairApplyForm[key]));
              return;
            }
          }
        }

        let params = {
          channel: 'WECHAT_MAINTAIN',
          communityId: this.communityId,//项目id
          houseId: this.houseId,  //房间号用户关联表id
          reporterId: this.userInfo.id, //报修人id，当前用户id
          reporterName: this.repairApplyForm.repairPeople, //报修人
          reporterPhone: this.repairApplyForm.contactsPhone,  //报修人电话
          contentText: this.repairApplyForm.repairContent,  //报修内容
          maintainItemId: this.repairTypeId,  //报修类型id
          imageAttachment: this.imgFile,//上传图片
          // planDay: this.planDay,//预约时间
          // planTimeId: this.planTimeId
        }
        console.log(params, ')__');
        const toast = this.$createToast({time: 0, txt: '正在提交'}).show();
        let res = await
          repair.saveMaintain(params, ['imageAttachment']);
        toast.hide();
        if (res && res.error) {
          if ('0' == res.error.err_code) {
            this.Toast('添加成功');
            setTimeout(v => {
              this.$router.push({path: '/repairRecord'})
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
      }
      ,
      setStyle() {
        let title = document.getElementsByClassName('cube-drawer-title');
        if (title && title[0]) title[0].style = 'text-align:left';
        let panel = document.getElementsByClassName('cube-drawer-panel');
        if (panel && panel[1]) panel[1].style = 'margin-left:auto;';
      }
    },
    async mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      } else {
        await
          this.getUserInfo();//获取个人所有信息
        await
          this.getRoomList();//获取房间列表数据
        //await this.getProjectList();//获取项目id
        await
          this.getRepairType()//获取报修类型
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  #repairApply {
    height: calc(100% - 100px);
    overflow: hidden;
    overflow-y: auto;
    background-color: #F8F8F8;
    padding-top: 100px;

    /*.repairApply-title {*/
    /*width: 668px;*/
    /*text-align: left;*/
    /*margin: 0 auto;*/
    /*line-height: 70px;*/
    /*padding-top: 16px;*/
    /*color: #7E828E;*/
    /*font-size: 16px; !*no*!*/
    /*}*/

    /*.repairApply-main {*/
    /*padding: 0 41px;*/
    /*background-color: white;*/

    /*li {*/
    /*height: 120px;*/
    /*border-bottom: 1px solid #dcdcdc;*/
    /*}*/

    /*li:last-of-type {*/
    /*border-bottom: 0px;*/
    /*min-height: 120px;*/
    /*}*/

    /*}*/
    /*.repairApply-upload {*/
    /*background-color: white;*/
    /*padding: 0 41px;*/
    /*!*height: 190px;*!*/
    /*overflow: hidden;*/

    /*li {*/
    /*overflow: hidden;*/
    /*border-bottom: 1px solid #dcdc; !*no*!*/
    /*height: 190px;*/
    /*margin-bottom: 20px;*/
    /*}*/

    /*li:last-of-type {*/
    /*border-bottom: none;*/
    /*}*/

    /*}*/
    /*.repairApply-btn {*/
    /*height: 150px;*/
    /*margin-top: 40px;*/
    /*display: flex;*/
    /*align-items: center;*/

    /*span {*/
    /*display: block;*/
    /*width: 70%;*/
    /*margin: 0 auto;*/
    /*background: linear-gradient(to right, #A260A4, #C777C9);*/
    /*color: white;*/
    /*padding: 25px 0;*/
    /*font-size: 16px; !*no*!*/
    /*border-radius: 60px;*/
    /*text-align: center;*/
    /*}*/

    /*}*/

    /*新增的样式*/
    .repairApply-content {
      width: 750px;
      background: rgba(255, 255, 255, 1);
      padding: 20px 30px;
      padding-bottom: 30px;
      margin-top: 20px;
      margin-bottom: 20px;
      overflow: hidden;
      textarea {
        width: 100%;
        font-size: 32px;
        font-family: Source Han Sans CN;
        height: 280px;
        padding-top: 10px;
        overflow-x: hidden;
      }
      .repairApply-content-img {
        .repairApply-content-img-item {
          width: 150px;
          height: 150px;
          display: inline-block;
          border-radius: 4px;
          margin-right: 10px;
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
            width: 50px;
            height: 50px;
            display: inline-block;
            /* border: 1px dotted #000;*/
            background-image: url("../../assets/img/arrowRight.png");
            vertical-align: middle;
            background-size: cover;
            position: absolute;
            top: 18.5px;
            right: 20px;
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
            /*width: 64px;*/
            /*height: 64px;*/
            /*display: inline-block;*/
            /*border: 1px dotted #000;*/
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
            display: inline-block;
            width: calc(100% - 80px);
            height: 100%;
            font-size: 30px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(54, 56, 58, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .operation {
      position: absolute;
    }
  }
</style>
