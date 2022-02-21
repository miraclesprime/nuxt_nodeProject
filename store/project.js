export const state = () => ({
  projects: [],
  selectedProject: {},
  favProjects: [],
});

export const getters = {

  // get projects
  getAllProjects(state) {
    return state.projects;
  },

  // get single project detail
  getSingleProject(state) {
    return state.selectedProject;
  },
  getFavProjects(state) {
    let fav = []
    state.favProjects.map(f=>{
      fav.push({label: f.projects.title, icon: "folder-solid", id: f.projects.id })
    })
    return fav
  }

};

export const mutations = {

  // To fetch all projects
  fetchProjects(state, payload) {
    state.projects = payload;
  },

  // To set a single project
  setSingleProject(state, currentProject) {
    state.selectedProject = currentProject;
  },

  // To create project
  createProject(state, payload) {
    state.projects.push(payload)
  },
  SETFAVPROJECTS(state, payload) {
    state.favProjects = payload
  },
};

export const actions = {

  // for dispatch fetching projects
  async fetchProjects(ctx) {
    const res = await this.$axios.$get(`/project/company/${ctx.rootState.user.user.subb}`, {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    ctx.commit('fetchProjects', res.data);
  },

  // for dispatching setting single project object
  setSingleProject(ctx, payload) {
    ctx.commit('setSingleProject', payload)
  },

  // create project 
  async createProject(ctx, payload) {
    const res = await this.$axios.$post('/project', {
      statusId: null,
      title: payload,
      description: null,
      dueDate: null,
      priority: null,
      budget: null,
    }, {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    ctx.commit('createProject', res.data);
    ctx.commit('setSingleProject', res.data);
    // if (window.history.pushState) {
    //   const newURL = new URL(window.location.href);
    //   newURL.search = `?project=${res.data.title}`;
    //   window.history.pushState({ path: newURL.href }, '', newURL.href);
    // }
  },

  async setFavProjects(ctx) {
    try {
      const fav = await this.$axios.$get("/project/user/favorites", {
        headers: {
          "Authorization": `Bearer ${ctx.rootState.token.token}`
        }
      })
      if (fav) {
        ctx.commit("SETFAVPROJECTS", fav)
      } else {
        ctx.commit("SETFAVPROJECTS", [])
      }
    } catch (e) {
      console.log(e);
    }
  }
}
