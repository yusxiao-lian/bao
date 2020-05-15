<template>
    <div id="QRcodeShare">
      <div class="Mask"></div>
      <div class="QRcode-main">
        <div class="QRcode-img">
          <div>
            <img :src="QRCodeImg" alt="二维码">
          </div>
        </div>
        <div class="QRcode-bottom" v-show="shareAble"><br>
          <!-- <div class="QRcode-icos">
            <img src="../../../assets/wechat.png" @click="wechatShare" alt="分享到微信">
            <img src="../../../assets/weibo.png" @click="wechatShare" alt="分享到QQ">
          </div>
          <div class="label">请选择发送方式分享二维码</div> -->
          <div class="label">长按二维码可以保存或分享二维码</div>
        </div>
        <div class="btn">
          <i class="cubeic-close" @click="closePopup"></i>
        </div>
      </div>
    </div>
</template>

<script>
  import QRCode from 'qrcode';
  export default {
    name: "QRcodeShare",
    props: {
      options:{},
      shareAble: true,
      close: {
        default:()=> {

        },
        type:Function
      }
    },
    data() {
      return {
        QRCodeImg: ''
      }
    },
    watch: {
      async options() {
        if(this.options) {
          try {
           this.QRCodeImg = await QRCode.toDataURL(this.options);
          } catch (err) {
            this.Toast(err);
          }
        }
      }
    },
    methods: {
      closePopup() {
        this.close();
      },
      wechatShare() {

      }
    },
    async mounted(){
      window.addEventListener('popstate',()=>{
        this.close()
      })
    }
  }
</script>

<style lang="scss" scoped>
#QRcodeShare{
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 10;
  background-color: transparent;
  overflow: hidden;
  overflow-y: auto;
  animation: hiddenTran .3s 1;
  .Mask{
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2;
    animation: hiddenTran .3s 1;
  }
  .QRcode-main{
    position: absolute;
    z-index: 4;
    width: 600px;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    animation: topSlide .6s  1;
    .QRcode-img{
     padding: 70px;
      background-color: white;
      div{
        height: 446px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .QRcode-bottom{
      border-top: 1Px solid #dcdcdc;/*no*/
      padding: 0 70px 40px 70px;
      background-color: white;
      .QRcode-icos{
        width:440px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 50px 0px;
        img{
          width: 100px;
          height: 100px;
        }
      }
      .label{
        text-align: center;
        font-size: 16Px;/*no*/
      }
    }
    .btn{
      text-align: center;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
      i{
        width: 100px;
        height: 100px;
        border: 1Px solid #fff;/*no*/
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30Px;/*no*/
      }
    }
  }
  @keyframes hiddenTran {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes topSlide {
    0%{
      opacity: 0;
      transform: translateX(-50%) translateY(-150%);
    }
    100%{
      opacity: 1;
      transform: translateX(-50%) translateY(-50%);
    }
  }
}
</style>
