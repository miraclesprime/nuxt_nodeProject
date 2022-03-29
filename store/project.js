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

  // get favorite projects
  getFavProjects(state) {
    let fav = []
    state.favProjects.map(f => {
      fav.push({ label: f.projects.title, icon: "folder-solid", id: f.projects.id })
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

  sortProjects(state, payload) {

    // sort By Project Name
    if (payload.key == 'name' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects));
      arr.sort((a, b) => a.title.localeCompare(b.title));
      state.projects = arr;
    }

    if(payload.key == 'name' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects));
      arr.sort((a, b) => b.title.localeCompare(a.title));
      state.projects = arr;
    }

    // Sort By Project Owner Name
    if (payload.key == 'owner' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      state.projects = arr;
    }

    if (payload.key == 'owner' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
      state.projects = arr;
    }


    // Sort By Status
    if (payload.key == 'status' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].statusId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.status && b.status) {
          return a.status.text.localeCompare(b.status.text)
        }
      });
      state.projects = newArr;

    }

    if (payload.key == 'status' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].statusId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.status && b.status) {
          return b.status.text.localeCompare(a.status.text)
        }
      });
      state.projects = newArr;

    }

    // Sort By Start Date
    if (payload.key == 'startDate' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      state.projects = arr;

    }

    if (payload.key == 'startDate' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.projects = arr;

    }

    // Sort By Due Date
    if (payload.key == 'dueDate' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dueDate) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          new Date(a.dueDate) - new Date(b.dueDate)
        }
      });
      state.projects = newArr;
    }

    if (payload.key == 'dueDate' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dueDate) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          new Date(b.dueDate) - new Date(a.dueDate)
        }
      });
      state.projects = newArr;
    }

    // Sort By Priority
    if (payload.key == 'priority' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].priorityId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.priority && b.priority) {
          return a.priority.text.localeCompare(b.priority.text)
        }
      });
      state.projects = newArr;
    }

    if (payload.key == 'priority' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].priorityId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.priority && b.priority) {
          return b.priority.text.localeCompare(a.priority.text)
        }
      });
      state.projects = newArr;
    }

  },

};

export const actions = {

  // for dispatch fetching projects
  async fetchProjects(ctx, payload) {
    const res = await this.$axios.$get(`/project/company/${JSON.parse(window.localStorage.getItem('user')).subb}`, {
      headers: { 'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`, 'Filter': payload ? payload : 'all' }
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
      userId: payload.userId,
      statusId: null,
      title: payload.title,
      description: null,
      dueDate: null,
      priority: null,
      budget: null,
    }, {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    console.log(res.data)
    if (res.statusCode == 200) {
      ctx.commit('createProject', res.data);
      // ctx.commit('setSingleProject', res.data);
    }
  },

  async setFavProjects(ctx) {
    try {
      const fav = await this.$axios.$get("/project/user/favorites", {
        headers: {
          "Authorization": `Bearer ${ctx.rootState.token.token}`
        }
      })
      if (fav.statusCode == 200) {
        ctx.commit("SETFAVPROJECTS", fav.data)
      } else {
        ctx.commit("SETFAVPROJECTS", [])
      }
    } catch (e) {
      console.log(e);
    }
  },

  sortProjects(ctx, payload) {
    ctx.commit('sortProjects', payload)
  },

}
