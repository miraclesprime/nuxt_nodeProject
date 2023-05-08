<template>
  <div class="adv-table-wrapper position-relative">
    <div class="adv-table bg-white" :style="{'width': tableWidth}" role="table">
      <!-- <div class="zero" :style="{ width: tableFields[0].width}">
        <div class="align-center gap-05">{{tableFields[0].label}} <span v-if="tableFields[0].header_icon" class="height-1" @click="$emit(tableFields[0].header_icon.event)"><bib-icon :icon="tableFields[0].header_icon.icon" :variant="tableFields[0].header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon></span></div>
      </div> -->
      <div class="tr" role="row">
        <div v-for="(field, index) in tableFields" :key="field+index" class="th" role="cell" :style="{ width: field.width}">
          <div class="align-center gap-05">{{field.label}} <span v-if="field.header_icon" class="height-1 cursor-pointer" @click="$emit(field.header_icon.event, field)">
              <bib-icon :icon="field.header_icon.icon" :variant="field.header_icon.isActive ? 'gray1' : 'gray4'"></bib-icon>
            </span></div>
        </div>
        <!-- <div class="th">owner</div>
        <div class="th">due date</div> -->
      </div>
      <!-- <div class="thead">
      </div> -->
      <div v-for="item in tableData" :key="item.id" class="tr" role="row" @click.right.prevent="contextOpen($event, item)">
        <div v-for="(field, index) in tableFields" :key="field+index" class="td" role="cell">
          <div v-if="field.key == 'title'" class="align-center ">
            <span v-if="field.icon" class="width-105 height-105 align-center justify-center" :class="{'cursor-pointer': field.icon.event}">
              <bib-icon :icon="field.icon.icon" :scale="1.25" :variant="field.icon.variant" hover-variant="success"></bib-icon>
            </span>
            <span v-if="field.event" class=" flex-grow-1" style=" line-height:1.25;">
              <input type="text" class="editable-input" :value="item[field.key]" @input="debounceTitle($event.target.value, item)">
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
            <user-select :key="item.id+'user'+index" :userId="item[field.key]" @change="updateAssignee($event, item)"></user-select>
            <!-- <user-info :userId="item[field.key]"></user-info> -->
            <!-- <bib-select :options="teamOptions" placeholder="Owner" @change="updateAssignee($event, item)" ></bib-select> -->
            <!-- <div class="picker-content">
              <input type="text" class="picker-input" ref="userFilterInput" v-model="userFilterKey" autofocus >
              <div class="mt-05" style="max-height: 12rem; overflow-y: auto">
                <ul class="m-0 p-0 text-left">
                  <li v-for="user in filterTeam" :key="user.id" class="p-025 font-md cursor-pointer" @click.stop="selected(user)">
                    <bib-avatar :src="user.avatar" size="1.5rem"></bib-avatar> {{user.label}}
                  </li>
                </ul>
              </div>
            </div> -->
          </template>
          <template v-if="field.key == 'status'">
            <!-- <status-comp :status="item[field.key]"></status-comp> -->
            <status-select ref="'st-'+item.id" :key="'st-'+item.id" :status="item[field.key]" @change="updateStatus($event, item)" ></status-select>
          </template>
          <template v-if="field.key == 'priority'">
            <!-- <priority-comp :priority="item[field.key]"></priority-comp> -->
            <priority-select :value="item[field.key]" @change="updatePriority($event, item)"></priority-select>
          </template>
          <template v-if="field.key == 'department'">{{item[field.key].title}}</template>
          <template v-if="field.key.includes('Date')" class="date-cell">
            <!-- {{$formatDate(item[field.key])}} -->
             <bib-datetime-picker :value="item[field.key]" format="DD MM YYYY" placeholder="" @input="updateDate" ></bib-datetime-picker>
          </template>
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
    <template v-if="contextItems">
      <table-context-menu :items="contextItems" :show="contextVisible" :coordinates="popupCoords" @close-context="closePopups" @item-click="taskContextItemClick" ref="task_menu"></table-context-menu>
    </template>
    <!-- user-picker for task -->
    <!-- <user-picker :show="userPicker" :coordinates="popupCoords" @selected="updateTaskAssignee('Assignee', 'userId', $event.id, $event.label)" @close="closePopups"></user-picker> -->
    <!-- date-picker for task -->
    <!-- <inline-datepicker :show="taskDatepickerOpen" :datetime="activeTask[datepickerArgs.field]" :coordinates="popupCoords" @date-updated="updateTaskDate" @close="closePopups"></inline-datepicker> -->
    <!-- status picker for task -->
    <!-- <status-picker :show="taskStatuspickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Status', field:'statusId', value: $event.value, historyText: $event.label})" @close="taskStatuspickerOpen = false"></status-picker> -->
    <!-- priority picker for task -->
    <!-- <priority-picker :show="taskPrioritypickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Priority', field:'priorityId', value: $event.value, historyText: $event.label})" @close="taskPrioritypickerOpen = false"></priority-picker> -->
    <!-- department-picker for list view -->
    <!-- <dept-picker :show="taskDeptpickerOpen" :coordinates="popupCoords" @selected="updateTask({ task: activeTask, label:'Department', field:'departmentId', value: $event.value, historyText: $event.label })" @close="taskDeptpickerOpen = false"></dept-picker> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
export default {

  name: 'AdvanceTable',

  props: {
    tableFields: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    dataType: { type: String, default: 'nested' },
    contextItems: { type: Array },
    draggable: { type: Boolean, default: true },
    // height: { type: String, default: '100%' }
  },

  data() {
    return {
      contextVisible: false,
      popupCoords: {left: 0, top: 0},
      userFilterKey: "",
    }
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
    /*teamOptions(){
      return this.teamMembers.map(t => {
        return { value : t.id, label: t.label }
      })
    },*/
    /*filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },*/
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
    contextOpen($event, item){
      this.popupCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.contextVisible = true
    },
    closePopups(){
      this.contextVisible = false
    },
    debounceTitle: _.debounce(function(value, item) {
      // console.log(item)
      this.$emit("update-title", { id: item.id, field: "title", value: value, label: "Title", historyText: value })
    }, 800),
    updateStatus(status, item){
      console.log(status, item)
    },
    updatePriority(priority, item){
      console.log(priority, item)
    },
    updateAssignee(user, item){
      console.log(user, item)
      this.$emit("update-field", { id: item.id, field: "userId", value: user.id, label: "Assignee", historyText: user.label })
    },
    updateDate(date){
      console.log(date)
    },
  }
}

</script>
<style lang="scss" scoped>
/*
* {
  scrollbar-width: unset;
  scrollbar-height: unset;
  scrollbar-gutter: unset;
}

*::-webkit-scrollbar {
  width: unset;
  height: unset;
}

::-webkit-scrollbar {
  width: unset;
  height: unset;
}

*::-webkit-scrollbar-track {
  border-radius: unset;
  background-color: initial;
}

*::-webkit-scrollbar-thumb {
  border-radius: unset;
  background-color: initial;
}

::-webkit-scrollbar {
    all:unset;
}

::-webkit-scrollbar-thumb {
    all:unset;
}
*/

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
::v-deep {
  .bib-select { line-height: normal;
    .select__real { margin: 0 !important; }
    .select__btn { background-color: transparent !important; line-height: normal;}
  }
  .vdpComponent__input { margin: 0; min-height: 2rem; border-color: transparent;
    &:hover { border-color: transparent;}
  }
}

</style>
