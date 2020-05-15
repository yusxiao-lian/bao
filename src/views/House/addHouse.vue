<template>
  <div class="addHouse">
    <headerTab :fn="goBack"></headerTab>
    <div class="addHouse-title">{{titleObj[addHouseType]}}</div>
    <div class="preActive" v-show="preActive.name" @click="goBack">
      <i class="cubeic-back"></i>
      {{preActive.name}}
    </div>
    <ul class="dataList" ref="ulList">
      <li @click="clickEvent(item)" v-for="item in dataList"> {{item.name}}<i class="cubeic-arrow"></i></li>
    </ul>
  </div>
</template>

<script>
  import {headerTab, bottomButton} from "../../components/index";
  import {getCity, getCommunityList, getBuilding, getHouse, getUnit} from '../../service/House'

  export default {
    name: "addHouse",
    components: {
      headerTab, bottomButton
    },
    computed: {
      addHouseType() {
        return this.$route.params.type
      }
    },
    watch: {
      addHouseType() {
        this.getList()
      },
    },
    data() {
      return {
        titleObj: {
          'city': '选择城市',
          'community': '选择社区',
          'building': '选择楼栋',
          'unit': '选择单元',
          'room': '选择房间',
        },
        preActive: {},
        activeData: {},
        dataList: [],
        flag: false
      }
    },
    methods: {
      goBack() {
        if (!this.flag && this.addHouseType == 'room') {
          this.$router.go(-2)
          return
        }
        this.$router.goBack()
      },
      clickEvent(item) {
        this.$refs.ulList.scrollTop = 0
        this.activeData[this.addHouseType] = item
        switch (this.addHouseType) {
          case 'city':
            this.$router.push('/addHouse/community')
            break
          case 'community':
            this.$router.push('/addHouse/building')
            break
          case 'building':
            this.$router.push('/addHouse/unit')
            break
          case 'unit':
            this.$router.push('/addHouse/room')
            break
          case 'room':
            // if(this.fromRouter === 'addApply'){
            //   this.$router.goBack(-4)
            // }else {
            //   this.$router.goBack(-5)
            // }
            this.$store.dispatch('setActiveHouse', {
              cityName: this.activeData.city.name,
              buildingId: this.activeData.building.id,
              buildingName: this.activeData.building.name,
              communityId: this.activeData.community.id,
              communityName: this.activeData.community.name,
              houseId: this.activeData.room.id,
              houseName: this.activeData.room.name,
            })
            this.$router.push('/roomData')
            break
        }
        this.$store.dispatch('setActiveHouseObj', this.activeData)

      },
      async getList() {
        let res
        const toast = this.$createToast({time: 0, txt: ''}).show();
        switch (this.addHouseType) {
          case 'city':
            res = await getCity()
            break
          case 'community':
            this.preActive = this.activeData['city']
            res = await getCommunityList({
              cityName: this.activeData['city'].name,
              //appType: 'yezhuApp',
              communityType: 'notparks'
            })
            break
          case 'building':
            this.preActive = this.activeData['community']
            res = await getBuilding({cid: this.activeData['community'].id})
            break
          case 'unit':
            this.preActive = this.activeData['building']
            res = await getUnit({bid: this.activeData['building'].id})
            if (this.$route.params.type == 'unit' && res.error.err_msg == '暂无数据') {
              this.flag = false
              this.clickEvent(this.activeData.building)
              return
            } else {
              this.flag = true
            }
            break
          case 'room':
            console.log(this.activeData['building'], '-=-=-=-=')
            if (this.flag) {
              this.preActive = this.activeData['unit']
              res = await getHouse({buid: this.activeData['unit'].id})
            } else {
              this.preActive = this.activeData['building']
              res = await getHouse({bid: this.activeData['building'].id})
            }
            break
        }
        toast.hide()
        if (res) {
          if (res.error.err_code === '0') {
            switch (this.addHouseType) {
              case 'city':
                this.dataList = res.list
                break
              case 'community':
                let arr = []
                res.list.forEach(v => {
                  v.list.forEach(k => {
                    arr.push(k)
                  })
                })
                this.dataList = arr
                break
              case 'building':
                this.dataList = res.list
                break
              case 'unit':
                this.dataList = res.list
                break
              case 'room':
                this.dataList = res.list
                break
            }
          } else {
            this.dataList = []
            this.Toast(res.error.err_msg)
          }
        }

      },
    },
    mounted() {
      this.activeData = this.$store.state.activeHouseObj || {}
      this.getList()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .addHouse {
    height: 100%;
    padding-top: 100px;
    padding-bottom: 10px;
    overflow-y: auto;

    .addHouse-title {
      padding: 40px;
      font-size: 50px;
      font-weight: 400;
      line-height: 60px;
      height: 60px;
      color: black;
      box-sizing: content-box;
    }

    .preActive {
      padding: 0 40px;
      margin-bottom: 20px;
      height: 40px;
      line-height: 40px;
      text-align: left;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #838895;
      font-size: 32px;

      .cubeic-back {
        display: inline-block;
        margin-right: 10px;
        color: #CCCCCC;
      }

    }
    .dataList {
      height: calc(100% - 200px);
      padding: 0px 0px 0 40px;
      overflow: hidden;
      overflow-y: auto;

      > li {
        border-bottom: 2px solid #E4E1DE;
        height: 40px;
        line-height: 40px;
        padding: 30px 0px;
        box-sizing: content-box;
        color: #333333;
        font-size: 36px;
        position: relative;
        padding-right: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .cubeic-arrow {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          color: #CCCCCC;
        }

      }
    }
  }
</style>
