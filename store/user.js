
export const state = () => ({
    user: null,
    teamMembers: []
  });
  
  export const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },

    setTeamMembers(state, payload) {
       state.teamMembers = payload;
    }
  };
  
  export const getters = {
    getUser(state) {
        return state.user;
    },

    getTeamMembers(state) {
      let members = []
      state.teamMembers.map(t=>{
        members.push({label: t.FirstName + ' ' + t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role })
      })
      return members
    }
  };
  
  export const actions = {
    async setUser(ctx, payload){
        await ctx.commit('setUser', payload);
    },

    async setTeamMembers(ctx) {
      const members = await this.$axios.$get(`${process.env.ORG_API_URL}/${ctx.rootState.user.user.subb}/users`, {
        headers: {
          "Authorization": `Bearer ${ctx.rootState.token.token}`
        }
      })
      ctx.commit("setTeamMembers", members)
    }
  };