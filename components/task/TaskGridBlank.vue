<template>
  <div  v-click-outside="closeNewTask">
    <div v-show="newTask" id="task-grid-wrapper" class="task-grid bg-white position-relative active">
      <div class="task-top" id="tg-top-wrap">
        <div class="d-flex gap-025" id="task-card-inside-wrap">
          <span class="cursor-pointer">
            <bib-icon icon="check-circle-solid" :scale="1.5" variant="light"></bib-icon>
          </span>
          <span class=" flex-grow-1" id="task-title-input">
            <textarea id="newtaskInput" ref="newtaskInput" class="editable-input" rows="1" v-model="taskTitle" @input="debounceCreate" @keyup.esc="newTask = false"  placeholder="Enter title..."></textarea>
          </span>
        </div>
      </div>
      <div class="task-mid d-flex gap-05">
        <status-badge :status="{id: 1, text: 'Not Started'}"></status-badge>
        <priority-comp :priority="{id:2, text: 'Medium'}" :iconOnly="true"></priority-comp>
      </div>
      <div class="task-bottom" id="tg-bottom">
        <bib-avatar size="1.25rem"></bib-avatar>
        <div class="align-center gap-05 ml-auto">
          <bib-icon icon="calendar" variant="gray5"></bib-icon>
          <format-date :datetime="new Date().toString()" variant="gray5"></format-date>
        </div>
      </div>
    </div>
    <div class="bg-success-sub6 shape-rounded cursor-pointer bg-hover-success-sub3 px-05 text-success text-center font-lg" @click.stop="showNewTask">+</div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: "TaskGridBlank",
  props: {
    section: { type: Object },
    sectionType: { type: String }
  },
  computed: {
    ...mapGetters({
      myTaskGroupBy:"todo/getGroupBy",
      projectGroupBy:"project/getGroupBy",  
      taskGroupBy:"task/getGroupBy",  
      singleProjectGroupBy:"section/getGroupBy",  
      loggedUser: "user/getUser2",
    }),
  },
  data() {
    return {
      title: "blankTaskGrid" + this.section.id,
      taskTitle: "",
      newTask: false,
      loading: false,
    };
  },
  mounted() {
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

      this.newTask = true
      this.$nextTick(() => {
        this.$refs.newtaskInput.focus()
        this.loading = false
        this.$emit("close-other", "blankTaskGrid" + this.section.id)
      });
    },
    closeNewTask($event) {
      this.newTask = false
    },
    createNewTask(section) {
      console.log(section)
      let proj={}
      proj.group = this.myTaskGroupBy;
      proj.status = null
      proj.statusId = null
      proj.priority = null
      proj.priorityId = null
      proj.departmentId = null;
      proj.department = null;
      proj.budget=0;
      proj.user = [{
        id: this.loggedUser.Id,
        email: this.loggedUser.Email,
        firstName: this.loggedUser.FirstName,
        lastName: this.loggedUser.LastName
      }]
      proj.userId = this.loggedUser.Id
      proj.todoId =  section.id
      proj.title=this.taskTitle
      if(this.myTaskGroupBy == "priority"){
        proj.priority = section.tasks[0]?.priority
        proj.priorityId = section.tasks[0]?.priorityId
     
      }
      if(this.myTaskGroupBy == "status"){
        proj.status = section.tasks[0]?.status
        proj.statusId = section.tasks[0]?.statusId
      }
      if(this.myTaskGroupBy=="assignee"){
        proj.user=[section.tasks[0]?.user]
        proj.userId=section.tasks[0]?.userId
      }
      if(this.myTaskGroupBy == "department"){
        proj.department = section.tasks[0]?.department
        proj.departmentId = section.tasks[0]?.departmentId
      }
      console.log(proj)
      this.$store.dispatch("task/createTask", {
          ...proj,
          text: `created task ${this.taskTitle}`,
        })
        .then((t) => {
          console.log(t)
          this.$nuxt.$emit("refresh-table");
          this.newTask = false
          this.taskTitle = ""
          
        })
        .catch((e) => {
          console.warn(e);
        });
    },

    debounceCreate: _.debounce(function() {
      if(this.sectionType=="myTask") {
          this.createNewTask(this.section)
      }
      if(this.sectionType == 'department') {
        this.loading = true
        this.$store.dispatch("task/createTask", {
          title: this.taskTitle,
          description: "",
          departmentId: this.section.id?this.section.id:null,
          statusId: null,
          dueDate: "",
          priorityId: null,
          budget: 0,
          text: `task "${this.taskTitle}" created`,
        }).then(t => {
          if (t.statusCode == 200) {
            this.$nuxt.$emit("update-key")
          }
          this.taskTitle = ""
          this.newTask = false
          this.loading = false
        }).catch(e => console.warn(e))

      } else {

        // this.loading = true
        // this.$store.dispatch("task/createTask", {
        //   sectionId: this.section.id,
        //   title: this.taskTitle,
        //   description: "",
        //   statusId: null,
        //   dueDate: "",
        //   priorityId: null,
        //   departmentId: null,
        //   projectId: this.section.projectId,
        //   budget: 0,
        //   text: `task "${this.taskTitle}" created`,
        // }).then(t => {
        //   if (t.statusCode == 200) {
        //     this.$nuxt.$emit("update-key")
        //   }
        //   this.taskTitle = ""
        //   this.newTask = false
        //   this.loading = false
        // }).catch(e => console.warn(e))
      
      }


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
