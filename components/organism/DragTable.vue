<template>
  <!-- <draggable v-model="sections" tag="div" class="sortable-list" handle=".section-header" @end="$emit('section-dragend')"> -->
    <table v-click-outside="unselectAll" class="table" :class="{ 'table__headless': headless }" cellspacing="0">
      <thead>
        <tr class="table__hrow">
          <th width="3%">&nbsp;</th>
          <th v-for="(field, key) in fields" @click="clickColumnHeader($event,key)" :key="key" :style="`width: ${field.width};`" :class="{'table__hrow__active': field.header_icon && field.header_icon.isActive}">
            <div class="align-center">
              <span> {{ field.label }} </span>
              <template v-if="field.header_icon">
                <div class="ml-05 shape-rounded bg-hover-black width-105 height-105 d-flex justify-center align-center cursor-pointer" :class="{'bg-black': field.header_icon.isActive }" @click="$emit(field.header_icon.event)">
                  <bib-icon :icon="field.header_icon.icon" :scale="1.1" variant="gray5" hoverVariant="white"></bib-icon>
                </div>
              </template>
            </div>
          </th>
          <!-- <th v-if="$scopedSlots.cell_action" class="cell_action_header">
          <div class="d-flex justify-center align-center">
            <bib-icon icon="horizontal-dots"></bib-icon>
          </div>
        </th> -->
        </tr>
      </thead>
      <tr :style="{ width: '0rem' }" v-if="collapseObj">
        <td :colspan="cols.length+1">
          <div class="section-header d-flex align-center gap-05 " :class="'text-'+collapseObj.variant" >
            <div class="drag-handle width-2 text-center"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24" /><path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg></div> <span class="d-flex gap-05 align-center cursor-pointer" @click="isCollapsed = !isCollapsed"><bib-icon icon="arrow-down" :scale="0.5" :variant="collapseObj.variant" :style="{transform: iconRotate}"></bib-icon> {{collapseObj.label}}</span>
          </div>
        </td>
      </tr>
      <draggable :list="localdata" tag="tbody" class="task-draggable " handle=".drag-handle" @start="" @end="$emit('task-dragend', sections)" :style="{ visibility: isCollapsed ? 'collapse': '' }">
        <tr v-for="(item, keyI) in sections" :key="'item-' + keyI" class="table__irow">
          <td>
            <div class="drag-handle width-2 "><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24" /><path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" /></svg></div>
          </td>
          <td v-for="(col, key) in cols" :key="key">
            <div v-if="$scopedSlots['cell(' + col + ')']">
              <slot :name="'cell(' + col + ')'" v-bind:keyI="keyI" v-bind:value="sections[keyI]">
              </slot>
            </div>
          </td>
          <!-- <td v-if="$scopedSlots.cell_action">
            <slot name="cell_action" v-bind:keyI="keyI" v-bind:value="sections[keyI]"></slot>
          </td> -->
        </tr>
        <tr v-if="newTaskButton">
          <td colspan="2">
            <div class="d-inline-flex align-center gap-05 cursor-pointer font-md" :class="['text-'+newTaskButton.variant, 'text-hover-'+newTaskButton.hover]" v-on:click="$emit(newTaskButton.event, sections)">
              <bib-icon icon="add" :variant="newTaskButton.variant" :scale="1.1" class=""></bib-icon> <span>{{newTaskButton.label}}</span>
            </div>
          </td>
        </tr>
      </draggable>
    </table>
  <!-- </draggable> -->
</template>
<script>
/**
 * @module Orgamisms/DragTable
 * @author Vishwajeet
 * @rebuild Vishwajeet
 * @desc Table component with drag-drop
 * @vue-prop headless=false {Boolean} - table without header.
 * @vue-prop fields=[] {Array} - table header names.
 * @vue-prop sections=[] {Array} - table data.
 * @vue-prop collapseObj=null {Object} - collapsible table settings.
 * @vue-prop newTaskbutton={Object} - add new row button
 */
import draggable from 'vuedraggable'
export default {
  name: "DragTable",
  components: {
    draggable
  },
  props: {
    headless: {
      type: Boolean,
      default () {
        return false;
      },
    },
    fields: {
      type: Array,
      default () {
        return [];
      },
    },
    sections: {
      type: Array,
      default () {
        return [];
      },
    },
    collapseObj: {
      type: Object,
      default () {
        return null;
      }
    },
    newTaskButton: {
      type: Object,
      default(){
        return {
          label: "New Task",
          event: "new-task",
          variant: "secondary",
          hover: "dark",
        }
      }
    }
  },
  data() {
    return {
      cols: [],
      item: {},
      isCollapsed: this.collapseObj ? this.collapseObj.collapsed : false,
    };
  },
  computed: {
    activeClass() { return keyI => this.sections[keyI].active ? 'active' : '' },
    iconRotate() { return this.isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' },
  },
  created() {
    this.cols = this.fields.map((field) => field.key);
    // this.cols.shift();
  },
  methods: {
    clickItem(key) {
      this.$emit('item-dblclicked', this.sections[key])
      this.unselectAll()
      document.getElementById(key).classList.toggle('active')
    },
    unselectAll() {
      let rows = document.getElementsByClassName('table__irow');
      for (let row of rows) {
        row.classList.remove('active');
      }
    },
    /*rightClickItem(event, key) {
      event.preventDefault()
      this.$emit('item-right-clicked', { event: event, row: this.sections[key] })
    },*/
    clickColumnHeader(event, key) {
      this.$emit('column-header-clicked', { event: event, column: this.cols[key] })
    }
  },
};

</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  height: max-content;
  margin: 0;
  border-collapse: collapse;

  tr {
    height: 2.5rem;
  }

  th,
  td {
    padding-left: 8px;
    padding-right: 6px;
  }

  &__hrow {
    height: 2.5rem;
    background-color: $light;
    color: $gray5;
    font-size: $base-size;
    font-weight: normal;

    th {
      border: $gray4 1px solid;
      border-top: none;
      text-align: left;

      &.cell_action_header {
        width: 0rem;
      }
    }

    &__no {
      text-align: center !important;
    }

    &__active {
      border-bottom-color: $dark-sub1 !important;

      span {
        color: $dark-sub1 !important;
      }
    }

    &.collapsed {
      visibility: collapse;
    }
  }

  &__srow {
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  &__irow {
    color: $gray6;
    font-weight: 400;
    line-height: 2.5rem;
    font-size: $base-size;
    outline: 1px solid transparent;
    transition: background-color .3s linear, outline-color .3s linear;

    td {
      border: 1px solid $light;

      &:not(:last-child) {
        border-right: none;
      }

      color: $gray5;

      &:first-child {
        text-align: center;
      }
    }

    /*&:nth-child(2) td {
      border-top: none;
    }

    &:not(:last-child) td {
      border-bottom: none;
    }*/

    &:hover {
      cursor: default;
      background-color: $light;
      border-color: $gray4;

    }

    &:active {
      cursor: default;
      background-color: $light;
      outline: 1px solid $gray4;
    }

    &.active {
      background-color: $light;
      outline: 1px solid $gray4;
    }
  }

  &__headless {
    border-top: 0;

    .table__hrow {
      visibility: collapse;
    }
  }

  .drag-handle {
    cursor: grab;

    svg {
      fill: $gray4;
    }
  }
}

.section-header {
  font-size: $base-size;
  font-weight: bold;
}

</style>
