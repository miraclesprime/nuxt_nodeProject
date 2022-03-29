<template>
  <div id="email-chip-wrapper" class="d-flex align-center py-025 px-05 bg-light shape-rounded">
    <template v-if="avatar || text">
      <bib-avatar :src="avatar" :text="text.toUpperCase()" size="1.25rem" class="mr-025"></bib-avatar>
    </template>
    <strong v-if="name" class="pl-025 font-sm">{{name}}</strong>
    <span id="email" class="px-05 font-sm">{{email}}</span>
    <template v-if="close">
      <bib-icon icon="close" variant="gray5" :scale="1" class="cursor-pointer ml-05" v-on:click="onClose" ></bib-icon>
    </template>
  </div>
</template>
<script>
export default {

  name: 'EmailChip',

  props: {
    email: { type: String, required: true, default: "john.doe@biztree.com" },
    name: String,
    avatar: String,
    text: String,
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
strong { white-space: nowrap;}
</style>
