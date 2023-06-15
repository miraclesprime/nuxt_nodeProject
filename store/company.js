export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: [],
  sortName: "title",
  sortOrder: "asc",
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

  fetchCompanyMembers(state, payload) {
    state.companyMembers = payload;
  },

  setCompanyTasks(state, payload) {
    state.companyTasks = payload;
  },

  setSortName(state, payload){
    state.sortName = payload
  },

  setSortOrder(state, payload){
    state.sortOrder = payload
  },
  groupTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.companyTasks));
    if(arr[0].tasks){
      let _arr = [];
      arr.forEach((ele) => {
        _arr = _arr.concat(ele.tasks);
      });
      arr = _arr;
    }
    let arrIndex;
    let _tasks;
    if (payload.sName == "priority") {
      arrIndex = "priority";
      let items = [];

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
        return b.priorityId - a.priorityId;
      })

      arr.forEach((ele) => {
        let title = ele.priorityId !== null ? ele.priority.text : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? _item[arrIndex].text : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.sName == "department") {
      arrIndex = "department";
      let items = [];
      arr.sort((a,b)=>{
        if (a.departmentId === null && b.departmentId !== null) {
          return 1;
        }
        if (b.departmentId === null && a.departmentId !== null) {
          return -1;
        }
        if (a.departmentId === null && b.departmentId === null) {
          return 0;
        }
        return a.departmentId - b.departmentId;
      })  
      

      arr.forEach((ele) => {
        let title =
          ele.departmentId !== null ? ele.department.title : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? _item[arrIndex].title : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.sName == "assignee") {
      arrIndex = "user";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      })  

      arr.forEach((ele) => {
        let title =
          ele.userId !== null&&ele.userId!==undefined
            ? ele.user.firstName + " " + ele.user.lastName
            : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (
                _item[arrIndex] !== null&&_item[arrIndex] !== undefined
                ? _item[arrIndex].firstName + " " + _item[arrIndex].lastName
                : null) === (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.sName == "status") {
      arrIndex = "status";
      let items = [];
      
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
      arr.forEach((ele) => {
        let title = ele.statusId !== null ? ele.status.text : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? _item[arrIndex].text : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    state.companyTasks = _tasks;
  },
  sortCompanyTasks(state, payload) {
    state.sortName = payload.sName
    state.sortOrder = payload.order

    // sort By Title
    if (payload.sName == 'title') {
      let arr = JSON.parse(JSON.stringify(state.companyTasks));

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
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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
      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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

      let arr = JSON.parse(JSON.stringify(state.companyTasks))
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
    console.log("payload121",payload)

          const res = await this.$axios.$get(`company/${payload.companyId}/tasks`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
          });

          if (res.data) {
            ctx.commit('setCompanyTasks', res.data);
            ctx.commit('groupTasks', payload)
            if (payload.sort) {
              ctx.commit('sortCompanyTasks', { sName: ctx.state.sortName, order: ctx.state.sortOrder })
            }
            return res.data
          }
    

  },

  sortCompanyTasks(ctx, payload) {
    ctx.commit('sortCompanyTasks', payload)
  }
};
