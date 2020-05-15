<template>
  <div></div>
</template>
<script>
  export default {
    name: "transferPage",
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if (!this.userInfo || !this.userInfo.accessToken) {
        this.toLogin();
      } else {
       let path = this.$route.query.path
        if(path){
          this.$router.replace({path:'/'+path})
        }else {
          this.$router.replace({path:'/personalMessage'})
        }

      }
    }
  }
</script>

