export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: []
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

  sortCompanyTasks(state, payload) {

    // sort By Title
    if (payload.sName == 'name' && payload.order == 'asc') {
      state.companyTasks.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (payload.sName == 'name' && payload.order == 'desc') {
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

    // sort by owner
    if (payload.sName == 'owner' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].user) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.user && b.user) {
          return a.user.firstName - b.user.firstName;
        }
      });
      state.companyTasks = newArr;

      // state.companyTasks.sort((a,b) => a.user.firstName.localeCompare(b.user.firstName))
    }

    if (payload.sName == 'owner' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].user) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.user && b.user) {
          return b.user.firstName - a.user.firstName;
        }
      });
      state.companyTasks = newArr;

      // state.companyTasks.sort((a,b) => b.user.firstName.localeCompare(a.user.firstName))
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
            return a.priority.text.localeCompare(b.priority.text);
          }
        });
      } else {
        newArr.sort((a, b) => {
          if (a.priority && b.priority) {
            return b.priority.text.localeCompare(a.priority.text);
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
      // console.log(res.data)
      let cu = res.data.map(u => u.user)
      ctx.commit("fetchCompanyMembers", cu)
    } else {
      console.log(res);
    }
  },
  async setCompanyTasks(ctx, payload) {
    const res = await this.$axios.$get(`company/${payload.companyId}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setCompanyTasks', res.data);
      return res.data
    }
  },

  sortCompanyTasks(ctx, payload) {
    ctx.commit('sortCompanyTasks', payload)
  }
};
