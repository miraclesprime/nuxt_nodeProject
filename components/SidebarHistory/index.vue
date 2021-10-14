<template>
  <div class="container pt-1">
    <div class="task-group">
      <a href="#" class="add-task">
        <a href="#" class="title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 48 48"
          >
            <title>arrowhead-right</title>
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
          Day or Date
        </a>
      </a>

      <div
        class="task w-100"
        v-for="(item, index) in [1, 2, 3, 4, 5]"
        :key="'task' + index"
      >
        <span>8:00</span>
        <div class="divider" style="left: 7.6%"></div>

        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            :id="'brand-' + index"
          />
          <label class="custom-control-label" :for="'brand-' + index">
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

        <span class="task-name">Entity Action</span>

        <a href="#">Location</a>
      </div>
    </div>

    <div class="task-group">
      <a href="#" class="add-task">
        <a href="#" class="title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 48 48"
          >
            <title>arrowhead-right</title>
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
          Day or Date
        </a>
      </a>

      <div
        class="task w-100"
        v-for="(item, index) in [1, 2, 3, 4, 5]"
        :key="'task' + index"
      >
        <span>8:00</span>
        <div class="divider" style="left: 7.6%"></div>

        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            :id="'brand-' + index"
          />
          <label class="custom-control-label" :for="'brand-' + index">
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

        <span class="task-name">Entity Action</span>

        <a href="#">Location</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-task {
  margin: 0 0 8px 0;
}

.title {
  margin-left: 5px;
  font-size: $sidebar-size;
}

.custom-control-label::before {
  left: 2.9rem;
}

.custom-checkbox svg {
  left: 49px;
}

.task {
  padding-left: 3px;

  &:last-child {
    border-bottom: 1px solid $gray4;
  }

  a {
    color: $primary;
  }
}

.task-group {
  width: 100%;
  min-height: 1px;
}

.task-name {
  width: 30%;
  padding-left: 3.2rem;
}
</style>