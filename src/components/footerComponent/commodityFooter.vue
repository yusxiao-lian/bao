<template>
    <footer class="commodityFooter">
      <slot></slot>
    </footer>
</template>

<script>
    export default {
        name: "commodityFooter"
    }
</script>

<style lang="scss" scoped>
.commodityFooter{
  position: absolute;
  z-index: 2;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 120px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 25px;
  justify-content: space-between;
  border-top: 1px solid #EEEEEE;
  text-align: center;
}
</style>
