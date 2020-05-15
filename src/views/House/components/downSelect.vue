<template>
  <cube-popup type="extend-popup" ref="downSelectPopup" position="bottom" :mask-closable="true">
    <div class="downSelect">
      <div class="downSelect-btn">
        <div class="btn1" @click="hide">取消</div>
        <div class="btn2" @click="okSelect">确定</div>
      </div>
      <div class="downSelect-com">
        <div class="checkbox-all">
          <cube-checkbox v-model="allFlag" style="padding:0" @input="changeAll">全选</cube-checkbox>
        </div>
        <div class="checkbox-list">
          <div class="checkbox-list-c">
            <cube-scroll ref="scroll" :data="[]" :options="{}">
              <div>
                <cube-checkbox-group v-model="checkList">
                  <cube-checkbox
                    :option="{value:item.value}"
                    v-for="item in dataList"
                    :key="item.value"
                    @input="changeItem"
                  >
                    <i>{{item.text}}</i>
                  </cube-checkbox>
                </cube-checkbox-group>
              </div>
            </cube-scroll>
          </div>
        </div>
      </div>
    </div>
  </cube-popup>
</template>
<script>
export default {
  name: "downSelect",
  data() {
    return {
      allFlag: false,
      checkList: []
    };
  },
  props: {
    dataList: {
      default: []
    }
  },
  watch: {
    dataList() {
      this.checkList = [];
    },
    checkList() {
      if (this.checkList.length != this.dataList.length) {
        this.allFlag = false;
      } else {
        this.allFlag = true;
      }
    }
  },
  methods: {
    okSelect() {
      this.$emit("getActSelect", this.checkList);
      this.$nextTick(v => {
        this.hide();
      });
    },
    hide() {
      this.$refs.downSelectPopup.hide();
    },

    show() {
      this.$refs.downSelectPopup.show();
      this.$nextTick(v => {
        this.$refs.scroll.refresh();
        this.$refs.scroll.scrollTo(1, 0);
      });
    },
    changeAll() {
      if (this.allFlag) {
        this.checkList = this.dataList.map(v => v.value);
      } else {
        this.checkList = [];
      }
    },
    changeItem(val) {
      if (val == false) {
        this.allFlag = false;
      }
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.downSelect {
  background: white;
}
.downSelect-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    font-size: 34px;
    line-height: 1;
    padding: 30px 40px;
  }
  .btn1 {
    color: #333;
  }
  .btn2 {
    color: #a260a4;
  }
}
.downSelect-com {
  .checkbox-all {
    padding: 0px 40px;
  }
  .checkbox-list {
    padding: 0px 40px;
    height: 300px;
    overflow: hidden;
  }
  .checkbox-list-c {
    height: 300px;
    font-size: 30px;
  }
}
</style>