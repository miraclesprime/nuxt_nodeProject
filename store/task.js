export const state = () => ({
  tasks: [],
  selectedTask: {},
  favTasks: [],
  taskMembers: [],
  teamKey: 1,
  taskComments: [],
  singleTaskComment: {},
  taskHistory: [],

});

export const getters = {
  tasksForListView(state) {
    return state.tasks;
  },

  tableFields(state) {
    return state.TABLE_FIELDS;
  },

  getSelectedTask(state) {
    return state.selectedTask;
  },

  // get task comments
  getProjectComments(state) {
    return state.taskComments;
  },

  getFavTasks(state) {
    return state.favTasks
  },

  getTaskMembers(state) {
    return state.taskMembers;
  },

  getKey(state) {
    return state.teamKey;
  },

  getTaskHistory(state) {
    return state.taskHistory;
  }

};

export const mutations = {
  initialize(state, list) {
    state.list = [...(list || [])];
  },

  fetchTasks(state, payload) {
    let arr = payload.map(t => {
      return t.task
    });
    state.tasks = arr;
  },

  getFavTasks(state, payload) {
    state.favTasks = payload
  },

  add(state, task) {
    state.list.push(task);
  },

  remove(state, taskId) {
    state.list = state.list.filter(task => task.id !== taskId);
  },

  update(state, updatedTask) {
    state.list = state.list.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
  },

  createTask(state, payload) {
    state.tasks.push(payload);
  },


  createTaskComment(state, payload) {
    state.taskComments.push(payload)
  },

  fetchTaskComments(state, payload) {
    state.taskComments = payload;
  },

  fetchSingleTaskDetail(state, payload) {
    state.singleTaskComment = payload
  },

  setSingleTask(state, currentTask) {
    state.selectedTask = currentTask;
  },

  fetchTeamMember(state, payload) {
    state.taskMembers = payload;
  },

  addMember(state, payload) {
    state.taskMembers = payload
  },

  setKey(state) {
    state.teamKey += 1;
  },

  SETTASKHISTORY(state, payload) {
    state.taskHistory = payload
  }

};

export const actions = {
  // fetch all tasks
  async fetchTasks(ctx, payload) {
    const res = await this.$axios.$get('/task/project/' + payload.id, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });
    if (res.statusCode == 200) {
      ctx.commit('fetchTasks', res.data);
    }
  },

  async fetchSingleTask(ctx, taskId){
    const task = await this.$axios.get("/task/"+taskId, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    // console.log('state task->',task.data.data)
    if (task.data.statusCode == 200) {
      ctx.commit('setSingleTask', task.data.data)
    }
    return task.data
  },

  // set single task
  setSingleTask(ctx, payload) {
    ctx.commit('setSingleTask', payload)
  },

  async getFavTasks(ctx) {
    const res = await this.$axios.get("/task/user/favorites", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    if (res.data.statusCode == 200) {
      ctx.commit("getFavTasks", res.data.data)
    }
  },

  // create Task
  async createTask(ctx, payload) {
    const res = await this.$axios.$post('/task', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    // console.log("create task response =>", res)

    if (res.statusCode == 200) {
      ctx.commit('createTask', res.data);
      ctx.commit("section/addTaskToSection", res.data, { root: true });
    }
    return res.data
  },

  async updateTask(ctx, payload) {
    const res = await this.$axios.$put("/task", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return res
  },

  async deleteTask(ctx, payload) {
    // console.log(payload)
    const res = await this.$axios.$delete("/task", {
      headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id, task: payload, text: `task "${payload.title}" deleted` },
    })
    return res
  },

  async updateTaskStatus(ctx, payload) {
    // console.log('update task payload', payload)
    // console.log(payload.project[0].projectId)
    if (payload.statusId !== 5) {
      const res = await this.$axios.$put('/task', { id: payload.id, projectId: ctx.rootState.project.selectedProject.id || payload.project[0].projectId || payload.project[0].project.id, data: { statusId: 5 }, text: 'Updated the status to Done' }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // ctx.dispatch("fetchTasks", { id: ctx.rootState.project.selectedProject.id, filter: 'all' })
      return res.data
    }

    if (payload.statusId == 5) {
      const res = await this.$axios.$put('/task', { id: payload.id, projectId: ctx.rootState.project.selectedProject.id || payload.project[0].projectId || payload.project[0].project.id, data: { statusId: 2 }, text: 'Updated the status to In-progress' }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // ctx.dispatch("fetchTasks", { id: ctx.rootState.project.selectedProject.id, filter: 'all' })
      return res.data
    }

  },

  async addToFavorite(ctx, payload) {
    // console.log(payload)
    try {
      let fav = await this.$axios.post(`/task/${payload.id}/favorite`, {}, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      // console.log(fav)
      if (fav.data.statusCode == 200) {
        // console.log('Added To Favorites')
        ctx.dispatch("getFavTasks")
        return fav.data.message
      } else {
        return fav.data.message
      }
    } catch (e) {
      console.log(e);
    }
  },

  async removeFromFavorite(ctx, payload) {
    try {
      let fav = await this.$axios.delete(`/task/${payload.id}/favorite`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      if (fav.data.statusCode == 200) {
        ctx.dispatch("getFavTasks")
        return fav.data.message
      } else {
        return fav.data.message
      }
    } catch (e) {
      console.log(e);
    }
  },

  async fetchTeamMember(ctx, payload) {
    try {
      const tm = await this.$axios.get(`/task/${payload.id}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      // console.log(tm)
      let team = tm.data.data.members;

      let data = team.map((el) => {
        if (payload.userId == el.user.id) {
          el.isOwner = true
        } else {
          el.isOwner = false
        }
        return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName, isOwner: el.isOwner };
      });
      ctx.commit('fetchTeamMember', data)
      return data
    } catch (e) {
      console.log('fetchTeamMember ->', e);
    }
  },

  async addMember(ctx, payload) {
    let data;
    if (ctx.getters.getTaskMembers.length < 1) {
      data = payload.team;
    } else {
      data = payload.team.filter((el1) => {
        if (ctx.getters.getTaskMembers.some((el2) => el2.id != el1.id)) {
          return el1;
        }
      })
    }
    await this.$axios.post(`/task/${payload.taskId}/members`, { users: data, text: payload.text }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    }).then((res) => {
      let team = res.data.data.members;
      let data = team.map((el) => {
        return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName };
      });
      ctx.commit('addMember', data);
    }).catch((err) => {
      console.log('add member->', err)
    })

  },

  async deleteMember(ctx, payload) {
    try {
      let m = await this.$axios.delete(`/task/${payload.taskId}/members`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "userId": payload.memberId,
          "text": payload.text,
        }
      })

      if (m.data.statusCode == 200) {
        ctx.dispatch("fetchTeamMember", { id: ctx.state.selectedTask.id })
        return m.data.message
      } else {
        return m.data.message
      }
    } catch (e) {
      console.log(e);
    }
  },

  setKey(ctx) {
    ctx.commit('setKey');
  },

  async fetchTaskComments(ctx, payload) {
    try {
      let fav = await this.$axios.get(`/task/${payload.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if (fav.data.statusCode == 200) {
        ctx.dispatch("fetchTaskComments")
        return fav.data.data;
      } else {
        return fav.data.data;
      }

    } catch (e) {
      console.log(e);
    }
  },

  async createTaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$post(`/task/${payload.id}/comments`, {
        comment: payload.comment,
        text: payload.text,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.commit('createTaskComment', res.data);
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async updateTaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$put(`/task/${payload.taskId}/comments/${payload.commentId}`, {
        comment: payload.comment,
        text: payload.text,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchTaskComments", { id: payload.taskId })
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async deleteTaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$delete(`/task/${payload.taskId}/comments/${payload.commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          "text": payload.text,
          "userid": payload.userId
        }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchTaskComments", { id: payload.taskId })
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async fetchSingleTaskDetail(ctx, payload) {
    try {
      const res = await this.$axios.$get(`/project/${payload.taskId}/comments/${payload.commentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchSingleTaskDetail", res.data)
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async fetchHistory(ctx, payload) {
    try {
      const hist = await this.$axios.$get("/history/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify({ "taskId": payload.id })
        }

      })

      if (hist.statusCode == 200) {
        ctx.commit("SETTASKHISTORY", hist.data)
      }
      return hist.data
    } catch (e) {
      console.log(e);
    }
  }
};
