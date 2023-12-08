<template>
  <div id="email-chip-wrapper" class="d-inline-flex align-center py-025 px-025 bg-white" style="border-radius: 1.25rem;">
    <template v-if="avatar">
      <bib-avatar :src="avatar" size="1.25rem" class="mr-025"></bib-avatar>
    </template>
    <template v-else>
      <bib-avatar :text="email[0].toUpperCase()" size="1.25rem" class="mr-025"></bib-avatar>
    </template>
    <strong v-if="name" class="px-025 font-sm" id="email-chip-strong">{{name}}</strong>
    <span id="email" class="px-025 font-sm">{{email}}</span>
    <template v-if="close">
      <bib-icon icon="trash-solid" variant="gray5" :scale="0.8" class="cursor-pointer ml-05 mr-025" v-on:click="onClose" ></bib-icon>
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
