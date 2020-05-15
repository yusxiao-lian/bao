<template>
  <div>

  </div>
</template>

<script>
  import * as api from '@/service/parking';

  export default {
    name: "",
    data() {
      return {
        dataList: ''
      }
    },
    created() {
      this.dataList = JSON.parse(window.localStorage.getItem("dataList"));
      console.log(this.dataList);
      this.dataList.openid =this.$route.query.openid;
      this.dataList.openId =  this.$route.query.openid;//="onkwO1I1y7YEyocoSbTvwMWZy_Ok";  
      window.localStorage.setItem('dataList', JSON.stringify(this.dataList));
      if (this.dataList.codeType == 0) {
        this.h5EntryOrExit()
      } else {
        this.$router.push({
          path: '/parkingQueryCard',
        })
      }
    },
    methods: {
      async h5EntryOrExit() {
        let res = await api.h5EntryOrExit(this.dataList)
        if (res) {
          if (('0' == res.error.err_code || '1000' == res.error.err_code || '1006' == res.error.err_code) && res.obj) {
            this.Toast('车辆入场成功');
          } else {
            this.Toast(res.obj.error.err_msg);
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
