<template>
  <div class="adv-table-wrapper position-relative">
    <div class="adv-table bg-white" :style="{'width': tableWidth}">
      <div class="thead">
        <div class="tr">
          <div v-for="(field, index) in tableFields" :key="field+index" class="th" :style="{ width: field.width}">{{field.label}}</div>
          <!-- <div class="th">owner</div>
        <div class="th">due date</div> -->
        </div>
      </div>
      <div class="tbody">
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
              <span v-if="field.event" class="width-105 height-105 align-center justify-center cursor-pointer bg-hover-light" @click.stop="$emit(`${field.event}`, item)">
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
        <!-- <div class="tr">
        <div class="td">asdf</div>
        <div class="td">asdf</div>
        <div class="td">asdf</div>
      </div> -->
      </div>
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
  },

  data() {
    return {

    }
  },

  computed: {
    tableWidth(){
      const main = document.getElementById("main-content")
      console.log(main.clientWidth, main.offsetWidth, main.scrollWidth )
      return main.scrollWidth+'px'
    },
  },

  methods: {
    methodName() {

    }
  }
}

</script>
<style lang="scss" scoped>
  *::-webkit-scrollbar {
    width: auto;
    height: auto;
  }

.adv-table-wrapper {
  overflow: auto;
  scrollbar-width: auto;
  height: calc(100vh - 200px);
}
.adv-table {
  display: table;
  min-width: 100%;
  /*border-collapse: collapse;*/
  position: relative;
  font-size: $base-size;
  border-top: 1px solid $gray2;

  .thead {
    position: sticky;
    top: 0;
    background-color: $white;
    border-bottom: 1px solid $gray2;

    .th {
      display: table-cell;
    }
  }

  .thead,
  .tbody,
  .tfoot {
    display: table-row-group;
  }
}

.tr {
  display: table-row;
}

.th,
.td {
  display: table-cell;
  border-left: 1px solid $light;
  border-bottom: 1px solid $light;
  padding: 0.25rem;
  /*resize: horizontal;*/
  vertical-align: middle;
  min-width: fit-content;
  white-space: nowrap;

  &::first-child {
    position: sticky;
    left: 0;
  }
}

.editable-input {
  font-size: $base-size;
  font-weight: normal;
}

</style>
