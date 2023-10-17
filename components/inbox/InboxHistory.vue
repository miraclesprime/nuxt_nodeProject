<template>
    <div id="inbox-history" class="d-flex inbox-history gap-05 my-05 position-relative">
        <bib-avatar :src="$userInfo(history.userId).Photo"></bib-avatar>
        <div class="pr-3">
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
        <div class="reaction align-center gap-05 position-absolute" @click.stop>
            <template v-if="reactions.length > 0">
                <div v-for="(react, index) in reactionGroup" :key="reactionKey + react.reaction" class="reaction " :id="'react-'+index">
                    <tippy>
                        <template slot="trigger">
                            {{ react.reaction }} <span class="count font-sm text-secondary" :id="'react-count-'+index" v-show="react.count > 1">{{react.count}}</span>
                        </template>
                        <template v-if="react.data.length > 1">
                            <span v-for="(ud, index) in react.data">{{ud.user.firstName}} {{ud.user.lastName}}<template v-if="index+1 < react.data.length">, </template></span>
                        </template>
                        <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div>
                    </tippy>
                </div>
            </template>
            <template v-if="historyReaction.count > 0">
                <tippy>
                    <template slot="trigger">
                        <fa :icon="faThumbsUp" /> <span class="count font-sm text-secondary" id="histreact-count" >{{historyReaction.count}}</span>
                    </template>
                    <!-- <template v-if="react.data.length > 1"> -->
                        <div v-for="(u, index) in historyReaction.users" :key="index + u" class="reaction " :id="'histreact-'+index">
                            <span>{{$userInfo(u).Name}}<template v-if="index+1 < historyReaction.users.length">, </template></span>
                        </div>
                    <!-- </template> -->
                    <!-- <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div> -->
                </tippy>
            </template>
            <div class="action" @click.stop="onLikeClick">
                <fa :icon="faThumbsUp" />
                <!-- <tippy>
                    <template slot="trigger">
                        <span>{{r.reaction}}</span>
                    </template>
                    <div>{{$userInfo(r.userId).Name}}</div>
                </tippy> -->
            </div>

            <tippy :visible="isReactionPickerOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
                <template slot="trigger">
                    <div class="action" @click="toggleReactionPicker">
                        <fa :icon="faSmile" />
                    </div>
                </template>
                <div @click.stop>
                    <v-emoji-picker @select="onReactionClick" />
                </div>
            </tippy>
            <!-- <bib-icon icon=""></bib-icon> -->
        </div>
        <bib-popup-notification-wrapper>
            <template #wrapper>
              <bib-popup-notification
                v-for="(msg, index) in popupMessages"
                :key="index"
                :message="msg.text"
                :variant="msg.variant"
              >
              </bib-popup-notification>
            </template>
          </bib-popup-notification-wrapper>
    </div>
</template>
<script>
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
            reactions: [],
            reactionKey: 1,
            popupMessages: [],
        }
    },
    computed: {
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
        if (this.history.reactions.length > 0) {
            let hru = {count: 0, users: []}
            this.history.reactions.map(r => {
                let rindex = hru.users.findIndex((el) => el == r.userId)
                console.log(r.id, r.userId, rindex)
                if (r.id) {
                    hru.count += 1
                    if(rindex) hru.users.push(r.userId)
                }
            })
            return hru
            // return this.history.reactions.reduce((acc, curr) => acc + 1, 0)
        } else {
            return null
        }
      },
      reactionGroup() {
          let rg = []
          if (this.reactions) {
            this.reactions.map(r => {
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
    },
    mounted() {
        if (this.history.taskCommentId) {
            this.$store.dispatch("task/fetchTaskCommentReactions", {id: this.history.taskCommentId}).then(c => {
                // console.log(c)
                this.reactions = c
                this.reactionKey += 1
                return c
            }).catch(e => console.warn(e))
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
            if (this.comment != null) {
                console.log("comment->",this.comment)
            } else {
                this.$axios.post(`/history/${this.history.id}/reaction`, { reaction: "👍" }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("accessToken")
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.statusCode == 200) {
                        this.popupMessages.push({text: "You 👍 the comment", variant: "white"})
                    }
                }).catch(e => {
                    console.warn(e)
                    this.popupMessages.push({text: "There was some issue", variant: "danger"})
                })
            }
            // this.reactionSpinner = true
            /*let duplicateReaction = this.reactions.some(r => r.userId == this.user.Id && r.reaction == "👍")
            if (duplicateReaction) {
                this.alertDialog = true
                this.alertMsg = "Reaction already exists"
                // this.reactionSpinner = false
            } else {
                this.$axios.post("/task/" + this.msg.id + "/reaction", { reaction: "👍", taskId: this.task.id, text: "liked 👍 the comment" }, {
                        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
                    })
                    .then(d => {
                        if (d.data.statusCode == 200) {
                            this.fetchReactions()
                            this.reactionSpinner = false
                        }
                    })
                    .catch(e => console.log(e))
            }*/
        },
        defer(func) {
            setTimeout(func, 0);
        },
        /*fetchReactions (type, commentId){
            if (type == "task") {
              this.$axios.get('/task/' + this.history.taskCommentId + "/reactions", {
                  headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
                })
                .then(r => {
                  if (r.data.statusCode == 200) {
                    this.reactionKey += 1
                    return r.data.data
                  }
                })
                .catch(e => throw new Error(message: e))
            }
    
        },*/
        onReactionClick({ data }) {
            alert("you reacted " + data)
            this.isReactionPickerOpen = false
        }
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
}
</style>