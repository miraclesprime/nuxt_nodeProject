export default ({ store, app, context }, inject) => {
  inject('isFavTask', (idx) => {
    const favtasks = store.state.task.favTasks
    let fav = favtasks.some(t => t.id == idx)
    if (fav) {
      return { variant: "orange", text: "Remove favorite", status: true }
    } else {
      return { variant: "gray5", text: "Add to favorites", status: false }
    }
  });
  inject('isFavProject', (idx) => {
    const favprojects = store.state.project.favProjects
    let fav = favprojects.some(p => p.projectId == idx)
    if (fav) {
      return { variant: "orange", text: "Remove favorite", status: true }
    } else {
      return { variant: "gray5", text: "Add to favorites", status: false }
    }
  });
  inject('CheckFavTask', (idx) => {
    const favtasks = store.state.task.favTasks
    let fav = favtasks.some(t => t.taskId == idx)
    if (fav) {
      return true
    } else {
      return false
    }
  });
  inject('CheckFavProject', (idx) => {
    const favprojects = store.state.project.favProjects
    let fav = favprojects.some(p => p.projectId == idx)
    if (fav) {
      return true
    } else {
      return false
    }
  });
  inject('CalDate', (idx) => {
              const oneDay = 24 * 60 * 60 * 1000; // one week in milliseconds
              const today = new Date();
              const todayTime=new Date (today.toISOString().substring(0, 10))
              todayTime.setHours(0, 0, 0, 0)
              today.setHours(0, 0, 0, 0);
              
              const lastSunday = new Date(today - today.getDay() * oneDay); // get date of last Sunday
              const nextSunday = new Date(lastSunday.getTime() + 7 * oneDay); // get date of next Sunday
              const nextNextSunday = new Date(nextSunday.getTime() + 7 * oneDay); // get date of Sunday after next
              const changeDueDate=new Date (idx)
              const selectedDate = new Date(changeDueDate.toISOString().substring(0, 10));
              selectedDate.setHours(0, 0, 0, 0);
              if (selectedDate < lastSunday ) {
                return  "Past Due";
              } else if(todayTime.getTime() === selectedDate.getTime()){
                return  "Today";
              } else
              if (selectedDate < nextSunday) {
                return  "This week";
              } else if (selectedDate < nextNextSunday) {
                return  "Next week";
              } else {
                return  "Later";
              }
  });
  inject('groupBy',(data,group)=>{
        let arr=data
        let _tasks=[];
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
        if (group == "priority") {  
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
          return _data
     
       }
        if (group == "department") {
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
            return _tasks
        }
        if (group == "project") {
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
          return _tasks
        }
        if(group=="dueDate"){
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

            // calc dueDate
            let _dueDate=""
            const oneDay = 24 * 60 * 60 * 1000; // one week in milliseconds
            const today = new Date();
            const todayTime=new Date (today.toISOString().substring(0, 10))
            todayTime.setHours(0, 0, 0, 0)
            today.setHours(0, 0, 0, 0);
            
            const lastSunday = new Date(today - today.getDay() * oneDay); // get date of last Sunday
            const nextSunday = new Date(lastSunday.getTime() + 7 * oneDay); // get date of next Sunday
            const nextNextSunday = new Date(nextSunday.getTime() + 7 * oneDay); // get date of Sunday after next
            const changeDueDate=new Date (task.dueDate)
            const selectedDate = new Date(changeDueDate.toISOString().substring(0, 10));
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate < lastSunday ) {
              _dueDate=  "Past Due";
            } else if(todayTime.getTime() === selectedDate.getTime()){
              _dueDate="Today";
            } else
            if (selectedDate < nextSunday) {
              _dueDate= "This week";
            } else if (selectedDate < nextNextSunday) {
              _dueDate= "Next week";
            } else {
              _dueDate= "Later";
            }

            const dueDate =_dueDate ?? "Unassigned"
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
          return _tasks
    }
        if (group == "assignee") {
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
          return _tasks
        }
        if (group == "status") {
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
          return _tasks
        }
  })
  inject('donotCloseSidebar', (classes) => {
    const cl = ['editable-input', 'user-info', 'date-info']
    let out = true
    cl.forEach((c) => {
      let cd = classes.contains(c)
      if (cd) {
        out = false
        return false
      }
    });
    return out
  })
}
