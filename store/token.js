
export const state = () => ({
    token: null,
    // token: ''
  });
  
  export const mutations = {
    setToken(state, payload) {
        state.token = payload;
    }
  };
  
  export const getters = {
    getToken(state) {
        return state.token;
    }
  };
  
  export const actions = {
    async setToken(ctx, payload){
        await ctx.commit('setToken', payload);
    }
  };
  