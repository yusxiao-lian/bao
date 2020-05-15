<template>
  <div class="rel-topic">
    <headerTab :title="$route.meta.title" />
    <div class="header"></div>
    <div class="content">
      <div class="title-line">
        <p class="title">基本信息</p>
      </div>
      <div class="detail">
        <div class="belog">
          <p class="label">话题分类</p>
          <p :class="type?'':'c-777'" class="p1" @click="showHousePicker">{{type?type:'请选择'}}</p>
          <img
            @click="showHousePicker"
            class="right-arrow"
            src="../../assets/neighbor/arrowRight.png"
            alt
          />
        </div>
        <div class="topic-msg">
          <p class="label">话题内容</p>
          <textarea class="msg-input" placeholder="请填写话题内容！" v-model="topicForm.contentText"></textarea>
          <!-- <cube-input class="msg-input" placeholder="请填写商品描述" v-model="value"></cube-input> -->
          <!-- <div :class="value?'':'c-bbb'" class="msg-input" :contenteditable="true">{{value}}</div> -->
        </div>
      </div>
      <div class="title-line">
        <p class="title">辅助信息</p>
      </div>
      <div class="detail-img">
        <div class="label">
          <p>发布图片</p>
        </div>
        <div class="img-box">
          <!-- <img src="../../assets/neighbor/addPicture.png" alt />
          <img src="../../assets/neighbor/addPicture.png" alt />
          <img src="../../assets/neighbor/addPicture.png" alt />
          <img src="../../assets/neighbor/addPicture.png" alt />
          <img src="../../assets/neighbor/addPicture.png" alt />
          <img src="../../assets/neighbor/addPicture.png" alt />-->
          <div class="repairApply-content-img">
            <div class="repairApply-content-img-item" v-for="(v,i) in imgFilePath">
              <img :src="v" alt @click="handleImgsClick(i)" />
              <i @click="deleteItem(i)"></i>
            </div>
            <div class="repairApply-content-img-item">
              <label for="male">
                <input id="male" type="file" accept="image/*" @change="fileLoadChange2" multiple />
                <img src="../../assets/neighbor/addPicture.png" alt />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="btn-bottom" @click="relTopic">发布话题</div>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import * as api from "../../service/neighbor/index.js";

export default {
  components: {
    headerTab
  },
  data() {
    return {
      value: "",
      type: "",
      userInfo: {},
      topicForm: {
        categoryId: "",
        communityId: "",
        topicIcon: [],
        contentText: "",
        topicTitle: ""
      },
      //-----------------
      housePicker: false,
      initialIndex: 0,
      imgs: [],
      imgFile: [], //提交的图片数据
      imgFilePath: [], //上传的图片列表
      selectedLabel: []
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.topicForm.communityId = this.userInfo.communityId;
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      let res = await api.categoryList();
      console.log(res);
      if (res.error.err_code === "0") {
        this.selectedLabel = res.list;
        res.list.map(item => {
          item.text = item.name;
          item.value = item.id;
        });
      }
    },
    showHousePicker() {
      if (!this.housePicker) {
        this.housePicker = this.$createPicker({
          title: "话题分类",
          data: [this.selectedLabel],
          onSelect: val => {
            this.topicForm.categoryId = val[0];
            this.selectedLabel.map(item => {
              if (item.value == this.topicForm.categoryId) {
                this.type = item.name;
              }
            });
          }
        });
      }
      this.housePicker.show();
    },
    async relTopic() {
      if (!this.topicForm.categoryId) {
        this.Toast("请选择话题分类!");
        return;
      }
      if (!this.topicForm.contentText) {
        this.Toast("请输入话题内容!");
        return;
      }
      this.topicForm.topicIcon = this.imgFile;
      let loading = this.$createToast({
        time: 0,
        txt: "发布中...",
        mask: true
      });
      loading.show();
      let res = await api.releaseTopic(this.topicForm, ["topicIcon"]);
      loading.hide();
      if (res.error.err_code === "0") {
        this.Toast("请等待后台审核...");
        this.$router.push({ name: "topicList" });
      }
    },
    // 图片放大
    handleImgsClick(index) {
      this.initialIndex = index;
      const params = {
        $props: {
          imgs: this.imgs,
          initialIndex: "initialIndex", // 响应式数据的key名
          loop: false
        },
        $events: {
          change: i => {
            // 必须更新 initialIndex
            this.initialIndex = i;
          }
        }
      };
      this.$createImagePreview({ ...params }).show();
    },
    // 删除某张图片
    deleteItem(i) {
      this.imgFilePath.splice(i, 1);
      this.imgFile.splice(i, 1);
      this.imgs.splice(i, 1);
    },
    photoCompress(file, w, objDiv) {
      var _this = this;
      var ready = new FileReader();
      /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
      ready.readAsDataURL(file);
      ready.onload = function() {
        var re = this.result;
        _this.canvasDataURL(re, w, objDiv);
      };
    },
    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.7; // 默认图片质量为0.7
        // //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    //上传文件方法
    fileLoadChange($event) {
      console.log($event);
      const _this = this;
      for (let i = 0; i < $event.target.files.length; i++) {
        let fileObj = $event.target.files[i]; // js 获取文件对象
        if (!/image\/\w+/.test(fileObj.type)) {
          _this.Toast("请选择图片");
          return false;
        }
        if (fileObj.type.indexOf("image") === -1) {
          _this.Toast("只能上传图片");
          return;
        }
        if (_this.imgFile.length >= 10) {
          _this.Toast("最多只能上传10张图片");
          return;
        }

        console.log("刚上传的图片大小" + fileObj.size);
        //表单对象可自行添加要发送的参数例如form.append("age"10) 则后台可接收到age=10的参数
        this.photoCompress(
          fileObj,
          {
            quality: 0.2
          },
          function(base64Codes) {
            //console.log("压缩后：" + base.length / 1024 + " " + base);
            var bl = _this.convertBase64UrlToBlob(base64Codes);
            console.log("压缩过的图片大小" + bl.size);
            _this.imgFilePath.push({ url: base64Codes });
            _this.imgs.push(base64Codes);
            // _this.imgFile.push(bl);
            _this.imgFile.push(fileObj);
          }
        );
      }
    },
    fileLoadChange2($event) {
      for (let i = 0; i < $event.target.files.length; i++) {
        let url = null,
          file = $event.target.files[i];
        if (window.createObjectURL != undefined) {
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(file);
        }
        if (file.type.indexOf("image") === -1) {
          this.Toast("只能上传图片");
          return;
        }
        if (this.imgFile.length > 10) {
          this.Toast("最多只能上传10张图片");
          return;
        }

        this.imgFile.push(file);
        // let list = {
        //   url: url
        // };
        this.imgFilePath.push(url);
        this.imgs.push(url);
        console.log(this.imgFile);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.rel-topic {
  background-color: #f8f8f8;
  height: 100vh;
  .header {
    height: 100px;
  }
  .content {
    background-color: #fff;
  }
  .title-line {
    height: 84px;
    line-height: 84px;
    padding-left: 40px;
    background-color: #f8f8f8;
    .title {
      font-size: 26px;
      font--: 500;
      color: #838895;
    }
  }
  .belog {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 40px;
    border-bottom: 1px solid #f1f1f1;

    .p1 {
      flex: 1;
      line-height: 80px;
      padding-left: 20px;
      color: #333;
    }
    .right-arrow {
      width: 32px;
      height: 52px;
    }
  }
  .topic-msg {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    margin: 0 40px;
    .msg-input {
      width: 480px;
      height: 180px;
      padding: 20px;
      border: transparent;
      flex: 1;
      outline: none;
      font-size: 30px;
      font--: 500;
      // color: rgba(180, 188, 204, 1);
      line-height: 44px;
      color: #333;
    }
  }
  .detail-img {
    display: flex;
    margin: 0 0 0 40px;
    padding-bottom: 10px;

    .img-box {
      flex: 1;
    }
    // .img-box {
    //   flex: 1;
    //   display: flex;
    //   flex-wrap: wrap;
    //   justify-content: space-between;
    //   img {
    //     margin: 15px;
    //     width: 130px;
    //     height: 130px;
    //   }
    // }
  }
  .bottom-box {
    position: fixed;
    bottom: 30px;
    width: 100%;
  }
  .btn-bottom {
    width: 670px;
    height: 88px;
    margin: 0 auto;
    background: #a260a4;
    border-radius: 44px;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    font--: bold;
    color: #f5f6f8;
  }
  .label {
    display: block;
    width: 180px;
    font-size: 30px;
    font--: 500;
    color: #323232;
    line-height: 88px;
  }
  .c-777 {
    color: #777 !important;
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
        max-width: 154px;
        max-height: 154px;
        position: absolute;
        top: 0;
      }

      i {
        width: 44px;
        height: 44px;
        display: inline-block;
        background-image: url("../../assets/neighbor/delete.png");
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

    // .repairApply-content-img-item:nth-child(4n) {
    //   margin-right: 0;
    // }
  }
}
</style>
<style lang="scss">
.rel-topic {
  .cube-textaera-active {
    border: transparent !important;
  }
}
</style>