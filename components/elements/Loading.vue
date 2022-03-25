<template >
    <div v-if="loading" id="loading-comp" class="position-absolute d-flex align-center justify-center comp-loading">
        <bib-spinner variant="primary"></bib-spinner>
    </div>
</template>
<script>
export default {

    name: 'Loading',

    data() {
        return {
            

        }
    },
    props: {
    	loading: { type: Boolean, default: true }
    }
}
</script>
<style lang="scss" scoped>
.comp-loading {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--bib-light);
  z-index: 29;
}

</style>
