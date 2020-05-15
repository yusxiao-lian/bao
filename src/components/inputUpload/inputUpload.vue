<template>
  <div class="inputUpload">
    <div class="inputUpload-label">
      <span>
        <slot name="label"></slot>
      </span>
    </div>
    <div class="inputUpload-input">
      <slot name="inputFile"></slot>
    </div>
    <div class="inputUpload-describe">
      <span>
        <slot name="describe"></slot>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "inputUpload",
    props:{

    }
  }
</script>

<style lang="scss" scoped>
  .inputUpload{
    height: 100%;
    display: flex;
    align-items: center;
    .inputUpload-label{
      width: 180px;
      font-size: 15Px;/*no*/
      display: flex;
      align-items: center;
      color: #2B2B2B;
      margin-right: 6px;
    }
    .inputUpload-input{
      width: 130px;
      height: 130px;
      border: 1Px solid #dcdc;/*no*/
      border-radius: 4Px;/*no*/
      label{
        display: block;
        width: 100%;
        height: 100%;
        background-size: 132px;
        background-position: center;
        background-repeat: no-repeat;
        input{
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
    .inputUpload-describe{
      padding-left: 20px;
      width: 350px;
      overflow:hidden;
      line-height: 38px;
      text-align: left;
    }
  }
</style>
