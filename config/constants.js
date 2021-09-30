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

export const TABS = Object.keys(TAB_TITLES).map(field => TAB_TITLES[field]);

export const DEFAULT_TAB = TAB_TITLES.overview;
