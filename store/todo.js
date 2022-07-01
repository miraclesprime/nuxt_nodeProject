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
    state.sections = payload;
  },

  createTodo(state, payload) {
    state.todos.push(payload)
  },

  setTodos(state, payload) {
    state.todos = payload;
  }

};

export const actions = {
  async fetchSections(ctx) {
    const res = await this.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    let d = res.data;

    for (let i = 0; i < d.length; i++) {
      d[i].tasks.sort((a, b) => {
        return a.order - b.order;
      })
    }

    ctx.commit('fetchTodos', d);
  },


  setTodos(ctx, payload) {
    ctx.commit('setTodos', payload)
  },

  async createTodo(ctx, payload) {
    const res = await this.$axios.$post('/todo', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createTodo', res.data)
  },

  async renameTodo(ctx, payload){

    const res = await this.$axios.$put("/todo", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    
    return res
  },

  async deleteTodo(ctx, payload){
   const res = await this.$axios.$delete("/todo", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id }
    })
    
    return res 
  },

};
