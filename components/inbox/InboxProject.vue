<template>
	<article class="position-relative p-1">
		<h3>{{project.title}}</h3>
		<div>{{$userInfo(project.userId).Name}}</div>
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