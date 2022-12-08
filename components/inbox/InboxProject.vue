<template>
	<article class="position-relative p-1">
		<h3>{{project.title}}</h3>
		<div>{{project.id}}</div>
	</article>
</template>

<script>
export default {

  name: 'InboxProject',
  props:{
  	project: Object,
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>