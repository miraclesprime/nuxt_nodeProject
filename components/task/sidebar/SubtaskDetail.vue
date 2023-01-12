<template>
    <section>
        {{subtask.title}}
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {

    name: 'SubtaskDetail',
    /*props: {
        subtask: Object,
    },*/
    data() {
        return {

        }
    },
    computed: {
    	...mapGetters({
    		subtask: "subtask/getSelectedSubTask"
    	}),
      property () {
        return true;
      }
    }
}
</script>
<style lang="scss" scoped>
</style>