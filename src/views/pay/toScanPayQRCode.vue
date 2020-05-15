<template>
    <div style="width: 200px;text-align: center;margin: 0 auto;">
        <img :src="QRCodeImg" alt="二维码" />
    </div>
</template>
<script>
  import axios from "axios";
  import QRCode from 'qrcode';
  export default {
    name: "toScanPayQRCode",
    props: {
      
    },
    data() {
      return {
        QRCodeImg: ''
      }
    },
    watch: {
      
    },
    methods: {
      
    },
    async mounted() {
        try {
            let url = axios.defaults.baseURL + '/static/h5/wechat/index.html#/setGateID?gateID=acf2275d-7ec4-482a-8ce1-a94400b4602f';
            this.Toast(url);
            this.QRCodeImg = await QRCode.toDataURL(url);
        } catch (err) {
            this.Toast(err);
        }
    }
  }
</script>    
