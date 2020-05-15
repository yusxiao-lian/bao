<template>
  <div class="recordProgress">
    <ul>
      <span class="line"></span>
      <li v-for="(item,key) in recordProgressData" :key="key">
        <span :class="{'mark_1':item.flagNum==0,'mark_2':item.flagNum!=0}"><span></span></span>
        <div>
          <div class="title">
            <span v-if="item.operArr.length<1||item.phone==''">{{item.label}}</span>
            <span v-else>{{item.operArr[0]}}]<a :href="'tel:'+item.phone"> <i
              class="phone"></i></a></span>
          </div>
          <div v-show="item.flagNum ==0 && item.formStatus == '已验收'" style="float: right;">
            <button
              style="color:white;background-color:#A260A4;width: 70px;height: 22px;border-radius: 10px;text-align: center;margin-left: 20px;text-align: center;"
              @click.stop="clickEvaluateBtn()">
              评价
            </button>
          </div>
          <div class="time">{{item.time}}</div>
          <div class="imgList" v-if="item.imgList.length>0">
            <publicSlide :slideData="item.imgList">
              <ul v-setScrollWidth="item.imgList.length">
                <li v-for="(item_,index) in item.imgList" :key="index">
                  <img :src="item_" alt="" @click="clickZoom(index,item.imgList)">
                </li>
              </ul>
            </publicSlide>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import img from '../../assets/logo.png'
  import ico from '../../assets/goods_ico.png'

  export default {
    name: "recordProgress",
    props: {
      recordProgressData: {
        type: Array,
        default() {
          return [
            {
              flagNum: 1,
              label: '验收结束',
              time: '2018-03-02 12:34',
              imgList: [img, img, img, img, img, img, img, img, img, img, img]
            },
            {
              flagNum: null,
              label: '施工完毕',
              time: '2018-03-02 12:34',
              imgList: []
            },
            {
              flagNum: null,
              label: '施工正在进行',
              time: '2018-03-02 12:34',
              imgList: [img, img, img, img, img, img, img, img, img, img, img]
            },
            {
              flagNum: null,
              label: '审核通过',
              time: '2018-03-02 12:34',
              imgList: []
            },
            {
              flagNum: null,
              label: '提交申请',
              time: '2018-03-02 12:34',
              imgList: []
            },
          ]
        }
      }
    },
    data() {
      return {
        imgList: [img, img, img, img, img, img, img, img, img, img, img]
      }
    },
    methods: {
      clickZoom(index, imgList) {
        this.$createImagePreview({
          initialIndex: index,
          imgs: imgList
        }).show();
      },
      clickEvaluateBtn() {
        let id_ = this.$route.query.id;
        if (id_) {
          this.$router.push({name: 'workEvaluate', query: {id: id_}});
        } else {
          this.$router.replace('repairRecord');
        }
      }
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .recordProgress {
    
    margin-top: 60px;
    background-color: white;
    overflow: hidden;
    padding: 20px 25px;
    text-align: left;
    > ul {
      position: relative;
      .line {
        position: absolute;
        width: 2px; /*no*/
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
            background: #a260a4;
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
            font-size: 16Px; /*no*/
            color: #333;
            overflow: hidden;
            line-height: 70px;
          }
          .phone {
            width: 45px;
            height: 45px;
            background: url("../../assets/shop-phone.png") no-repeat center;
            background-size: 45px;
            display: inline-block;
            vertical-align: sub;
          }
          .time {
            clear: both;
            font-size: 14Px; /*no*/
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
</style>
