// import { mapTasks } from "services/task";

export const state = () => ({
  tasks: [],
  selectedTask: {},
  favTasks: [],
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
  getFavTasks(state) {
    return state.favTasks
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

  setSingleTask(state, currentTask) {
    state.selectedTask = currentTask;
  },

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

  async updateTaskStatus(ctx, payload) {
    if (payload.value.statusId !== 5) {
      const res = await this.$axios.$put('/task', {
        id: payload.value.id,
        data: {
          statusId: 5
        }
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
    }

    if (payload.value.statusId == 5) {
      const res = await this.$axios.$put('/task', {
        id: payload.value.id,
        data: {
          statusId: 2
        }
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
    }

    ctx.dispatch("fetchTasks", { id: ctx.rootState.project.selectedProject.id, filter: 'all' })

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

};
