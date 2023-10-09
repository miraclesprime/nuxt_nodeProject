<template>
    <div id="inbox-history" class="d-flex inbox-history gap-05 my-05 position-relative">
        <bib-avatar :src="$userInfo(history.userId).Photo"></bib-avatar>
        <div>
            <span :id="'li-name-'+i" class="font-w-600">{{$userInfo(history.userId).Name}}</span>
            <span class="history" :id="'ii-history-'+i">{{truncateText(history.text)}}</span>
            <div class="text-secondary font-sm mt-025" :id="'ii-updatedAt-'+i">
                <format-date :datetime="history.updatedAt"></format-date> at {{$toTime(history.updatedAt)}}
            </div>
        </div>
        <div class="reaction align-center gap-05 position-absolute" @click.stop>
            <div class="action" @click.stop="onLikeClick">
                <fa :icon="faThumbsUp" />
            </div>
            <tippy :visible="isReactionPickerOpen" theme="light-border p-0" :animate-fill="false" :distance="6" interactive trigger="manual" :onHide="() => defer(() => (isReactionPickerOpen = false))">
                <template slot="trigger">
                    <div class="action" @click="toggleReactionPicker">
                        <fa :icon="faSmile" />
                    </div>
                </template>
                <div @click.stop>
                    <!-- add reaction to comment -->
                    <v-emoji-picker @select="onReactionClick" />
                </div>
            </tippy>
            <!-- <bib-icon icon=""></bib-icon> -->
        </div>
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
            alert("liked")
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
        onReactionClick({ data }) {
            alert("you reacted " + data)
        }
    }
}
</script>
<style lang="css" scoped>
.inbox-history {
    &:hover {
        .reaction {
            /*top: 0; right: 0;*/
        }
    }
}

.reaction {
    /*transition: top 200ms;*/
    top: 0;
    right: 0;

    /*opacity: 1;*/
    .action {
        color: $gray5;
        color: var(--bib-gray5);
    }
}
</style>