export const strict = false;

export const state = () => ({
    sections: [],
    sortType: null
  });
  
  export const mutations = {
    
    fetchSections(state, payload) {
      state.sections = payload;
    },

    createSection(state, payload) {
      state.sections.push(payload)
    },

    setSections(state, payload) {
      state.sections = payload;
    },

    setSortType(state, payload) {
      state.sortType = payload
    }

  };
  
  export const getters = {
    
    getAllSections(state) {
      if(state.sortType == 'name') {

          let arr = JSON.parse(JSON.stringify(state.sections))
          arr.sort((a, b) => a.title.localeCompare(b.title));

          for(let i=0; i<arr.length; i++) {
            arr[i].tasks.sort((a, b) => a.title.localeCompare(b.title));
          }
          return arr;

      } else if(state.sortType == 'owner') {

          let arr = JSON.parse(JSON.stringify(state.sections))
          arr.sort((a, b) => a.title.localeCompare(b.title));

          for(let i=0; i<arr.length; i++) {
            arr[i].tasks.sort((a, b) => a.userId.localeCompare(b.userId));
          }
          return arr;

      } else if(state.sortType == 'status') {

          let arr = JSON.parse(JSON.stringify(state.sections))
          arr.sort((a, b) => a.title.localeCompare(b.title));

          for(let i=0; i<arr.length; i++) {
            arr[i].tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
          }
          return arr;

      } else if(state.sortType == 'startDate') {

          let arr = JSON.parse(JSON.stringify(state.sections))
          arr.sort((a, b) => a.title.localeCompare(b.title));

          for(let i=0; i<arr.length; i++) {
            arr[i].tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          }
          return arr;

      } else if(state.sortType == 'dueDate') {

          let arr = JSON.parse(JSON.stringify(state.sections))
          arr.sort((a, b) => a.title.localeCompare(b.title));

          for(let i=0; i<arr.length; i++) {
            arr[i].tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          }
          return arr;

      } else if(state.sortType == 'priority') {

          let arr = JSON.parse(JSON.stringify(state.sections))
            arr.sort((a, b) => a.title.localeCompare(b.title));

            for(let i=0; i<arr.length; i++) {
              arr[i].tasks.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
            }
            return arr;

      } else {
        return state.sections;
      }
    }

  };
  
  export const actions = {
    async fetchSections(ctx) {
      const res = await this.$axios.$get('/section', {
        headers: {'Authorization': `Bearer ${ctx.rootState.token.token}`}
      });
      ctx.commit('fetchSections', res.data);
    },

    setSections(ctx, payload) {
      ctx.commit('setSections', payload)
    },

    setSortType(ctx, payload) {
      ctx.commit('setSortType', payload)
    },

    async createSection(ctx) {
      const res = await this.$axios.$post('/section', {
        headers: {'Authorization': `Bearer ${ctx.rootState.token.token}`}
      });
      ctx.commit('createSection', res.data)
    }
  };
  