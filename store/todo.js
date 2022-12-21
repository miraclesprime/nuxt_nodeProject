export const strict = false;

export const state = () => ({
  todos: [],
});

export const getters = {

  getAllTodos(state) {
    return state.todos;
  },

};

export const mutations = {

  fetchTodos(state, payload) {
    state.todos = payload.sort((a, b) => a.uOrder - b.uOrder)
  },

  createTodo(state, payload) {
    state.todos.push(payload)
  },

  setTodos(state, payload) {
    state.todos = payload;
  },

};

export const actions = {

  async fetchTodos(ctx, payload) {
    const res = await this.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter ? payload.filter : 'all' }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchTodos', res.data);
    }

    return res
  },


  setTodos(ctx, payload) {
    ctx.commit('setTodos', payload)
  },

  async createTodo(ctx, payload) {
    const res = await this.$axios.$post('/todo', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createTodo', res.data)
    return res
  },

  async renameTodo(ctx, payload) {

    const res = await this.$axios.$put("/todo", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })

    return res
  },

  async deleteTodo(ctx, payload) {
    const res = await this.$axios.$delete("/todo", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id }
    })

    return res
  },

  sortTodoTasks(ctx, payload) {
    ctx.commit('sortTodoTasks', payload)
  }

};
