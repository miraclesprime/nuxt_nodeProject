<template>
  <div class="adv-table-wrapper position-relative">
    <div class="adv-table bg-white" :style="{'width': tableWidth}" role="table">
      <!-- <div class="zero" :style="{ width: tableFields[0].width}">
        <div class="align-center gap-05">{{tableFields[0].label}} <span v-if="tableFields[0].header_icon" class="height-1" @click="$emit(tableFields[0].header_icon.event)"><bib-icon :icon="tableFields[0].header_icon.icon" :variant="tableFields[0].header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon></span></div>
      </div> -->
      <div class="tr" role="row">
        <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :style="{ width: field.width}">
          <div class="align-center gap-05">{{field.label}} <span v-if="field.header_icon" class="height-1" @click="$emit(field.header_icon.event)">
              <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon>
            </span></div>
        </div>
        <!-- <div class="th">owner</div>
        <div class="th">due date</div> -->
      </div>
      <!-- <div class="thead">
      </div> -->
      <div v-for="item in tableData" :key="item.id" class="tr" role="row">
        <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell">
          <div v-if="field.key == 'title'" class="align-center ">
            <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}">
              <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="field.icon.variant" hover-variant="success"></bib-icon>
            </span>
            <span v-if="field.event" class=" flex-grow-1" style=" line-height:1.25;">
              <input type="text" class="editable-input" :value="item[field.key]">
            </span>
            <span v-else class="flex-grow-1">
              {{item[field.key]}}
            </span>
            <span v-if="field.event" class="width-105 height-105 align-center justify-center flex-shrink-0 cursor-pointer bg-hover-light" @click.stop="$emit(`${field.event}`, item)">
              <bib-icon icon="arrow-right" variant="gray4" hover-variant="gray5"></bib-icon>
            </span>
          </div>
          <template v-if="field.key == 'project'">{{item[field.key][0].project.title}}</template>
          <template v-if="field.key == 'userId'">
            <user-info :userId="item[field.key]"></user-info>
          </template>
          <template v-if="field.key == 'status'">
            <status-comp :status="item[field.key]"></status-comp>
          </template>
          <template v-if="field.key == 'priority'">
            <priority-comp :priority="item[field.key]"></priority-comp>
          </template>
          <template v-if="field.key == 'department'">{{item[field.key].title}}</template>
          <template v-if="field.key.includes('Date')" class="date-cell">{{$formatDate(item[field.key])}}</template>
          <!-- {{item[field.key]}} -->
        </div>
        <!-- <div class="td">asdf</div>
        <div class="td">asdf</div> -->
      </div>
      <!-- <div class="tbody">
        
      </div> -->
      <!-- <div class="tfoot">
      <div class="tr">
        <div class="td">foot asdf</div>
        <div class="td">foot asdf</div>
        <div class="td">foot asdf</div>
      </div>
    </div> -->
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {

  name: 'AdvanceTable',

  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },
    draggable: { type: Boolean, default: true },
    // height: { type: String, default: '100%' }
  },

  data() {
    return {

    }
  },

  computed: {
    tableWidth() {
      const main = document.getElementById("main-content")
      // console.log(main.clientWidth, main.offsetWidth, main.scrollWidth)
      let w = main.scrollWidth

      return w + "px"

      /*const resizeObserver = new ResizeObserver((entries) => {
        console.log(entries[0])
        if (entries[0].contentRect) {
          return entries[0].contentRect.width + "px"
        } else {
          return main.scrollWidth + "px"
        }
      });

      resizeObserver.observe(main);*/

    },
  },

  mounted() {
    const sub = document.getElementById("sub-panel")
  },

  methods: {

  }
}

</script>
<style lang="scss" scoped>
* {
  scrollbar-width: auto;
  scrollbar-height: auto;
}

*::-webkit-scrollbar {
  width: auto;
  height: auto;
}

::-webkit-scrollbar {
  width: auto;
  height: auto;
}

*::-webkit-scrollbar-track {
  border-radius: 0;
}

*::-webkit-scrollbar-thumb {
  border-radius: 0;
  /*border: 0 none;*/
}

.adv-table-wrapper {
  overflow: auto;
  /*height: calc(100vh - 200px);*/
  height: 100%;
}

.adv-table {
  display: table;
  min-width: 100%;
  font-size: $base-size;

  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }

  .th,
  .td {
    display: table-cell;
    border-bottom: 1px solid $light;
    padding: 0.25rem;
    vertical-align: middle;
    min-width: fit-content;
    white-space: nowrap;

    &:not(:last-child) {
      border-right: 1px solid $light;
    }
  }


  .tr {
    display: table-row;

    .th:first-child,
    .td:first-child {
      position: sticky;
      width: 100px;
      left: 0;
      z-index: 10;
      background: #fff;
    }

    .th {
      position: sticky;
      top: 0;
      z-index: 9;
      background: $gray9;

      &:first-child {
        z-index: 11;
        background: $gray9;
      }
    }
  }

}

.editable-input {
  font-size: $base-size;
  font-weight: normal;
}

</style>
