export const TABLE_FIELDS = [
  {
    key: "id",
    label: "#"
  },
  {
    key: "title",
    label: "Task name"
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
  overview: "Overview",
  task: "Tasks",
  timeline: "Timeline",
  calendar: "Calendar",
  team: "Team",
  conversation: "Conversations",
  file: "Files"
};

export const TASKS = [
  {
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
]

export const Teammates = [
  {
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
]

export const TABS = Object.keys(TAB_TITLES).map(field => TAB_TITLES[field]);

export const DEFAULT_TAB = TAB_TITLES.overview;
