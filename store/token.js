
export const state = () => ({
    // token: null,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IlVTRVIiLCJzdWJjIjoiQ2FuYWRhIiwiaWF0IjoxNjQyNTc1MjIzMTAyLCJleHAiOjE2NTAzNTEyMjMxMDIsImp0aSI6IjczNWEwM2IzLWVjZDQtNGE4Yy05OGNlLTFhYWQ2NjBmZTc4OSJ9.QSFZwGR8st6e7kask5y1Si0fNWZeTzT5oErBI6o2NL0'
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
  