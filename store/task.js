export const state = () => ({
  tasks: [],
  selectedTask: {},
  favTasks: [],
  taskMembers: [],
  teamKey: 1,
  taskComments: [],
  singleTaskComment: {},
  taskHistory: [],
  sidebarVisible: false,
  expandVisible:true,
  filterView:"all",
  gridType:"list",
  groupByValue:"department",

});

export const getters = {
  getSidebarVisible(state){
    return state.sidebarVisible
  },
  tasksForListView(state) {
    return state.tasks;
  },
  getExpandVisible (state) {
    return state.expandVisible
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
  },
  getFilterView (state) {
    return state.filterView
  },
  getGridType(state){

    return state.gridType
  },
  getGroupBy (state) {
    return state.groupByValue 
  },
 

};

export const mutations = {

  setGroupBy(state,payload) {
    state.groupByValue=payload
  },
  gridType(state,payload){
    state.gridType=payload.gridType
  },
  setExpandVisible(state,payload) {
    state.expandVisible=payload
  },
  setSidebarVisible(state, payload){
    state.sidebarVisible = payload
  },
  setFilterView (state,payload) {
    state.filterView=payload.filter
  },
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
      // if(state.selectedTask.userId){
      //   state.taskMembers=payload.filter((item)=>item.id!==state.selectedTask.userId)
      
      //   }
      //   else {
          state.taskMembers=payload
        // }
  },

  // addMember(state, payload) {
  //   if(state.selectedTask.userId){
  //     state.taskMembers=payload.filter((item)=>item.id!==state.selectedTask.userId)
  //     }
  //     else {
  //       state.taskMembers=payload
  //     }
  // },

  setKey(state) {
    state.teamKey += 1;
  },

  setTaskHistory(state, payload) {
    state.taskHistory = payload
  }

};

export const actions = {
  setSidebarVisible(ctx, payload){
    ctx.commit("setSidebarVisible", payload)
  },

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
    return res.data
  },

  // create Task
  async createTask(ctx, payload) {
    console.log("pay",payload)
    const res = await this.$axios.$post('/task', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('createTask', res.data);
      ctx.commit("section/addTaskToSection", res.data, { root: true });
    }
    return res
  },

  async updateTask(ctx, payload) {
    /*if(payload.title == "") {
      throw new Error("Task can't have empty Value")
    }*/
    const res = await this.$axios.$put("/task", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    ctx.commit('setSingleTask', res.data)

    return res.data
    
  },

  async deleteTask(ctx, payload) {
    const res = await this.$axios.$delete("/task", {
      headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id, task: payload, retainSubtasks: payload.retainSubtasks, text: `task "${payload.title}" deleted` },
    })
    return res
  },

  async updateTaskStatus(ctx, payload) {
    if (payload.statusId !== 5) {
      const res = await this.$axios.$put('/task', {
        id: payload.id,
        projectId:  payload.project?.[0]?.project?.id,
        data: { statusId: 5, isDone: true },
        text: "updated status to Done"
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      return res.data
    }

    if (payload.statusId == 5) {
      const res = await this.$axios.$put('/task', { 
        id: payload.id,
        projectId:  payload.project?.[0]?.project?.id,
        data: { statusId: 2, isDone: false },
        text: 'Updated the status to In-progress'
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      
    return res.data
    }

  },

  async addToFavorite(ctx, payload) {

    try {
      let fav = await this.$axios.post(`/task/${payload.id}/favorite`, {}, {
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
      
      let team = tm.data.data.members;
      // console.log(payload)

      let data = team.map((el) => {
        if (payload.userId == el.user.id) {
          el.isOwner = true
        } else {
          el.isOwner = false
        }
        return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName, isOwner: el.isOwner, email: el.user.email };
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
    const res = await this.$axios.post(`/task/${payload.taskId}/members`, { users: data, text: payload.text }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    // console.log(res.data)
    if(res.data.statusCode == 200) {
      let team = res.data.data.members;
      let data = team.map((el) => {
        return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName };
      });
      ctx.commit('fetchTeamMember', data);
    } else {
      console.warn('add member->', err)
    }

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
      let res = await this.$axios.get(`/task/${payload.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if (res.data.statusCode == 200) {
        ctx.dispatch("fetchTaskComments")
        return res.data.data;
      } else {
        return res.data.data;
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
        isHidden: false,
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
        isHidden: true,
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
          "isHidden": true,
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
        ctx.commit("setTaskHistory", hist.data)
      }
      return hist.data
    } catch (e) {
      console.log(e);
    }
  },
  async addCommentReaction(ctx, payload){
    try {
      const res = await this.$axios.post(`/task/${payload.taskCommentId}/reaction`, {
        reaction: payload.reaction,
        taskId: payload.taskId,
        text: payload.text
      }, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      })
      return res.data
    } catch(e) {
      console.warn(e);
    }
  },
  async fetchCommentReactions(ctx, payload){
    try {
      const react = await this.$axios.get('/task/' + payload.id + "/reactions", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
       })
      // console.log(react.data)
      if (react.data.statusCode == 200) {
        return react.data.data
      }
    } catch(e) {
      console.warn(e);
    }
  },
  async deleteCommentReaction(ctx, payload){
    try {
      const del = await this.$axios.delete(`/task/${payload.taskCommentId}/reaction`, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") },
        data: { reactionId: payload.reactionId, userId: payload.userId },
      })
      // console.log(del)
      return del.data
    } catch(e) {
      console.log(e);
      // throw new Error(e)
    }
  }
};
