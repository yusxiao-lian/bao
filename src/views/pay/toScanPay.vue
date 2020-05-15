
<script>
  import * as pay from '@/service/pay';
  export default {
    name: "toScanPay",
    props: {
      
    },
    data() {
      return {
        
      }
    },
    methods: {
      
    },
    async mounted() {
        let openid = this.$route.query.openid;
        let gateID = window.localStorage.getItem('gateID');
        if(!gateID) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '通道id为空，请联系管理员'
          }).show();
          return ;
        }
        const toast = this.$createToast({time: 0, txt: '加载中'}).show();
        let res = await pay.h5scanCalculatingTempCost({gateID: gateID});
        toast.hide();
        if(res && res.error) {
          if('0' == res.error.err_code && res.obj) {
            let obj = res.obj;
            if(!obj.entranceTime || !obj.OrderTime) {
              this.Toast('没有数据');
              return ;
            }
            let inTime = obj.entranceTime.substring(0, 4) + "-" + obj.entranceTime.substring(4, 6) + "-" + obj.entranceTime.substring(6, 8) + " " + obj.entranceTime.substring(8, 10)
              + ":" + obj.entranceTime.substring(10, 12) + ":" + obj.entranceTime.substring(12, 14);
            let outTime = obj.OrderTime.substring(0, 4) + "-" + obj.OrderTime.substring(4, 6) + "-" + obj.OrderTime.substring(6, 8) + " " + obj.OrderTime.substring(8, 10)
              + ":" + obj.OrderTime.substring(10, 12) + ":" + obj.OrderTime.substring(12, 14);
            let params = {plateNumber: obj.plateNumber, inTime: inTime, outTime: outTime,
              duration: obj.duration, amount: obj.UnPayAmount, openid: openid, gateID: gateID};
            this.$router.push({ name: 'temporaryStopPaySettlementH5', path: '/temporaryStopPaySettlementH5', params: params});
          } else {
            this.Toast(res.error.err_msg);
          }
        } else {
          this.Toast("call h5calculatingTempCost interface exception");
        }
    }
  }
</script>