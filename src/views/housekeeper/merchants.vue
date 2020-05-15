<template>
  <div class="merchants">
    <div class="merchants-item">
      <img class="store" :src="item.iconUrl" />
      <p class="title">{{item.name}}</p>
      <p class="phone">{{item.tel}}</p>
      <a :href="'tel:'+item.tel">
        <i class="phone_img"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "merchants",
  props: {
    item: {
      default() {
        return {};
      }
    }
  },
  mounted(){
    console.log(this.item,'000')
  }
};
</script>

<style lang="scss" scoped>
.merchants {
  margin-top: 30px;
  background: rgba(255, 255, 255, 1);
  padding: 0 30px;

  .merchants-item {
    height: 160px;
    padding-left: 141px;
    padding-right: 42px;
    position: relative;
    padding-top: 44px;
    border-bottom: 1px solid rgba(215, 215, 215, 1);

    .store {
      position: absolute;
      left: 29px;
      top: 40px;
      width: 90px;
      height: 90px;
      display: inline-block;
      // background-image: url("../../assets/convenience_img/McDonald's.png");
      background-size: cover;
    }

    .title {
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 19px;
    }

    .phone {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }

    .phone_img {
      position: absolute;
      right: 42px;
      top: 58px;
      width: 40px;
      height: 44px;
      display: inline-block;
      background-image: url("../../assets/convenience_img/tel.png");
      background-size: cover;
    }
  }
}
</style>
