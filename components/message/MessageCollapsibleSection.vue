<template>
  <div class="section">
    <div class="head" @click.stop="collapsed = !collapsed">
      <div class="arrow" :class="{ closed: collapsed }">
        <span class="triangle"></span>
      </div>
      <slot name="title" />
    </div>
    <div class="content-container">
      <div class="content">
        <slot name="content" v-if="!collapsed" />
      </div>
    </div>
  </div>
</template>
<script>
export default {

  data() {
    return {
      collapsed: false,
    };
  },
};

</script>
<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-size: 1rem;
  color: $gray1;
}

.arrow {
  transition: all 0.1s linear;
  padding: 0;
  border: 0;

  &.closed {
    transform: rotate(-90deg);
  }
}

.triangle {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid $gray1;
  position: relative;
  bottom: -14px;
}

</style>
