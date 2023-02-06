<template>
  <div v-click-outside="closeNewTask">
    <div class="bg-success-sub6 shape-rounded cursor-pointer bg-hover-success-sub3 px-05 text-success text-center font-lg" @click.stop="showNewTask">+</div>
    <div v-show="newTask" id="task-grid-wrapper" class="task-grid bg-white active">
      <div class="task-top" id="tg-top-wrap">
        <div class="d-flex gap-025" id="task-card-inside-wrap">
          <span class="cursor-pointer">
            <bib-icon icon="check-circle-solid" :scale="1.5" variant="light"></bib-icon>
          </span>
          <span class=" flex-grow-1" id="task-title-input">
            <textarea id="newtaskInput" ref="newtaskInput" class="editable-input" :class="{'loading': loading}" rows="1" v-model="taskTitle" @input="debounceCreate" @keyup.esc="newTask = false" placeholder="Enter title..."></textarea>
          </span>
        </div>
        <!-- <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
        <bib-popup pop="elipsis" icon="elipsis" icon-variant="gray5" icon-hover-variant="dark">
          <template v-slot:menu>
            <div class="list" :id="'task-list'+task.id">
              <span v-for="(item, index) in contextMenuItems" :key="item.label+index" class="list__item cursor-pointer" :class=" ['list__item__'+item.variant] " v-on:click.stop="contextItemClick(item)">
                <bib-icon v-if="item.icon" :icon="item.icon" :variant="activeVariant(item)" class="mr-05"></bib-icon> {{item.label}}
              </span>
            </div>
          </template>
        </bib-popup>
      </div> -->
      </div>
      <div class="task-mid d-flex gap-05">
        <status-badge :status="{id: 1, text: 'Not Started'}"></status-badge>
        <!-- <priority-badge :priority="task.priority"></priority-badge> -->
        <priority-comp :priority="{id:2, text: 'Medium'}" :iconOnly="true"></priority-comp>
      </div>
      <div class="task-bottom" id="tg-bottom">
        <!-- <user-info v-if="task.userId" :userId="task.userId"></user-info> -->
        <bib-avatar size="1.25rem"></bib-avatar>
        <div class="align-center gap-05 ml-auto">
          <bib-icon icon="calendar" variant="gray5"></bib-icon>
          <format-date :datetime="new Date().toString()" variant="gray5"></format-date>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
// import { TASK_CONTEXT_MENU } from "../../config/constants";
export default {
  name: "TaskGridBlank",
  props: {
    section: Object,
  },
  data() {
    return {
      title: "blankTaskGrid" + this.section.id,
      taskTitle: "",
      newTask: false,
      loading: false,
      // flag: false,
      // contextMenuItems: TASK_CONTEXT_MENU,
    };
  },
  computed: {
    /*...mapGetters({
      favTasks: "task/getFavTasks",
    }),*/
  },
  mounted() {
    /*this.$nextTick(() => {
      document.getElementById("newtaskInput").focus
    });*/
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  },
  methods: {
    showNewTask() {
      /*let elem = this.$refs['newTaskGrid'+id][0]
      console.log(elem)
      if (elem.style.display = 'block') {
        elem.style.display = 'none'
      } else {
        elem.style.display = 'block'
      }*/

      this.newTask = true
      this.$nextTick(() => {
        // document.getElementById("newtaskInput").focus
        this.$refs.newtaskInput.focus()
        this.loading = false
        this.$emit("close-other", "blankTaskGrid" + this.section.id)
      });
    },
    closeNewTask($event) {
      // console.log($event.originalTarget)
      this.newTask = false
      /*$event.target.classList.forEach((cl, index) => {
        // console.info(index, cl)
        if (cl == 'editable-input') {
          return false
        } else {
          this.newTask = false
        }
      })*/
    },
    debounceCreate: _.debounce(function() {
      // console.info(this.taskTitle)
      // this.$refs.newtaskInput.classList.add("loading")
      this.loading = true
      this.$store.dispatch("task/createTask", {
        sectionId: this.section.id,
        title: this.taskTitle,
        description: "",
        statusId: 1,
        dueDate: "",
        priorityId: 3,
        budget: 0,
        text: `task "${this.taskTitle}" created`,
      }).then(t => {
        // console.log(t)
        if (t.statusCode == 200) {
          // this.$emit("update-key")
          this.$nuxt.$emit("update-key")
        }
        this.taskTitle = ""
        this.newTask = false
        this.loading = false
      }).catch(e => console.warn(e))
    }, 1200),
  },
};

</script>
<style scoped lang="scss">
.task-grid {
  font-size: 14px;
  margin: 1rem 0;
  border: 1px solid var(--bib-gray4);
  border-radius: 6px;
  transition: all 200ms ease;

  &.active {
    border-color: $dark;
    box-shadow: 0 0 0 4px $primary-sub3;
  }

  .task-top,
  .task-bottom {
    display: flex;
    justify-content: space-between;
    padding: 8px;
  }

  .task-top {
    margin-bottom: 0.5rem;
  }

  .task-mid {
    padding: 4px 8px;
  }

  .task-bottom {
    align-items: center;
    color: $gray5;

    span {
      font-size: 13px;
    }
  }

  .editable-input {
    font-size: $base-size;
    font-weight: normal;
    resize: initial;
    padding-block: 0.1rem;
    min-height: 1.8rem;
  }

}

</style>
