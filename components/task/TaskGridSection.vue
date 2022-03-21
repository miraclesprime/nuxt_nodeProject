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
      <!-- <Container @drop="onDrop" :get-child-payload="getChildPayload">            
          <Draggable v-for="item in dragItems" :key="item.id">
            <div class="draggable-item p-1 border-gray4 mb-025">
              {{item.label}}
            </div>
          </Draggable>
        </Container> -->
      <Container @drop="onDrop" :get-child-payload="getChildPayload">
        <Draggable v-for="(item, index) in sections" :key="item.name + '-' + index">
          <div class="task-grid draggable-item" id='tg-card'>
            <figure v-if="item.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
            <div class="task-top" id='tg-card-top'>
              <div class="d-flex" id='tg-card-inside-wrap'>
                <!-- <custom-check-box :id="'tg-' + item.key" /> -->
                <bib-icon icon="check-circle" :scale="1.5" :variant="item.status.text === 'Done' ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="handleTaskStatus(item)"></bib-icon>
                <span class="ml-05" id='tg-title'>{{ item.title }}</span>
              </div>
              <bib-button pop="elipsis" icon="elipsis" icon-variant="secondary">
                <template v-slot:menu>
                  <div class="list" id='tg-list'>
                    <span class="list__item" v-on:click="openSidebar(item)">Details</span>
                    <hr>
                    <span class="list__item"><bib-icon icon="check-circle" class="mr-05"></bib-icon> Mark Completed</span>
                    <span class="list__item" id='tg-fav' @click="addToFavorites"><bib-icon icon="heart-like" class="mr-05"></bib-icon> Add to favorites</span>
                    <span class="list__item"><bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...</span>
                    <span class="list__item"><bib-icon icon="user-add" class="mr-05"></bib-icon> Assign to...</span>
                    <span class="list__item"><bib-icon icon="notification" class="mr-05"></bib-icon> Set as reminder</span>
                    <span class="list__item " id='tg-copy-link'><bib-icon icon="duplicate" class="mr-05"></bib-icon> Copy </span>
                    <span class="list__item"><bib-icon icon="transfer" class="mr-05"></bib-icon> Move to</span>
                    <span class="list__item " id='tg-view-task'><bib-icon icon="warning" class="mr-05"></bib-icon> Report</span>
                    <hr>
                    <span class="list__item danger" id='tg-delete-task'>Delete Task</span>
                  </div>
                </template>
              </bib-button>
            </div>
            <div class="task-bottom" id='tg-card-bottom'>
              <user-info :user="item.user" avatar="https://i.pravatar.cc/32"></user-info>
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
// import { applyDrag } from "~/utils/helpers";
import { mapGetters } from 'vuex';

export default {
  components: {
    Container,
    Draggable,
  },
  data() {
    return {
      /*dragItems: [
        { label: "Item one", id: 1 },
        { label: "Item two", id: 2 },
        { label: "Item three", id: 3 },
        { label: "Item four", id: 4 },
      ],*/
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
  computed: {
    ...mapGetters({
      token: "token/getToken"
    })
  },
  methods: {
    async onDrop(dropResult) {
      // this.dragItems = dropResult
      // console.log(dropResult)
      const { removedIndex, addedIndex, payload } = dropResult
      // console.log(this.sections[addedIndex])

      let added = this.sections[addedIndex]

      // this.sections = applyDrag(this.sections, dropResult);
      let dnd = await this.$axios.$put("/task/dragdrop", { removedIndex, addedIndex, source: payload, target: added }, {
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      })
      console.log(dnd)

      /*if (removedIndex === null && addedIndex === null) return arr

      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      this.sections = result*/
    },
    getChildPayload(index) {
      // console.log(index)
      return this.sections[index];
    },
    shouldAcceptDrop(sourceContainerOptions, payload) {
      return true;
    },
    openSidebar($event) {
      // this.flag = !this.flag;
      this.$nuxt.$emit("open-sidebar", true);
      // this.$nuxt.$emit("set-active-task", task);
      this.$store.dispatch('task/setSingleTask', $event)
    },
    addToFavorites() {
      console.log('favorites')
    }
  },
};

</script>
<style scoped lang="scss">
.smooth-dnd-container.vertical>.smooth-dnd-draggable-wrapper {
  overflow: initial;
}

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

  .title {
    font-weight: bold;
  }

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
  /*border: 1px solid $gray4;*/
  background: var(--bib-gray2);
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
    .user-name {
      visibility: hidden;
      opacity: 0;
      transition: opacity 200ms ease-out;
    }

    &:hover .user-name {
      visibility: visible;
      opacity: 1;
    }
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
