<template>
  <div class="agreement">
    <headerTab></headerTab>
    <div v-html="content">

    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    name: "",
    data() {
      return {
        content: this.$route.params.content
      }
    },
    components: {
      headerTab
    },
    created() {
      console.log(this.$route.params.content);
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .agreement {
    padding: 0 30px;
    padding-top: 110px;
    height: 100%;
    background-color: #f1f1f1;

    p{
      line-height: 30px;
    }
  }
</style>
