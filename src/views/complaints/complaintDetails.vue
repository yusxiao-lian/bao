<template>
  <div class="complaintDetails">
    <headerTab/>

    <div class="repairRecord-li">
      <div class="repairRecord-li-top">
        <div class="repairRecord-li-top-left">
          <i class="repairRecord-ico"></i>
        </div>
      </div>

      <div class="repairRecord-content">
        <div class="repairRecord-li-i">
          <i></i>
          <span> 房间号：</span>
          <span class="title">{{myFormList.houseName}}</span>
        </div>
        <div class="repairRecord-li-i">
          <i></i>
          <span>    投诉人：</span>
          <span class="title">{{myFormList.complainantName}}</span>
        </div>

        <div class="repairRecord-li-i">
          <i></i>
          <span>  投诉时间：</span>
          <span class="title">{{myFormList.complaintTime}}</span>
        </div>

        <div class="repairRecord-li-i">
          <i></i>
          <span> 投诉内容：</span>
          <span class="title">{{myFormList.contentText}}</span>
        </div>
        <div class="repairRecord-img">
          <div v-for="(v,i) in myFormList.imageAttachment" @click="showCustomImagePreview(i)">
            <img :src="v.filePath" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="progress">
      <ul>
        <span class="line"></span>
        <li v-for="(v1,i) in myFormList.logs">
          <span :class="{'mark_1':i==0,'mark_2':i!=0}"><span></span></span>
          <div>
            <div class="title">{{v1.operaContent}}</div>
            <div class="time">{{v1.workStartTime}}</div>
            <!--<div class="imgList" v-if="item.imgList.length>0">-->
            <!--<publicSlide :slideData="item.imgList">-->
            <!--<ul v-setScrollWidth="item.imgList.length">-->
            <!--<li v-for="(item_,index) in item.imgList" :key="index">-->
            <!--<img :src="item_" alt="" @click="clickZoom(index,item.imgList)">-->
            <!--</li>-->
            <!--</ul>-->
            <!--</publicSlide>-->
            <!--</div>-->
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import *as complaints from '@/service/complaints';
  import {headerTab} from "../../components/index";

  let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  export default {
    name: "complaintDetails",
    data() {
      return {
        customIndex: '',
        dataId: '',
        myFormList: [],
        imgs: [],
      }
    },
    components: {
      headerTab
    },
    methods: {
      // 图片放大
      showCustomImagePreview(i) {
        this.customIndex = i
        this.$createImagePreview({
          imgs: this.imgs,
          initialIndex: this.customIndex,
          loop: false,
          speed: 500,
          onChange: (i) => {
            this.customIndex = i
          },
          onHide: () => {
            console.log('hide')
          }
        }, (h) => {
          return h('div', {
            class: {
              'image-preview-custom-header': true
            },
            slot: 'header'
          }, this.customIndex + 1)
        }).show()
      },
      //获取详情
      async getFormDetail() {
        let params = {
          complaintId: this.dataId
        };
        let res = await complaints.complaintDetail(params, userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code) {
            if (res.obj.imageAttachment) {
              res.obj.imageAttachment.forEach((v, i) => {
                this.imgs.push(v.filePath)
              })
            }
            this.myFormList = res.obj
          } else {
            this.$createDialog({
              type: 'alert',
              title: '温馨提示',
              content: res.error.err_msg,
            }).show();
          }
        } else {
          this.Toast("call getFormDetail interface exception");
        }
      },
    },
    mounted() {
      if (!userInfo) {
        this.toLogin();
      } else {
        this.dataId = this.$route.query.id;
        this.getFormDetail()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .complaintDetails {
    background-color: #F8F8F8;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding-top: 100px;

    .repairRecord-li {
      padding: 24px;
      background-color: white;
      margin-top: 26px;
      margin-bottom: 30px;
      .repairRecord-li-top {
        overflow: hidden;
      }
      .repairRecord-li-top-left {
        float: left;
        width: 100%;
        height: 80px;
        line-height: 80px;
        text-align: left;
        .repairRecord-ico {
          width: 60px;
          height: 60px;
          background: url("../../assets/record_ico_comp.png") no-repeat center;
          background-size: 50px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .repairRecord-li-top-right {
        float: right;
        width: 200px;
        line-height: 80px;
        text-align: right;
      }
      .purple {
        color: #A260A4;
      }
      .lightBlue {
        color: #06A9A8;
      }
      .yellow {
        color: #DAAC01;
      }
      .red {
        color: #E44C40;
      }

      .repairRecord-content {
        padding-left: 24px;
        .repairRecord-li-i {
          font-size: 28px;
          overflow: hidden;
          min-height: 50px;
          line-height: 50px;
          color: #333333;
          i {
            width: 12px;
            height: 12px;
            background: rgba(153, 153, 153, 1);
            opacity: 0.2;
            border-radius: 50%;
            display: inline-block;
            margin-right: 28px;
          }
          .title {
            float: right;
          }
        }
        .repairRecord-img {
          div {
            width: 150px;
            height: 150px;
            display: inline-block;
            margin-top: 14px;
            margin-right: 14px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          div:nth-child(n+4) {
            margin-right: 0;
          }
        }
      }

    }

    .progress {
      margin-top: 60px;
      background-color: white;
      overflow: hidden;
      padding: 20px 25px;
      text-align: left;
      > ul {
        position: relative;
        .line {
          position: absolute;
          width: 2Px; /*no*/
          background-color: #dcdcdc;
          height: calc(100% - 50px);
          left: 18px;
          top: 47px;
        }
        > li {
          padding-left: 50px;
          position: relative;
          .mark_1 {
            position: absolute;
            top: 20px;
            left: 0px;
            width: 40px;
            height: 40px;
            background: rgba(182, 120, 184, 0.3);
            border-radius: 100%;
            z-index: 1;
            > span {
              position: absolute;
              width: 18px;
              height: 18px;
              border-radius: 100%;
              z-index: 2;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(162, 96, 164, 1);
            }
          }
          .mark_2 {
            position: absolute;
            top: 20px;
            left: 0px;
            width: 40px;
            height: 40px;
            background-color: transparent;
            border-radius: 100%;
            z-index: 1;
            > span {
              position: absolute;
              width: 18px;
              height: 18px;
              border-radius: 100%;
              z-index: 2;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: #dcdc;
            }
          }
          > div {
            border-bottom: 1px solid #dcdc;
            .title {
              float: left;
              font-size: 30px;
              color: #333;
              overflow: hidden;
              line-height: 70px;
            }
            .time {
              clear: both;
              font-size: 24px;
              color: #ccc;
              overflow: hidden;
              line-height: 45px;
              margin-bottom: 20px;
            }
            .imgList {
              margin: 0px 0px 40px 0px;
              overflow: hidden;
              ul {
                overflow: hidden;
                li {
                  float: left;
                  padding-right: 20px;
                  width: 100px;
                  box-sizing: content-box;
                  height: 100px;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }

            }
          }
        }
        li:last-of-type > div {
          border-bottom: 0px;
        }
      }
    }

  }
</style>
