
export const state = () => ({
    goals: [],
    selectedGoal: {},
  });
  
  export const getters = {
    getGoals(state) {
      return state.goals;
    },
  
    getSelectedGoal(state) {
      return state.selectedGoal;
    },
  };
  
  export const mutations = {
  
    fetchGoals(state, payload) {
      state.goals = payload
    },
  
    createGoal(state, payload) {
      state.goals.push(payload);
    },
  
    setSingleGoal(state, currentGoal) {
      state.selectedGoal = currentGoal;
    },
  };
  
  export const actions = {
    // fetch all Goals
    async fetchGoals(ctx, payload) {
      const res = await this.$axios.$get(`/goal/company/${JSON.parse(localStorage.getItem('user')).subb}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log(res)
      if (res.statusCode == 200) {
        ctx.commit('fetchGoals', res.data);
      }
    },
  
    // set single Goal
    setSingleGoal(ctx, payload) {
      ctx.commit('setSingleGoal', payload)
    },
  
    // create Goal
    async createGoal(ctx, payload) {
      const res = await this.$axios.$post('/goal', payload, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // console.log("create task response =>", res)
  
      if (res.statusCode == 200) {
        ctx.commit('createGoal', res.data);
      }
      return res.data
    },
    
  };
  