<template>
  <div class="vehicle">
    <headerTab>
      <div slot="right" class="right" @click="addvehicle">
        添加车辆
      </div>
    </headerTab>
    <div class="content">
      <div class="content-item">
        <img src="../../assets/img/vehicle.png"/>
        <p>添加车辆</p>
        <p>足不出户办月卡</p>
        <div class="content-button" @click="addvehicle">
          添加车辆
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    name: "vehicle",
    components: {
      headerTab
    },
    methods: {
      addvehicle() {
        this.$router.push('/addVehicle')
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .vehicle {
    height: 100%;
    background-color: rgba(249, 249, 249, 1);
    .right {
      font-size: 25px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .content {
      margin-top: 100px;
      height: 100%;
      padding-top: 200px;
      .content-item {
        margin: 0 auto;
        text-align: center;
        img {
          margin: 0 auto;
          margin-bottom: 43px;
        }
        p {
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 44px;
        }
        .content-button {
          width: 320px;
          height: 88px;
          background: linear-gradient(90deg, rgba(162, 96, 164, 1), rgba(199, 119, 201, 1));
          border-radius: 44px;
          margin: 0 auto;
          margin-top: 60px;
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(245, 246, 248, 1);
          line-height: 88px;
          text-align: center;
        }
      }
    }
  }
</style>

