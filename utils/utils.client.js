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
              today.setHours(0, 0, 0, 0);
              const lastSunday = new Date(today - today.getDay() * oneDay); // get date of last Sunday
              const nextSunday = new Date(lastSunday.getTime() + 7 * oneDay); // get date of next Sunday
              const nextNextSunday = new Date(nextSunday.getTime() + 7 * oneDay); // get date of Sunday after next
              const changeDueDate=new Date (idx)
              const selectedDate = new Date(changeDueDate.toISOString().substring(0, 10));
              selectedDate.setHours(0, 0, 0, 0);
              if (selectedDate < lastSunday ) {
                return  "Past week";
              } else if (selectedDate < nextSunday) {
                return  "This week";
              } else if (selectedDate < nextNextSunday) {
                return  "Next week";
              } else {
                return  "Later";
              }
  });
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
