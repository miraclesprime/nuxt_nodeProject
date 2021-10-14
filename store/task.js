import { mapTasks } from 'services/task';

import { DUMMY_TASKS } from 'dummy/tasks';

export const state = () => ({
  list: [],
  single: undefined,
});

export const mutations = {
  initialize (state, list) {
    state.list = [...(list || [])];
  },
  
  add (state, task) {
    state.list.push(task);
  },

  remove (state, taskId) {
    state.list = state.list.filter(task => task.id !== taskId);
  },

  update (state, updatedTask) {
    state.list = state.list.map(task => task.id === updatedTask.id ? updatedTask : task);
  },
};

export const getters = {
  tasksForListView (state) {
    return state.list;
  },
  tasksForOverview (state) {
    
  }
};

export const actions = {
  async fetchTasks (ctx) {
    // const res = await this.$axios.$get('/task?page=1&limit=99999');
    // ctx.commit('initialize', mapTasks(res.data));
    ctx.commit('initialize', DUMMY_TASKS);
  },
};
