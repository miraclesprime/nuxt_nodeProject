<template>
  <div class="section">
    <div class="head" @click.stop="collapsed = !collapsed">
      <div class="arrow" :class="{ closed: collapsed }" :style="arrowStyle">
        <span class="triangle" :style="triangleStyle"></span>
      </div>

      <slot name="title" />
    </div>

    <div class="content-container">
      <div class="content">
        <!-- <collapse-transition> -->
          <slot name="content" v-if="!collapsed" />
        <!-- </collapse-transition> -->
      </div>
    </div>
  </div>
</template>

<script>
// import { CollapseTransition } from '@ivanv/vue-collapse-transition';

export default {
  components: {
    // CollapseTransition,
  },
  props: {
    variant: {
      type: String,
      default: 'lg',
    },
  },
  computed: {
    arrowStyle() {
      return {
        'margin-right': `${this.variant === 'lg' ? '5px' : '2px'}`,
      };
    },
    triangleStyle() {
      return {
        'border-left-width': `${this.variant === 'lg' ? '4px' : '3px'}`,
        'border-right-width': `${this.variant === 'lg' ? '4px' : '3px'}`,
        'border-top-width': `${this.variant === 'lg' ? '8px' : '6px'}`,
        bottom: `${this.variant === 'lg' ? '-14px' : '-12px'}`,
      };
    },
  },
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
  gap: 7px;
}

.arrow {
  transition: all 0.1s linear;
  padding: 0;
  border: 0;
  margin-right: 5px;

  &.closed {
    transform: rotate(-90deg);
  }
}

.triangle {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #1d1d20;
  position: relative;
  bottom: -14px;
}
</style>