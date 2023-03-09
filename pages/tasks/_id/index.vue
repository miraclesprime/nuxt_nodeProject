<template>
   <client-only>
    <div class="position-relative h-100 of-scroll-y" id="single-task">
        <div class="inbox-task h-100 position-relative" >
            <div class="d-flex justify-between side-panel__header__actions " id='ts-side-panel'>
            <div class="d-flex gap-05 ml-auto align-center" id="ts-icon-attachment-wrapper">
                <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-3' v-tooltip="'Subtasks'" v-scroll-to="'#task_subtasks'">
                <bib-icon icon="check-square-solid" variant="gray5"></bib-icon>
                </div>
                <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-4' v-tooltip="'Conversation'" v-scroll-to="'#task_conversation'">
                <bib-icon icon="comment-forum-solid" variant="gray5"></bib-icon>
                </div>
                <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id='ts-icon-5' v-tooltip="'Files'" v-scroll-to="'#task_files'">
                <bib-icon icon="folder-solid" variant="gray5"></bib-icon>
                </div>
                <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center" id="ts-icon-6" v-tooltip="isFavorite.text" @click="setFavorite">
                <bib-icon icon="bookmark-solid" :variant="isFavorite.variant"></bib-icon>
                </div>
                <div id="ts-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
                <bib-popup pop="horizontal-dots">
                    <template v-slot:menu>
                    <div class="list" id="ts-list">
                        <span class="list__item" id="ts-list-item-1" @click="markComplete">
                        <bib-icon icon="check-circle-solid" :variant="isComplete.variant" class="mr-075"></bib-icon> {{isComplete.text}}
                        </span>
                        <span class="list__item" id="ts-list-item-2" @click="setFavorite">
                        <bib-icon icon="bookmark-solid" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                        </span>
                        <span class="list__item" id="ts-list-item-4" @click="showAddTeamModal">
                        <bib-icon icon="user-group-solid" variant="gray5" class="mr-075"></bib-icon> Team
                        </span>
                        <span class="list__item" id="ts-list-item-5" v-scroll-to="'#task_subtasks'">
                        <bib-icon icon="check-square-solid" variant="gray5" class="mr-075" v-scroll-to=""></bib-icon> Subtasks
                        </span>
                        <span class="list__item" id="ts-list-item-7" v-scroll-to="'#task_conversation'">
                        <bib-icon icon="comment-forum-solid" variant="gray5" class="mr-075"></bib-icon> Conversation
                        </span>
                        <span class="list__item" id="ts-list-item-3" v-scroll-to="'#task_files'">
                        <bib-icon icon="folder-solid" variant="gray5" class="mr-075"></bib-icon> Files
                        </span>
                        <!-- <span class="list__item" id="ts-list-item-6">
                            <bib-icon icon="duplicate" variant="gray5" class="mr-075"></bib-icon> Copy
                        </span> -->
                        <hr>
                        <span class="list__item list__item__danger" id="ts-list-item-8" @click="deleteTask(item.taskId)">Delete</span>
                    </div>
                    </template>
                </bib-popup>
                </div>
            </div>
            </div>
            <!-- task title -->
            <div class="d-flex align-center gap-05 border-top-light border-bottom-light py-025 px-1" id="ts-title">
            <div class="width-2 height-2 d-inline-flex align-center justify-center cursor-pointer" @click="markComplete">
                <bib-icon icon="check-circle-solid" :variant="isComplete.variant" :scale="1.5"></bib-icon>
            </div>
            <div class="flex-grow-1">
                <input type="text" class="editable-input" ref="taskTitleInput" v-model="form.title" placeholder="Enter task name..." v-on:keyup="debounceUpdate('Title', 'title', form.title)">
                <!-- <small v-show="error == 'invalid'" class="text-danger font-xs d-block" style="margin-top: -0.25rem;">Task name is required</small> -->
            </div>
            <div>
                <team-avatar-list :team="team"></team-avatar-list>
                <!-- <div class="team-avatar-list px-05">
                <bib-avatar v-for="(team, index) in teammates.main" :src="team.avatar" :key="index" :title="team.label" :style="{ 'left': -0.5 * index + 'rem'}" class="border-gray2"></bib-avatar><span v-show="teammates.extra.length" class="extra" v-tooltip="extraNames">+{{teammates.extra.length}}</span>
                </div> -->
            </div>
            <div class="d-flex align-center justify-center width-2 height-2 shape-circle bg-light cursor-pointer" v-tooltip="'Team'" @click="showAddTeamModal">
                <bib-icon icon="user-group-solid"></bib-icon>
            </div>
            </div>
            <div class="of-scroll-y position-relative py-05" id="ts-of-scroll-y" >
                <!-- editable fields -->
                <sidebar-fields :task="form" @update-project-field="updateProject" @update-field="updateTask"></sidebar-fields>
                <!-- subtasks -->
                <sidebar-subtask @view-subtask="viewSubtask($event)"></sidebar-subtask>
                <!-- conversation -->
                <sidebar-conversation :reloadComments="reloadComments" :reloadHistory="reloadHistory"></sidebar-conversation>
                <!-- files -->
                <sidebar-files :reloadFiles="reloadFiles"></sidebar-files>
            </div>
            <!-- message input -->
            <div id="task-message-input" class=" d-flex gap-1 border-top-light py-1 px-105">
            <bib-avatar :src="user.Photo" size="2rem" class="flex-shrink-0"></bib-avatar>
            <message-input class="flex-grow-1" :value="value" key="taskMsgInput" :editingMessage="editMessage" @input="onFileInput" @submit="onsubmit"></message-input>
            </div>
            
            <subtask-detail v-if="showSubtaskDetail" @close-sidebar-detail="showSubtaskDetail = false"></subtask-detail>

            <loading :loading="loading"></loading>
        </div>
    </div>
</client-only>
</template>

<script>
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import _ from 'lodash'

export default {
    name: "SingleTask",
    data() {
        return {
            loading: false,
            statusValues: STATUS,
            priorityValues: PRIORITY,
            department: DEPARTMENT,
            form: {},
            value: {
                files: []
            },
            editMessage: {},
            reloadComments: 1,
            reloadHistory: 1,
            reloadFiles: 1,
            showSubtaskDetail: false,
        }
    },

    watch: {
        task(newValue){
            this.form = _.cloneDeep(newValue)
            this.$store.dispatch("task/fetchTeamMember", this.task)
        },
        
        showSubtaskDetail(newValue){
            if(!newValue){
                this.$store.dispatch("subtask/fetchSubtasks", this.currentTask )
            }
        },
    },

    computed: {
         ...mapGetters({
            task: 'task/getSelectedTask',
            favTasks: "task/getFavTasks",
            team: 'task/getTaskMembers',
            teamMembers: "user/getTeamMembers",
            projects: "project/getAllProjects",
            sections: "section/getProjectSections",
        }),

        isFavorite() {
            let fav = this.favTasks.some(t => t.task.id == this.task.id)
            if (fav) {
                return { variant: "orange", text: "Remove favorite", status: true }
            } else {
                return { variant: "gray5", text: "Add to favorites", status: false }
            }
        },

        isComplete() {
            if (this.task.statusId == 5) {
                return { variant: "success", text: "Completed" }
            } else {
                return { variant: "gray4", text: "Mark Completed" }
            }
        },

        user() {
            return this.$userInfo(this.task.userId)
        },
    },

    created() {
        
        if (process.client) {

            this.$nuxt.$on("edit-message", (msg) => {
            
                this.editMessage = msg
            })

            this.$axios.$get(`task/${this.$route.params.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            }).then((res) => {
                if (res) {
                if (!res.data || res.data.isDeleted) {
                    this.$router.push("/notfound")
                } else {
                    this.$store.dispatch('task/setSingleTask', res.data)
                }
                } else {
                    this.$router.push("/notfound")
                }
            }).catch(err => {
                console.log("There was an issue in project API", err);
            })

        }
    },

    methods: {
        markComplete() {
            // console.log(this.task)
            this.loading = true
            this.$store.dispatch('task/updateTaskStatus', this.task)
                .then((d) => {
                // console.log(d)
                this.loading = false
                // this.$nuxt.$emit("update-key")
                this.$store.dispatch("task/setSingleTask", d)
                this.reloadComments += 1
                }).catch(e => {
                // console.log(e)
                this.loading = false
                })
        },

        setFavorite() {
            // console.info(this.isFavorite.status)
            if (this.isFavorite.status) {
                this.$store.dispatch("task/removeFromFavorite", { id: this.task.id })
                .then(msg => console.log(msg))
                .catch(e => console.log(e))
            } else {
                this.$store.dispatch("task/addToFavorite", { id: this.task.id })
                .then(msg => console.log(msg))
                .catch(e => console.log(e))
            }
        },
        
        showAddTeamModal() {
            this.$nuxt.$emit("add-member-to-task")
        },
        
        debounceUpdate: _.debounce(function(payload) {
            if (this.form.id) {
                // console.log('Debounce', name, value)
                
                if (this.form.priorityId == "") {
                this.form.priority = null
                this.form.priorityId = null
                }
                if (this.form.statusId == "") {
                this.form.status = null
                this.form.statusId = null
                }
                // console.log(updatedvalue)
                this.updateTask({ name: payload.name, field: payload.field, value: payload.value })
                this.reloadComments += 1

            }
        }, 1000),

        updateTask(taskData, historyText, projectId) {
            // this.loading = true

            let updatedvalue = taskData.value
            if (taskData.name == 'Assignee') {
                let user = this.teamMembers.find(t => t.id == taskData.value)
                updatedvalue = user.label
            }
            if (taskData.name == 'Project') {
                let user = this.projects.find(t => t.id == taskData.value)
                updatedvalue = user.title
            }
            if (taskData.name == 'Status') {
                this.statusValues.find(s => {
                if (s.value == taskData.value) {
                    updatedvalue = s.label
                }
                })
            }
            if (taskData.name == 'Priority') {
                this.priorityValues.find(p => {
                if (p.value == taskData.value) {
                    updatedvalue = p.label
                }
                })
            }

            if( taskData.name == 'Section') {
                this.sections.find(sec => {
                if(sec.id == taskData.value) {
                    updatedvalue = sec.title
                }
                })
            }

            if (taskData.name == "Due date" || taskData.name == "Start date") {
                updatedvalue = dayjs(taskData.value).format('DD MMM, YYYY')
            }

            let user;
            if (taskData.field == 'userId' && taskData.value != "") {
                user = this.teamMembers.filter(u => u.id == taskData.value)
            } else {
                user = null
            }

            this.$store.dispatch("task/updateTask", {
                id: this.form.id,
                // data: { ...this.form },
                data: { [taskData.field]: taskData.value },
                user,
                projectId: this.form.projectId ? this.form.projectId : null,
                // text: historyText
                text: `changed ${taskData.name} to ${updatedvalue}`,
            })
                .then((u) => {
                // console.log(u)
                this.$nuxt.$emit("update-key")
                // this.$nuxt.$emit("refresh-history")
                this.reloadHistory += 1
                // this.loading = false
                })
                .catch(e => {
                console.log(e)
                // this.loading = false
                })

        },

        async updateProject(taskData) {

            let proj = this.projects.find(t => t.id == taskData.projValue)

            let user;
            if (taskData.field == 'userId' && taskData.value != "") {
                user = this.teamMembers.filter(u => u.id == taskData.value)
            } else {
                user = null
            }

            this.$store.dispatch("task/updateTask", {
                id: this.form.id,
                data: { [taskData.projField]: taskData.projValue, [taskData.secField]: taskData.secValue },
                user,
                projectId: taskData.oldProjValue,
                text: proj ? `changed project to ${proj.title}` : `Task removed from Project`,
            })
                .then((u) => {
                // console.log(u)
                this.$nuxt.$emit("update-key")
                // this.$nuxt.$emit("refresh-history")
                this.reloadHistory += 1
                // this.loading = false
                })
                .catch(e => {
                console.log(e)
                // this.loading = false
                })

        },
        
        onFileInput(payload) {
            // console.log(payload)
            this.value.files = payload.files
            },
            onsubmit(data) {
            // console.log(data, this.editMessage?.id)
            let trimComment = _.truncate(data.text.slice(3, -4), { length: 128 })

            if (this.editMessage?.id) {
                this.$store.dispatch("task/updateTaskComment", { taskId: this.task.id, commentId: this.editMessage.id, comment: data.text, text: `updated comment ${trimComment}` })
                .then(res => {
                    this.reloadComments += 1
                })
                .catch(e => console.log(e))
            } else {
                this.$store.dispatch("task/createTaskComment", { id: this.task.id, comment: data.text, text: `added comment ${trimComment}` })
                .then(res => {
                    if (this.value.files.length > 0) {
                    // console.log(this.value.files, res.data)
                    this.uploadFiles(this.value.files, res.data)
                    }
                    this.reloadComments += 1
                })
                .catch(e => console.log(e))
            }
        },

        async uploadFiles(files, commentRes) {
            let filelist = []

            let formdata = new FormData()
            files.forEach(file => {
                formdata.append('files', file)
                filelist.push(file.name)
            })
            formdata.append('taskId', commentRes.taskId)
            formdata.append('taskCommentId', commentRes.id)
            formdata.append('text', `uploaded file(s) "${filelist.join(", ")}" to task`)

            const fi = await this.$axios.post("/file/upload", formdata, {
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if (fi.data.statusCode == 200) {
                this.reloadFiles += 1;
                this.value.files = []
            }
        },
        createTask($event) {
            console.log($event)
        },

        viewSubtask($event){
            // console.log($event)
            this.showSubtaskDetail = true
            // this.$store.dispatch("subtask/setSelectedSubtask", $event)
            this.$store.commit("subtask/setSelectedSubtask", $event)
        },
    }
}
</script>

<style lang="scss" scoped>
#single-task {
    max-width: $sidebar-width;
    margin: 0 auto;
}

</style>