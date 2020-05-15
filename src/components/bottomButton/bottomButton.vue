<template>
  <div class="chargeProject-btn" :style="{'background-color': bgColor}">
    <button :class="{'isButton':!isDisabled}" :disabled="isDisabled" @click="$emit('click')">
      <slot>提交</slot>
    </button>
  </div>
</template>

<script>
export default {
  name: "bottomButton",
  props: {
    bgColor: {
      default: "#F8F8F8",
      type: String
    },
    bgcolor: {
      default: "#F8F8F8",
      type: String
    },
    isDisabled: {
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.chargeProject-btn {
  // position: absolute;
  // bottom: 0px;
  // left: 0;
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  background-color: #f8f8f8;
  box-shadow: 0 0 10px 0px #ccc;

  button {
    color: white;
    height: 88px;
    width: 86%;
    font-size: 30px;
    // font-weight: 700;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ccc;
  }
  .isButton {
    background: linear-gradient(to right, #a260a4, #c777c9);
  }
}
</style>
