<template>
  <div :id="'department-wrap-'+compId" class="d-flex gap-05 align-center">
    <span v-if="department.title" :id="'department-text'+compId" class="text-capitalize">
      {{ department.title }}
    </span>
  </div>
</template>

<script>
export default {

  name: 'DepartmentComp',
  props: {
    department: { type: Object },
    iconOnly: { type: Boolean, default: false},
  },
  computed: {
  	compId(){
      return Math.floor((Math.random()*1000)+1);
    },
  },
}

</script>
<style lang="scss" scoped>
.circle {
  width: 24px;
  height: 24px;

  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>
