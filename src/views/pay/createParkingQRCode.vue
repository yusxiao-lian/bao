<template>
    <div style="width: 200px;text-align: center;margin: 0 auto;">
        <img :src="QRCodeImg" alt="二维码" />
    </div>
</template>
<script>
  import axios from "axios";
  import QRCode from 'qrcode';
  export default {
    name: "createParkingQRCode",
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
            let url = axios.defaults.baseURL + '/h5Pay/toStopPayQueryH5';
            this.Toast(url);
            this.QRCodeImg = await QRCode.toDataURL(url);
        } catch (err) {
            this.Toast(err);
        }
    }
  }
</script>    
