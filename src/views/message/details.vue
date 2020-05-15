<template>
  <div class="detailsMessage">
    <headerTab :title="$route.meta.title"></headerTab>
    <div class="">

    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    name: "details",
    components: {
      headerTab
    },
  }
</script>

<style scoped>
  .detailsMessage {
    margin-top: 100px;

  }
</style>
