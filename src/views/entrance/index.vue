<template>
  <div class="openDoorList">
    <headerTab :showBackArrow="false" :title="'我的门禁'">
      <div slot="right" v-if="da.length>0||xia.length>1" class="right" @click="authorization">访客授权</div>
    </headerTab>
    <img
      v-if="platformType==1"
      class="scan"
      src="../../assets/entrance/scan.png"
      alt
      @click="handleScan"
    />
    <div class="main">
      <!-- <div class="text">请选择需要开门的门禁</div> -->
      <div class="openDoorList-l"></div>
      <ul class="openDoorList-ul">
        <li
          class="openDoorList-li"
          :class="{'lan':item.type==0&&item.enable,'wei':!item.enable}"
          v-for="item in da"
          @click="torouter(item)"
        >
          <div class="con">{{item.name}}</div>
          <div class="weiqi" v-if="!item.enable">未启用</div>
        </li>
      </ul>

      <ul class="openDoorList-ul">
        <li
          class="openDoorList-li"
          :class="{'wei':!item.enable}"
          v-for="item in xia"
          @click="torouter(item)"
        >
          <div class="con">{{item.name}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import * as personalMessage from "@/service/personalMessage";
import { headerTab } from "../../components/index";
import * as api from "../../service/entrance";

export default {
  name: "entrance",
  components: { headerTab },
  data() {
    return {
      userInfo: {},
      objData: [],
      da: [],
      xia: [],
      authFlag: false,
      havaEntrance: false,
      communitys: [],
      platformType: 0,
      entranceIds: "",
      QRRes: ""
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.getUserInfo();
    this.getGuardSettings();
  },
  methods: {
    async applyEntranceList() {
      let res = await api.applyEntranceList({
        communityId: this.userInfo.communityId
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          let ids = "";
          if (res.list[0]) {
            res.list.map(item => {
              ids = ids + item.id + ",";
            });
            ids = ids.substr(0, ids.length - 1);
            this.entranceIds = ids;
            this.addEntrance();
          } else {
            this.entranceList();
          }
        } else {
          this.entranceList();
        }
      }
    },
    async addEntrance() {
      let res = await api.addEntrance({
        communityId: this.userInfo.communityId,
        entranceIds: this.entranceIds
      });
      if (res && res.error) {
        this.entranceList();
      }
    },
    handleScan() {
      console.log("进入微信扫码");
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: res => {
          this.QRRes = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

          this.$router.push({
            name: "scanRes",
            query: {
              QRCodeRes: this.QRRes
            }
          });
        }
      });
      // this.$router.push({
      //   name: "scanRes",
      //   query: {
      //     QRCodeRes: "883B8B0E3E4A"
      //   }
      // });
    },
    async getGuardSettings() {
      let res = await api.getGuardSettings({
        communityId: this.userInfo.communityId
      });
      console.log(res);
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.platformType = res.obj.platformType;
        }
      }
    },
    // 判断是否开通了门禁
    async haveEntrance() {
      let res = await api.haveEntrance({
        communityId: this.userInfo.communityId,
        isH5: true
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.havaEntrance = res.obj.havaEntrance;
          if (this.havaEntrance) {
            // this.entranceList();
            this.applyEntranceList();
          } else {
            this.Toast("该小区暂时未开通门禁功能，敬请期待");
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast("call getUserInfo interface exception");
      }
    },
    torouter(item) {
      if (this.platformType == 0) {
        if (item.enable) {
          this.$router.push({ path: "/qrCode", query: { id: item.id } });
        } else {
          this.$createDialog({
            type: "alert",
            title: "门禁未启用，若有疑问请联系管理处",
            content: ""
          }).show();
        }
      } else if (this.platformType == 1) {
        if (item.enable) {
          // this.$router.push({
          //   path: "/scanRes",
          //   query: { id: item.id }
          // });
          this.qdUserOpenDoor(this.userInfo.communityId, item.id);
        } else {
          this.$createDialog({
            type: "alert",
            title: "门禁未启用，若有疑问请联系管理处",
            content: ""
          }).show();
        }
      }
    },
    jude(item) {
      console.log(this.objData.valid, "(****");
      if (this.objData.valid === 1) {
        if (item.communityDoor) {
          return {
            lan: true
          };
        } else {
          return {
            zi: true
          };
        }
      } else if (this.objData.valid === 2) {
        return {
          shi: true
        };
      } else if (this.objData.valid === 0) {
        return {
          wei: true
        };
      }
    },
    authorization() {
      this.$router.push({
        path: "/visitors",
        query: { maxDay: this.objData[0].maxDay }
      });
    },
    //门禁授权列表
    async userEntranceList() {
      let res = await api.userEntranceList({
        communityId: this.userInfo.communityId
      });
      if (res) {
        if (res.error.err_code === "0") {
          this.objData = res.list;
          this.xia = [];
          this.da = [];
          this.objData.forEach(v => {
            if (v.communityDoor) {
              this.da.push(v);
            } else {
              this.xia.push(v);
            }
          });
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    //获取历史记录有门禁
    async entranceList() {
      let useInfo = localStorage.getItem("userInfo");
      useInfo = useInfo ? JSON.parse(useInfo) : {};
      let res = await api.entranceList({ communityId: useInfo.communityId });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          // 如果授权的有数据就使用有数据的
          if (res.list.length > 0) {
            this.objData = res.list;
            this.xia = [];
            this.da = [];
            this.objData.forEach(v => {
              if (v.communityDoor) {
                this.da.push(v);
              } else {
                this.xia.push(v);
              }
            });
            // 如果没有就调全部的
          } else {
            this.userEntranceList();
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast(res.error.err_msg);
      }
    },
    //判断用户是否有认证的房间
    async getUserInfo() {
      let useInfo = localStorage.getItem("userInfo");
      useInfo = useInfo ? JSON.parse(useInfo) : {};
      let res = await personalMessage.getUserInfo({
        communityId: useInfo.communityId
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          if (!res.obj) {
            this.Toast("没有数据");
            return;
          }
          res.obj.communitys.forEach(v => {
            if (v === useInfo.communityId) {
              this.authFlag = true;
              useInfo.authFlag = true;
              localStorage.setItem("userInfo", JSON.stringify(useInfo));
            }
          });
          this.communitys = res.obj.communitys;
          if (!this.authFlag) {
            this.showBtn();
            return;
          } else {
            this.haveEntrance();
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      } else {
        this.Toast(res.error.err_msg);
      }
    },
    showBtn() {
      this.$createDialog({
        type: "confirm",
        icon: "cubeic-alert",
        content: "未认证当前社区",
        confirmBtn: {
          text: this.communitys.length > 0 ? "切换房间" : "去认证",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "取消",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
          this.$router.push("/HouseList");
        },
        onCancel: () => {}
      }).show();
    },
    // -----------千丁一键开门
    async qdUserOpenDoor(communityId, entranceId) {
      let loading = this.$createToast({
        time: 0,
        txt: "开门中...",
        mask: true
      });
      loading.show();
      let res = await api.qdOpenDoor({
        communityId: communityId,
        entranceId: entranceId
      });
      loading.hide();
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.Toast("开门成功！");
        } else if ("1" == res.error.err_code) {
          this.Toast("一键开门失败，请点击左上角使用扫码开门！");
        }
      }
    },
    async qdVisitorOpenDoor(communityId, entranceId) {
      let loading = this.$createToast({
        time: 0,
        txt: "开门中...",
        mask: true
      });
      loading.show();
      let res = await api.qdVisitorOpenDoor({
        communityId: communityId,
        entranceId: entranceId
      });
      loading.hide();
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          this.Toast("开门成功！");
        } else if ("1" == res.error.err_code) {
          this.Toast("一键开门失败，请点击左上角使用扫码开门！");
        }
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.scan {
  width: 48px;
  height: 43px;
  position: absolute;
  top: 26px;
  left: 70px;
  z-index: 3;
}
.openDoorList {
  height: 100%;
  padding-top: 120px;
  .right {
    width: 200px;
    min-width: 160px !important;
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .main {
    height: calc(100% - 10px);
    overflow: hidden;
    overflow-y: auto;
    padding: 0 50px;
    .text {
      font-size: 30px;
      margin-bottom: 40px;
      text-align: center;
      line-height: 40px;
      color: #9b9b9b;
    }
  }
  .miao {
    font-size: 30px;
    color: #9b9b9b;
    padding: 50px 0;
    line-height: 50px;
    text-align: center;
    > span {
      color: #52c7c5;
    }
  }
  .openDoorList-l {
    padding: 0 50px;
  }
  .openDoorList-ul {
    border-bottom: 1px solid #ddd; /*no*/
    margin-bottom: 30px;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .openDoorList-li {
    height: 136px;
    background: url("../../assets/img/bg2.png") no-repeat center;
    background-size: 100% 136px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    position: relative;
    &:before {
      content: "";
      display: inline-block;
      width: 64px;
      height: 64px;
      background: url("../../assets/img/icon_door.png") no-repeat center;
      background-size: 64px;
      margin-right: 10px;
    }
    &:after {
      content: "";
      display: inline-block;
      width: 64px;
      height: 64px;
      background: url("../../assets/img/next.png") no-repeat center;
      background-size: 64px;
    }
    .con {
      width: calc(100% - 150px);
      height: 70px;
      line-height: 70px;
      color: white;
      font-size: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .openDoorList-li.lan {
    background: url("../../assets/img/bg1.png") no-repeat center;
    background-size: 100% 136px;
  }
  .openDoorList-li.wei {
    background: url("../../assets/img/bg4.png") no-repeat center;
    background-size: 100% 136px;
  }
  .openDoorList-li.wei {
    &:after {
      width: 94px;
      height: 94px;
      /*background: url("../../assets/img/ineffective.png") no-repeat center;*/
      /*background-size: 94px;*/
    }
    &:before {
      background: none;
    }
    .con {
      width: calc(100% - 170px);
      height: 70px;
      color: #a8a8a8;
    }
  }

  .openDoorList-li.shi {
    background: url("../../assets/img/bg3.png") no-repeat center;
    background-size: 100% 136px;
  }
  .openDoorList-li.shi {
    &:after {
      width: 94px;
      height: 94px;
      background: url("../../assets/img/Invalid.png") no-repeat center;
      background-size: 94px;
    }
    &:before {
    }
    .con {
      width: calc(100% - 170px);
      height: 70px;
    }
  }
  .weiqi {
    position: absolute;
    right: 100px;
    color: #a8a8a8;
  }
}
</style>
