<template>
  <div class="align-center text-secondary p-05 bg-light shape-rounded">
    <template v-if="avatar">
      <bib-avatar :src="avatar" size="1.5rem"></bib-avatar>
    </template>
    <span class="pl-025 pr-025">{{email}}</span>
    <template v-if="close">
      <bib-icon icon="close" :scale="1" class="cursor-pointer" v-on:click="onClose"></bib-icon>
    </template>
  </div>
</template>
<script>
export default {

  name: 'EmailChip',

  props: {
    email: { type: String, required: true, default: "john.doe@biztree.com" },
    avatar: { type: String, default: "" },
    close: { type: Boolean, default: false },
  },
  methods: {
    onClose() {
      this.$emit("remove-email", true)
      this.$nuxt.$emit('remove-email', true)
    }
  }
}

</script>
<style lang="css" scoped>
</style>
