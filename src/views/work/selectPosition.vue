<template>
  <div class="box">
      11111
  </div>
</template>

<script>
import { appGetRepairProject} from "@/service/work"

export default {
    data () {
        return {

        }
    },
    async mounted () {
        let res =await appGetRepairProject()
        console.log(res)
    }
}
</script>

<style>

</style>