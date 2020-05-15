<template>
  <div class="housekeeper">
    <div class="housekeeper-t">
      <img class="ste_ico_tow" src="../../assets/convenience_img/ste_ico_tow.png" alt />
      <span class="text">{{item.bname}}</span>
    </div>
    <div class="housekeeper-c">
      <div class="item" v-for="(v,i) in item.hbs" :key="i">
        <div class="left">
          <img :src="v.imgSrc||defaultImg" alt />
          <span>{{v.userFullName}}</span>
        </div>
        <div class="right">
          <div class="phone">
            <a :href="'tel:'+v.userTel">
              <img src="../../assets/convenience_img/ste_ico_pho.png" alt />
              电话
            </a>
          </div>
          <div class="liao" @click="toliaotian(v)">
            <img src="../../assets/convenience_img/ste_ico_chat.png" alt />
            聊天
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImg from "../../assets/chat_ico_serv.png";
import qs from 'qs'
export default {
  name: "housekeeper",
  props: {
    item: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      defaultImg
    };
  },
  methods:{
    toliaotian(item){
     
      this.$router.push('/chat?'+qs.stringify(item))
    }
  },
  mounted(){
     
  }
 
};
</script>

<style lang="scss" scoped>
.housekeeper-t {
  padding: 30px 30px 20px 30px;
  display: flex;
  align-items: center;
  .ste_ico_tow {
    width: 40px;
    height: 38px;
    margin-right: 20px;
  }
  .text {
    color: #838895;
    display: inline-block;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
  }
}
.housekeeper-c {
  background: white;
  padding: 0 30px;
  .item {
    border-bottom: 2px solid #eeeeee;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }

      span {
        color: #1a1a1a;
        font-size: 32px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.4;
      }
    }
    .right {
      display: flex;
      align-items: center;
      > div {
        min-width: 100px;
        height: 60px;
        border-radius: 60px;
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 36px;
      }
      .phone {
        background: #f8a20f;
        margin-right: 20px;
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }
        img {
          height: 24px;
          width: 24px;
          display: inline-block;
          margin-right: 10px;
        }
      }
      .liao {
        background: #a260a4;
        img {
          width: 28px;
          height: 24px;
          display: inline-block;
          margin-right: 10px;
        }
      }
    }
  }
  .item:last-of-type {
    border: none;
  }
}
</style>
