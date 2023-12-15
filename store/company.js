
export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: [],
  sortName: "title",
  sortOrder: "asc",
  initialAllTasks:[],
  tags: [],
  groupByValue:"",
  taskCount:0

});

export const getters = {

  getAllCompanies(state) {
    return state.companies;
  },
  getCompanyMembers(state) {
    return state.companyMembers
  },
  getCompanyTasks(state) {
    return state.companyTasks;
  },
  getSortName(state){
    return state.sortName
  },
  getSortOrder(state){
    return state.sortOrder
  },
  getInitialAllTasks(state){
    return state.initialAllTasks
  },
  getCompanyTags(state){
    return state.tags
  },
  getGroupBy (state) {
    return state.groupByValue 
  },
  getTaskCount (state) {
    return state.taskCount
  }
};

export const mutations = {
  setAddTaskCount (state, payload) {
    state.taskCount ++
  },
  setDeleteTaskCount (state, payload) {
    state.taskCount--
  },
  setTaskCount ( state, payload) {
    state.taskCount=payload.reduce((acc, td) => acc + td.tasks.length, 0)
  },
  setGroupBy(state,payload) {
    state.groupByValue=payload
  },
  fetchCompanies(state, payload) {
    state.companies = payload;
  },
  flatTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.companyTasks));
    if(arr[0].tasks){
      let _arr = [];
    arr.forEach((ele) => {
      _arr = _arr.concat(ele.tasks);
    })
    arr = _arr;
    }
    state.companyTasks = arr;
    
  },
  fetchCompanyMembers(state, payload) {
    state.companyMembers = payload;
  },

  setCompanyTasks(state, payload) {
    state.companyTasks = payload;
  },
  setInitialTasks(state,payload) {
     let arr=[]
      arr=payload
      arr = arr.reduce((acc, ele) => {
        return [...acc, ...ele.tasks];
      }, []);
    state.initialAllTasks=arr
  },

  setSortName(state, payload){
    state.sortName = payload
  },

  setSortOrder(state, payload){
    state.sortOrder = payload
  },
  
  groupTasks(state, payload) {
    let arr = state.companyTasks
    if(arr[0].tasks){
      let _arr = [];
      arr.forEach((ele) => {
        _arr = _arr.concat(ele.tasks);
      });
      arr = _arr;
    }
    state.companyTasks = this.$groupBy(arr,payload.sName)
  },

  sortCompanyTasks(state, payload) {
    state.sortName = payload.sName
    state.sortOrder = payload.order
    let arr =JSON.parse(JSON.stringify(state.companyTasks));
    // sort By Title
    if (payload.sName == 'title') {
      if(payload.order == 'asc') {
        if(arr[0].tasks){
                arr.forEach((ele)=>{
              ele.tasks.sort((a,b)=>a.title.localeCompare(b.title))
              return ele
            })
        }
      
      } else {
        if(arr[0].tasks){
            arr.forEach((ele)=>{
              ele.tasks.sort((a,b)=>b.title.localeCompare(a.title))
              return ele
            })
          }
      }

      state.companyTasks = arr;
    }

    // sort By Status
    if (payload.sName == "status") {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].statusId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.statusId && b.statusId) {
              return a.status.text.localeCompare(b.status.text);
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.statusId && b.statusId) {
              return b.status.text.localeCompare(a.status.text);
            }
          })
        })
      }

      state.companyTasks = newArr;
    }

    // sort by priority
    if (payload.sName == 'priority') {

      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].priorityId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.priorityId && b.priorityId) {
              return a.priority.id - b.priority.id;
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.priorityId && b.priorityId) {
              return b.priority.id - a.priority.id;
            }
          })
        })
      }

      state.companyTasks = newArr;

    }

    // sort by priority
    if (payload.sName == 'difficultyId') {

      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].difficultyId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.difficultyId && b.difficultyId) {
              return a.difficultyId - b.difficultyId;
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.difficultyId && b.difficultyId) {
              return b.difficultyId - a.difficultyId;
            }
          })
        })
      }

      state.companyTasks = newArr;

    }
    if (payload.sName == 'department') {

      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].departmentId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.departmentId && b.departmentId) {
              return a.department.title.localeCompare(b.department.title)
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.departmentId && b.difficultyId) {
              return b.department.title.localeCompare(a.department.title)
            }
          })
        })
      }

      state.companyTasks = newArr;

    }
    // sort by owner
    if (payload.sName == 'userId') {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].userId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.userId && b.userId) {
              return a.user.firstName.localeCompare(b.user.firstName);
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.userId && b.userId) {
              return b.user.firstName.localeCompare(a.user.firstName);
            }
          })
        })
      }

      state.companyTasks = newArr;

    }

    // sort by due date
    if (payload.sName == 'startDate') {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].startDate) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.startDate && b.startDate) {
              return new Date(a.startDate) - new Date(b.startDate);
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.startDate && b.startDate) {
              return new Date(b.startDate) - new Date(a.startDate);
            }
          })
        })
      }

      state.companyTasks = newArr;
    }

    // sort by due date
    if (payload.sName == 'dueDate') {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].dueDate) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate) - new Date(b.dueDate);
            }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return new Date(b.dueDate) - new Date(a.dueDate);
            }
          })
        })
      }

      state.companyTasks = newArr;
    }

    // sort by project
    if (payload.sName == "project") {

      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].project[0]?.projectId) {
            t.unshift(arr[i].tasks[j])
          } else {
            t.push(arr[i].tasks[j])
          }
        }
        arr[i].tasks = t;
        newArr.push(arr[i]);
      }

      if (payload.order == "asc") {
        newArr.map((dept) => {
       
          return dept.tasks.sort((a, b) => {
            if (b.project[0]?.project?.title && a.project[0]?.project?.title) {
              return a.project[0]?.project?.title?.localeCompare(b.project[0]?.project?.title);
               }
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            if (b.project[0]?.project?.title && a.project[0]?.project?.title) {
            return b.project[0]?.project?.title?.localeCompare(a.project[0]?.project?.title);
             }
          })
        })
      }

      state.companyTasks = newArr;
    }
  },
  SET_COMPANY_TAGS(state, payload){
    state.tags = payload
  },
  ADDTO_TAGS(state, payload){
    state.tags.push(payload)
  }
};

export const actions = {

  async fetchCompanies(ctx) {
    const res = await this.$axios.$get('/company', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    });
    ctx.commit('fetchCompanies', res.data);
  },
  async setCompanyTasks(ctx,payload){
    ctx.commit('setCompanyTasks', payload.data);
    ctx.commit('setTaskCount',payload.data)

  },
  async fetchCompanyMembers(ctx, companyId) {
    const res = await this.$axios.$get("/company/" + companyId + "/members/", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    })
    if (res.statusCode == 200) {
      let cu = res.data.map(u => u.user)
      ctx.commit("fetchCompanyMembers", cu)
    } else {
      return res
    }
  },
  async groupTasks(ctx,payload){
    ctx.commit('groupTasks', payload)
  },
  async fetchCompanyTasks(ctx, payload) {

    const res = await this.$axios.$get(`company/tasks/all`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    ctx.commit('setCompanyTasks', res.data);
    ctx.commit('setTaskCount',res.data)
    ctx.commit('groupTasks', payload)
    return res.data
  },
  async fetchInitialCompanyTasks(ctx, payload) {

    const res = await this.$axios.$get(`company/tasks/all`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter':'all' }
    });

    if (res.data) {
      ctx.commit('setInitialTasks', res.data);
      return res.data
    }

  },

  sortCompanyTasks(ctx, payload) {
    ctx.commit('sortCompanyTasks', payload)
  },
  async addCompanyTag(ctx, payload){
    const res = await this.$axios.post("/tag", { content: payload.content }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      }
    })
    if (res.data.statusCode == 200) {
      // ctx.state.tags.push(res.data.data)
      ctx.commit("ADDTO_TAGS", res.data.data)
      return res
    }
  },
  async fetchCompanyTags(ctx, payload){
    const res = await this.$axios.get("/tag/company/all", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    // console.log("company tags", res.data)
    if (res.data.statusCode == 200) {
      ctx.commit("SET_COMPANY_TAGS", res.data.data)
      return res.data
    } else {
      return []
    }
  },

};
