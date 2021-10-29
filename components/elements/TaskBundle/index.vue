<template>
  <div :class="{ 'col-2': gridType === 'list' }">
    <template v-if="gridType === 'grid'">
      <div class="tasks" :class="activeColor">
        <a class="bundle-title" href="#" @click="isOpened = !isOpened">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 48 48"
            v-if="!isOpened"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="invisible_box" data-name="invisible box">
                <rect width="48" height="48" fill="none"></rect>
              </g>
              <g id="icons_Q2" data-name="icons Q2">
                <path
                  d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z"
                ></path>
              </g>
            </g>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 48 48"
            v-if="isOpened"
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="invisible_box" data-name="invisible box">
                <rect width="48" height="48" fill="none"></rect>
              </g>
              <g id="icons_Q2" data-name="icons Q2">
                <path
                  d="M24,27.2,13.4,16.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7l12,11.9a1.9,1.9,0,0,0,2.8,0l12-11.9a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2Z"
                ></path>
              </g>
            </g>
          </svg>

          <span>{{ title }}</span>
        </a>

        <template v-if="isOpened">
          <ul
            class="task-bundle padding-sm"
            v-for="(item, index) in tasks"
            :key="item.id + item.name"
            @click="toggleSidebar($event)"
          >
            <li class="task-item task-number">
              <span>0</span>
            </li>
            <li class="task-item task-name">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="'brand-1-' + item.id + index"
                />
                <label
                  class="custom-control-label"
                  :for="'brand-1-' + item.id + index"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 48 48"
                  >
                    <g>
                      <path
                        d="M14.1,37.9,6.1,30a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2l6.6,6.6L39.1,10.1a2,2,0,0,1,2.8,2.8l-25,25A1.9,1.9,0,0,1,14.1,37.9Z"
                      ></path>
                    </g>
                  </svg>
                </label>
              </div>
              <span>{{ item.name }}</span>
            </li>
            <li
              class="task-item task-status"
              :class="progressColor(item.status[0])"
            >
              <span>{{ item.status[0] }}</span>
              <span class="ml-auto">{{ item.status[1] }}</span>
            </li>
            <li
              class="task-item task-priority"
              :class="priorityColor(item.priority)"
            >
              <span>{{ item.priority }}</span>
            </li>
            <li class="task-item task-assignee">
              <bib-avatar size="25px" />
              <span style="margin-left: 4px">{{ item.assignee }}</span>
            </li>
            <li class="task-item task-date">
              <span>{{ item.dueDate }}</span>
            </li>
            <li class="task-item" style="flex: 1"></li>
          </ul>
        </template>
      </div>
    </template>

    <template v-else>
      <div class="tasks list" :class="activeColor">
        <a class="bundle-title" href="#">
          <span>{{ title }}</span>
        </a>

        <ul
          class="task-bundle"
          v-for="(item, index) in tasks"
          :key="item.id + item.name + index"
          @click="toggleSidebar($event)"
        >
          <div class="task-bundle-top">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                :id="'brand-1-' + item.id + index"
              />
              <label
                class="custom-control-label"
                :for="'brand-1-' + item.id + index"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 48 48"
                >
                  <g>
                    <path
                      d="M14.1,37.9,6.1,30a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2l6.6,6.6L39.1,10.1a2,2,0,0,1,2.8,2.8l-25,25A1.9,1.9,0,0,1,14.1,37.9Z"
                    ></path>
                  </g>
                </svg>
              </label>
            </div>
            <div class="task-item task-name">
              <span
                >Lerem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do</span
              >
            </div>
            <div class="task-item" style="flex: 1" size="10">
              <bib-icon icon="elipsis"></bib-icon>
            </div>
          </div>

          <div class="task-bundle-bottom">
            <div class="task-item task-assignee">
              <bib-avatar size="25px" />
            </div>
            <div class="task-item task-date">
              <span>Due {{ item.dueDate }}</span>
            </div>
          </div>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Section",
    },
    tasks: Array,
    isExpanded: {
      type: Boolean,
      default: false,
    },
    gridType: String,
  },
  data: function () {
    return {
      isOpened: this.isExpanded,
      activeColor: "blue",
    };
  },
  methods: {
    toggleSidebar: function (event) {
      document.querySelector("#__layout").classList.toggle("show-sidebar");
      event.currentTarget.classList.toggle("active");
    },
    priorityColor: function (priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      if (priority === "Priority") return "text-green";
    },
    progressColor: function (progress) {
      if (progress === "Past Due") return "text-red";
      if (progress === "In-progress") return "text-blue";
    },
  },
  created: function () {
    if (this.title === "Past Due") this.activeColor = "red";
    if (this.title === "Due Today") this.activeColor = "orange";
    if (this.title === "Tomorrow") this.activeColor = "green";
  },
};
</script>

<style lang="scss" scoped>
.bundle-title {
  font-weight: 600;

  &:hover {
    color: #333;
  }
}

.tasks {
  border-bottom: 1px solid $gray4;
}

.red,
.orange,
.green,
.blue {
  .task-bundle.active {
    .bundle-title,
    .task-number,
    .task-name,
    .task-status,
    .task-date,
    .task-priority,
    .task-assignee {
      color: #fff;
    }
  }
}

.red .task-bundle.active {
  background-color: $red;
}

.orange .task-bundle.active {
  background-color: $orange;

  .custom-control-label:before {
    border-color: $orange;
  }
}

.green .task-bundle.active {
  background-color: $green;

  .custom-control-label:before {
    border-color: $green;
  }
}

.blue .task-bundle.active {
  background-color: $blue;

  .custom-control-label:before {
    border-color: $blue;
  }
}

.task-bundle {
  cursor: pointer;
}

.tasks.red {
  .bundle-title span,
  .task-name,
  .task-date {
    color: $red;
  }

  .custom-control-label::before {
    border-color: $red;
  }

  .bundle-title svg g,
  .custom-control-label g {
    fill: $red;
  }

  .custom-control-input:checked ~ .custom-control-label:before {
    border-color: $red;
  }
}

.tasks.orange {
  .bundle-title span,
  .task-date {
    color: $orange;
  }
  .bundle-title svg g,
  .custom-control-label g {
    fill: $orange;
  }

  .custom-control-input:checked ~ .custom-control-label:before {
    border-color: $orange;
  }
}

.tasks.green {
  .bundle-title span,
  .task-date {
    color: $green;
  }

  .bundle-title svg g,
  .custom-control-label g {
    fill: $green;
  }

  .custom-control-input:checked ~ .custom-control-label:before {
    border-color: $green;
  }
}

.task-bundle.active {
  .custom-control-label svg {
    opacity: 1;
    visibility: visible;
  }
}

.tasks.list {
  box-shadow: none;

  .task-bundle {
    display: block;
    margin: 0 10px 20px;
    border-radius: 5px;
  }

  .task-item {
    border: none;
    width: unset;
  }

  .task-name {
    padding-top: 10px;
    padding-bottom: 8px;

    span {
      margin-left: 32px;
      font-size: 15px;
    }
  }

  .task-bundle-top,
  .task-bundle-bottom {
    display: flex;
    position: relative;
  }

  .task-bundle-top {
    align-items: start;
  }

  .custom-control-label {
    &::before {
      width: 25px;
      height: 25px;
    }
  }

  .task-bundle-bottom {
    display: flex;
    justify-content: space-between;
  }
}

.col-2 {
  min-height: 78vh;
  border-right: 1px solid $gray4;

  .tasks.list {
    border-bottom: none;
  }
}
</style>