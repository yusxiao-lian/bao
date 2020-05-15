<template>
  <div id="repairProgress">
    <headerTab/>
    <recordItem :recordItemData="recordItemData" v-if="recordItemData"></recordItem>
    <recordProgress :recordProgressData="recordProgressData"
                    v-if="recordProgressData&&recordProgressData.length>0"></recordProgress>
  </div>
</template>

<script>
  import recordItem from '../../components/recordItemComponent/recordItem'
  import recordProgress from '../../components/recordProgressComponent/recordProgress'
  import *as repair from '@/service/repair'
  import {headerTab} from "../../components/index";

  let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  export default {
    name: "repairProgress",
    data() {
      return {
        dataId: '',
        recordItemData: null,
        recordProgressData: null,
      }
    },
    components: {
      recordItem,
      recordProgress, headerTab
    },
    methods: {
      fnexit() {
        this.$router.push({path: 'repairRecord', query: {formStatus: this.$route.query.formStatus}})
      },
      //获取详情
      async getFormDetail() {
        let params = {
          formId: this.dataId
        };
        let res = await repair.getFormDetail(params, userInfo.accessToken);
        if (res && res.error) {
          if ('0' == res.error.err_code) {
            var obj = res.obj.form;
            let imgList = [];
            if (obj.formAttachment != null) {
              imgList = obj.formAttachment.map(v => v.filePath)
            }
            this.recordItemData = {
              type: 'repairProgress',
              title: {
                label: obj.formType,
                state: obj.formStatus
              },
              content: [
                {
                  label: '工单编号',
                  value: obj.formNo
                },
                {
                  label: '报修时间',
                  value: obj.createdDate
                },
                {
                  label: '报修类型',
                  value: obj.displayMaintainItem
                },
                {
                  label: '报修内容',
                  value: obj.contentText
                },
              ],
              imgList: imgList
            };
            this.recordProgressData = obj.arrayLog.map((v, i) => {
              let operTitle = v.oper
              if (operTitle.indexOf(v.phone) != -1) {
                console.log(99);
                v.operArr = v.oper.split(":")
                console.log(v.operArr);
              }
              return {
                operArr: v.operArr ? v.operArr : [],
                formStatus: obj.formStatus,
                flagNum: i,
                label: v.oper,
                time: v.operDate,
                imgList: [],
                phone: v.phone ? v.phone : ''
              }
            });
            console.log(this.recordProgressData, 'qqqqqq');
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
        this.getFormDetail();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #repairProgress {
    background-color: #F8F8F8;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding-top: 100px;
  }
</style>
