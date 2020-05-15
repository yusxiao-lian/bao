<template>
  <div class="sysMsg">
    <headerTab :title="$route.meta.title">
      <span slot="right">全部已读</span>
    </headerTab>
    <div class="content">
      <div>
<!--        <scrollList-->
<!--          ref="scrollList"-->
<!--          :dataList="dataList"-->
<!--          :pullDownRefresh="false"-->
<!--          @onPullingUp="onPullingUp"-->
<!--        >-->
          <div class="sysMessage">
            <div class="sys-li" v-for="i in dataList">
              <div class="item">
                <div class="msg">
                  <p>恭喜您！您注册的吉祥E+已经认证成功，欢迎登录使用。祝您生活愉快，谢谢！</p>
                </div>
                <div class="tip">
                  <div class="date">
                    <p>2020-04-03 13:39</p>
                    <div class="tip-icon"></div>
                  </div>
                  <div class="detail">
                    <p class="msg">详情</p>
                    <i class="cubeic-arrow"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
<!--        </scrollList>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    components: {
      headerTab
    },
    data() {
      return {
        dataList: [1, 2, 3, 4]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .publicTitle {
    font-weight: 700;
  }

  .content {
    margin-top: 100px;
    background-color: #eee;
  }

  .item {
    background-color: #fff;
    box-sizing: border-box;
    height: 210px;
    margin: 20px 26px 0 26px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 6px;

    .msg {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #5e5e5e;
      flex: 1;
    }

    .tip {
      display: flex;
      justify-content: space-between;

      .date {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #8e8e8e;
        display: flex;
        align-items: center;

        .tip-icon {
          width: 16px;
          height: 16px;
          background: #9a629f;
          border-radius: 50%;
          margin-left: 14px;
        }
      }

      .detail {
        display: flex;

        .msg {
          font-size: 22px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #9a629f;
          margin-right: 10px;
        }
      }
    }
  }
</style> 
