export const strict = false;

export const state = () => ({
  sections: [],
  projectSections: [],
});

export const getters = {

  getAllSections(state) {
    return state.sections;
  },

  getProjectSections(state) {
    return state.projectSections
  }

};

export const mutations = {

  fetchSections(state, payload) {
    state.sections = payload;
  },

  fetchProjectSections(state, payload){
    state.projectSections = payload
  },

  createSection(state, payload) {
    let ns = payload
    ns.tasks = []
    state.projectSections.unshift(ns)
  },

  setSections(state, payload) {
    state.sections = payload;
  },

  setSortType(state, payload) {
    state.sortType = payload
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
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    let d = res.data;

    for (let i = 0; i < d.length; i++) {
      d[i].tasks.sort((a, b) => {
        return a.order - b.order;
      })
    }

    ctx.commit('fetchSections', d);
  },

  async fetchProjectSections(ctx, projectId) {
    const res = await this.$axios.$get('/section/project/' + projectId, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchProjectSections', res.data);
    }
  },

  setSections(ctx, payload) {
    ctx.commit('setSections', payload)
  },

  setSortType(ctx, payload) {
    ctx.commit('setSortType', payload)
  },

  async createSection(ctx, payload) {
    const res = await this.$axios.$post('/section', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createSection', res.data)
  },

  // sortSections(ctx, payload) {
  //   ctx.commit('sortSections', payload)
  // }  
};
