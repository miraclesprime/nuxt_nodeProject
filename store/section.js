export const strict = false;

export const state = () => ({
  sections: []
});

export const getters = {

  getAllSections(state) {
    return state.sections;
  }

};

export const mutations = {

  fetchSections(state, payload) {
    state.sections = payload;
  },

  createSection(state, payload) {
    state.sections.unshift(payload)
  },

  setSections(state, payload) {
    state.sections = payload;
  },

  setSortType(state, payload) {
    state.sortType = payload
  },

  sortSections(state, payload) {
    if (payload == 'name') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => a.title.localeCompare(b.title));
      }
      state.sections = arr;

    }
    if (payload == 'owner') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      }
      state.sections = arr;

    }
    if (payload == 'status') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
      }
      state.sections = arr;

    }
    if (payload == 'startDate') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      state.sections = arr;

    }
    if (payload == 'dueDate') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      }
      state.sections = arr;

    }
    if (payload == 'priority') {

      let arr = JSON.parse(JSON.stringify(state.sections))
      state.sections = [];
      arr.sort((a, b) => a.title.localeCompare(b.title));

      for (let i = 0; i < arr.length; i++) {
        arr[i].tasks.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
      }
      state.sections = arr;

    }
  },

  addTaskToSection(state, payload) {
    state.sections.forEach((s) => {
      if (s.id == payload.sectionId) {
        s.tasks.push(payload)
      }
    })
  }

};

export const actions = {
  async fetchSections(ctx) {
    const res = await this.$axios.$get('/section', {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    ctx.commit('fetchSections', res.data);
  },

  setSections(ctx, payload) {
    ctx.commit('setSections', payload)
  },

  setSortType(ctx, payload) {
    ctx.commit('setSortType', payload)
  },

  async createSection(ctx, payload) {
    const res = await this.$axios.$post('/section', payload, {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    ctx.commit('createSection', res.data)
  },

  sortSections(ctx, payload) {
    ctx.commit('sortSections', payload)
  }
};
