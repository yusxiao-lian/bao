<template>
  <div class="selectFloor">
    <headerTab :title="$route.meta.title" />
    <p @click="selectPro">{{name}}</p>
    <div class="selectList" v-for="(item,index) in floors" :key="index" @click="selectFloor(item)" >
      <span>
          <slot>{{item.name}}</slot>
      </span>
      <span class="right"></span>
  </div>
  </div>
</template>

<script>

import { headerTab, bottomButton2 } from "../../components/index";
import { appGetRepairFloor } from "@/service/work"


export default {
    components: {
        headerTab
    },
    data () {
        return {
            workInfo: {},
            id: '',
            floors: [], // 楼层列表
            name: '',
            floor: '' // 所选楼层
        }
    },
    async mounted () {
        console.log(this.$route.query)
        let floor = await appGetRepairFloor({
            'cid': this.$route.query.item.id
        })
        this.floors = floor.list 
        this.name = this.$route.query.item.name
        this.workInfo = this.$route.query.workInfo
        console.log(this.$route.query)
    },
    methods: {
        selectPro () {
            this.$router.push({
                path: '/selectProject',
                query: {
                    'workInfo': this.workInfo,
                    name: this.name + this.floor
                }
            })
        },
        selectFloor (floor) {
            console.log(floor)
            this.floor = floor
             this.$router.push({
                path: '/selectRoom',
                query: {
                    'workInfo': this.workInfo,
                    'name': this.name + floor.name
                }
            })
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.selectFloor {
    height: calc(100% - 100px);
    padding: 100px 0 0 20px;
    overflow: hidden;
    overflow-y: auto;
    .selectList{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    font-size: 40px;
    height: 100px;
    color: black;
    padding-right: 50px;
    .right {
        width: 20px;
        height: 20px;
        border-top: 5px solid #eee;
        border-right: 5px solid #eee;
        transform: rotateZ(45deg);
    }
}
    p {
        position: relative;
        display: flex;
        
        align-items: center;
        font-size: 40px;
        padding-left: 50px;
        height: 100px;
        &::after{
            content: '';
            width: 20px;
            height: 20px;
            border-bottom: 1px solid #333;
            border-left: 1px solid #333;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: rotateZ(45deg);
            position: absolute;
            left: 20px;
            top: 40%;
            
        }
    }
}
</style>