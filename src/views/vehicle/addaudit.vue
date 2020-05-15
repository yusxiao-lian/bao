<template>
  <div class="addVehicle">
    <headerTab></headerTab>
    <div class="addVehicle-content">
      <div class="addVehicle-content-img">
        <span v-for="v in objList.numberPlateS">{{v}}</span>
      </div>
      <div class="addVehicle-content-item">
        <ul>
          <li @click="showRoomSelect(parkingList,'停车场')">
            <span class="span1">停车场</span>
            <span class="span2">{{objList.parkingName}}</span>
            <i></i>
          </li>
          <li @click="showRoomSelect(carModelList,'车辆类型')">
            <span class="span1">车辆类型</span>
            <span class="span2">{{objList.carModelName}}</span>
            <i></i>
          </li>
          <li @click="showRoomSelect(carTypeList,'月卡类型')">
            <span class="span1">月卡类型</span>
            <span class="span2">{{objList.carTypeName}}</span>
            <i></i>
          </li>
          <li>
            <span class="span1">月卡价格</span>
            <span class="span2">{{num}}元/月</span>
          </li>
          <li class="prompt" v-if="useRules.length>0">
            <p v-for="iten in useRules">{{iten}}</p>
          </li>
        </ul>
      </div>
      <div class="addVehicle-content-item">
        <ul>
          <li>
            <span class="span-top">选填信息</span>
          </li>
          <li>
            <span class="span1">品牌</span>
            <input type="text" v-model="objList.carBrand" placeholder="请输入车辆品牌"/>
          </li>
          <li>
            <span class="span1">型号</span>
            <input type="text" v-model="objList.typeCar" placeholder="请输入车辆型号"/>
          </li>
          <li>
            <span class="span1">颜色</span>
            <input type="text" v-model="objList.color" placeholder="请输入车辆颜色"/>
          </li>
        </ul>
      </div>
      <div class="addVehicle-upload">
        <p class="addVehicle-title">请拍照上传有效月卡资料</p>
        <div class="repairApply-content-img">
          <div class="repairApply-content-img-item" v-for="(v,i) in imgFilePath">
            <img :src="v.url" alt="" @click="handleImgsClick(i)">
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
    </div>
    <bottomButton class="HouseList-btn" @click="addItem">添加</bottomButton>
  </div>
</template>

<script>
  import {headerTab, bottomButton} from "../../components/index";
  import * as api from "../../service/vehicle";

  export default {
    name: "addVehicle",
    data() {
      return {
        initialIndex: 0,
        imgs: [],
        imgFile: [],//提交的图片数据
        imgFilePath: [],//上传的图片列表
        num: 0,
        checked: true,
        objList: {
          numberPlateS: "",
          numberPlate: "", //车牌号
          parkingName: "", //停车场
          parkingId: "", //停车场id
          carModelName: "", //停车场类型
          carModelId: "", //停车场类型id
          carTypeName: "", //月卡
          carTypeId: "", //月卡id
          houseId: ""
        }, //当前车辆信息
        userInfo: "", //个人信息
        parkingList: [], //停车场下拉数据
        carModelList: [], //车辆型号
        carTypeList: [], //车辆月卡
        useRules: "" //月卡权限说明
      };
    },
    components: {headerTab, bottomButton},
    async created() {
      this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      this.objList.houseId = this.userInfo.houseId;
      if (this.$route.query.infoId) {
        await this.getInfoById();
      } else {
        let arr = [];
        for (let i = 0; i < this.$route.query.numberPlate.length; i++) {
          if (i == 2) {
            arr.push("·");
          }
          arr.push(this.$route.query.numberPlate[i]);
        }
        this.objList.numberPlateS = arr;
        this.objList.numberPlate = this.$route.query.numberPlate;
      }
      await this.getParkinfo();
      await this.getCarModel();
      await this.getCarType();

    },
    methods: {
      // 图片放大
      handleImgsClick(index) {
        this.initialIndex = index
        const params = {
          $props: {
            imgs: this.imgs,
            initialIndex: 'initialIndex', // 响应式数据的key名
            loop: false
          },
          $events: {
            change: (i) => {
              // 必须更新 initialIndex
              this.initialIndex = i
            }
          }
        }
        this.$createImagePreview({...params}).show()
      },
      // 删除某张图片
      deleteItem(i) {
        this.imgFilePath.splice(i, 1)
        this.imgFile.splice(i, 1)
        this.imgs.splice(i, 1)
      },
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
        if (_this.imgFile.length >= 10) {
          _this.Toast('最多只能上传10张图片')
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
          _this.imgs.push(base64Codes)
          _this.imgFile.push(bl);

        });

      },
      async agreement() {
        let params = {
          communityId: this.userInfo.communityId,
          channelCode: "TCXY",
          label: "TCXY"
        };
        let res = await api.doc(params);
        if (res.error.err_code == 0) {
          this.$router.push({
            name: "agreement",
            params: {content: res.obj.content}
          });
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 添加月保车辆
      async addItem() {
        // if (!this.checked) {
        //   this.Toast('请勾选停车场管理协议');
        //   return;
        // }
        let params = {
          communityId: this.userInfo.communityId, //项目id
          numberPlate: this.objList.numberPlate, //车牌号码
          parkingId: this.objList.parkingId, //停车场id
          type: "monthlyApply" //月保申请默认传monthlyApply
        };
        console.log(params, "YYYYYYY");
        let toast = this.$createToast({time: 0, txt: "正在提交"}).show();
        let res = await api.judgement(params);
        toast.hide();
        if (res.error.err_code == 0) {
          this.monthlyCarApply();
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 提交月保申请
      async monthlyCarApply() {
        let params = {
          communityId: this.userInfo.communityId, //项目id
          numberPlate: this.objList.numberPlate, //车牌号码
          parkingId: this.objList.parkingId, //停车场id
          carModelId: this.objList.carModelId, //车型id
          carModelName: this.objList.carModelName, //车型名称
          carTypeId: this.objList.carTypeId, //月卡id
          carTypeName: this.objList.carTypeName, //月卡名称
          color: this.objList.color?this.objList.color:'', //车辆颜色
          typeCar: this.objList.typeCar?this.objList.typeCar:'', //车辆型号
          carBrand: this.objList.carBrand?this.objList.carBrand:'', //车辆品牌
          houseId: this.userInfo.houseId, //房间id
          fileAttachments: this.imgFile,//上传图片的数据
        };
        console.log(params,'POPOPO');
        let toast = this.$createToast({time: 0, txt: "正在提交"}).show();
        let res = await api.monthlyCarApply(params, ['fileAttachments']);
        toast.hide();
        if (res.error.err_code == 0) {
          this.Toast(res.error.err_msg);
          setTimeout(v => {
            this.$router.push({path: "/myVehicle"});
          }, 800);
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取当前车辆信息
      async getInfoById() {
        let params = {infoId: this.$route.query.infoId};
        let res = await api.getInfoById(params);
        if (res.error.err_code == 0) {
          let arr = [];
          for (let i = 0; i < res.obj.numberPlate.length; i++) {
            if (i == 2) {
              arr.push("·");
            }
            arr.push(res.obj.numberPlate[i]);
          }
          res.obj.numberPlateS = arr;
          // console.log(res.obj.numberPlate);
          this.objList = res.obj;
          console.log(this.objList, "wwwww");
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取停车场列表
      async getParkinfo() {
        let params = {communityId: this.userInfo.communityId};
        let res = await api.getParkinfo(params);
        if (res.error.err_code == 0) {
          console.log(res, "停车场列表");
          res.list.forEach((v, i) => {
            let list = {
              value: v.parkingId,
              text: v.parkingName
            };
            this.parkingList.push(list);
          });

          if (this.objList.parkingId == "") {
            this.objList.parkingId = this.parkingList[0].value;
            this.objList.parkingName = this.parkingList[0].text;
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取停车场车型
      async getCarModel() {
        let params = {
          communityId: this.userInfo.communityId,
          parkingId: this.objList.parkingId
        };
        let res = await api.getCarModel(params);
        if (res.error.err_code == 0) {
          console.log(res, "停车场车型");
          if (res.list.length > 0) {
            res.list.forEach((v, i) => {
              let list = {
                value: v.carModelID,
                text: v.carModelName
              };
              this.carModelList.push(list);

              if (this.objList.carModelId == "") {
                this.objList.carModelId = this.carModelList[0].value;
                this.objList.carModelName = this.carModelList[0].text;
              }
            });
          }
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 获取停车场月卡信息
      async getCarType() {
        let params = {
          communityId: this.userInfo.communityId,
          parkingId: this.objList.parkingId
        };
        let res = await api.getCarType(params);
        if (res.error.err_code == 0) {
          console.log(res, "停车场月卡信息");
          if (res.list.length > 0) {
            res.list.forEach((v, i) => {
              let list = {
                value: v.carTypeID,
                text: v.carTypeName,
                num: v.amount,
                useRules: v.useRules
              };
              this.carTypeList.push(list);
              this.num = this.carTypeList[0].num;
              if (this.objList.carTypeId == "") {
                this.objList.carTypeId = this.carTypeList[0].value;
                this.objList.carTypeName = this.carTypeList[0].text;
                this.useRules = this.carTypeList[0].useRules
                  ? this.carTypeList[0].useRules.split("\r\n")
                  : "";
              }
            });
          }
          console.log(this.carTypeList, "JJJJJJJJJ");
        } else {
          this.$createDialog({
            type: "alert",
            title: res.error.err_msg,
            content: ""
          }).show();
        }
      },
      // 下拉数据
      showRoomSelect(arr, val) {
        console.log(arr);
        this.$createPicker({
          title: val,
          data: [arr],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            console.log(999);
            console.log(val);
            switch (val) {
              case "停车场":
                this.objList.parkingName = selectedText[0];
                this.objList.parkingId = selectedVal[0];
                this.objList.carModelName = "";
                this.objList.carModelId = "";
                this.objList.carTypeName = "";
                this.objList.carTypeId = "";
                this.getCarModel();
                this.getCarType();
                break;
              case "车辆类型":
                this.objList.carModelName = selectedText[0];
                this.objList.carModelId = selectedVal[0];
                break;
              case "月卡类型":
                console.log(arr);
                arr.forEach(v => {
                  if (v.value == selectedVal[0]) {
                    this.num = v.num;
                    this.useRules = v.useRules ? v.useRules.split("\r\n") : "";
                  }
                });
                this.objList.carTypeName = selectedText[0];
                this.objList.carTypeId = selectedVal[0];
                break;
            }
          },
          onCancel: () => {
          }
        }).show();
      }
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  .addVehicle {
    padding-top: 100px;
    height: 100%;
    background-color: #f1f1f1;

    .addVehicle-content {
      height: calc(100% - 130px);
      overflow-x: hidden;
      overflow-y: auto;

      .addVehicle-content-img {
        height: 220px;
        background-image: url("../../assets/img/addcheliang.png");
        background-size: cover;
        font-size: 48px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        padding-left: 80px;
        line-height: 220px;
      }

      .addVehicle-content-item {
        padding-left: 35px;
        padding-right: 35px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.02);
        margin-bottom: 28px;

        ul {
          li {
            height: 88px;
            line-height: 88px;
            border-bottom: 1px solid rgba(240, 242, 245, 1);
            position: relative;

            .span-top {
              font-size: 24px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #333;
            }

            .span1 {
              font-size: 28px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 89px;
            }

            .span2,
            input {
              font-size: 30px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              line-height: 89px;
              position: absolute;
              right: 50px;
            }

            input {
              text-align: right;
            }

            i {
              width: 50px;
              height: 50px;
              display: inline-block;
              background-size: cover;
              background-image: url("../../assets/img/arrowRight.png");
              position: absolute;
              right: 0;
              top: 19px;
            }
          }

          .prompt {
            padding: 5px 0;
            height: auto;

            p {
              font-size: 26px;
              line-height: 1.2;
              margin-bottom: 10px;
              color: #333333;
              font-weight: 700;
            }

            span {
              display: inline-block;
              font-weight: 700;
            }
          }
        }
      }

      .addVehicle-content-check {
        padding-left: 30px;
        margin-bottom: 30px;

        .checkbox-span {
          font-size: 28px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          color: #a260a4;
          display: inline-block;
          height: 100%;
          line-height: 60px;
        }
      }

      .addVehicle-upload {
        padding: 0 35px;
        padding-bottom: 35px;

        .addVehicle-title {
          font-size: 30px;
        }

        .repairApply-content-img {
          .repairApply-content-img-item {
            width: 154px;
            height: 154px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 18px;
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
    }

    .HouseList-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10;
    }
  }
</style>
<style lang="scss" type="text/scss">
  .addVehicle {
    .cube-checkbox-label {
      margin-left: 30px !important;
      font-size: 28px !important;
    }

    .cubeic-right {
      transform: scale(2.23) !important;
    }

    .cube-checkbox-ui::before {
      transform: scale(2.23) !important;
    }

    .cube-checkbox {
      display: inline-block;
    }
  }

  .cube-dialog-title-def {
    text-align: left !important;
  }
</style>
