<template>
  <div id="task-actions-wrapper" class="task-actions p-025 bg-white">
    <div class="action-left d-flex gap-05" id="ta-action-left">
      <!-- <div class="d-flex gap-05 shape-rounded py-025 px-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3" id="ta-add-task-button" v-on:click.stop="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div> -->
      <bib-button label="New Task" variant="primary" icon="add" class="" @click.native.stop="showCreateTaskModal"></bib-button>
      <!-- <div class="d-flex gap-05 ml-1 shape-rounded py-025 px-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3" id="ta-add-section-button" v-show="!group" v-on:click.stop="addSection">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-section-text" class="">New Section</span>
      </div> -->
      <bib-button v-show="!group" label="New Section" variant="primary" icon="add" class="" @click.native.stop="addSection"></bib-button>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <template>
        <bib-input size="sm" type="text" v-model="searchText" name="name" @input="$emit('search-projectTasks', searchText)" placeholder="Search Project Tasks..." :variant="searchText.length > 50 ? 'alert': ''"></bib-input>
      </template>
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1" title="Viewing" >
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" activeIcon="tick" tooltip="View" v-on:change-sort="changeViewName"></sorting-comp>
        </li>
        <li class="action" id="ta-action3"  >
          <sorting-comp label="Group by" :items="groupby" icon="accessibility-braille-solid" tooltip="Group By" v-on:change-sort="groupBy"></sorting-comp>
        </li>
        <li class="action" id="ta-action2" title="Sort by" >
          <sorting-comp label="Sort by" :items="sorting" icon="swap-vertical" tooltip="Sort By" v-on:change-sort="sortBy"></sorting-comp>
        </li>
        <li class="action" id="ta-action5">
          <div class="d-flex width-2 height-2 align-center justify-center bg-light bg-hover-gray2 shape-circle p-025 cursor-pointer" id="ta-action5-link" title="Change view"  v-tooltip="'List/Grid'">
            <bib-icon v-if="gridType == 'list'" icon="table" variant="gray6" @click.native="changeGridType('grid')"></bib-icon>
            <bib-icon v-if="gridType == 'grid'" icon="list" variant="gray6" @click.native="changeGridType('list')"></bib-icon>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { VIEW_FILTER, TASK_SORT, SINGLE_PROJECT_GROUP } from 'config/constants.js'
export default {
  props: {
    gridType: {
      type: String,
      default: "list",
      sortDir: {default: "asc"}
    },
    group: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      selectInfo: null,
      sortName: '',
      viewing: VIEW_FILTER,
      sorting: TASK_SORT,
      groupby: SINGLE_PROJECT_GROUP,
      searchText: ''
    };
  },
  methods: {
    changeGridType($event) {
      this.$emit("change-grid-type", $event);
      this.$nuxt.$emit("change-grid-type", $event);
    },
    showCreateTaskModal() {
      this.$emit("create-task", false) //event will be captured by parent only
      this.$nuxt.$emit("create-task", false) //event will be available to all
    },
    showCreateSectionModal() {
      this.$refs.modals.showCreateSectionModal = true;
    },
    createSectionInline($event) {
      this.$emit("show-newsection", $event)
    },
    async createTask(task) {
      console.log(task);
    },
    addSection(){
      this.$emit("add-section")
    },
    async createSection(section) {
      if (section.name != "") {
        try {
          await this.$axios.$post("/section", {
            title: section.name,
          });
          this.$refs.modals.showCreateSectionModal = false;
          this.$emit("change-data");
        } catch (err) {
          console.log(err);
        }
      }
    },


    sortBy($event) {
      this.$emit("sort", $event)
    },

    groupBy($event) {
      this.$emit("SingleProjectGroup", $event)
    },

    changeViewName($event){
      // console.log($event)
      this.$emit("filterView", $event)
    }

  },
};

</script>
<style scoped lang="scss">
.task-actions {
  display: flex;
  border-bottom: 1px solid $light;
  align-items: center;
}

.action-right {
  margin-left: auto;
}

.actions {
  display: flex;
  color: $gray1;

  span {
    margin-left: 5px;
    font-size: 13px;
  }

  svg,
  svg g {
    fill: $gray1;
  }
}

.action {
  display: flex;
  padding: 0 0.25rem;
  align-items: center;
}

.button {
  .list.filter {
    .list__item {
      height: auto;

      .input--sm {
        input {
          min-height: 1.75rem;
        }
      }
    }

  }
}

</style>