<template>
  <div class="task-grid-section" id="task-grid-section-wrapper">
    <div class="w-100 d-flex justify-between" id="tgs-inner-wrap" style="margin-bottom: 10px">
      <div class="title text-gray" id="tgs-label">{{ label }}</div>
      <div class="d-flex section-options" id="tgs-section-options">
        <div class="mr-1" id="tgs-add-icon">
          <bib-icon icon="add" variant="success" :scale="1.2" />
        </div>
        <div id="tgs-elipsis-icon">
          <bib-icon icon="elipsis" :scale="1.2" />
        </div>
      </div>
    </div>
    <div class="task-section__body" id="tgs-task-section-body">
      <Container :group-name="groupName" @drop="onDrop('sections', $event)" :get-child-payload="getChildPayload">
        <Draggable v-for="(item, index) in taskSections" :key="item.name + '-' + index">
          <!-- <task-grid :task="item" /> -->
          <div class="task-grid" id='tg-card'>
            <figure v-if="item.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
            <div class="task-top" id='tg-card-top'>
              <div class="d-flex" id='tg-card-inside-wrap' >
                <custom-check-box :id="'tg-' + item.key" />
                <span class="ml-05" id='tg-title'>{{ item.description }}</span>
              </div>
              <bib-button pop="elipsis" icon="elipsis" icon-variant="secondary" >
                <template v-slot:menu>
                  <div class="list" id='tg-list'>
                    <span class="list__item success" id='tg-fav' @click="addToFavorites">Add to favorites</span>
                    <span class="list__item " id='tg-copy-link'>Copy Task Link</span>
                    <span class="list__item danger" id='tg-delete-task'>Delete Task</span>
                    <span class="list__item primary" id='tg-view-task' @click="openSidebar(item)">View Task Details</span>
                  </div>
                </template>
              </bib-button>
            </div>
            <div class="task-bottom" id='tg-card-bottom'>
              <!-- <bib-avatar size="25px"></bib-avatar> -->
              <user-info :id="item.userId"></user-info>
              <span id='tg-bottom-duedate' v-format-date="item.dueDate"></span>
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "~/utils/helpers";

export default {
  components: {
    Container,
    Draggable,
  },
  data() {
    return {
      sections: this.taskSections,
      flag: false,
    };
  },
  props: {
    label: {
      type: String,
      default () {
        return "Section";
      },
    },
    taskSections: {
      type: Array,
      default () {
        return [];
      },
    },
    labelClass: {
      type: String,
      default () {
        return "text-gray";
      },
    },
    groupName: {
      type: String,
      default () {
        return "grid-1";
      },
    },
  },
  methods: {
    onDrop(collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult);
    },
    getChildPayload(index) {
      return this.sections[index];
    },
    openSidebar($event) {
      // this.flag = !this.flag;
      this.$nuxt.$emit("open-sidebar", true);
      // this.$nuxt.$emit("set-active-task", task);
      this.$store.dispatch('task/setSingleTask', $event)
    },
  },
};

</script>
<style scoped lang="scss">
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper { overflow: initial;}
.task-grid-section {
  width: 18%;
  min-width: 240px;
  min-height: 100vh;
  padding: 10px;

  &:not(:first-child) {
    border-left: 1px solid $gray4;
  }

  &:last-child {
    border-right: 1px solid $gray4;
  }

  .title { font-weight: bold; }

  &:hover {

    &,
    &+.task-grid-section {
      border-left-color: $gray5;
    }

    .section-options {
      visibility: visible;
      opacity: 1;
    }
  }

  &:last-child:hover {
    border-right-color: $gray5;
  }
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

.task-top,
.task-bottom {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.task-top {
  margin-bottom: 1rem;
}

.task-bottom {
  align-items: center;
}

.task-grid {
  margin: 8px 4px 8px;
  background: #fff;
  border: 1px solid $gray4;
  border-radius: 4px;
  cursor: pointer;

  .task-image {
    aspect-ratio: 16 / 9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  span {
    font-size: 15px;
    font-weight: 500;
  }

  .task-bottom span {
    font-size: 13px;
  }


}

::v-deep {
  .user-info-wrapper {
    .user-name { visibility: hidden; opacity: 0; transition: opacity 200ms ease-out; }
    &:hover .user-name { visibility: visible; opacity: 1; }
  }
  .custom-control-label {
    &::before {
      width: 1.4rem;
      height: 1.4rem;
    }
  }

  .custom-checkbox {
    height: 22px;
  }
}

</style>
