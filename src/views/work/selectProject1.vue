<template>
  <div class="selectProject">
    <headerTab :title="$route.meta.title" />
     <!-- 搜索 -->
    <div class="box">
        <div class="search" >
        <!-- <cube-input></cube-input> -->
            <input type="text"  v-model="search" placeholder="请输入小区名称">
        </div>
    </div>
    <div class="container">
       
        <!-- 城市列表 -->
        <div class="city" v-for="(item,index) in citys" :key="index">
            <p class="idx">{{item.idx}}</p>
            <p class="name" v-for="(v,i) in item.list" :key="i" @click="choseCity(v.name)">{{v.name}}</p>
        </div>
        <div class="right">
            <span v-for="(item,index) in idxLists" :key="index">{{item}}</span>
        </div>
    </div>
    
  </div>
</template>

<script>
import { headerTab, bottomButton2 } from "../../components/index";
import { appGetRepairProject} from "@/service/work"

export default {
    components: {
        headerTab
    },
    data () {
        return {
            citys: {},
            idxLists: [],
            search: ''
        }
    },
    methods: {
        choseCity (name) {
            console.log(name)
        }
    },
    async mounted () {
        let res =await appGetRepairProject()
        this.citys = res.list
        console.log(res)
        this.idxLists = res.list.map(v=>{
            return v.idx
        })
        
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.selectProject{
   
    height: calc(100% - 100px);
    padding-top: 100px;
    overflow: hidden;
    overflow-y: auto;
}
.headerTab{
    position: fixed;
    top:0px;
    z-index: 9999;
}
.box{
    background: #fff;
    height: 80px;
    width: 100%;
    position: fixed;
    top:100px;
    left:0;
    padding: 10px 10px;
    z-index: 999;
}
.search{
        width: 85%;
        height: 50px;
        margin: 0px auto;
        border-radius: 60px;
        background-color: #f5f5f5;
        padding: 0 10%;
        display: flex;
        align-items: center;
        background-image: url('../../assets/searchIcon.png');
        background-repeat:no-repeat;
        background-size: 30px 30px;
        background-position:20px;
        .cube-input{
            height: 40px;
            background: #f5f5f5;
        }
    }
.cube-input{
    height: 100%;
    width: 100%;
    outline: none!important;
}
.container{
    padding: 1px 20px 0px 20px;
    background: #f5f5f5;
    
    .city{
       
        position: relative;
        .idx{
            padding: 20px 0 10px 0;
            font-size: 30px;
        }
        .name{
             width: 85%;
            border-bottom: 1px solid #ddd;
            padding: 20px 0;
            font-size: 30px;
        }
    }
    .right{
            width: 100px;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-wrap: wrap;
            font-size: 6px;
            background: #f5f5f5;
            align-items: center;
            span{
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 20px 0;
            }
        }
}
</style>