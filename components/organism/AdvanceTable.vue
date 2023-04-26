<template>
  <div class="adv-table">
    <div class="thead">
      <div class="tr">
        <div v-for="(field, index) in tableFields" :key="field+index" class="th" :style="{ width: field.width}">{{field.label}}</div>
        <!-- <div class="th">owner</div>
        <div class="th">due date</div> -->
      </div>
    </div>
    <div class="tbody">
      <div v-for="item in tableData" :key="item.id" class="tr">
        <div v-for="(field, index) in tableFields" :key="field+index" class="td">
        	<template v-if="field.key == 'title'">{{item[field.key]}}</template>
        	<template v-if="field.key == 'project'">{{item[field.key][0].project.title}}</template>

      		<template v-if="field.key == 'userId'"><user-info :userId="item[field.key]"></user-info></template>
      		<template v-if="field.key == 'status'"><status-comp :status="item[field.key]"></status-comp></template>
      		<template v-if="field.key == 'priority'"><priority-comp :priority="item[field.key]"></priority-comp></template>
      		<template v-if="field.key == 'department'">{{item[field.key].title}}</template>
      		<template v-if="field.key.includes('Date')" class="date-cell" >{{$formatDate(item[field.key])}}</template>
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
  methods: {
    methodName () {
      
    }
  }
}

</script>
<style lang="scss" scoped>
.adv-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
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
  resize: horizontal;
}

</style>
