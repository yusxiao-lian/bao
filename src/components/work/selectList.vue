<template>
  <div class="selectList" @selectProject="selectProject(id)">
      <span>
          <slot>{{name}}</slot>
      </span>
      <span class="right"></span>
  </div>
</template>

<script>
export default {
    props:  { name:'' },
    data () {
        
        return {

        }
    },
    methods: {
      selectProject (id) {
          console.log(id)
      }
        
    },
    mounted () {
        this.$emit('selectProject')
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
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
</style>