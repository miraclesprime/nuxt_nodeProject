
export const state = () => ({
    dreams: [],
    selectedDream: {},
  });
  
  export const getters = {
    getDreams(state) {
      return state.dreams;
    },
  
    getSelectedDream(state) {
      return state.selectedDream;
    },
  };
  
  export const mutations = {
  
    fetchDreams(state, payload) {
      state.dreams = payload
    },
  
    createDream(state, payload) {
      state.dreams.push(payload);
    },
  
    setSingleGoal(state, currentDream) {
      state.selectedDream = currentDream;
    },
  };
  
  export const actions = {
    // fetch all Dreams
    async fetchDreams(ctx, payload) {
      const res = await this.$axios.$get(`/dream/company/${JSON.parse(localStorage.getItem('user')).subb}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // console.log(res)
      if (res.statusCode == 200) {
        ctx.commit('fetchDreams', res.data);
      }
    },
  
    // set single Dream
    setSingleDream(ctx, payload) {
      ctx.commit('setSingleDream', payload)
    },
  
    // create Dream
    async createDream(ctx, payload) {
      const res = await this.$axios.$post('/dream', payload, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // console.log("create dream response =>", res)
  
      if (res.statusCode == 200) {
        ctx.commit('createDream', res.data);
      }
      return res.data
    },
    
  };
  