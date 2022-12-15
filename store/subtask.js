export const state = () => ({
  subTasks: [],
  selectedSubTask: {},
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

  // create Task
  async createSubtask(ctx, payload) {
    const res = await this.$axios.$post('/subtask', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('createSubTask', res.data);
    }
    return res.data
  },

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

};
