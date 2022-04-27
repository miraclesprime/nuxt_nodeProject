export const state = () => ({
  user: null,
  user2: null,
  teamMembers: []
});

export const getters = {
  getUser(state) {
    return state.user;
  },

  getUser2(state) {
    return state.user2;
  },

  getTeamMembers(state) {
    let members = []
    state.teamMembers.map(t => {
      members.push({ label: t.FirstName + ' ' + t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo })
    })
    return members
  }
};

export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },

  setUser2(state, payload) {
    state.user2 = payload;
  },

  setTeamMembers(state, payload) {
    state.teamMembers = payload;
  }
};


export const actions = {
  async setUser(ctx, payload) {
    await ctx.commit('setUser', payload);
  },

  async setUser2(ctx, payload) {
    await ctx.commit('setUser2', payload);
  },

  async setTeamMembers(ctx) {
    const members = await this.$axios.$get(`${process.env.ORG_API_URL}/${ctx.rootState.user.user.subb}/users`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    ctx.commit("setTeamMembers", members)
  }
};
