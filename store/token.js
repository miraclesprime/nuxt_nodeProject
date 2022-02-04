
export const state = () => ({
    // token: null,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImlhdCI6MTY0Mzg5MTkyODA1NiwiZXhwIjoxNjUxNjY3OTI4MDU2LCJqdGkiOiI5ZjUxOWZiYy00NTFiLTQ0ZmMtYjM0MS1lYWVjYjY0MGM5MWIifQ.taqZq0UfB8_0p9g7pEA969C1v1kdpI0de9rXQch96aE'
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
  