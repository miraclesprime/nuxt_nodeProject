export const state = () => ({
  subTasks: [],
  selectedSubTask: {},
  subtaskComments: [],
  singleSubtaskComment: {},
});

export const getters = {
  getSubTasks(state) {
    return state.subTasks;
  },

  getSelectedSubTask(state) {
    return state.selectedSubTask;
  },
};

export const mutations = {

  fetchSubTasks(state, payload) {
    state.subTasks = payload
  },

  createSubTask(state, payload) {
    state.subTasks.push(payload);
  },

  setSingleSubTask(state, currentTask) {
    state.selectedSubTask = currentTask;
  },

  createSubtaskComment(state, payload) {
    state.subtaskComments.push(payload)
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

  // set single SubTask
  setSingleSubTask(ctx, payload) {
    ctx.commit('setSingleSubTask', payload)
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

  async fetchSubtaskComments(ctx, payload) {
    try {
      let res = await this.$axios.get(`/subtask/${payload.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if (res.data.statusCode == 200) {
        ctx.dispatch("fetchSubtaskComments")
        return res.data.data;
      } else {
        return res.data.data;
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

};
