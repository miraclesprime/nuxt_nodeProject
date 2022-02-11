<template>
	<div>
		<div id="project-name" style="border-bottom: 1px solid #dcdcdf" class="p-05 text-secondary font-sm">{{task.title ? task.title : 'My Project'}}</div>
	</div>
</template>

<script>
export default {

  name: 'Tasks',

  data () {
    return {
      task: {
        title: "Task A"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>