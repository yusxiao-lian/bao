<template>
    <div class="publicSlide" ref="publicSlide">
      <slot></slot>
    </div>
</template>

<script>
  import { BetterScroll } from 'cube-ui'
  export default {
    name: "publicSlide",
    data(){
      return{
        sliderObj:null
      }
    },
    props:{
      slideData:{
        default:[],
        type:Array
      }
    },
    watch:{
      slideData(){
        setTimeout(v=>{
          this.sliderObj.refresh()
        },200)
      }
    },
    methods:{

    },
    mounted(){
      this.sliderObj = new BetterScroll(this.$refs.publicSlide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: true,
        tap:true,
        snap: {
          loop: false,
          threshold: 0.1,
          speed: 1000,
          stepX: 100,
          stepY: 100,
          easing: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function(t) {
              return t * (2 - t)
            }
          }
        }
      });
      setTimeout(v=>{
        this.sliderObj.refresh()
      },800)

    }
  }
</script>

<style lang="scss" scoped>
.publicSlide{
  width: 100%;
  height: 100%;
}
</style>
