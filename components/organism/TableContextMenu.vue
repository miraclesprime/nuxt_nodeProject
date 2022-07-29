<template>
  <div :id="'c_menu_'+id" class="table-context-menu" v-show="show" v-click-outside="onClickOutside" :style="position">
    <div class="list">
      <span v-for="(item, index) in items" :key="item.label+index" class="list__item cursor-pointer" :class=" ['list__item__'+item.variant] " v-on:click="$emit(item.event)">
        <bib-icon v-if="item.icon" :icon="item.icon" :variant="item.iconVariant" class="mr-05"></bib-icon> {{item.label}}
      </span>
      <!-- <hr> -->
      <!-- <span class="list__item list__item__danger">Delete Task</span> -->
    </div>
  </div>
</template>
<script>
export default {

  name: 'TableContextMenu',
  props: {
    items: {
      type: Array,
      required: true,
      default () {
        return [
          { label: 'Action one', event: 'action-one', variant: '', icon: '', iconVariant: '' },
          { label: 'Action two', event: 'action-two', variant: '', icon: '', iconVariant: '' },
          { label: 'Action three', event: 'action-three', variant: '', icon: '', iconVariant: '' },
        ]
      }
    },
    show: { type: Boolean, default: false },
    coordinates: { type: Object, default () { return { left: '50%', top: '50%' } } },
  },

  data() {
    return {
      id: this._uid,
    }
  },
  watch: {
    coordinates(newValue) {
      let options = {
        // root: document.querySelector('#main-content'),
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }

      let observer = new IntersectionObserver(this.callback, options);
      let target = document.querySelector('#c_menu_' + this.id);
      observer.observe(target);
    },

  },
  computed: {
    position() {
      return this.coordinates
    },
  },
  methods: {
    onClickOutside() {
      // console.log('click outside context')
      this.$emit('close-context')
    },
    callback(entries, observer) {
      entries.forEach((entry) => {
        // Each entry describes an intersection change for one observed target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
        
        if (!entry.isIntersecting) {
          // console.log(entry.target, 'no')
          if (entry.boundingClientRect.right > entry.rootBounds.width) {
            this.position.left = (entry.rootBounds.width - entry.boundingClientRect.width) - 10 + 'px'
          }
          if (entry.boundingClientRect.bottom > entry.rootBounds.height) {
            this.position.top = (entry.rootBounds.height - entry.boundingClientRect.height) - 10 + 'px'
          }
        } 
      });
    },
  }
}

</script>
<style lang="css" scoped>
.table-context-menu {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 11;
  width: 12rem;
}

.list {
  box-shadow: 0 2px 10px rgba(100, 100, 100, 0.25);
  border: 1px solid $gray4;

  &__item {}
}

</style>
