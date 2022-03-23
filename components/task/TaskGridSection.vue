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
      <Container @drop="onDrop" :get-child-payload="getChildPayload">
        <Draggable v-for="item in sections" :key="item.title + key+'-' + item.id">
          <div class="task-grid draggable-item " :class="overdue(item)" :id="'tg-card-'+item.id">
            <figure v-if="item.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
            <div class="task-top" id='tg-card-top'>
              <div class="d-flex" id='tg-card-inside-wrap'>
                <!-- <custom-check-box :id="'tg-' + item.key" /> -->
                <bib-icon icon="check-circle" :scale="1.5" :variant="item.status.text === 'Done' ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="handleTaskStatus(item)"></bib-icon>
                <span class="ml-05" id='tg-title'>{{ item.title }} </span>
              </div>
              <bib-button pop="elipsis" icon="elipsis" :icon-variant="overdue(item) == 'bg-danger'? 'white' :'secondary'">
                <template v-slot:menu>
                  <div class="list" id='tg-list'>
                    <span class="list__item" v-on:click="openSidebar(item)">Details</span>
                    <hr>
                    <span class="list__item">
                      <bib-icon icon="check-circle" class="mr-05"></bib-icon> Mark Completed
                    </span>
                    <span class="list__item" id='tg-fav' @click="addToFavorites">
                      <bib-icon icon="heart-like" class="mr-05"></bib-icon> Add to favorites
                    </span>
                    <span class="list__item">
                      <bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...
                    </span>
                    <span class="list__item">
                      <bib-icon icon="user-add" class="mr-05"></bib-icon> Assign to...
                    </span>
                    <span class="list__item">
                      <bib-icon icon="notification" class="mr-05"></bib-icon> Set as reminder
                    </span>
                    <span class="list__item " id='tg-copy-link'>
                      <bib-icon icon="duplicate" class="mr-05"></bib-icon> Copy
                    </span>
                    <span class="list__item">
                      <bib-icon icon="transfer" class="mr-05"></bib-icon> Move to
                    </span>
                    <span class="list__item " id='tg-view-task'>
                      <bib-icon icon="warning" class="mr-05"></bib-icon> Report
                    </span>
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
import { mapGetters } from 'vuex';

export default {
  components: {
    Container,
    Draggable,
  },
  data() {
    return {
      sections: this.taskSections,
      flag: false,
      ordered: [],
      key: 0,
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
      token: "token/getToken",
      project: "project/getSingleProject",
    }),

  },
  methods: {
    overdue(item) {
      console.log(new Date(item.dueDate), new Date);
      return new Date(item.dueDate) < new Date() ? 'bg-danger' : 'bg-gray2';
    },
    swap(sourceObj, sourceKey, targetObj, targetKey) {
      var temp = sourceObj[sourceKey];
      sourceObj[sourceKey] = targetObj[targetKey];
      targetObj[targetKey] = temp;
    },
    getChildPayload(index) {
      return JSON.parse(JSON.stringify(this.sections));
    },
    async onDrop(dropResult) {
      
      const { removedIndex, addedIndex, payload, droppedElement } = dropResult

      // console.info(dropResult);
      var ordered = []

      if (removedIndex - addedIndex >= 1 || removedIndex - addedIndex <= -1) {
        // ordered = JSON.parse(JSON.stringify(payload))
        ordered = payload.map(a => { return { ...a } })
        ordered.splice(removedIndex, 1)
        ordered.splice(addedIndex, 0, payload[removedIndex])

        ordered.forEach((item, index) => {
          item.order = index
        })
      }

      // console.log(ordered)

      let dnd = await this.$axios.$put("/task/dragdrop", { sectionId: payload[removedIndex].sectionId, data: ordered }, {
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      })

      // console.log(dnd)
      if (dnd.statusCode == 200) {
        this.$store.dispatch("section/fetchProjectSections", this.$route.params.id)
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'all' }).then(() => {
          this.$emit("update-key", 1)
          this.key += 1
        })
      } else {
        console.warn(dnd.message)
      }

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
  /*background: var(--bib-gray2);*/
  border-radius: 4px;
  cursor: pointer;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
  }

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

  .bg-danger {
    .user-name {
      color: #fff
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
