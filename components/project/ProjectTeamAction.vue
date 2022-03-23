<template>
  <div id="project-team-action-wrapper" class="project-team-actions ml-05">
    <div id="pta-add-teammate-wrapper" class="action-left">
      
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="pta-add-teammate-button">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon>
            <span id="pta-add-teammate-text">New Teammate</span>
      </div>

    </div>
    
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
.project-team-actions {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid $gray4;
  align-items: center;
}

.action-right {
  margin-left: auto;
}
</style>