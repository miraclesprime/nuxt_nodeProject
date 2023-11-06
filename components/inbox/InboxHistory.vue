<template>
    <div id="inbox-history" class="d-flex inbox-history gap-05 my-05 position-relative" >
        <bib-avatar :src="$userInfo(history.userId).Photo" class="flex-shrink-0"></bib-avatar>
        <div style="padding-right: 5rem;">
            <span id="li-name" class="font-w-600">{{$userInfo(history.userId).Name}}</span>
            <template v-if="comment">
                <span id="ii-history" class="history" >commented</span>
                <div v-html="comment"></div>
            </template>
            <span v-else id="ii-history" class="history" >{{truncateText(history.text)}}</span>
            <div id="ii-updatedAt" class="text-secondary font-sm mt-025" >
                <format-date :datetime="history.updatedAt"></format-date> at {{$toTime(history.updatedAt)}}
            </div>
        </div>
        <div class="reaction align-center gap-05 position-absolute px-05 shape-pill" style="padding-block: 0.15rem;" :class="{'bg-warning-sub3 border-warning': comment}" @click.stop>
            <!-- <span v-show="comment" class="border-gray1 shape-rounded font-sm" >{{history.taskCommentId}} {{history.projectCommentId}}</span> -->
            <!-- history reactions -->
            <div v-if="historyReaction.count > 0" class="history-reaction">
                <tippy arrow="true" arrowType="round">
                    <template slot="trigger">
                        <div class="action h-105" @click.stop="onLikeClick">
                            <bib-spinner v-if="reactionSpinner" :scale="1.25"></bib-spinner>
                            <template v-else>
                                👍 <span class="count font-sm text-secondary" id="histreact-count" >{{historyReaction.count}}</span>
                            </template>
                        </div>
                    </template>
                    <!-- <template v-if="react.data.length > 1"> -->
                        <div v-for="(u, index) in historyReaction.users" :key="index + u" class="reaction " :id="'histreact-'+index">
                            <span>{{$userInfo(u).Name}}<template v-if="index+1 < historyReaction.users.length">, </template></span>
                        </div>
                    <!-- </template> -->
                    <!-- <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div> -->
                </tippy>
            </div>

            <div class="action" v-if="historyReaction.count == 0" @click.stop="onLikeClick">
                <bib-spinner v-if="reactionSpinner" :scale="1.25"></bib-spinner>
                <fa v-else :icon="faThumbsUp" />
            </div>

            <!-- comment reactions -->
            <div v-if="commentReactions.length > 0" class="comment-reaction">
                <div v-for="(react, index) in reactionGroup" :key="reactionKey + react.reaction" class="reaction " :id="'react-'+index">
                    <tippy arrow="true" arrowType="round">
                        <template slot="trigger">
                            {{ react.reaction }} <span class="count font-sm text-secondary" :id="'react-count-'+index" >{{react.count}}</span>
                        </template>
                        <template v-if="react.data.length > 1">
                            <span v-for="(ud, index) in react.data">{{ud.user.firstName}} {{ud.user.lastName}}<template v-if="index+1 < react.data.length">, </template></span>
                        </template>
                        <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div>
                    </tippy>
                </div>
            </div>

            <template v-if="reactionPicker">
                <tippy :visible="isReactionPickerOpen" arrow theme="light-border p-0" :animate-fill="false" :distance="6" interactive trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
                    <template slot="trigger">
                        <div class="action" @click="toggleReactionPicker">
                            <fa :icon="faSmile" />
                        </div>
                    </template>
                    <div @click.stop>
                        <v-emoji-picker @select="onReactionClick" />
                    </div>
                </tippy>
            </template>
        </div>

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

    name: 'InboxHistory',
    components: {
        fa: FontAwesomeIcon,
        tippy: TippyComponent,
        VEmojiPicker,
    },
    props: {
        history: Object,
    },

    data() {
        return {
            faThumbsUp,
            faSmile,
            isReactionPickerOpen: false,
            historyReactions:[],
            commentReactions: [],
            // projCommentReactions: [],
            reactionKey: 1,
            reactionSpinner: false,
            popupMessages: [],
        }
    },
    watch: {
        msgKey(newValue) {
            if(newValue.taskMsgid && (newValue.taskMsgid == this.history.taskCommentId)) {
                console.log(newValue.taskMsgid, this.history.taskCommentId)
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
                console.log(newValue.projMsgid, this.history.projectCommentId)

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
      historyReaction(){
        let hru = {count: 0, users: []}
        if (this.historyReactions.length > 0) {
            this.historyReactions.map(r => {
                let rindex = hru.users.findIndex((el) => el == r.userId)
                // console.log(r.id, r.userId, rindex)
                if (r.id) {
                    hru.count += 1
                    if(rindex) hru.users.push(r.userId)
                }
            })
            // return hru
            // return this.history.reactions.reduce((acc, curr) => acc + 1, 0)
        } /*else {
            return hru
        }*/
        return hru
      },
      reactionGroup() {
          let rg = []
          if (this.commentReactions) {
            this.commentReactions.map(r => {
              let rindex = rg.findIndex((el) => el.reaction == r.reaction)
              let relem = rg.find((el, index) => el.reaction == r.reaction)
              if (relem == undefined) {
                rg.push({ reaction: r.reaction, count: 1, data: [{ id: r.id, user: r.user }] })
              } else {
                rg[rindex].count += 1
                rg[rindex].data.push({ id: r.id, user: r.user })
              }
            })
          }
          this.reactionKey += 1
          return rg
        },
        reactionPicker(){
            if (this.commentReactions.length > 0 && this.comment) {
                let react = this.commentReactions.findIndex(el => el.reaction != "👍")
                if (react) {
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
        if (this.history.reactions[0]?.id) {
            this.historyReactions = this.history.reactions
        }
        if (this.history.taskCommentId) {
            this.fetchTaskCommentReactions()
        }
        if (this.history.projectCommentId) {
            this.fetchProjCommentReactions()
        }
    },
    methods: {
        truncateText(text) {
            let t = _.truncate(text, { length: 200 })
            return t.replace(/(<([^>]+)>)/gi, "")
        },
        toggleReactionPicker() {
            this.isReactionPickerOpen = !this.isReactionPickerOpen;
            // this.isMenuOpen = false;
        },
        onLikeClick() {
            // alert("work in progress")
            this.reactionSpinner = true
            if (this.comment != null) {
                console.log("comment->",this.comment)
                this.$store.dispatch("task/addCommentReaction", {taskCommentId: this.history.taskCommentId, reaction: "👍", taskId: this.history.task.id, text: "liked the comment" }).then(res => {
                    console.log("add task comment reaction", res.data)
                    if (res.statusCode == 200) {
                        this.fetchTaskCommentReactions()
                    }
                }).catch(e => console.warn(e))
                // this.reactionSpinner = false
                return false
            }

            let ownLike = this.historyReactions.find(el => el.userId == this.user.Id)
            let ownLikeIndex = this.historyReactions.findIndex(el => el.userId == this.user.Id)
            console.log(ownLike, ownLikeIndex)
            if(typeof ownLike != "object") {
                this.$axios.post(`/history/${this.history.id}/reaction`, { reaction: "👍" }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.statusCode == 200) {
                        this.popupMessages.push({text: "You liked the comment", variant: "secondary"})
                        this.historyReactions.push(res.data.data)
                    }
                    this.reactionSpinner = false
                }).catch(e => {
                    console.warn(e)
                    this.popupMessages.push({text: "There was some issue", variant: "danger"})
                    this.reactionSpinner = false
                })
            } else {
                this.$axios.delete(`/history/${this.history.id}/reaction`, {
                    data: {
                        reactionId: ownLike.id,
                        userId: ownLike.userId
                    },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken"),
                    }
                }).then(r => {
                    this.popupMessages.push({text: "You removed your reaction", variant: "orange"})
                    this.historyReactions.splice(0, 1)
                    this.reactionSpinner = false
                }).catch(e => {
                    console.warn(e)
                    this.reactionSpinner = false
                })
            }
            // this.reactionSpinner = true
        },
        defer(func) {
            setTimeout(func, 0);
        },
        onReactionClick({ data }) {
            // alert("you reacted " + data)
            this.isReactionPickerOpen = false
            this.$store.dispatch("task/addCommentReaction", {taskCommentId: this.history.taskCommentId, reaction: data, taskId: this.history.task.id, text: "reacted to comment" }).then((res) => {
                    // console.log(res.data)
                    this.fetchTaskCommentReactions();
                }).catch(e => console.warn(e))
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
    }
    .history-reaction,
    .comment-reaction { display: flex; align-items: center; gap: 0.25rem; }
}
</style>