export const TABLE_FIELDS = [{
    key: "",
    label: "#"
  },
  {
    key: "title",
    label: "Task name",
  },
  {
    key: "status",
    label: "Status"
  },
  {
    key: "priority",
    label: "Priority"
  },
  {
    key: "assignee",
    label: "Assignee"
  },
  {
    key: "dueDate",
    label: "Due Date"
  }
];

export const TASK_FIELDS = [{
    key: "title",
    label: "Task name",
    width: "32%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    event: "task-click",
  },
  {
    key: "status",
    label: "Status",
    width: "10%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    key: "priority",
    label: "Priority",
    width: "8%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    key: "userId",
    label: "Owner",
    width: "20%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    key: "startDate",
    label: "Start Date",
    width: "10%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    key: "dueDate",
    label: "Due Date",
    width: "10%",
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
];

export const FILE_FIELDS = [
  {
    key: "",
    label: "#"
  },{
    key: "name",
    label: "Name",
  },
  {
    key: "type",
    label: "File type",
  },
  {
    key: "size",
    label: "File size",
  },
  {
    key: "owner",
    label: "Owner",
  },
  {
    key: "date",
    label: "Upload date",
  }
];

export const TASKS = [{
    name: "Remind me what time it is",
    author: "Bruno Goulet",
    date: "Jan-22"
  },
  {
    name: "Turn the music up",
    author: "Elon Musk",
    date: "Jan-22"
  },
  {
    name: "Live long and prosper",
    author: "Johny Boy",
    date: "Jan-22"
  }
];

export const TEAMMATES = [{
    name: "Bruno Goulet",
    role: "Developer"
  },
  {
    name: "Elon Musk",
    role: "Developer"
  },
  {
    name: "Guy Laliberte",
    role: "Developer"
  },
  {
    name: "Tony Robbins",
    role: "Developer"
  },
  {
    name: "Albert Einstein",
    role: "Owner"
  },
  {
    name: "Capt. Jean Luc-Picard",
    role: "Assignee"
  }
];

// project index page constants -----

export const PROJECT_TABS = [
  /*{
    key: "overview",
    value: "overview",
    title: "Overview"
  },*/
  {
    key: "tasks",
    value: "tasks",
    title: "Tasks"
  },
  // {
  //   key: "timeline",
  //   value: "timeline",
  //   title: "Timeline"
  // },
  // {
  //   key: "calendar",
  //   value: "calendar",
  //   title: "Calendar"
  // },
  {
    key: "team",
    value: "team",
    title: "Team"
  },
  {
    key: "conversations",
    value: "conversations",
    title: "Conversations"
  },
  {
    key: "files",
    value: "files",
    title: "Files"
  },
  {
    key: "history",
    value: "history",
    title: "History",
  }
];

export const PROJECT_DEFAULT_TAB = {
  key: "tasks",
  value: "tasks",
  title: "Tasks"
};

export const PROJECT_TAB_TITLES = {
  overview: "overview",
  tasks: "tasks",
  timeline: "timeline",
  calendar: "calendar",
  team: "team",
  conversations: "conversations",
  files: "files",
  history: "history",
};

// dream index page constants -----

export const DREAM_TABS = [{
    key: "overview",
    value: "overview",
    title: "Overview"
  },
  {
    key: "goals",
    value: "goals",
    title: "Goals"
  },
  {
    key: "projects",
    value: "projects",
    title: "Projects"
  },
  {
    key: "tasks",
    value: "tasks",
    title: "Tasks"
  },
  {
    key: "team",
    value: "team",
    title: "Team"
  },
  {
    key: "conversations",
    value: "conversations",
    title: "Conversations"
  },
  {
    key: "files",
    value: "files",
    title: "Files"
  }
];

export const DREAM_DEFAULT_TAB = {
  key: "overview",
  value: "overview",
  title: "Overview"
};

export const DREAM_TAB_TITLES = {
  overview: "overview",
  goals: "goals",
  projects: "projects",
  tasks: "tasks",
  team: "team",
  conversations: "conversations",
  files: "files"
};

// goal index page constants -----

export const GOAL_TABS = [{
    key: "overview",
    value: "overview",
    title: "Overview"
  },
  {
    key: "projects",
    value: "projects",
    title: "Projects"
  },
  {
    key: "tasks",
    value: "tasks",
    title: "Tasks"
  },
  {
    key: "team",
    value: "team",
    title: "Team"
  },
  {
    key: "conversations",
    value: "conversations",
    title: "Conversations"
  },
  {
    key: "files",
    value: "files",
    title: "Files"
  }
];

export const GOAL_DEFAULT_TAB = {
  key: "overview",
  value: "overview",
  title: "Overview"
};

export const GOAL_TAB_TITLES = {
  overview: "overview",
  projects: "projects",
  tasks: "tasks",
  team: "team",
  conversations: "conversations",
  files: "files"
};

export const VIEW_FILTER = [
  { label: 'Incompleted', key: 'incomplete', },
  { label: 'Completed', key: 'complete' },
  { label: 'All', key: 'all', selected: true }
]

export const GOAL_VIEW_FILTER = [
  { label: 'Incompleted Goals', key: 'incomplete', },
  { label: 'Completed Goals', key: 'complete' },
  { label: 'All Goals', key: 'all', selected: true }
]

export const DREAM_VIEW_FILTER = [
  { label: 'Incompleted Dreams', key: 'incomplete', },
  { label: 'Completed Dreams', key: 'complete' },
  { label: 'All Dreams', key: 'all', selected: true }
]

export const PROJECT_SORT = [
  { label: 'Name', key: 'name' },
  { label: 'Owner', key: 'owner' },
  { label: 'Status', key: 'status' },
  { label: 'Priority', key: 'priority' },
  { label: 'Start Date', key: 'startDate' },
  { label: 'Due Date', key: 'dueDate' },
  // { label: 'Tag', key: 'tag' },
  // { label: 'Department', key: 'department' },
]

export const PROJECT_TEAM_FIELDS = [
  { label: '#', key: '' },
  { label: 'Name', key: 'name' },
  // { label: 'Location', key: 'location' },
  // { label: 'Position', key: 'position' },
  // { label: 'Added/Modified', key: 'createdAt' } 
]

export const TASK_SORT = [
  { label: 'Name', key: 'title' },
  { label: 'Owner', key: 'userId' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Start Date', key: 'startDate' },
  { label: 'Due Date', key: 'dueDate' },
]

export const TASK_GROUP = [
  { label: 'Title', key:'title' },
  { label: 'Priority', key:'priority' },
  { label: 'Status', key:'status' },
  { label: 'Due Date', key:'dueDate' },
]

export const FAVORITE_SORT = [
  { label: 'Name', key: 'title' },
  { label: 'Status', key: 'status' },
  { label: 'Priority', key: 'priority' },
  { label: 'Owner', key: 'userId' },
  { label: 'Due Date', key: 'dueDate' },
]

export const DEPARTMENT = [
  { label: 'Choose department', value: null },
  { label: 'IT', value: "it" },
  { label: 'Marketing', value: "marketing" },
]
export const STATUS = [
  { label: 'Select' },
  { label: 'Not Started', value: '1' },
  { label: 'In-Progress', value: '2' },
  { label: 'Waiting', value: '3' },
  { label: 'Delayed', value: '4' },
  { label: 'Done', value: '5' },
]
export const PRIORITY = [
  { label: 'Select' },
  { label: 'Low', value: '3' },
  { label: 'Medium', value: '2' },
  { label: 'High', value: '1' },
]

export const PROJECT_FAVORITES = [

  {
    label: 'Project name',
    key: 'title',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    event: "project-click"
  },
  {
    label: 'Department',
    key: 'department',
    /*header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }*/
  },
  {
    label: 'Status',
    key: 'status',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Priority',
    key: 'priority',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Owner',
    key: 'userId',
    width: '20%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Start Date',
    key: 'startDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Due Date',
    key: 'dueDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  }
]

export const TASK_FAVORITES = [

  {
    label: 'Task name',
    key: 'title',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    event: "task-click",
  },
  {
    label: "Project",
    key: "project",
    header_icon: {
      icon: "swap-vertical",
      event: "table-sort",
      isActive: false,
    },
  },
  {
    label: 'Status',
    key: 'status',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Priority',
    key: 'priority',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Owner',
    key: 'userId',
    width: '15%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Start Date',
    key: 'startDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Due Date',
    key: 'dueDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  }
]

export const PROJECT_CONTEXT_MENU = [
  { label: 'Add to Favorites', event: 'fav-project', variant: '', icon: 'bookmark', iconVariant: 'gray5' },
  { label: 'Share with', event: 'share-project', variant: '', icon: 'user-add', iconVariant: 'gray5' },
  { label: 'Rename', event: 'rename-project', variant: '', icon: 'pencil', iconVariant: 'gray5' },
  { label: 'Report', event: 'report-project', variant: '', icon: 'warning', iconVariant: 'gray5' },
  { label: 'Delete', event: 'delete-project', variant: 'danger', icon: '', iconVariant: '' },
]

export const TASK_CONTEXT_MENU = [
  { label: 'Mark Complete', event: 'done-task', variant: '', icon: 'check-circle', iconVariant: 'gray5' },
  { label: 'Add to Favorites', event: 'fav-task', variant: '', icon: 'bookmark', iconVariant: 'gray5' },
  { label: 'Attach file...', event: 'attach-file', variant: '', icon: 'upload', iconVariant: 'gray5' },
  { label: 'Assign to...', event: 'assign-task', variant: '', icon: 'user-add', iconVariant: 'gray5' },
  { label: 'Set as reminder', event: 'set-reminder', variant: '', icon: 'notification', iconVariant: 'gray5' },
  { label: 'Copy', event: 'copy-task', variant: '', icon: 'duplicate', iconVariant: 'gray5' },
  { label: 'Move', event: 'move-task', variant: '', icon: 'transfer', iconVariant: 'gray5' },
  { label: 'Report', event: 'report-task', variant: '', icon: 'warning', iconVariant: 'gray5' },
  { label: 'Delete', event: 'delete-task', variant: 'danger', icon: '', iconVariant: '' },
]

export const COMPANY_TASK_FIELDS = [

  {
    label: 'Task name',
    key: 'title',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    event: "task-click",
  },
  {
    label: "Project",
    key: "project",
    header_icon: {
      icon: "swap-vertical",
      event: "table-sort",
      isActive: false,
    },
  },
  {
    label: 'Status',
    key: 'status',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Priority',
    key: 'priority',
    width: '12%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Owner',
    key: 'userId',
    width: '15%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Start Date',
    key: 'startDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Due Date',
    key: 'dueDate',
    width: '10%',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  }
]


export const USER_TASKS = [

  {
    label: 'Task name',
    key: 'title',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    width: "25%",
    event: "task-click",
  },
  {
    label: 'Project',
    key: 'project',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    },
    width: "15%",
  },
  {
    label: 'Status',
    key: 'status',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Start Date',
    key: 'startDate',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Due Date',
    key: 'dueDate',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Priority',
    key: 'priority',
    header_icon: {
      icon: 'swap-vertical',
      event: 'table-sort',
      isActive: false
    }
  },
  {
    label: 'Tag',
    key: 'tag',

  },
  {
    label: 'Team',
    key: 'team',

  },
  {
    label: 'Department',
    key: 'department',

  },
]

export const USER_TASK_SORT = [
  { label: 'Name', key: 'title' },
  { label: 'Project', key: 'project' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Start Date', key: 'startDate' },
  { label: 'Due Date', key: 'dueDate' },
]

export const GOAL_SORT = [
  { label: 'Name', key: 'name' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Owner', key: 'owner' },
  { label: 'Due Date', key: 'dueDate' },
]

export const DREAM_SORT = [
  { label: 'Name', key: 'name' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Owner', key: 'owner' },
  { label: 'Due Date', key: 'dueDate' },
]

export const COMPANY_TASK_SORT = [
  { label: 'Name', key: 'title' },
  { label: 'Project', key: 'project' },
  { label: 'Status', key: 'status' },
  { label: 'Priority', key: 'priority' },
  { label: 'Owner', key: 'userId' },
  { label: 'Due Date', key: 'dueDate' },
]

export const TaskTeamFields = [{
    label: '#',
    key: ''
  },
  {
    label: 'name',
    key: 'name',
  },
  {
    label: 'delete',
    key: 'delete',
    width: '10%'
  }
]