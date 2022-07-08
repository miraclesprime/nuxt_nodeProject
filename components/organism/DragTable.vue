<template>
  <table v-click-outside="unselectAll" class="table" :class="{ 'table__headless': headless }" cellspacing="0">
    <template>
      <tr class="table__hrow" :class="fixHeader ? 'table__hrow-fixed' : ''">
        <!-- <th v-if="!hideNoColumn" class="table__hrow__no">{{ fields[0].label }}</th> -->
        <th v-for="(field, key) in fields" @click="clickColumnHeader($event,key)" :key="key" :style="`width: ${field.width};`" :class="{'table__hrow__active': field.header_icon && field.header_icon.isActive}">
          <div class="align-center">
            <span> {{ field.label }} </span>
            <template v-if="field.header_icon">
              <div
                class="ml-05 shape-rounded bg-hover-black width-105 height-105 d-flex justify-center align-center cursor-pointer"
                :class="{'bg-black': field.header_icon.isActive }"
                @click="$emit(field.header_icon.event)"
              >
                <bib-icon :icon="field.header_icon.icon" :scale="1.1" variant="gray5" hoverVariant="white"></bib-icon>
              </div>
            </template>
          </div>
        </th>
        <th v-if="$scopedSlots.cell_action" class="cell_action_header">
          <div class="d-flex justify-center align-center">
            <bib-icon icon="horizontal-dots"></bib-icon>
          </div>
        </th>
      </tr>
    </template>
    <tr :style="{ width: '0rem' }" v-if="collapseObj">
      <td colspan="2">
        <bib-detail-collapse
          :label="collapseObj.label"
          :open="!isCollapsed"
          :variant="collapseObj.variant"
          @click="isCollapsed = !isCollapsed"
          style="transform: translateX(-10px);"
        >
        </bib-detail-collapse>
      </td>
    </tr>
    <template v-for="(item, keyI) in sections">
      <tr :key="'item-' + keyI" :style="{ visibility: isCollapsed ? 'collapse': '' }" class="table__irow" @contextmenu.stop="rightClickItem($event, keyI)" @click="$emit('item-clicked', $event, keyI)" @dblclick="clickItem(keyI)" :id="keyI" >
        <!-- <td v-if="!hideNoColumn" class="table__irow-count">{{keyI+1}}</td> -->
        <td v-for="(col, key) in cols" :key="key">
          <div v-if="$scopedSlots['cell(' + col + ')']">
            <slot
              :name="'cell(' + col + ')'"
              v-bind:keyI="keyI"
              v-bind:value="sections[keyI]"
            >
            </slot>
          </div>
        </td>
        <td v-if="$scopedSlots.cell_action">
          <slot
            name="cell_action"
            v-bind:keyI="keyI"
            v-bind:value="sections[keyI]"
          ></slot>
        </td>
      </tr>
    </template>
  </table>
</template>

<script>
/**
 * @module Orgamisms/DragTable
 * @author Vishwajeet
 * @rebuild Vishwajeet
 * @desc Table component with drag-drop
 * @vue-prop {Boolean} headless=null - table without header.
 * @vue-prop {String} fields=[] - table header names.
 * @vue-prop {String} sections=[] - table data.
 * @vue-prop {Object} collapseObj=null - collapsible table settings.
 */
export default {
  name: "DragTable",
  props: {
    headless: {
      type: Boolean,
      default() {
        return null;
      },
    },
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    sections: {
      type: Array,
      default() {
        return [];
      },
    },
    collapseObj: {
      type: Object,
      default() {
        return null;
      }
    },
    hideNoColumn: {
      type: Boolean,
      default() {
        return false;
      },
    },
    fixHeader:{
      type: Boolean,
      default() {
        return false;
      },
    }
  },
  data() {
    return {
      cols: [],
      item: {},
      isCollapsed: this.collapseObj ? this.collapseObj.collapsed : false
    };
  },
  created() {
    this.cols = this.fields.map((field) => field.key);
    // this.cols.shift();
  },
  methods: {
    clickItem(key){
      this.$emit('item-dblclicked',this.sections[key])
      this.unselectAll()
      document.getElementById(key).classList.toggle('active')
    },
    unselectAll(){
      let rows = document.getElementsByClassName('table__irow');
      for(let row of rows){
        row.classList.remove('active');
      }
    },
    rightClickItem(event, key){
      this.$emit('item-right-clicked', { event: event, row:this.sections[key]})
    },
    clickColumnHeader(event,key){
      this.$emit('column-header-clicked', { event: event, column:this.cols[key]})
    }
  },
  computed:{
    activeClass(){
      return keyI => this.sections[keyI].active ? 'active' : ''
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: max-content;
  margin: 0;

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
    font-size: 13px;
    font-weight: bold;

    th {
      border: $gray4 1px solid;
      border-top: none ;
      text-align: left;
      
      /*&:not(:last-child){
        border-right: none;
      }*/

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

    &-count {
      width: 60px;
    }

    td {
      border: 1px solid $light;
      
      &:not(:last-child){
        border-right: none;
      }
      color: $gray5;
        &:first-child{
        text-align: center;
        }
    }
    &:nth-child(2) td{
        border-top: none;
    }
    &:not(:last-child) td{
      border-bottom: none;
    }
    &:hover {
      cursor: default;
      background-color: $light;
      border-color: $gray4;
      td {
        border-left: $gray4 1px solid;
      }
    }
    &:active {
      cursor: default;
      background-color: $light;
      outline: 1px solid $gray4;
    }
    &.active{
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
}
.table__hrow-fixed{
  position: sticky;   // first row
  top: 100px;
  z-index: 20;
  left: 0;
}
</style>