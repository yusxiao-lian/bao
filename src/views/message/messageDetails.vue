<template>
  <div class="messageDetails">
    <headerTab :title="$route.meta.title"></headerTab>
    <div class="messageDetails-content">
      <h5>{{$route.params.items.title}}</h5>
      <p class="content-p">
        {{$route.params.items.content}}
      </p>
      <p class="content-date">
        {{$route.params.items.sendTime}}
      </p>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    name: "messageDetails",
    components: {
      headerTab
    },
  }
</script>

<style lang="scss" scoped>
  .messageDetails {
    padding-top: 100px;
    height: 100%;

    .messageDetails-content {
      height: 100%;
      padding: 30px;

      h5 {
        font-size: 36px;
        text-align: center;
        margin-bottom: 60px;
      }

      .content-p {
        text-indent: 2em;
        line-height: 40px;
        text-align: left;
        margin-bottom: 60px;
      }

      .content-date {
        text-align: right;
      }
    }

  }
</style>
