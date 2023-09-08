<template>
  <div id="project-action-wrapper" class="task-actions py-025 ml-025">
    <div id="pa-add-project-wrapper" class="action-left">
      <div class="d-flex gap-05 shape-rounded py-025 px-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3" id="pa-add-project-button" v-on:click="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text">New Project</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="pa-action-right">
      <template>
        <bib-input size="sm" type="text" v-model="searchText" name="name" @input="$emit('search-projects', searchText)" placeholder="Search Projects..." :variant="searchText.length > 50 ? 'alert': ''"></bib-input>
      </template>
      <ul class="actions" id="pa-actions-list">
        <li class="action" id="pa-action-item1" >
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" tooltip="View" v-on:change-sort="viewProjects($event)"></sorting-comp>
        </li>
        <li class="action" id="pa-action3" >
          <sorting-comp label="Group by" :items="groupBy" icon="accessibility-braille-solid" tooltip="Group By" v-on:change-sort="groupProjects($event)"></sorting-comp>
        </li>
        
        <li class="action" id="pa-action-item3" >
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" tooltip="Sort By" v-on:change-sort="sortBy($event)"></sorting-comp>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { VIEW_FILTER, PROJECT_SORT ,PROJECT_GROUP} from 'config/constants.js'

export default {
  props: {
    gridType: {
      type: String,
      default: "list",
    }
  },
  data() {
    return {
      type: this.gridType,
      selectInfo: null,
      selectedView: 'All',
      selectedSort: null,
      orderBy: '',
      groupBy:PROJECT_GROUP,
      viewing: VIEW_FILTER,
      sorting: PROJECT_SORT,
      searchText: ""
    };
  },
  
  methods: {
    showCreateTaskModal(data) {
      this.$nuxt.$emit("create-project-modal");
      this.selectInfo = data;
    },

    showCreateSectionModal() {
      this.$refs.modals.showCreateSectionModal = true;
    },

    async createTask(task) {
      console.log(task);
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

    viewProjects($event) {
      this.$emit('viewValue', $event)
    },
    groupProjects($event) {
      this.$emit("groupValue", $event)
    },
    sortBy($event) {
      this.$emit('sortValue', $event)
    }
  },
};

</script>
<style scoped lang="scss">
.task-actions {
  display: flex;
  border-bottom: 1px solid $gray4;
  align-items: center;
}

.action-right {
  margin-left: auto;
}

.actions {
  display: flex;
  color: $gray1;
}

.action {
  display: flex;
  padding: 0 4px;
  align-items: center;
}

.custom-control-label {
  &::before {
    position: static;
    transform: none;
  }

  svg {
    left: 2px;
  }
}

.grid-type {
  border: 1px solid $gray4;
  padding: 2px 3px 0px;
  border-radius: 5px;
}

</style>