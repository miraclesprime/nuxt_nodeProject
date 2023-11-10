<template>
  <div class="d-inline-flex align-center flex-wrap my-025 task-history position-relative" id="task-history-wrapper">
    <!-- <figure class="user-avatar">
      <bib-avatar :src="user.Photo" size="2rem" ></bib-avatar>
    </figure> -->
    <div id="task-history-titles-wrapper">
      <span class="font-w-600" id="th-username">{{user.Name}}</span>
      <span class="mx-05 " id="th-historytext">{{history.text}}</span>
      <span class="text-gray4 " id="th-historyupdatedat">{{$displayDate(history.updatedAt)}}</span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from "vuex"

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {

  name: 'TaskHistory',
  props: {
    history: Object,
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
  },
  data: function() {
    return {
      user:""
    };
  },

  mounted () {
if(this.teamMembers.length>0) {
  this.user=this.$userInfo(this.history.userId)

}
else {
      this.$axios.$get(`${process.env.ORG_API_ENDPOINT}/${JSON.parse(localStorage.getItem('user')).subb}/users`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
          }).then((res) => {
             this.user=this.getUserInfo(res,this.history.userId)
          })
      }
     
  },
  methods:{
    getUserInfo(members,userID)
    {
      if (members.length > 0 && userID) 
                {
                      let u = members.find((m) => m.Id == userID)
                        if (u) {
                          return { Name: `${u.FirstName} ${u.LastName}`}
                        }
                        else
                        {
                            return {Name: ''}
                        }
                } 
                else 
                {
                  return { Name: "no user found" }
                }
    }
  }
}

</script>
<style lang="scss" scoped>
.task-history { font-size: $base-size; color: $text; /*min-height: 1.5rem;*/ }
/*.user-avatar {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0.125rem;

}*/

</style>
