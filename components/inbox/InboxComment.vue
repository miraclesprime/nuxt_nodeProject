<template>
    <div id="inbox-history" class="d-flex inbox-history gap-05 my-05 position-relative" >
        <bib-avatar :src="$userInfo(history.userId).Photo" class="flex-shrink-0"></bib-avatar>
        <div style="padding-right: 5rem;">
            <span id="li-name" class="font-w-600">{{$userInfo(history.userId).Name}}</span>
            <!-- <template > -->
                <span id="ii-history" class="history" >commented</span>
                <div v-html="comment"></div>
            <!-- </template> -->
            <div id="ii-updatedAt" class="text-secondary font-sm mt-025" >
                <format-date :datetime="history.updatedAt"></format-date> at {{$toTime(history.updatedAt)}}
            </div>
        </div>
        <div class="reaction align-center gap-05 position-absolute px-05 shape-pill" style="padding-block: 0.1rem;"  @click.stop>
            
            <!-- comment reactions -->
            <div class="comment-reaction">
                <div v-if="reactionGroup.length > 0" class="align-center gap-05">
                    <div v-for="(react, index) in reactionGroup" :key="reactionKey + react.reaction" :id="'react-'+index">
                        <template v-if="react.reaction != '👍'">
                            <tippy arrow="true" arrowType="round" >
                                <template slot="trigger" >
                                    <span @click="toggleReactionPicker">
                                        {{ react.reaction }} <span class="count font-sm text-secondary" :id="'react-count-'+index" >{{react.count}}</span>
                                    </span>
                                </template>
                                <template v-if="react.data.length > 1">
                                    <span v-for="(ud, index) in react.data">{{ud.user.firstName}} {{ud.user.lastName}}<template v-if="index+1 < react.data.length">, </template></span>
                                </template>
                                <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div>
                            </tippy>
                        </template>
                        <template v-if="react.reaction == '👍'">
                            <tippy arrow="true" arrowType="round" >
                                <template slot="trigger" >
                                    <span @click="onLikeClick(react)">
                                        {{ react.reaction }} <span class="count font-sm text-secondary" :id="'react-count-'+index" >{{react.count}}</span>
                                    </span>
                                </template>
                                <template v-if="react.data.length > 1">
                                    <span v-for="(ud, index) in react.data">{{ud.user.firstName}} {{ud.user.lastName}}<template v-if="index+1 < react.data.length">, </template></span>
                                </template>
                                <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div>
                            </tippy>
                        </template>
                    </div>
                    <div v-show="showLike" class="action" @click.stop="onLikeClick">
                        <bib-spinner v-if="reactionSpinner" :scale="1.25"></bib-spinner>
                        <fa v-else :icon="faThumbsUp" />
                    </div>
                    <div v-show="showSmile" class="action" @click.stop="toggleReactionPicker">
                        <fa :icon="faSmile" />
                    </div>
                </div>
                <template v-else>
                    <div class="action" @click.stop="onLikeClick">
                        <bib-spinner v-if="reactionSpinner" :scale="1.25"></bib-spinner>
                        <fa v-else :icon="faThumbsUp" />
                    </div>
                    <div class="action" @click.stop="toggleReactionPicker">
                        <fa :icon="faSmile" />
                    </div>
                </template>
            </div>
        </div>
        <tippy :visible="isReactionPickerOpen" arrow theme="light-border p-0" :animate-fill="false" :distance="6" interactive trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
            <!-- <template slot="trigger">
                <div class="action" @click.stop="toggleReactionPicker">
                    <fa :icon="faSmile" />
                </div>
            </template> -->
            <div @click.stop>
                <v-emoji-picker @select="onReactionClick" />
            </div>
        </tippy>

        <bib-popup-notification-wrapper>
            <template #wrapper>
              <bib-popup-notification
                v-for="(msg, index) in popupMessages"
                :key="index"
                :message="msg.text"
                :variant="msg.variant"
                :autohide="5000"
              >
              </bib-popup-notification>
            </template>
          </bib-popup-notification-wrapper>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import _ from 'lodash'
import { VEmojiPicker } from 'v-emoji-picker';
import { TippyComponent } from 'vue-tippy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faSmile } from '@fortawesome/free-solid-svg-icons';
import "~/assets/tippy-theme.scss";
export default {

    name: 'InboxComment',
    components: {
        fa: FontAwesomeIcon,
        tippy: TippyComponent,
        VEmojiPicker,
    },
    props: {
        history: Object,
        // comment: Object,
    },

    data() {
        return {
            faThumbsUp,
            faSmile,
            isReactionPickerOpen: false,
            commentReactions: [],
            // projCommentReactions: [],
            reactionKey: 1,
            reactionSpinner: false,
            popupMessages: [],
            showLike: true,
            showSmile: true,
        }
    },
    watch: {
        msgKey(newValue) {
            if(newValue.taskMsgid && (newValue.taskMsgid == this.history.taskCommentId)) {
                // console.log(newValue.taskMsgid, this.history.taskCommentId)
                // this.reactionSpinner = true
                this.$store.dispatch("task/fetchCommentReactions", {id: this.history.taskCommentId}).then(c => {
                    // console.log(c)
                    this.commentReactions = c
                    this.reactionKey += 1
                    // this.reactionSpinner = false
                }).catch(e => {
                    // this.reactionSpinner = false
                    console.warn(e)
                })
            }
            if (newValue.projMsgid && (newValue.projMsgid == this.history.projectCommentId)) {
                // console.log(newValue.projMsgid, this.history.projectCommentId)
                this.$store.dispatch("project/fetchCommentReactions", {id: this.history.projectCommentId}).then(c => {
                    // console.log(c)
                    this.commentReactions = c
                    this.reactionKey += 1
                    // this.reactionSpinner = false
                }).catch(e => {
                    // this.reactionSpinner = false
                    console.warn(e)
                })

            }
        }
    },
    computed: {
        ...mapGetters({
            user: "user/getUser2",
            msgKey: "inbox/getKey"
        }),
      comment () {
        if (this.history.projectCommentId) {
            return this.history.projectComment.comment
        }
        if (this.history.taskCommentId) {
            return this.history.taskComment.comment
        }
        if (this.history.subtaskCommentId) {
            return this.history.subtaskComment.comment
        }
        return null
      },
      
      reactionGroup() {
          let rg = []
          if (this.commentReactions) {
            this.commentReactions.map(r => {
              let rindex = rg.findIndex((el) => el.reaction == r.reaction)
              let relem = rg.find((el) => el.reaction == r.reaction)
              if (relem == undefined) {
                rg.push({ reaction: r.reaction, count: 1, data: [{ id: r.id, user: r.user }] })
              } else {
                rg[rindex].count += 1
                rg[rindex].data.push({ id: r.id, user: r.user })
              }
              if (r.reaction == "👍") {
                this.showLike = false
                // this.showSmile = true
              } 
              if (r.reaction != "👍") {
                this.showSmile = false
                // this.showLike = true
              } 
            })
          }
          this.reactionKey += 1
          return rg
        },
        reactionPicker(){
            // console.info(this.commentReactions.length, this.comment)
            if (this.commentReactions.length > 0 && this.comment) {
                let react = this.commentReactions.findIndex(el => el.reaction != "👍")
                console.info(react)
                if (react >= 0) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        },
    },
    mounted() {
        
        if (this.history.taskCommentId) {
            this.fetchTaskCommentReactions()
        }
        if (this.history.projectCommentId) {
            this.fetchProjCommentReactions()
        }
    },
    methods: {
        /*truncateText(text) {
            let t = _.truncate(text, { length: 200 })
            return t.replace(/(<([^>]+)>)/gi, "")
        },*/
        toggleReactionPicker() {
            console.log('event fired')
            this.isReactionPickerOpen = !this.isReactionPickerOpen;
            // this.isMenuOpen = false;
        },
        ownReaction(reaction){
            return reaction.data.find(r => r.user.id == this.user.Id)
        },
        onLikeClick(react) {
            let own
            console.log(react, own)
            if(react.count) {
                own = react.data.find(r => r.user.id == this.user.Id)
            }
            this.reactionSpinner = true
            if (own) {
                if (this.history.taskCommentId) {
                    this.$store.dispatch("task/deleteCommentReaction", { taskCommentId: this.history.taskCommentId, reactionId: own.id, userId: this.user.Id }).then(del => {
                        this.fetchTaskCommentReactions()
                    })
                } 

                if (this.history.projectCommentId) {
                    this.$store.dispatch("project/deleteCommentReaction", { projectCommentId: this.history.projectCommentId, reactionId: own.id, userId: this.user.Id }).then(del => {
                        this.fetchProjCommentReactions()
                    })
                }
            } else {
                // console.log('not own reaction')
                if(this.history.taskCommentId) {
                    this.$store.dispatch("task/addCommentReaction", {taskCommentId: this.history.taskCommentId, reaction: "👍", taskId: this.history.task.id, text: "liked the comment" }).then(res => {
                        console.log("add task comment reaction", res.data)
                        if (res.statusCode == 200) {
                            this.fetchTaskCommentReactions()
                        }
                    }).catch(e => console.warn(e))
                }

                if(this.history.projectCommentId) {
                    this.$store.dispatch("project/addCommentReaction", {projectCommentId: this.history.projectCommentId, reaction: "👍", projectId: this.history.project.id, text: "liked the comment" }).then(res => {
                        console.log("add project comment reaction", res.data)
                        if (res.statusCode == 200) {
                            this.fetchProjCommentReactions()
                        }
                    }).catch(e => console.warn(e))
                }
            }
            
        },
        defer(func) {
            setTimeout(func, 0);
        },
        onReactionClick({ data }) {
            // alert("you reacted " + data)
            this.isReactionPickerOpen = false
            if(this.history.taskCommentId) {
                this.$store.dispatch("task/addCommentReaction", {taskCommentId: this.history.taskCommentId, reaction: data, taskId: this.history.task.id, text: "reacted to comment" }).then((res) => {
                        // console.log(res.data)
                        this.fetchTaskCommentReactions();
                    }).catch(e => console.warn(e))
            }
            if(this.history.projectCommentId) {
                this.$store.dispatch("project/addCommentReaction", {projectCommentId: this.history.projectCommentId, reaction: data, projectId: this.history.project.id, text: "reacted to comment" }).then((res) => {
                    // console.log("add task comment reaction", res.data)
                    // if (res.statusCode == 200) {
                        this.fetchProjCommentReactions()
                    // }
                }).catch(e => console.warn(e))
            }
        },
        fetchTaskCommentReactions(){
            this.reactionSpinner = true
            this.$store.dispatch("task/fetchCommentReactions", {id: this.history.taskCommentId}).then(c => {
                // console.log(c)
                this.commentReactions = c
                this.reactionKey += 1
                let inboxKey = this.msgKey.key+1;
                this.$store.dispatch("inbox/setKey", {key: inboxKey, taskMsgid: this.history.taskCommentId, projMsgid: null})
                this.reactionSpinner = false
                // return c
            }).catch(e => {
                this.reactionSpinner = false
                console.warn(e)
            })
        },
        fetchProjCommentReactions(){
            this.reactionSpinner = true
            this.$store.dispatch("project/fetchCommentReactions", {id: this.history.projectCommentId}).then(r => {
                // console.log(r)
                this.commentReactions = r
                this.reactionKey += 1
                let inboxKey = this.msgKey.key+1;
                this.$store.dispatch("inbox/setKey", {key: inboxKey, taskMsgid: null, projMsgid: this.history.projectCommentId})
                this.reactionSpinner = false
            }).catch(e => {
                console.warn(e)
                this.reactionSpinner = false
            })
        },
    }
}
</script>
<style lang="css" scoped>
.inbox-history {
    /*&:hover {
        .action {
            opacity:1;
        }
    }*/
}

.reaction {
    top: 0;
    right: 0;
    .action {
        /*opacity: 0;*/
        transition: opacity 200ms;
        color: var(--bib-gray5);
        min-width: 1rem;
    }
    .history-reaction,
    .comment-reaction { display: flex; align-items: center; gap: 0.25rem; }
}
</style>