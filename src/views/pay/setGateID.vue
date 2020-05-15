<script>
  export default {
    name: "setGateID",
    props: {
      
    },
    data() {
      return {
      }
    },
    watch: {
      
    },
    methods: {
      
    },
    async mounted() {
        try {
            let gateID = this.$route.query.gateID;
            if(gateID){
                window.localStorage.setItem('gateID', gateID);
                window.location.href = '/h5Pay/toScanPay';
            } else {
                this.$createDialog({
                  type: 'alert',
                  title: '温馨提示',
                  content: '通道id为空，请联系管理员'
                }).show();
            }
        } catch (err) {
            this.Toast(err);
        }
    }
  }
</script>