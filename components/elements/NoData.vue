<template>
	<figure class="text-center py-2">
		<img :src="notask" alt="no data">
		<!-- <figcaption>Add tasks to start achieving your goals!</figcaption> -->
	</figure>
</template>

<script>
import NoTask from "~/assets/no-tasks.png"
export default {

  name: 'NoData',

  data () {
    return {
    	notask: NoTask,
    }
  }
}
</script>

<style lang="css" scoped>
figure {}
</style>