export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: [],
  sortName: "title",
  sortOrder: "asc",
});

export const getters = {

  getAllCompanies(state) {
    return state.companies;
  },
  getCompanyMembers(state) {
    return state.companyMembers
  },
  getCompanyTasks(state) {
    return state.companyTasks;
  },
  getSortName(state){
    return state.sortName
  },
  getSortOrder(state){
    return state.sortOrder
  }

};

export const mutations = {

  fetchCompanies(state, payload) {
    state.companies = payload;
  },

  fetchCompanyMembers(state, payload) {
    state.companyMembers = payload;
  },

  setCompanyTasks(state, payload) {
    state.companyTasks = payload;
  },

  setSortName(state, payload){
    state.sortName = payload
  },

  setSortOrder(state, payload){
    state.sortOrder = payload
  },

  sortCompanyTasks(state, payload) {
    // console.log(payload)
    state.sortName = payload.sName
    state.sortOrder = payload.order

    // sort By Title
    if (payload.sName == 'title' && payload.order == 'asc') {
      state.companyTasks.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (payload.sName == 'title' && payload.order == 'desc') {
      state.companyTasks.sort((a, b) => b.title.localeCompare(a.title))
    }

    // sort By Status
    if (payload.sName == "status") {
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].status) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      if (payload.order == "asc") {
        newArr.sort((a, b) => {
          if (a.status && b.status) {
            return a.status.text.localeCompare(b.status.text);
          }
        })
      } else {
        newArr.sort((a, b) => {
          if (a.status && b.status) {
            return b.status.text.localeCompare(a.status.text);
          }
        })
      }

      state.companyTasks = newArr;
    }

    // sort by project
    if (payload.sName == 'project' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].project[0]) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.project[0] && b.project[0]) {
          return a.project[0].project.title.localeCompare(b.project[0].project.title);
        }
      });
      state.companyTasks = newArr;

    }

    if (payload.sName == 'project' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].project[0]) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.project[0] && b.project[0]) {
          return b.project[0].project.title.localeCompare(a.project[0].project.title);
        }
      });
      state.companyTasks = newArr;

    }

    // sort by owner
    if (payload.sName == 'userId') {
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].user) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }
      if (payload.order == 'asc') {
        newArr.sort((a, b) => {
          if (a.user && b.user) {
            return a.user.firstName.localeCompare(b.user.firstName);
          }
        });
        state.companyTasks = newArr;
      } else {
        newArr.sort((a, b) => {
          if (a.user && b.user) {
            return b.user.firstName.localeCompare(a.user.firstName);
          }
        });
        state.companyTasks = newArr;
      }

    }

    // sort by due date
    if (payload.sName == 'startDate' && payload.order == 'asc') {
      state.companyTasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    }

    if (payload.sName == 'startDate' && payload.order == 'desc') {
      state.companyTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    }

    // sort by due date
    if (payload.sName == 'dueDate' && payload.order == 'asc') {
      state.companyTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }

    if (payload.sName == 'dueDate' && payload.order == 'desc') {
      state.companyTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    }

    // sort by priority
    if (payload.sName == "priority") {
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].priority) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }
      if (payload.order == "asc") {
        newArr.sort((a, b) => {
          if (a.priority && b.priority) {
            return a.priority.id- b.priority.id;
          }
        });
      } else {
        newArr.sort((a, b) => {
          if (a.priority && b.priority) {
            return b.priority.id- a.priority.id;
          }
        });
      }
      state.companyTasks = newArr;
    }
  }
};

export const actions = {

  async fetchCompanies(ctx) {
    const res = await this.$axios.$get('/company', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    });
    ctx.commit('fetchCompanies', res.data);
  },

  async fetchCompanyMembers(ctx, companyId) {
    const res = await this.$axios.$get("/company/" + companyId + "/members/", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    })
    if (res.statusCode == 200) {
      let cu = res.data.map(u => u.user)
      ctx.commit("fetchCompanyMembers", cu)
    } else {
      return res
    }
  },
  
  async fetchCompanyTasks(ctx, payload) {
    const res = await this.$axios.$get(`company/${payload.companyId}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setCompanyTasks', res.data);
      // ctx.commit('sortCompanyTasks', { sName: ctx.state.sortName, order: ctx.state.sortOrder })
      return res.data
    }
  },

  sortCompanyTasks(ctx, payload) {
    // console.log(payload)
    ctx.commit('sortCompanyTasks', payload)
  }
};
