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
    let arr = payload.map(t=>{
      return t.task
    });
    state.tasks = arr;
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

  // create Task
  async createTask(ctx, payload) {
    const res = await this.$axios.$post('/task', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createTask', res.data);
    ctx.commit("section/addTaskToSection", res.data, { root: true });
  },

  async updateTaskStatus(ctx, payload) {

    if(payload.value.statusId !== 5) {
      const res = await this.$axios.$put('/task', {
        id: payload.value.id,
        data: {
          statusId: 5
        }
      }, 
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
    }

    if(payload.value.statusId == 5) {
      const res = await this.$axios.$put('/task', {
        id: payload.value.id,
        data: {
          statusId: 2
        }
      }, 
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
    }
    
    ctx.dispatch("fetchTasks", {id: ctx.rootState.project.selectedProject.id, filter: 'all' })

  },


  async addToFavorite(ctx, payload) {
    
    try {

      let fav = await this.$axios.post(`/task/${payload.id}/favorite`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if(fav.data.statusCode == 200) {
        console.log('Added To Favorites')
      } else {
        console.log(fav.data.message)
      }

    } catch(e) {
      console.log(e);
    }
  },


  async removeFromFavorite(ctx, payload) {
    
    try {

      let fav = await this.$axios.delete(`/task/${payload.id}/favorite`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if(fav.data.statusCode == 200) {
        console.log('Removed From Favorites')
      } else {
        console.log(fav.data.message)
      }

    } catch(e) {
      console.log(e);
    }
  }

};
