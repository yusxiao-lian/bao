<template>
  <div class="chooseCommunity">
    <div class="chooseCommunity-title">选择社区</div>
    <div class="chooseCommunity-select">
      <div class="title">选择城市</div>
      <div class="city-box">
        <div class="sel">
          <cube-select
            v-model="city.id"
            cancelTxt=""
            confirmTxt="确定"
            @change="changeSelectCity"
            title="选择城市"
            :options="citys">
          </cube-select>
        </div>
        <!--        <span class="positionBtn" @click="toPosition">重新定位</span>-->
      </div>
    </div>
    <div class="chooseCommunity-select">
      <div class="title">全部社区</div>
      <!--<div class="sel">
        <cube-select
          v-model="community.id"
          cancelTxt=""
          confirmTxt="确定"
          @change="changeSelectCom"
          title="选择社区"
          :options="communitys">
        </cube-select>
      </div>-->
    </div>
    <ul class="communitysList">
      <li v-for="(item,index) in communitys" @click="changeSelectCom(item.id,index,item.name,item)">{{item.name}}</li>
      <li class="nodata" v-show="communitys.length<1&&city.id">该城市暂无社区</li>
    </ul>
    <!--    <bottomButton class="operation" @click="clickOk">确定</bottomButton>-->
  </div>
</template>

<script>
  import {getCity, getCommunityList} from '../../service/system'
  import {getHouseList, getOwnerHouse} from '../../service/House'
  import {mapState} from 'vuex'
  //import {bottomButton} from '../../components/index'
  export default {
    name: "chooseCommunity",
    data() {
      return {
        citys: [],
        city: {id: '', name: ''},
        communitys: [],
        community: {
          id: '',
          name: ''
        },
        houseList: [],
        from: false, // 选择完后是返回原来流程页还是商户首页
      }
    },
    components: {
      //bottomButton
    },
    computed: {
      ...mapState({cityName: 'cityName'}),
    },
    watch: {
      async cityName() {
        if (this.cityName) {
          await this.getCity()
          // let flag = true
          // this.citys.forEach(v=>{
          //   if(v.text == this.cityName){
          //     flag=false
          //     this.city=v
          //     this.getCommunityList({
          //       cityName: v.text,
          //       appType: 'yezhuApp',
          //       communityType: 'notparks'
          //     })
          //   }
          // })
          // if(flag){
          //   this.city=this.citys[0]
          //   this.getCommunityList({
          //     cityName: this.city.text,
          //     appType: 'yezhuApp',
          //     communityType: 'notparks'
          //   })
          // }
          // this.city = this.cityName
          await this.getCommunityList({
            cityName: this.city,
            //appType: 'yezhuApp',
            communityType: 'notparks'
          })
        }
      }
    },
    methods: {
      //定位
      async toPosition() {
        const toast = this.$createToast({time: 0, txt: ''}).show();
        this.$parent.getPositionCity(() => {
          toast.hide()
          this.getCity()
        })
      },
      clickOk() {

      },
      changeSelectCity(value, index, text) {
        console.log(value, index, text, this.city)
        this.city.name = text

        this.getCommunityList({
          cityName: text == '全部' ? '' : text,
          //appType: 'yezhuApp',
          communityType: 'notparks'
        })
      },
      changeSelectCom(value, index, text, item) {
        let useInfo = localStorage.getItem('userInfo')
        useInfo = useInfo ? JSON.parse(useInfo) : {}
        this.houseList.forEach((v, i) => {
          if (v.communityId == value) {
            if (v.approveStatus == 1) {
              useInfo. buildingName = v.buildingName
              useInfo.houseId = v.houseId
              useInfo.houseName = v.houseName
              useInfo.authFlag = true
              return
            }
          }
        })
        this.community.name = text
        useInfo.communityId = value
        useInfo.communityName = text
        useInfo.cityId = this.city.id
        useInfo.cityName = this.city.name
        useInfo.address = item.address // 新增地址字段 用于顶栏展示
        localStorage.setItem('userInfo', JSON.stringify(useInfo))
        console.log(item, '我选的社区')
        setTimeout(v => {
          let page = window.localStorage.getItem('toGoURL');
          // page ? window.location.href = page : this.$router.push({
          //   path: '/personalMessage'
          // })
          if(this.from) {
            localStorage.removeItem('fromMerchant')
            this.$router.push({
              path: 'merchantsHome'
            })
          } else {
            if(page) {
              window.location.href = page
            } else {
              this.$router.push({
                path: '/personalMessage'
              })
            }
          }
          window.localStorage.removeItem('toGoURL');

        }, 300)
      },
      async getCity() {
        const toast = this.$createToast({time: 0, txt: ''}).show();
        let res = await getCity()
        toast.hide()
        if (res) {
          if (res.error.err_code === '0') {
            this.citys = res.list.map(v => {
              return Object.assign(v, {
                value: v.id,
                text: v.name
              })
            })
            this.citys.unshift({
              text: "全部",
              value: "0",
              id: '0'
            })
            console.log(this.citys, '@@@@@@');
            if (this.cityName) {
              let flag = true
              this.citys.forEach(v => {
                if (v.text == this.cityName) {
                  flag = false
                  this.city = v
                  this.getCommunityList({
                    cityName: v.text,
                    //appType: 'yezhuApp',
                    communityType: 'notparks'
                  })
                }
              })
              if (flag) {
                this.city = this.citys[0]
                console.log(this.city.text);
                this.getCommunityList({
                  cityName: this.city.text == '全部' ? '' : this.city.text,
                  //appType: 'yezhuApp',
                  communityType: 'notparks'
                })
              }
            }

            console.log(this.city, 'this.city')
          } else {
            this.citys = []
            this.Toast(res.error.err_msg)
          }
        }
      },
      async getCommunityList(params) {
        console.log(this.city)
        console.log(params, 'WWWQWQQW');
        let res = await getCommunityList(params)
        if (res) {
          if (res.error.err_code === '0') {
            let arr = []
            console.log(res.list, 'wwwwwwwwww');
            res.list.forEach(v => {
              v.list.forEach(k => {
                arr.push(k)
              })
            })
            this.communitys = arr.map(v => {
              return Object.assign(v, {
                value: v.id,
                text: v.name
              })
            })
            console.log(this.communitys)
          } else {
            this.communitys = []
            this.Toast(res.error.err_msg)
          }
        }
      },
      // 获取房间
      async getHouseList() {
        var userInfo = JSON.parse(localStorage.getItem('userInfo'))
        let data = {
          // communityId:'73a539aca84843a19115fa5422a805ed'
        }
        if(userInfo.accessToken) {
          let res = await getHouseList(data)
          if (res) {
            if (res.error.err_code === '0') {
              console.log(res,'YYYYY');
              this.houseList = res.list
            } else {}
          }
        }
      },
      // async   changeSelectCom(value, index, text,item) {
      //   let data = {
      //     communityId:value
      //   }
      //   let res = await getOwnerHouse(data)
      //   if (res) {
      //     if (res.error.err_code === '0') {
      //       console.log(res,'YYYYY');
      //       this.houseList = res.list
      //
      //
      //       let useInfo = localStorage.getItem('userInfo')
      //       useInfo = useInfo ? JSON.parse(useInfo) : {}
      //       this.houseList.forEach((v, i) => {
      //         if (v.communityId == value) {
      //           if (v.approveStatus == 1) {
      //             useInfo. buildingName = v.buildingName
      //             useInfo.houseId = v.houseId
      //             useInfo.houseName = v.houseName
      //             useInfo.authFlag = true
      //             return
      //           }
      //         }
      //       })
      //       this.community.name = text
      //       useInfo.communityId = value
      //       useInfo.communityName = text
      //       useInfo.cityId = this.city.id
      //       useInfo.cityName = this.city.name
      //       localStorage.setItem('userInfo', JSON.stringify(useInfo))
      //       setTimeout(v => {
      //         let page = window.localStorage.getItem('toGoURL');
      //         page ? window.location.href = page : this.$router.push({
      //           path: '/personalMessage'
      //         })
      //         window.localStorage.removeItem('toGoURL');
      //
      //       }, 300)
      //
      //
      //     } else {
      //
      //     }
      //   }
      // }
    },
    mounted() {
      console.log(this.$route.query)
      if(this.$route.query.from) {
        // let query = this.$route.query
        // this.city.id = query.city_id
        // this.city.name = query.city_name
        // this.community.name = query.commun_name
        // this.community.id = query.commun_id
        this.from = true
      }
      if(localStorage.fromMerchant) {
        this.from = true
      }
      this.getCity()
      this.getHouseList()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .chooseCommunity {
    padding-top: 100px;
    position: relative;
    height: 100%;
    .operation {
      position: absolute;
      z-index: 1;
    }
    .chooseCommunity-title {
      height: 100px;
      line-height: 100px;
      text-align: left;
      font-size: 50px;
      color: black;
      padding: 0 40px;
      margin-bottom: 30px;
    }
    .chooseCommunity-select {
      text-align: left;
      .title {
        text-align: left;
        background: #f9f9f9;
        padding: 20px 40px;
        height: 100px;
        line-height: 60px;
        font-size: 30px;
        color: #999;
      }
      .sel {
        display: inline-block;
        padding: 0 40px;
      }
      .city-box {
        position: relative;
        .positionBtn {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          padding: 20px;
        }
      }
    }
    .communitysList {
      text-align: left;
      display: block;
      max-height: calc(100% - 450px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 0;
      li {
        color: #666;
        line-height: 80px;
        font-size: 34px;
        padding: 0 40px;
        transition: background-color .3s;
        &:active {
          background-color: #f5f5f5;
        }
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  .chooseCommunity {
    .cube-select {
      padding: 20px 50px 20px 0;
      text-align: left;
      &:after {
        border: none !important;
      }
    }
  }
</style>
