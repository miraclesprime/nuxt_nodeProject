
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
  
    setSingleDream(state, currentDream) {
      state.selectedDream = currentDream;
    },

    sortDreams(state, payload) {
    
      // sort By Dream Title
      if (payload.key == 'name' && payload.order == 'asc') {
        let arr = JSON.parse(JSON.stringify(state.dreams));
        arr.sort((a, b) => a.title.localeCompare(b.title));
        state.dreams = arr;
      }

      if (payload.key == 'name' && payload.order == 'desc') {
        let arr = JSON.parse(JSON.stringify(state.dreams));
        arr.sort((a, b) => b.title.localeCompare(a.title));
        state.dreams = arr;
      }

      // Sort By Project Owner Name
      if (payload.key == 'owner' && payload.order == 'asc') {
        let arr = JSON.parse(JSON.stringify(state.dreams))
        arr.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
        state.dreams = arr;
      }

      if (payload.key == 'owner' && payload.order == 'desc') {
        let arr = JSON.parse(JSON.stringify(state.dreams))
        arr.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
        state.dreams = arr;
      }


      // Sort By Status
      if (payload.key == 'status' && payload.order == 'asc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].statusId) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.status && b.status) {
            return a.status.text.localeCompare(b.status.text)
          }
        });
        state.dreams = newArr;

      }

      if (payload.key == 'status' && payload.order == 'desc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].statusId) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.status && b.status) {
            return b.status.text.localeCompare(a.status.text)
          }
        });
        state.dreams = newArr;

      }

      // Sort By Department
      if (payload.key == 'department' && payload.order == 'asc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        arr.sort((a, b) => (a.department) - (b.department));
        state.dreams = arr;

      }

      if (payload.key == 'department' && payload.order == 'desc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        arr.sort((a, b) => (b.department) - (a.department));
        state.dreams = arr;

      }

      // Sort By Due Date
      if (payload.key == 'dueDate' && payload.order == 'asc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].dueDate) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            new Date(a.dueDate) - new Date(b.dueDate)
          }
        });
        state.dreams = newArr;
      }

      if (payload.key == 'dueDate' && payload.order == 'desc') {

        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].dueDate) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            new Date(b.dueDate) - new Date(a.dueDate)
          }
        });
        state.dreams = newArr;
      }

      // Sort By Priority
      if (payload.key == 'priority' && payload.order == 'asc') {
        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].priorityId) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.priority && b.priority) {
            return a.priority.text.localeCompare(b.priority.text)
          }
        });
        state.dreams = newArr;
      }

      if (payload.key == 'priority' && payload.order == 'desc') {
        let arr = JSON.parse(JSON.stringify(state.dreams))
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].priorityId) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }

        newArr.sort((a, b) => {
          if (a.priority && b.priority) {
            return b.priority.text.localeCompare(a.priority.text)
          }
        });
        state.dreams = newArr;
      }

    }
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
  
      if (res.statusCode == 200) {
        ctx.commit('createDream', res.data);
      }
      return res.data
    },

    sortDreams(ctx, payload) {
      ctx.commit('sortDreams', payload)
    },
    
  };
  