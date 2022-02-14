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

export const getters = {
  tasksForListView(state) {
    return state.list;
  },
  tableFields(state) {
    return state.TABLE_FIELDS;
  },
  // getAllTasks(state) {
  //   return state.tasks.filter((task) => {
  //     return task.isDeleted !== true;
  //   });
  // },
  getSelectedTask(state) {
    return state.selectedTask;
  },
  getSingleTask(state) {
    return state.selectedTask;
  },
  tasksForOverview(state) {}
};

export const actions = {
  // fetch all tasks
  // async fetchTasks(ctx) {
  //   const res = await this.$axios.$get('/task?page=1&limit=99999', {
  //     headers: {'Authorization': `${ctx.rootState.token.token}`}
  //   });
  //   ctx.commit('fetchTasks', res.data);
  // },

  // set single task
  setSingleTask(ctx, payload) {
    ctx.commit('setSingleTask', payload)
  },

  // create Task
  async createTask(ctx) {
    const res = await this.$axios.$post('/task', {
      headers: {'Authorization': `${ctx.rootState.token.token}`}
    });
    ctx.commit('createTask', res.data);
  }
};
