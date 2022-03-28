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

export const TAB_TITLES = {
  overview: "overview",
  tasks: "tasks",
  timeline: "timeline",
  calendar: "calendar",
  team: "team",
  conversations: "conversations",
  files: "files"
};

export const TASK_FIELDS = [{
    key: "",
    label: "#"
  },
  {
    key: "title",
    label: "Task name",
    width: "32%",
  },
  {
    key: "status",
    label: "Status",
    width: "10%",
  },
  {
    key: "priority",
    label: "Priority",
    width: "8%",
  },
  {
    key: "owner",
    label: "Owner",
    width: "20%",
  },
  {
    key: "startDate",
    label: "Start Date",
    width: "10%",
  },
  {
    key: "dueDate",
    label: "Due Date",
    width: "10%",
  },
]

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

export const TABS = [{
    key: "overview",
    value: "overview",
    title: "Overview"
  },
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
  }
];

export const DEFAULT_TAB = {
  key: "overview",
  value: "overview",
  title: "Overview"
};

export const VIEW_FILTER = [
  { label: 'Incompleted', key: 'incomplete', },
  { label: 'Completed', key: 'complete' },
  { label: 'All', key: 'all', selected: true }
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
  { label: 'Name', key: 'name' },
  { label: 'Location', key: 'location' },
  { label: 'Position', key: 'position' },
  { label: 'Added/Modified', key: 'createdAt' } 
]

export const TASK_SORT = [
  { label: 'Name', key: 'name' },
  { label: 'Owner', key: 'owner' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Start Date', key: 'startDate' },
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
  { label: 'Select', },
  { label: 'Low', value: '3' },
  { label: 'Medium', value: '2' },
  { label: 'High', value: '1' },
]
