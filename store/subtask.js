export const state = () => ({
  subTasks: [],
  selectedSubTask: {},
  subtaskComments: [],
  subtaskHistory: [],
  favSubtasks: [],
  subtaskMembers: [],
});

export const getters = {
  getSubTasks(state) {
    return state.subTasks;
  },

  getSelectedSubTask(state) {
    return state.selectedSubTask;
  },

  getSubTaskComments(state) {
    return state.subtaskComments
  },

  getSubtaskHistory(state) {
    return state.subtaskHistory
  },

  getFavSubtasks(state) {
    return state.favSubtasks
  },

  getSubtaskMembers(state) {
    return state.subtaskMembers
  }
};

export const mutations = {

  fetchSubTasks(state, payload) {
    state.subTasks = payload
  },

  createSubTask(state, payload) {
    state.subTasks.push(payload);
  },

  setSelectedSubtask(state, payload) {
    state.selectedSubTask = payload;
  },

  setFavSubtasks(state, payload) {
    state.favSubtasks = payload
  },

  setSubtaskMembers(state, payload) {
    state.subtaskMembers = payload
  },

  updateSingleSubtask(state, payload) {
    let idx = state.subTasks.findIndex(st => st.id == payload.id)
    state.subTasks[idx] = payload
    // console.log(payload, idx)
  },

  createSubtaskComment(state, payload) {
    state.subtaskComments.push(payload)
  },

  setSubtaskHistory(state, payload) {
    state.subtaskHistory = payload
  },

  fetchSubtaskComments(state, payload) {
    state.subtaskComments = payload;
  },
};

export const actions = {

  // fetch all SubTasks
  async fetchSubtasks(ctx, payload) {
    const res = await this.$axios.$get('/subtask/task/' + payload.id, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    if (res.statusCode == 200) {
      ctx.commit('fetchSubTasks', res.data);
    }
  },

  async fetchSubTask(ctx, payload) {
    const res = await this.$axios.$get("/subtask/" + payload.id, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    if (res.statusCode == 200) {
      ctx.commit("setSelectedSubtask", res.data)
    }
    return res.data;
  },

  setSelectedSubtask(ctx, payload) {
    ctx.commit("setSelectedSubtask", payload)
  },

  // create subtask
  async createSubtask(ctx, payload) {
    const res = await this.$axios.$post('/subtask', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('createSubTask', res.data);
    }
    return res.data
  },

  // update subtask
  async updateSubtask(ctx, payload) {
    const res = await this.$axios.$put("/subtask", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    if (res.statusCode == 200) {
      ctx.commit("updateSingleSubtask", res.data)
      ctx.commit("setSelectedSubtask", res.data)
    }
    return res
  },

  // delete subtask
  async deleteSubtask(ctx, payload) {
    try {
      const delsub = await this.$axios.$delete("/subtask/" + payload.id, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          "text": payload.text,
          "taskid": payload.taskId,
          "userid": payload.userId
        }
      })
      return delsub
    } catch (e) {
      console.log(e);
      return e
    }
  },

  async removeFromFavorite(ctx, payload){
    try {
      const stf = await this.$axios.delete(`subtask/${payload.id}/favorite`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      return stf.data
    } catch(e) {
      console.warn(e);
    }
  },

  async fetchFavorites(ctx) {
    try {
      const favsub = await this.$axios.get("subtask/user/favorites", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      ctx.commit("setFavSubtasks", favsub.data.data)
      return favsub.data
    } catch (e) {
      console.warn(e);
    }
  },

  async addMembers(ctx, payload) {
    let data;
    if (ctx.getters.getSubtaskMembers.length < 1) {
      data = payload.team;
    } else {
      data = payload.team.filter((el1) => {
        if (ctx.getters.getSubtaskMembers.some((el2) => el2.id != el1.id)) {
          return el1;
        }
      })
    }
    try {
      const stm = await this.$axios.post("subtask/" + payload.id + "/members", { users: data, text: payload.text }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      return stm.data
    } catch (e) {
      console.warn(e);
    }
  },

  async fetchSubtaskMembers(ctx, payload) {
    const st = await this.$axios.get("subtask/" + payload.id + "/members", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    })
    if (st.data.statusCode == 200) {
      let team = st.data.data.members;

      let data = team.map((el) => {
        if (payload.userId == el.user.id) {
          el.isOwner = true
        } else {
          el.isOwner = false
        }
        return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName, isOwner: el.isOwner };
      });
      ctx.commit("setSubtaskMembers", data)
    }
    return st.data
  },

  async deleteMember(ctx, payload) {
    try {
      let m = await this.$axios.delete(`/subtask/${payload.id}/members`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "userId": payload.memberId,
          "text": payload.text,
        }
      })
      return m.data
    } catch (e) {
      console.log(e);
    }
  },

  async fetchSubtaskComments(ctx, payload) {
    try {
      let res = await this.$axios.get(`/subtask/${payload.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })
      if (res.data.statusCode == 200) {
        ctx.commit("fetchSubtaskComments", res.data.data)
        return res.data;
      } else {
        return res.data;
      }

    } catch (e) {
      console.log(e);
    }
  },

  async createSubtaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$post(`/subtask/${payload.id}/comments`, {
        comment: payload.comment,
        text: payload.text,
        isHidden: true,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.commit('createSubtaskComment', res.data);
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async updateSubtaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$put(`/subtask/${payload.subtaskId}/comments/${payload.commentId}`, {
        comment: payload.comment,
        text: payload.text,
        isHidden: true,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchSubtaskComments", { id: payload.subtaskId })
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async deleteSubtaskComment(ctx, payload) {
    try {
      const res = await this.$axios.$delete(`/subtask/${payload.subtaskId}/comments/${payload.commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          "text": payload.text,
          "isHidden": true,
          "userid": payload.userId
        }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchSubtaskComments", { id: payload.subtaskId })
        return res
      } else {
        return res
      }

    } catch (e) {
      console.log(e)
    }
  },

  async fetchSubtaskHistory(ctx, payload) {
    try {
      const hist = await this.$axios.get("/history/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify({ "subtaskId": payload.id })
        }
      })
      if (hist.data.statusCode == 200) {
        ctx.commit("setSubtaskHistory", hist.data.data)
      }
      return hist.data.data
    } catch (e) {
      console.log(e);
    }
  },

};
