
export const state = () => ({
    user: null
  });
  
  export const mutations = {
    setUser(state, payload) {
        state.user = payload;
    }
  };
  
  export const getters = {
    getUser(state) {
        return state.user;
    }
  };
  
  export const actions = {
    async setUser(ctx, payload){
        await ctx.commit('setUser', payload);
    }
  };