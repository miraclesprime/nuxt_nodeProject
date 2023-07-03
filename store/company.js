
export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: [],
  sortName: "title",
  sortOrder: "asc",
  initialAllTasks:[]
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
  }

};

export const mutations = {

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
    let arr = state.initialAllTasks
    let _tasks=[];
    // console.time('executionTime');
    // console.timeEnd('executionTime');

    if (payload.sName == "priority") {  
      const groupByPriority = arr.reduce((acc, task) => {
        const priority = task.priority && task.priority.text || 'Unassigned';
        if (!acc[priority]) {
          acc[priority] = [];
        }
        acc[priority].push(task);
        return acc;
      }, {});
      let _data=[]
      let groupIndex = 0;
      for (const key in groupByPriority) {
        _data.push({
          id: groupIndex,
          title: key.charAt(0).toUpperCase()+key.slice(1),
          tasks: groupByPriority[key]
        });
        groupIndex++;
      }
      const titleArray= {0:"High", 1:"Medium",2:"Low",3:"Unassigned"}
      _tasks = _data.map(item => {
        if (titleArray[item.id]) {
          item.title = titleArray[item.id];
        }
        return item;
      });
 
}
    if (payload.sName == "department") {
      arr.sort((a,b)=>{
        if (a.priorityId === null && b.priorityId !== null) {
          return 1;
        }
        if (b.priorityId === null && a.priorityId !== null) {
          return -1;
        }
        if (a.priorityId === null && b.priorityId === null) {
          return 0;
        }
        return a.priorityId - b.priorityId;
      })
        const groupByDepartment = arr.reduce((acc, task) => {
          const department = task.department && task.department.title || 'Unassigned';
          if (!acc[department]) {
            acc[department] = [];
          }
          acc[department].push(task);
          return acc;
        }, {});
        let groupIndex = 0;
        for (const key in groupByDepartment) {
          _tasks.push({
            id: groupIndex,
            title: key,
            tasks: groupByDepartment[key]
          });
          groupIndex++;
        }
    }
    if (payload.sName == "project") {
      const groupProject = arr.reduce((acc, task) => {
        const project =task.project?.[0]?.project?.title ?? "Unassigned"
        if (!acc[project]) {
          acc[project] = [];
        }
        acc[project].push(task);
        return acc;
      }, {});
      let groupIndex = 0;
      for (const key in groupProject) {
        _tasks.push({
          id: groupIndex,
          title: key,
          tasks: groupProject[key]
        });
        groupIndex++;
      }
    }
    if(payload.sName=="dueDate"){
      arr.sort((a,b)=>{
        if (a.dueDate === null && b.dueDate !== null) {
          return 1;
        }
        if (b.dueDate === null && a.dueDate !== null) {
          return -1;
        }
   
        return new Date(a.dueDate) - new Date(b.dueDate);
      })
      const groupDueDate = arr.reduce((acc, task) => {
        const dueDate =this.$CalDate(task.dueDate) ?? "Unassigned"
        if (!acc[dueDate]) {
          acc[dueDate] = [];
        }
        acc[dueDate].push(task);
        return acc;
      }, {});
      let groupIndex = 0;
      for (const key in groupDueDate) {
        _tasks.push({
          id: groupIndex,
          title: key,
          tasks: groupDueDate[key]
        });
        groupIndex++;
      }
}
    if (payload.sName == "assignee") {
      arr.sort((a,b)=>{
        return a.id - b.id;
      })  
      const groupAssignee = arr.reduce((acc, task) => {
        const assignee=  task.user !== null&&task.user!==undefined 
        ? task.user.firstName + " " + task.user.lastName
        : "Unassigned";
        if (!acc[assignee]) {
          acc[assignee] = [];
        }
        acc[assignee].push(task);
        return acc;
      }, {});
      let groupIndex = 0;
      for (const key in groupAssignee) {
        _tasks.push({
          id: groupIndex,
          title: key,
          tasks: groupAssignee[key]
        });
        groupIndex++;
      }
    }
    if (payload.sName == "status") {
      arr.sort((a,b)=>{
        if (a.statusId === null && b.statusId !== null) {
          return 1;
        }
        if (b.statusId === null && a.statusId !== null) {
          return -1;
        }
        if (a.statusId === null && b.statusId === null) {
          return 0;
        }
        return a.statusId - b.statusId;
      })  
      const groupStatus = arr.reduce((acc, task) => {
        const status =task.status?.text ?? "Unassigned";
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {});
      let groupIndex = 0;
      for (const key in groupStatus) {
        _tasks.push({
          id: groupIndex,
          title: key,
          tasks: groupStatus[key]
        });
        groupIndex++;
      }
      
    }
    state.companyTasks = _tasks;
  },
  sortCompanyTasks(state, payload) {
    state.sortName = payload.sName
    state.sortOrder = payload.order
    let arr = state.companyTasks;
    // sort By Title
    if (payload.sName == 'title') {
      

      if(payload.order == 'asc') {
        arr.map((dept) => {
          dept.tasks.sort((a,b) => a.title.localeCompare(b.title))
        })
      } else {
        arr.map((dept) => {
          dept.tasks.sort((a,b) => b.title.localeCompare(a.title))
        })
      }

      state.companyTasks = arr;
    }

    // sort By Status
    if (payload.sName == "status") {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].status) {
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
          if (arr[i].tasks[j].priority) {
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

    // sort by owner
    if (payload.sName == 'userId') {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        let t = []
        for(let j=0; j<arr[i].tasks.length; j++) {
          if (arr[i].tasks[j].user) {
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
          if (arr[i].tasks[j].project[0]) {
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
            return a.project[0]?.project?.title?.localeCompare(b.project[0]?.project?.title);
          })
        })
      } else {
        newArr.map((dept) => {
          return dept.tasks.sort((a, b) => {
            return b.project[0]?.project?.title?.localeCompare(a.project[0]?.project?.title);
          })
        })
      }

      state.companyTasks = newArr;
    }
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

    const res = await this.$axios.$get(`company/${payload.companyId}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setCompanyTasks', res.data);
      // if(payload.sName!==''){
      //   ctx.commit('groupTasks', payload)
      // }
    
      // if (payload.sort) {
      //   ctx.commit('sortCompanyTasks', { sName: ctx.state.sortName, order: ctx.state.sortOrder })
      // }
      return res.data
    }

    

  },

  sortCompanyTasks(ctx, payload) {
    ctx.commit('sortCompanyTasks', payload)
  }
};
