<template>
    <div id="inbox-history" class="d-flex inbox-history gap-05 my-05 position-relative" >
        <bib-avatar :src="$userInfo(history.userId).Photo" class="flex-shrink-0"></bib-avatar>
        <div style="padding-right: 5rem;">
            <span id="li-name" class="font-w-600">{{$userInfo(history.userId).Name}}</span>
            <!-- <template v-if="comment">
                <span id="ii-history" class="history" >commented</span>
                <div v-html="comment"></div>
            </template> -->
            <span id="ii-history" class="history" >{{truncateText(history.text)}}</span>
            <div id="ii-updatedAt" class="text-secondary font-sm mt-025" >
                <format-date :datetime="history.updatedAt"></format-date> at {{$toTime(history.updatedAt)}}
            </div>
        </div>
        <div class="reaction align-center gap-05 position-absolute px-05 shape-pill" style="padding-block: 0.15rem;"  @click.stop>
            
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
                    
                        <div v-for="(u, index) in historyReaction.users" :key="index + u" class="reaction " :id="'histreact-'+index">
                            <span>{{$userInfo(u).Name}}<template v-if="index+1 < historyReaction.users.length">, </template></span>
                        </div>
                    
                    <!-- <div v-else>{{react.data[0].user.firstName}} {{react.data[0].user.lastName}}</div> -->
                </tippy>
            </div>
            <div v-else class="action" @click.stop="onLikeClick">
                <bib-spinner v-if="reactionSpinner" :scale="1.25"></bib-spinner>
                <fa v-else :icon="faThumbsUp" />
            </div>

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
// import { VEmojiPicker } from 'v-emoji-picker';
import { TippyComponent } from 'vue-tippy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faSmile } from '@fortawesome/free-solid-svg-icons';
import "~/assets/tippy-theme.scss";
export default {

    name: 'InboxHistory',
    components: {
        fa: FontAwesomeIcon,
        tippy: TippyComponent,
        // VEmojiPicker,
    },
    props: {
        history: Object,
    },

    data() {
        return {
            faThumbsUp,
            faSmile,
            // isReactionPickerOpen: false,
            historyReactions:[],
            // commentReactions: [],
            // projCommentReactions: [],
            reactionKey: 1,
            reactionSpinner: false,
            popupMessages: [],
        }
    },
    
    computed: {
        ...mapGetters({
            user: "user/getUser2",
            msgKey: "inbox/getKey"
        }),
      
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
      
    },
    mounted() {
        if (this.history.reactions[0]?.id) {
            this.historyReactions = this.history.reactions
        }
    },
    methods: {
        truncateText(text) {
            let t = _.truncate(text, { length: 200 })
            return t.replace(/(<([^>]+)>)/gi, "")
        },
        onLikeClick() {
            this.reactionSpinner = true

            let ownLike = this.historyReactions.find(el => el.userId == this.user.Id)
            let ownLikeIndex = this.historyReactions.findIndex(el => el.userId == this.user.Id)
            console.log("own like",ownLike, ownLikeIndex)
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