export const DUMMY_TASKS = [{
    key: 1,
    name: "Task - 1",
    status: "Past Due",
    progress: "80%",
    priority: "Urgent",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 2,
    name: "Task - 2",
    status: "Past Due",
    progress: "80%",
    priority: "Top",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 3,
    name: "Task - 3",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 4,
    name: "Task - 4",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 5,
    name: "Task - 5",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 6,
    name: "Task - 6",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 7,
    name: "Task - 7",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 8,
    name: "Task - 8",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 9,
    name: "Task - 9",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 10,
    name: "Task - 10",
    status: "DONE",
    priorit: "LOW",
    assignee: "Ramon",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  },
  {
    key: 11,
    name: "Task - 11",
    status: "DONE",
    priorit: "LOW",
    assignee: "Bruno",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  },
  {
    key: 12,
    name: "Task - 12",
    status: "DONE",
    priorit: "LOW",
    assignee: "Bruno",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  }
];

export const DUMMY_PROJECT = {
  companyId: 1,
  title: "Tom's Business project",
  description: "2030 Project Description",
  dueDate: "2030-8-31",
  priority: "medium",
  buget: 10.0

}

export const SECTION_TASKS = [{
    "id": 14,
    "projectId": 3,
    "title": "_section3",
    "order": 0,
    "isDeleted": false,
    "createdAt": "2022-07-01T12:59:22.000Z",
    "updatedAt": "2022-07-01T12:59:22.000Z",
    "tasks": [{
      "id": 19,
      "userId": "k61YQdJ6J7ldOGpJ",
      "companyId": "O3GWpmbk5ezJn4KR",
      "sectionId": 14,
      "statusId": 5,
      "todoId": 34,
      "priorityId": 3,
      "departmentId": null,
      "title": "Demo Task",
      "order": 17,
      "tOrder": 0,
      "description": "",
      "dueDate": "2022-08-23T00:00:00.000Z",
      "budget": "0.00",
      "isDeleted": false,
      "isDone": false,
      "createdAt": "2022-07-01T12:59:22.000Z",
      "updatedAt": "2022-07-01T13:00:06.000Z",
      "status": {
        "id": 5,
        "text": "Done"
      },
      "priority": {
        "id": 3,
        "text": "low"
      },
      "user": {
        "id": "k61YQdJ6J7ldOGpJ",
        "firstName": "Dhruv",
        "lastName": "Sharma"
      }
    }]
  },
  {
    "id": 6,
    "projectId": 3,
    "title": "Section one",
    "order": 2,
    "isDeleted": false,
    "createdAt": "2022-06-29T11:02:34.000Z",
    "updatedAt": "2022-06-29T11:18:23.000Z",
    "tasks": [{
        "id": 21,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 6,
        "statusId": 1,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Task no section",
        "order": 1,
        "tOrder": 17,
        "description": "",
        "dueDate": "2022-07-06T10:01:54.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:01:58.000Z",
        "updatedAt": "2022-07-06T10:01:58.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": {
          "id": "DKgl9av2NwnaG1vz",
          "firstName": "Vishwajeet",
          "lastName": "Mandal"
        }
      },
      {
        "id": 22,
        "userId": null,
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 6,
        "statusId": 1,
        "todoId": null,
        "priorityId": 2,
        "departmentId": null,
        "title": "Test task",
        "order": 0,
        "tOrder": 18,
        "description": "",
        "dueDate": "2022-07-06T10:02:41.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:02:44.000Z",
        "updatedAt": "2022-07-06T10:03:06.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": null
      }
    ]
  },
  {
    "id": 27,
    "projectId": 3,
    "title": "Ultimate",
    "order": 18,
    "isDeleted": false,
    "createdAt": "2022-07-07T11:16:12.000Z",
    "updatedAt": "2022-07-07T11:16:12.000Z",
    "tasks": [{
        "id": 20,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 27,
        "statusId": 1,
        "todoId": 22,
        "priorityId": 2,
        "departmentId": null,
        "title": "New test task",
        "order": 1,
        "tOrder": 0,
        "description": "",
        "dueDate": "2022-07-08T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T09:42:08.000Z",
        "updatedAt": "2022-07-06T09:42:37.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": {
          "id": "DKgl9av2NwnaG1vz",
          "firstName": "Vishwajeet",
          "lastName": "Mandal"
        }
      },
      {
        "id": 27,
        "userId": null,
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 27,
        "statusId": 3,
        "todoId": null,
        "priorityId": 2,
        "departmentId": null,
        "title": "Ultimate task",
        "order": 0,
        "tOrder": 23,
        "description": "",
        "dueDate": "2022-07-29T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-07T11:17:00.000Z",
        "updatedAt": "2022-07-07T11:17:00.000Z",
        "status": {
          "id": 3,
          "text": "Waiting"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": null
      }
    ]
  }
]
