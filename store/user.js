export const state = () => ({
  user: null,
  user2: null,
  teamMembers: [],
  appMembers: [],
  userTasks: [],
});

export const getters = {
  getUser(state) {
    return state.user;
  },

  getUser2(state) {
    return state.user2;
  },

  getTeamMembers(state) {
    let members = []
    state.teamMembers.map(t => {
      members.push({ label: t.FirstName + ' ' + t.LastName, firstName: t.FirstName, lastName: t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo, selected: false })
    })
    return members
  },

  getAppMembers(state) {
    let appmembers = []
    state.appMembers.map(t => {
      appmembers.push({ label: t.FirstName + ' ' + t.LastName, firstName: t.FirstName, lastName: t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo, selected: false })
    })
    return appmembers
  },

  getUserTasks(state) {
    return state.userTasks;
  },

};

export const mutations = {
  flatTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.userTasks));
    if(arr[0].tasks){
      let _arr = [];
    arr.forEach((ele) => {
      _arr = _arr.concat(ele.tasks);
    })
    arr = _arr;
    }
    state.userTasks = arr;
  },
  getUserTasks(state,payload){
    let arr = JSON.parse(JSON.stringify(state.userTasks));
    if(arr[0].tasks){
      let _arr = [];
      arr.forEach((ele) => {
        _arr = _arr.concat(ele.tasks);
      });
      arr = _arr;
    }
    let arrIndex;
    let _userTasks;
    if (payload.key == "priority") {
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
        return a.priorityId - b.priorityId;
      })


      arr.forEach((ele) => {
        let title = ele.priority !== null && ele.priority?.text !== null ? ele.priority.text.charAt(0).toUpperCase()+ele.priority.text.slice(1) : "Unassigned"
         if (!items.includes(title)) items.push(title);
       });
       _userTasks = items.map((item, idx) => {
         return {
           id: idx,
           title: item !== null ? item : "Unassigned",
           tasks: arr.filter(
             (_item) =>
               (_item[arrIndex] !== null&&_item[arrIndex]?.text !== null ?  _item[arrIndex].text.charAt(0).toUpperCase()+_item[arrIndex].text.slice(1) : null) ===
               (item === "Unassigned" ? null : item)
           ),
         };
       });
    }
    if (payload.key == "department") {
      console.log("111111111departme")
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
      _userTasks = items.map((item, idx) => {
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
    if (payload.key == "assignee") {
      arrIndex = "user";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      })  

      arr.forEach((ele) => {
        let title =
          ele.user !== null&&ele.user!==undefined 
            ? ele.user.firstName + " " + ele.user.lastName
            : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _userTasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null&&_item[arrIndex] !== undefined
                ? _item[arrIndex].firstName + " " + _item[arrIndex].lastName
                : null) === (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.key == "status") {
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
      _userTasks = items.map((item, idx) => {
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
    if (payload.key == "project") {
      arrIndex = "project";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      }) 
      arr.forEach((ele) => {
        const title = ele.project?.[0]?.project?.title ?? "Unassigned";
        if (!items.includes(title))  items.push(title);
      });
      _userTasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex].length>0 ? _item[arrIndex][0]?.project?.title : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if(payload.key=="dueDate"){
      arrIndex = "dueDate";
      let items = [];
      arr.sort((a,b)=>{
        if (a.dueDate === null && b.dueDate !== null) {
          return 1;
        }
        if (b.dueDate === null && a.dueDate !== null) {
          return -1;
        }
   
        return new Date(a.dueDate) - new Date(b.dueDate);
      })
      arr.forEach((ele) => {
        let title
        if(ele.dueDate!==null){
          title =this.$CalDate(ele.dueDate)
        }
        else {
          title="Unassigned"
        }
        if (!items.includes(title)) items.push(title);
      });
      _userTasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? this.$CalDate(_item[arrIndex]) : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
}
console.log("111111111departme",_userTasks)
    state.userTasks=_userTasks
  },
  sortUserTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.userTasks));
    if (payload.key == 'title' && payload.order == 'asc') {
      
      if(arr[0].tasks){// group is true 
              arr.forEach((ele)=>{
            ele.tasks.sort((a,b)=>a.title.localeCompare(b.title))
            return ele
          })
      }
    else{
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }  
      state.userTasks = arr;
    }

    if (payload.key == 'title' && payload.order == 'desc') {
      if(arr[0].tasks){
      arr.forEach((ele)=>{
        ele.tasks.sort((a,b)=>b.title.localeCompare(a.title))
        return ele
      })
    }
    else {
      arr.sort((a, b) => b.title.localeCompare(a.title));

    }
      state.userTasks = arr;
    }
        if (payload.key == 'project' ) {
          
              if(arr[0].tasks){
                    arr.map((ele)=>{
                      let newArr=[]
                      ele.tasks.forEach((item) => {
                        if (item.project[0]) {
                          newArr.unshift(item)
                        } else {
                          newArr.push(item)
                        }
                      });
                      if(payload.order == 'asc'){
                        newArr.sort((a,b)=>{
                          return a.project[0]?.project?.title?.localeCompare(b.project[0]?.project?.title);
                          });
                      } 
                      if(payload.order == 'desc'){
                        newArr.sort((a,b)=>{
                          return b.project[0]?.project?.title?.localeCompare(a.project[0]?.project?.title);
                        });
                    } 
                      ele.tasks=newArr
                      return ele
                    })
                state.userTasks = arr;
            }
        else {
                    
              let newArr = []

              for (let i = 0; i < arr.length; i++) {
                if (arr[i].project[0]) {
                  newArr.unshift(arr[i])
                } else {
                  newArr.push(arr[i])
                }
              }
              if(payload.order == 'asc'){
                    newArr.sort((a, b) => {
                      return a.project[0]?.project?.title?.localeCompare(b.project[0]?.project?.title);
                    });
              }
              if(payload.order == 'desc'){
                newArr.sort((a, b) => {
                  return b.project[0]?.project?.title?.localeCompare(a.project[0]?.project?.title);
                });
          }

           
              state.userTasks = newArr;
        }
    }
    // Sort By Project Owner Name
    if (payload.key == 'owner' ) {
      if(arr[0].tasks){
        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.userId!==null&&item.userId!==undefined) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
      if(payload.order == 'asc'){
         newArr.sort((a,b)=>{
            if (a.userId && b.userId) {
              return a.user.firstName.localeCompare(b.user.firstName)
            }
          });
      }
      if(payload.order == 'desc'){
        newArr.sort((a,b)=>{
           if (a.userId && b.userId) {
             return b.user.firstName.localeCompare(a.user.firstName)
           }
         });
     }
          ele.tasks=newArr
          return ele
        })
        state.userTasks = arr;
    }
    else {
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId!==null&&arr[i].userId!==undefined) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
          
        }
      }
      if(payload.order == 'asc'){
            newArr.sort((a, b) => {
              if (a.userId && b.userId) {
                return a.user.firstName.localeCompare(b.user.firstName)
              }
            });
      }
      if(payload.order == 'desc'){
        newArr.sort((a, b) => {
          if (a.userId && b.userId) {
            return b.user.firstName.localeCompare(a.user.firstName)
          }
        });
  }
      
      state.userTasks = newArr;
     }
    }

    // Sort By Status
    if (payload.key == 'status' ) {
      if(arr[0].tasks){
        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.statusId) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
          if(payload.order == 'asc'){
                newArr.sort((a,b)=>{
                if (a.statusId && b.statusId) {
                  return a.status.text.localeCompare(b.status.text)
                }
              });
          } 
          if(payload.order == 'desc'){
            newArr.sort((a,b)=>{
            if (a.statusId && b.statusId) {
              return b.status.text.localeCompare(a.status.text)
            }
          });
      } 
       
          ele.tasks=newArr
          return ele
        })
     
      state.userTasks=arr
      }
      else {

      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].statusId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
          
        }
      }
      if(payload.order == 'asc'){
        newArr.sort((a, b) => {
          if (a.statusId && b.statusId) {
            return a.status.text.localeCompare(b.status.text)
          }
        });
      }
      if(payload.order == 'desc'){
        newArr.sort((a, b) => {
          if (a.statusId && b.statusId) {
            return b.status.text.localeCompare(a.status.text)
          }
        });
      }
      
      
      state.userTasks = newArr;

    }
  }
    // Sort By Start Date
    if (payload.key == 'startDate' ) {
      if(arr[0].tasks)
      {

        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.startDate) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
          if(payload.order == 'asc'){
                newArr.sort((a,b)=>{
                if (a.startDate && b.startDate) {
                  return new Date(a.startDate) - new Date(b.startDate)
                }
              });
          }
          if(payload.order == 'desc'){
            newArr.sort((a,b)=>{
            if (a.startDate && b.startDate) {
              return new Date(b.startDate) - new Date(a.startDate)
            }
          });
      }
        
          ele.tasks=newArr
          return ele
        })
     
        state.userTasks=arr
      }
      else 
      {
          let newArr = []

          for (let i = 0; i < arr.length; i++) {
            if (arr[i].startDate) {
              newArr.unshift(arr[i])
            } else {
              newArr.push(arr[i])
            }
          }
          if(payload.order == 'asc'){
            newArr.sort((a, b) => {
                if (a.startDate && b.startDate) {
                  return new Date(a.startDate) - new Date(b.startDate)
                }
              });
          }
          if(payload.order == 'desc'){
            newArr.sort((a, b) => {
              if (a.startDate && b.startDate) {
                return new Date(b.startDate) - new Date(a.startDate)
              }
            });
          }
        
          state.userTasks = newArr;

       }

    }


    // Sort By Due Date
    if (payload.key == 'dueDate' ) {
      if(arr[0].tasks)
      {
        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.dueDate) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
          if(payload.order == 'asc'){
              newArr.sort((a,b)=>{
              if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate)
              }
            });
          }
          if(payload.order == 'desc'){
            newArr.sort((a,b)=>{
            if (a.dueDate && b.dueDate) {
              return new Date(b.dueDate) - new Date(a.dueDate)
            }
          });
        }
         
          ele.tasks=newArr
          return ele
        })
     
        state.userTasks=arr
      }
      else 
      {
          let newArr = []

          for (let i = 0; i < arr.length; i++) {
            if (arr[i].dueDate) {
              newArr.unshift(arr[i])
            } else {
              newArr.push(arr[i])
            }
          }
          if(payload.order == 'asc'){
                 newArr.sort((a, b) => {
                      if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate)
                      }
                    });
          }
          if(payload.order == 'desc'){
            newArr.sort((a, b) => {
              if (a.dueDate && b.dueDate) {
                return new Date(b.dueDate) - new Date(a.dueDate)
              }
            });
          }
         
          state.userTasks = newArr;

       }
      
    }


    // Sort By Priority
    if (payload.key == 'priority' ) {

      if(arr[0].tasks)
      {
        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.priorityId) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
          if(payload.order == 'asc'){
              newArr.sort((a,b)=>{
              if (a.priorityId && b.priorityId) {
                return a.priority.id - b.priority.id;
              }
            });
          }
          if(payload.order == 'desc'){
            newArr.sort((a,b)=>{
            if (a.priorityId && b.priorityId) {
              return b.priority.id - a.priority.id;
            }
          });
        }
          ele.tasks=newArr
          return ele
        })
     
        state.userTasks=arr
      }
      else 
      {
            let newArr = []

            for (let i = 0; i < arr.length; i++) {
              if (arr[i].priorityId) {
                newArr.unshift(arr[i])
              } else {
                newArr.push(arr[i])
              }
            }
            if(payload.order == 'asc'){
                newArr.sort((a, b) => {
                if (a.priorityId && b.priorityId) {
                  return a.priority.id - b.priority.id;
                }
              });
            }
            if(payload.order == 'desc'){
              newArr.sort((a, b) => {
              if (a.priorityId && b.priorityId) {
                return b.priority.id - a.priority.id;
              }
            });
          }
           
            state.userTasks = newArr;

       }

      
     
    }

    // Sort By Department
    if (payload.key == 'department' ) {
      let arr = JSON.parse(JSON.stringify(state.projects))

      if(arr[0].tasks)
      {
        arr.map((ele)=>{
          let newArr=[]
          ele.tasks.forEach((item) => {
            if (item.departmentId) {
              newArr.unshift(item)
            } else {
              newArr.push(item)
            }
          });
          if(payload.order == 'asc'){
              newArr.sort((a,b)=>{
              if (a.departmentId && b.departmentId) {
                return a.department.title.localeCompare(b.department.title)
              }
            });
          }
          if(payload.order == 'desc'){
            newArr.sort((a,b)=>{
            if (a.departmentId && b.departmentId) {
              return b.department.title.localeCompare(a.department.title)
            }
          });
        }
          ele.tasks=newArr
          return ele
        })
     
        state.userTasks=arr
      }
      else 
      {
        let newArr = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].departmentId) {
            newArr.unshift(arr[i])
          } else {
            newArr.push(arr[i])
          }
        }
  
        newArr.sort((a, b) => {
          if (a.departmentId && b.departmentId) {
            if(payload.order == 'asc'){
              return a.department.title.localeCompare(b.department.title);
            }
            if(payload.order == 'desc'){
              return b.department.title.localeCompare(a.department.title);
            }

          }
        });
        state.userTasks = newArr;

       }
      
    }

   

  },
  setUser(state, payload) {
    state.user = payload;
  },

  setUser2(state, payload) {
    state.user2 = payload;
  },

  setTeamMembers(state, payload) {
    state.teamMembers = payload;
  },

  setAppMembers(state, payload) {
    state.appMembers = payload;
  },

  setUserTasks(state, payload) {
    state.userTasks = payload
  },

  // sortUserTasks(state, payload) {

  //   // sort By Title
  //   if (payload.sName == 'name' && payload.order == 'asc') {
  //     state.userTasks.sort((a, b) => a.title.localeCompare(b.title))
  //   }

  //   if (payload.sName == 'name' && payload.order == 'desc') {
  //     state.userTasks.sort((a, b) => b.title.localeCompare(a.title))
  //   }

  //   // sort By Project
  //   if (payload.sName == 'projectId' && payload.order == 'asc') {

  //     let arr = JSON.parse(JSON.stringify(state.userTasks))
  //     let newArr = []

  //     for (let i = 0; i < arr.length; i++) {
  //       if (arr[i].project[0]) {
  //         newArr.unshift(arr[i])
  //       } else {
  //         newArr.push(arr[i])
  //       }
  //     }

  //     newArr.sort((a, b) => {
  //       if (a.project[0] && b.project[0]) {
  //         return a.project[0].project.title.localeCompare(b.project[0].project.title)
  //       }
  //     });
  //     state.userTasks = newArr;

  //   }

  //   if (payload.sName == 'projectId' && payload.order == 'desc') {

  //     let arr = JSON.parse(JSON.stringify(state.userTasks))
  //     let newArr = []

  //     for (let i = 0; i < arr.length; i++) {
  //       if (arr[i].project[0]) {
  //         newArr.unshift(arr[i])
  //       } else {
  //         newArr.push(arr[i])
  //       }
  //     }

  //     newArr.sort((a, b) => {
  //       if (a.project[0] && b.project[0]) {
  //         return b.project[0].project.title.localeCompare(a.project[0].project.title)
  //       }
  //     });
  //     state.userTasks = newArr;

  //   }

  //   // sort By Status
  //   if (payload.sName == "status") {
  //     let arr = JSON.parse(JSON.stringify(state.userTasks))
  //     let newArr = []

  //     for (let i = 0; i < arr.length; i++) {
  //       if (arr[i].status) {
  //         newArr.unshift(arr[i])
  //       } else {
  //         newArr.push(arr[i])
  //       }
  //     }

  //     if (payload.order == "asc") {
  //       newArr.sort((a, b) => {
  //         if (a.status && b.status) {
  //           return a.status.text.localeCompare(b.status.text);
  //         }
  //       })
  //     } else {
  //       newArr.sort((a, b) => {
  //         if (a.status && b.status) {
  //           return b.status.text.localeCompare(a.status.text);
  //         }
  //       })
  //     }

  //     state.userTasks = newArr;
  //   }

  //   // sort by create date
  //   if (payload.sName == 'createdAt' && payload.order == 'asc') {
  //     state.userTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  //   }

  //   if (payload.sName == 'createdAt' && payload.order == 'desc') {
  //     state.userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  //   }

  //   // sort by due date
  //   if (payload.sName == 'dueDate' && payload.order == 'asc') {
  //     state.userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  //   }

  //   if (payload.sName == 'dueDate' && payload.order == 'desc') {
  //     state.userTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
  //   }

  //   // sort by priority
  //   if (payload.sName == "priority") {
  //     let arr = JSON.parse(JSON.stringify(state.userTasks))
  //     let newArr = []

  //     for (let i = 0; i < arr.length; i++) {
  //       if (arr[i].priority) {
  //         newArr.unshift(arr[i])
  //       } else {
  //         newArr.push(arr[i])
  //       }
  //     }
  //     if (payload.order == "asc") {
  //       newArr.sort((a, b) => {
  //         if (a.priority && b.priority) {
  //           return a.priority.text.localeCompare(b.priority.text);
  //         }
  //       });
  //     } else {
  //       newArr.sort((a, b) => {
  //         if (a.priority && b.priority) {
  //           return b.priority.text.localeCompare(a.priority.text);
  //         }
  //       });
  //     }
  //     state.userTasks = newArr;
  //   }

  // },

};


export const actions = {

  async setUser(ctx, payload) {
    await ctx.commit('setUser', payload);
  },

  async setUser2(ctx, payload) {
    await ctx.commit('setUser2', payload);
  },

  async setTeamMembers(ctx) {
    const members = await this.$axios.$get(`${process.env.ORG_API_ENDPOINT}/${ctx.rootState.user.user.subb}/users`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    ctx.commit("setTeamMembers", members)

    if (JSON.parse(localStorage.getItem('user')).subr == 'USER') {
      const userlist = await this.$axios.$get("/user/list", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
      })
      if (userlist.statusCode == 200) {
        let userTeam = members.filter(u => {
          if (userlist.data.userIds.includes(u.Id)) {
            return u
          }
        })
        ctx.commit("setAppMembers", userTeam)
      }
    } else {
      ctx.commit("setAppMembers", members)
    }

  },

  async setUserTasks(ctx, payload) {
    const res = await this.$axios.$get('user/tasks', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setUserTasks', res.data);
      return res.data
    }
  },
  async getUserTasks(ctx,payload){
    const res = await this.$axios.get("user/user-tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Filter: payload.filter,
        userid: payload.userId,
      },
    });

    if(res.data.statusCode==200){
      ctx.commit('setUserTasks', res.data.data);
      // if(payload.key!==''){
      //   ctx.commit('getUserTasks',payload)
      // }
      return res
    }
  
  },
  sortUserTasks(ctx, payload) {
    ctx.commit('sortUserTasks', payload)
  },

  async fetchUserHistory(ctx, payload) {
    const hist = await this.$axios.get('user/user-history', {
      headers: {
        "page": payload.page,
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    })
    return hist
  }
};
