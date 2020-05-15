<template>
  <div class="roomData">
    <headerTab></headerTab>
    <div class="roomData-content">
      <h2>选择身份信息</h2>
      <p>{{name}}</p>
      <div
        :class="{'roomData-div':true,'roomData-div-shadow':flag==v.code}"
        @click="isShadow(v.code)"
        v-for="(v,i) in listType"
      >
        <p class="p1">{{v.name}}</p>
        <p class="p2">{{v.text}}</p>
        <i :class="{'i1':v.code==1,'i2':v.code==2,'i3':v.code==3}"></i>
      </div>

      <div class="roomData-button" @click="confirm">确认</div>
    </div>
    <div class="mask" v-if="showMask">
      <div class="mask_top" @click="cancel"></div>
      <div class="mask_conten">
        <div class="mask_conten_top">
          <span>真实姓名</span>
          <input type="text" v-model="realName" />
        </div>
        <div @click="submit" class="mask_conten_bottom">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components/index";
import {
  customerApply,
  customerTypes,
  createOwnerApply,
  updateUser
} from "../../service/House";

export default {
  name: "",
  data() {
    return {
      flag: "",
      listType: [],
      name: "",
      houseId: "",
      userInfo: "",
      showMask: false,
      realName: "" //真实姓名
    };
  },
  components: { headerTab },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.customerTypes();
    let obj = this.$store.state.activeHouse;
    this.name =
      obj.cityName + obj.communityName + obj.buildingName + obj.houseName;
    this.houseId = obj.houseId;
  },
  methods: {
    goBack() {
      this.$router.push({ path: "/addHouse/room", flag: false });
    },
    isShadow(type) {
      this.flag = type;

      console.log(this.$store.state);
    },
    // 取消
    cancel() {
      this.showMask = false;
    },
    // 确认
    confirm() {
      this.showMask = true;
    },
    // 提交
    async submit() {
      if (!this.realName) {
        this.Toast("请填写真实姓名");
        return;
      }
      await this.updateUser(this.realName, this.userInfo.loginName);
      let data = {
        houseId: this.houseId,
        applyType: this.flag
      };
      const toast = this.$createToast({ time: 0, txt: "正在提交" }).show();
      let res = await customerApply(data);
      toast.hide();
      if (res) {
        console.log(this.flag);
        if (res.error.err_code == "0") {
          if (this.flag != 1) {
            this.Toast(res.error.err_msg);
            await setTimeout(v => {
              this.$router.push("/merchantsHome");
            }, 800);
          } else {
            this.createOwnerApply(this.realName, this.userInfo.loginName);
          }
        } else if (res.error.err_code == "10") {
          if (this.flag == 1) {
            customerApply({
              houseId: this.houseId,
              applyType: 11
            }).then(res => {
              if (res.error.err_code == "0") {
                //this.createOwnerApply(this.realName, this.userInfo.loginName);
                this.showMask = false;
                setTimeout(v => {
                  this.$router.push("/merchantsHome");
                }, 800);
              }
              if (res.error.err_msg) {
                this.Toast(res.error.err_msg);
              }
            });
          }
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    // 修改个人信息
    async updateUser(name, phone) {
      let data = {
        name: name,
        phone: phone
      };
      let res = await updateUser(data);
      if (res) {
        this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        this.userInfo.fullName = name;
        window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      }
    },
    // 获取当前角色
    async customerTypes() {
      let res = await customerTypes();
      if (res) {
        console.log(res);
        if (res.error.err_code === "0") {
          res.list.forEach((v, i) => {
            if (v.code == 1) {
              v.text = "房屋所有者，点我认证";
            } else if (v.code == 2) {
              v.text = "房屋承租者，点我认证";
            } else if (v.code == 3) {
              v.text = "房屋所属家人，点我认证";
            }
          });
          this.listType.push(res.list[0]);
          this.listType.push(res.list[2]);
          this.listType.push(res.list[1]);
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    },
    async createOwnerApply(realName, phone) {
      let data = {
        houseId: this.houseId,
        realName: realName,
        phone: phone,
        applyType: 11
      };
      let res = await createOwnerApply(data);
      if (res) {
        if (res.error.err_code === "0") {
          // this.Toast(res.error.err_msg);
          setTimeout(v => {
            this.$router.push("/HouseList");
          }, 800);
        } else {
          this.Toast(res.error.err_msg);
        }
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.roomData {
  height: 100%;

  .roomData-content {
    margin-top: 100px;
    padding: 0 50px;
    background-color: rgb(249, 249, 249);
    height: 100%;

    h2 {
      font-size: 52px;
      font-family: PingFang;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 80px;
      margin-bottom: 40px;
    }

    p {
      font-size: 32px;
      font-family: PingFang;
      font-weight: 500;
      color: rgba(131, 136, 149, 1);
    }
  }

  .roomData-div {
    margin-top: 40px;
    padding: 50px;
    width: 650px;
    height: 190px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    position: relative;

    .p1 {
      font-size: 40px;
      font-family: PingFang;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 20px;
    }

    .p2 {
      font-size: 24px;
      font-family: PingFang;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }

    i {
      width: 120px;
      height: 120px;
      display: inline-block;
      position: absolute;
      top: 35px;
      right: 30px;
    }

    .i1 {
      background-image: url("../../assets/img/auto_ico_iden_owner.png");
      background-size: cover;
    }

    .i2 {
      background-image: url("../../assets/img/auto_ico_iden_lessee.png");
      background-size: cover;
    }

    .i3 {
      background-image: url("../../assets/img/auto_ico_iden_family.png");
      background-size: cover;
    }
  }

  .roomData-div-shadow {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
  }

  .roomData-button {
    margin-top: 94px;
    width: 650px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(162, 96, 164, 1),
      rgba(199, 119, 201, 1)
    );
    border-radius: 45px;
    font-size: 36px;
    font-family: PingFang;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.4);

    .mask_top {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .mask_conten {
      position: relative;
      z-index: 10;
      width: 500px;
      margin: 0 auto;
      margin-top: 450px;
      border-radius: 20px;
      background-color: #fff;

      .mask_conten_top {
        /*height: 220px;*/
        padding: 30px 20px;
        padding-top: 30px;
        border-bottom: 2px solid #cccccc;

        span {
          font-size: 30px;
        }

        input {
          margin-left: 10px;
          padding-left: 10px;
          height: 70px;
          width: 300px;
          border: 2px solid #cccccc;
          border-radius: 10px;
        }

        p {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.5);
          margin-top: 40px;
        }
      }

      .mask_conten_bottom {
        height: 80px;
        text-align: center;
        line-height: 80px;
        font-size: 36px;
      }
    }
  }
}
</style>
