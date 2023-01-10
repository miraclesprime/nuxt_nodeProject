export const state = () => ({
  user: null,
  user2: null,
  teamMembers: [],
  appMembers: [],
  userTasks: [],
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
      members.push({ label: t.FirstName + ' ' + t.LastName, firstName: t.FirstName, lastName: t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo, selected: false })
    })
    return members
  },

  getAppMembers(state){
    let appmembers = []
    state.appMembers.map(t => {
      appmembers.push({ label: t.FirstName + ' ' + t.LastName, firstName: t.FirstName, lastName: t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo, selected: false })
    })
    return appmembers
  },

  getUserTasks(state) {
    return state.userTasks;
  },

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
  },

  setAppMembers(state, payload) {
    state.appMembers = payload;
  },

  setUserTasks(state, payload) {
    state.userTasks = payload
  },

  sortUserTasks(state, payload) {

    // sort By Title
    if (payload.sName == 'name' && payload.order == 'asc') {
      state.userTasks.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (payload.sName == 'name' && payload.order == 'desc') {
      state.userTasks.sort((a, b) => b.title.localeCompare(a.title))
    }

    // sort By Project
    if (payload.sName == 'projectId' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.userTasks))
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
          return a.project[0].project.title.localeCompare(b.project[0].project.title)
        }
      });
      state.userTasks = newArr;

    }

    if (payload.sName == 'projectId' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.userTasks))
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
          return b.project[0].project.title.localeCompare(a.project[0].project.title)
        }
      });
      state.userTasks = newArr;

    }

    // sort By Status
    if (payload.sName == "status") {
      let arr = JSON.parse(JSON.stringify(state.userTasks))
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

      state.userTasks = newArr;
    }

    // sort by create date
    if (payload.sName == 'createdAt' && payload.order == 'asc') {
      state.userTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }

    if (payload.sName == 'createdAt' && payload.order == 'desc') {
      state.userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // sort by due date
    if (payload.sName == 'dueDate' && payload.order == 'asc') {
      state.userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }

    if (payload.sName == 'dueDate' && payload.order == 'desc') {
      state.userTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    }

    // sort by priority
    if (payload.sName == "priority") {
      let arr = JSON.parse(JSON.stringify(state.userTasks))
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
      state.userTasks = newArr;
    }

  },
  
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

    if(JSON.parse(localStorage.getItem('user')).subr == 'USER') {
        const userlist = await this.$axios.$get("/user/list", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
        })
        if (userlist.statusCode == 200) {
          let userTeam = members.filter(u => {
            if(userlist.data.userIds.includes(u.Id)) {
              return u
            }
          })
          ctx.commit("setAppMembers", userTeam)
        }  
    } else {
      ctx.commit("setAppMembers", members)
    }
    
  },

  async setUserTasks(ctx, payload) {
    const res = await this.$axios.$get('user/tasks', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setUserTasks', res.data);
      return res.data
    }
  },

  sortUserTasks(ctx, payload) {
    ctx.commit('sortUserTasks', payload)
  },

  
};