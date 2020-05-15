<template>
  <div class="instructions">
    <headerTab></headerTab>
    <div class="instructions_content">
      <div class="instructions_content_tingche">
        <div class="instructions_content_top">
          <i class="i1"></i>
          <span>停车场管理规定</span>
        </div>
        <div class="instructions_content_bottom">
          <p v-for="v in rules">{{v}}</p>
          </div>
      </div>
      <div class="instructions_content_tingche">
        <div class="instructions_content_top">
          <i class="i2"></i>
          <span>收费标准</span>
        </div>
        <div class="instructions_content_bottom">
          <p v-for="v in feeStandards">{{v}}</p>
        </div>
      </div>
      <div class="instructions_wen">
        <i></i>
        <span>温馨提示：请在缴费完成后15分钟离场！</span>
      </div>
    </div>
    <div class="instructions_determine" @click="clickBack">确定</div>
    <!-- <commodityFooter>
      <div class="instructions_determine" @click="clickBack">确定</div>
    </commodityFooter> -->
  </div>
</template>

<script>
import { headerTab, commodityFooter } from "../../components/index";
import * as api from "../../service/vehicle";

export default {
  name: "instructions",
  components: {
    headerTab,
    commodityFooter
  },
  data() {
    return {
      rules: "", //停车场管理规定
      feeStandards: "" //收费标准
    };
  },
  created() {
    this.getParkSettings();
  },
  methods: {
    clickBack() {
      this.$router.goBack();
    },
    // 获取缴费说明
    async getParkSettings() {
      let params = {
        communityId: this.$route.query.communityId //项目id
      };
      let res = await api.getParkSettings(params);
      if (res.error.err_code == 0) {
        // let str =  res.obj.rules.replace(/↵/g,"<br/>");

        this.rules = res.obj.rules ? res.obj.rules.split("\r\n") : "";
        this.feeStandards = res.obj.feeStandards
          ? res.obj.feeStandards.split("\r\n")
          : "";
      } else {
        this.$createDialog({
          type: "alert",
          title: res.error.err_msg,
          content: ""
        }).show();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.instructions {
  background-color: #f9f9f9;
  // padding: 60px;
  padding-top: 110px;
  height: 100%;

  .instructions_content {
    // background-color: #fff;
    // border-radius: 15px;
    padding-bottom: 30px;

    .instructions_content_tingche {
      padding: 0 30px 10px 30px;
      border-bottom: 1px solid #eeeeee;

      .instructions_content_top {
        height: 80px;
        line-height: 80px;
        padding-left: 5px;

        .i1 {
          width: 42px;
          height: 42px;
          display: inline-block;
          background-image: url("../../assets/img/biaozhun.png");
          background-size: cover;
          vertical-align: middle;
        }

        .i2 {
          width: 42px;
          height: 42px;
          display: inline-block;
          background-image: url("../../assets/img/shoufei.png");
          background-size: cover;
          vertical-align: middle;
        }

        span {
          // font-weight: 600;
          color: #1a1a1a;
          font-size: 28px;
        }
      }

      .instructions_content_bottom {
        padding: 0 20px;
        padding-top: 5px;

        p {
          color: #666666;
          font-size: 24px;
          line-height: 35px;
          // margin-bottom: 40px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .instructions_wen {
      padding: 30px;
      span {
        font-size: 26px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: rgba(26, 26, 26, 1);
      }
    }
  }

  .instructions_determine {
    margin: 0 auto;
    width: 690px;
    height: 88px;
    line-height: 88px;
    color: #fff;
    font-size: 32px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(162, 96, 164, 1),
      rgba(199, 119, 201, 1)
    );
    border-radius: 44px;
  }
}
</style>
