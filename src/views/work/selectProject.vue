<template>
  <div class="selectProject">
    <headerTab :title="$route.meta.title" />
    <!-- <p>E+社区</p> -->
    <div class="selectList" v-for="(item,index) in proLists" :key="index" @click="selectProject(item)" >
      <span>
          <slot>{{item.name}}</slot>
      </span>
      <span class="right"></span>
  </div>
    <!-- <selectList v-for="(item,index) in proLists" :key="index" :name="item.name" @click="selectProject(item.id)"></selectList> -->
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";
import { selectList } from "../../components/index";
import { appGetRepairProject} from "@/service/work"

export default {
    components: { headerTab,selectList },
    data () {
        return {
            workInfo: {},
            proLists: []
        }
    },
    async mounted () {
        // 接收选择参数
        this.workInfo = this.$route.query.workInfo
        console.log( this.workInfo)

        // 获取项目列表
        let res =await appGetRepairProject()
        let list = res.list
        let lists = list.map(v => {
            return v.list
        })
        console.log(lists)
        let arr = []
        let a = lists.map(i => {
            i.forEach(e => {
                arr.push(e)
            });
            return arr
        })
        this.proLists = arr
        console.log(this.proLists)
    },
    methods: {
        selectProject (item) {
            this.$router.push({
                path: '/selectFloor',
                query: {
                    'item': item,
                    'workInfo': this.workInfo
                }
            })
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>

.selectProject {
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