<template>
    <div id="keyboard" :class="{'keyboardactive':flag}">
      <ul class="keyboard-List"  v-for="(items,indexs) in keyboardList">
        <li v-for="(item,index) in items" @click="clickKey(item)">{{item}}</li>
      </ul>
      <ul class="keyboard-btn">
        <li @click="clearKey">清空</li>
        <li class="close" @click="closeKeyBoard">关闭</li>
        <li @click="delKey">删除</li>
        <li @click="clickOk">OK</li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "keyboard",
    props: {
      keyNumbers: {
        default:7,
        type:Number
      },
      value: {
        default:function () {
          return []
        },
        type:Array
      },
    },
    data() {
      return {
        flag:false,
        provinces:[
          ["京","沪","浙","苏","粤","鲁","晋","冀", "豫","川"],
          ["渝","辽","吉","黑","皖","鄂", "津","贵","云"],
          ["桂","琼","青","新","藏", "蒙","宁","甘"],["陕","闽","赣","湘"]],
        letters:[["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"]],
        letterNums:[["0","1","2","3","4","5","6","7","8","9"], ["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"]],
        letterNumsChinese:[["0","1","2","3","4","5","6","7","8","9"], ["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"],["警","领","使","学"]],
        keyboardList:[],
        activeKey:[]
      }
    },
    watch: {
      activeKey: {
        handler: function(val, oldVal) {
          let num = val.length
          setTimeout(v=> {
            if(num==0) {
              this.keyboardList=this.provinces;
            }
            if(num==1) {
              this.keyboardList=this.letters;
            }
            if(num>1) {
              this.keyboardList=this.letterNums;
            }
            if(num>5) {
              this.keyboardList=this.letterNumsChinese;
            }
          },150)
          this.$emit('input',val)
        },
        deep: true
      }
    },
    methods: {
      closeKeyBoard() {
        this.flag=true;
        setTimeout(v=>{this.$emit('closeKey')},150);
      },

      //ok
      clickOk() {
        if(this.activeKey.length<this.keyNumbers) {
          this.Toast('车牌号码位数不够，若非新能源车牌请点“删除”');
        } else {
          this.flag=true;
          setTimeout(v=>{this.$emit('closeKey')},150);
        }
      },
      //清空
      clearKey() {
        this.activeKey=[];
        this.$emit('clearKey');
      },
      //删除
      delKey(){
        this.$emit('delKey')
        /*if(this.activeKey.length>0){
          let lastIndex= this.activeKey.length-1
          this.activeKey.splice(lastIndex,1)
        }*/
      },

      clickKey(item) {
        if(this.activeKey.length<this.keyNumbers) {
          this.activeKey.push(item)
        } else {
          let arr = []
          this.activeKey.forEach((v,i)=> {
            if(i< this.activeKey.length-1){
              arr.push(v)
            } else {
              arr.push(item)
            }
          })
          this.activeKey=arr
        }

      }
    },
    mounted() {
      this.keyboardList=this.provinces
      this.activeKey=this.value
      this.flag=false
    }
  }
</script>

<style lang="scss" scoped>
#keyboard{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: #CED3D9;
  box-shadow: 0 0 4px #ccc;/*no*/
  animation: keySlidShow .3s 1;
  .keyboard-List{
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    li{
      width: 65px;
      height: 65px;
      border-radius: 4Px;/*no*/
      box-shadow: 2px 2px 2px #888888;/*no*/
      background-color: white;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px 5px 5px 5px;
    }
    li:active{
      background-color: #00b0f0;
      color: white;
    }
  }
  .keyboard-btn{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    li{
      width: 120px;
      height: 60px;
      border-radius: 4Px;/*no*/
      box-shadow: 2px 2px 2px #888888;/*no*/
      background-color: white;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close{
      width: 320px;
    }
    li:active{
      background-color: #00b0f0;
      color: white;
    }
  }
  @keyframes keySlidShow {
    0%{
      transform: translateY(100%);
      opacity: 0;
    }
    100%{
      transform: translateY(0%);
      opacity: 1;
    }
  }
}
#keyboard.keyboardactive{
  animation: keySlidHidden .2s 1;
}
@keyframes keySlidHidden {
  0%{
    opacity: 1;
    transform: translateY(0%);
  }
  100%{
    opacity: 0;
    transform: translateY(110%);
  }
}
</style>
