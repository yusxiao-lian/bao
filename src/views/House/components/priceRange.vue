<template>
  <cube-popup type="extend-popup" ref="myPopup" position="center">
    <div class="priceRange">
      <div class="priceRange-top">输入价格区间</div>
      <div class="priceRange-com">
        <input type="number" placeholder="最低价" v-model="amountStart" />
        <span>至</span>
        <input type="number" placeholder="最高价" v-model="amountEnd" />
      </div>
      <div class="priceRange-bottom">
        <button class="btn1" @click="hide">取消</button>
        <button class="btn2" @click="ok">确定</button>
      </div>
    </div>
  </cube-popup>
</template>
<script>
export default {
  name: "priceRange",
  data() {
    return {
      amountStart: "",
      amountEnd: ""
    };
  },
  methods: {
    hide() {
      this.$refs["myPopup"].hide();
    },
    show() {
      this.$refs["myPopup"].show();
    },
    ok() {
      this.$emit("getDate", {
        amountStart: this.amountStart,
        amountEnd: this.amountEnd,
      });
      this.hide();
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.priceRange {
  background: white;
  padding: 40px 60px;
  border-radius: 10px;
  .priceRange-top {
    line-height: 40px;
    text-align: center;
    font-size: 34px;
    color: #333;
    margin-bottom: 60px;
  }
  .priceRange-com {
    display: flex;
    align-items: center;
    justify-content: center;
    > input {
      width: 220px;
      text-align: center;
      border: 2px solid #ddd;
      border-radius: 70px;
      height: 70px;
      padding: 0 15px;
    }
    > span {
      display: inline-block;
      line-height: 1.3;
      margin: 0 20px;
    }
  }
  .priceRange-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 60px 0 0 0;
    button {
      padding: 15px 70px;
      border-radius: 60px;
      display: flex;
      align-items: center;
      line-height: 1.2;
      font-size: 30px;
    }
    button.btn1 {
      color: #333;
      background: white;
      border: 2px solid #ddd;
    }
    button.btn2 {
      color: #fff;
      background: #a260a4;
      margin-left: 60px;
    }
  }
}
</style>