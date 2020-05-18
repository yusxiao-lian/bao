<template>
  <div id="selectPosition">
    <headerTab :title="$route.meta.title" />
    <div class="container">
        <div class="project" @click="selectProject">
            <span>项目</span>
            <span class="select">请选择项目</span>
        </div>
        <div class="floor">
            <span>楼栋</span>
            <div class="chooseFloor">
                <cube-button @click="showPicker">{{floor?floor:'请选择楼栋'}}</cube-button>
            </div>
        </div>
        <div class="floor">
            <span>房间号</span>
            <div class="chooseFloor">
                <cube-button @click="showPickerRoom">{{room?room:'请选择房间号'}}</cube-button>
            </div>
        </div>
    </div>
  </div>
  
</template>

<script>
import { appGetRepairProject} from "@/service/work"
import { headerTab } from "../../components/index";

export default {
    
    components: {
        headerTab
    },
    data () {
        return {
            column1:[{ text: '剧毒', value: '剧毒'}, { text: '蚂蚁', value: '蚂蚁' },{ text: '幽鬼', value: '幽鬼' }],
            column2:[{ text: '1', value: '1'}, { text: '2', value: '2' },{ text: '3', value: '3' }],
            floor: '',
            room: ''
        }

    },
    async mounted () {
        let res =await appGetRepairProject()
        console.log(res)
    },
    methods: {
        selectProject () {
            this.$router.push({path:'/selectProject'})
        },
        showPicker() {
        if (!this.picker) {
            this.picker = this.$createPicker({
            title: '选择楼栋',
            data: [this.column1],
            onSelect: this.selectHandle,
            onCancel: this.cancelHandle
            })
        }
        this.picker.show()
        },
        selectHandle(selectedVal, selectedIndex, selectedText) {
            this.floor = selectedVal.join(', ')
            console.log(this.floor)
        },

        cancelHandle() {
            this.picker = ''
        },
        showPickerRoom() {
        if (!this.picker2) {
            this.picker2 = this.$createPicker({
            title: '请选择房间号',
            data: [this.column2],
            onSelect: this.selectHandleRoom,
            onCancel: this.cancelHandle2
            })
        }
        this.picker2.show()
        },
        selectHandleRoom(selectedVal, selectedIndex, selectedText) {
            this.room = selectedVal.join(', ')
            console.log(this.room)
        },
        cancelHandle2() {
        }

    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.container{
    padding: 100px 40px 0 40px;
    background: #fff;
    .project{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100px;
        border-bottom: 1px solid #ddd;
        span{
            font-size: 35px;
        }
        .select{
            display: flex;
             align-items: center;
            &::after{
                display: block;
                content: '';
                height: 20px;
                width: 20px;
                border-top: 1px solid #333;
                border-right: 1px solid #333;
                transform: rotateZ(45deg);
                margin-left: 20px;
            }
        }
    }
    .floor{
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;

        span{
            font-size: 35px;
        }
        .cube-btn{
            height: 90px;
            color: #666;
            background: #fff;
            font-size: 35px;
        }
    }
}
</style>