// import { mapTasks } from "services/task";

export const state = () => ({
  tasks: [],
  selectedTask: {},
  taskInfo: {
    section: "",
    title: "",
    priority: "",
    progress: "",
    status: "",
    assignee: "",
    budget: "",
    description: "",
    dueDate: "2021-02-11",
  },
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
};

export const mutations = {
  initialize(state, list) {
    state.list = [...(list || [])];
  },

  fetchTasks(state, payload) {
    state.tasks = payload;
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

  setSingleTask(state, currentTask) {
    state.selectedTask = currentTask;
  }
};

export const actions = {
  // fetch all tasks
  /*async fetchTasks(ctx) {
    const res = await this.$axios.$get('/task?page=1&limit=99999', {
      headers: {'Authorization': `${ctx.rootState.token.token}`}
    });
    ctx.commit('fetchTasks', res.data);
  },*/

  // set single task
  setSingleTask(ctx, payload) {
    ctx.commit('setSingleTask', payload)
  },

  // create Task
  async createTask(ctx, payload) {
    const res = await this.$axios.$post('/task', payload, {
      headers: {'Authorization': `Bearer ${ctx.rootState.token.token}`}
    });
    ctx.commit('createTask', res.data);
  }
};
