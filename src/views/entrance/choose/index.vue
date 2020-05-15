<template>
  <div class="visitors-check" v-if="invitation">
    <div class="visitors-zhezhao" @click="down"></div>
    <div class="visitors-content">
      <div class="visitors-content-top">
        <span class="span1" @click="down">取消</span>
        <span>{{title}}</span>
        <span class="span2" @click="confirm">确认</span>
      </div>
      <ul>
        <li v-for="(v,i) in dataList">
          <cube-checkbox v-model="v.checked">
            {{v.name}}
          </cube-checkbox>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    props: ['dataList', 'invitation','title'],
    methods: {
      down() {
        this.$emit('down')
      },
      confirm() {
        this.$emit('confirm',this.dataList)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .visitors-check {
    position: absolute;
    z-index: 999999;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    .visitors-zhezhao {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .visitors-content {
      position: absolute;
      bottom: 0px;
      z-index: 2;
      height: 550px;
      width: 100%;
      overflow-y: auto;
      background-color: #fff;
      padding-top: 80px;
      .visitors-content-top {
        height: 80px;
        text-align: center;
        line-height: 80px;
        padding: 0 20px;
        border-bottom: 1Px solid #f1f1f1;
        font-size: 26px;
        width: 100%;
        position: fixed;
        bottom: 470px;
        background-color: #fff;
        z-index: 20;
        .span1 {
          width: 80px;
          font-size: 26px;
          color: #999;
          float: left;
          text-align: center;
        }
        .span2 {
          width: 80px;
          font-size: 26px;
          color: #A260A4;
          float: right;
          text-align: center;
        }
      }
      ul {

      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  .visitors-check {
    .cube-checkbox_checked .cube-checkbox-ui i, .cube-checkbox-ui::before, .cube-checkbox-ui::before, .cube-checkbox-ui i {
      transform: scale(3.23);
    }
    .cube-checkbox-label {
      margin-left: 30px;
    }
  }

</style>
