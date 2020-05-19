<template>
  <div class="selectRoom">
      <div class="top" @click="jump">
          选择房间
      </div>
      <div class="selectList" v-for="(item,index) in rooms" :key="index" @click="selectRoom(item)" >
        <span>
            <slot>{{item.name}}</slot>
        </span>
        <span class="right"></span>
    </div>
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";
import { appGetRepairRoom } from "@/service/work"

export default {
    components: {headerTab } ,
    data () {
        return {
            cid: '', // 项目id
            name: '',
            workInfo: {},
            rooms: [],
            toname: '',
            roomid: '', // 楼层id,
            proname: '',
            floorname: ''
        }
    },
    async mounted () {
        // 获取房间信息
        console.log(this.$route.query.item.roomid)
        let room = await appGetRepairRoom({
            'bid': this.$route.query.item.roomid
        })
        this.rooms = room.list
        this.roomid = this.$route.query.item.roomid
        this.cid = this.$route.query.item.id
        this.name = this.$route.query.item.name
        this.proname = this.$route.query.item.proname
        this.floorname = this.$route.query.item.floorname
        this.toname = this.$route.query.item.toname
        this.workInfo = this.$route.query.workInfo
        
    },
    methods: {
        jump () {
            this.$router.push({
                path: '/selectFloor',
                query: {
                    'item': {
                        'id': this.cid,
                        'name': this.name
                    },
                    'workInfo': this.workInfo,
                }
            })
        },
        selectRoom (val) {
            console.log(val)
            this.$router.push({
                path: '/createWork',
                query: {
                    'item': {
                        'id': this.cid,
                        'name': this.name
                    },
                    'workInfo': this.workInfo,
                    'allInfo': {
                        'proname': this.proname,
                        'floorname': this.floorname,
                        'roomname': val.name,
                        'proid': this.cid,
                        'floorid': this.roomid,
                        'roomid': val.id,
                        'toname': this.toname + val.name
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.selectRoom {
    height: calc(100% - 100px);
    padding: 100px 0 0 20px;
    overflow: hidden;
    overflow-y: auto;
    .top {
        width: 100%;
        height: 100px;
        position: fixed;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        border-bottom: 1px solid #f1f1f1; /*no*/
        color: black;
        background: #fff;
        &::before {
            content: "";
            width: 12px; /*no*/
            height: 12px; /*no*/
            border-bottom: 1px solid #333; /*no*/
            border-left: 1px solid rgb(92, 90, 90); /*no*/
            transform-origin: center;
            transform: rotateZ(45deg);
            position: absolute;
            left: 10px;
        }
    }
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
}
</style>