<template>
  <div>
    <task-actions />

    <ul class="task-bundle">
      <li class="task-item task-number">
        <span>#</span>
      </li>
      <li class="task-item task-name" style="width: 50%">
        <span>File name</span>
      </li>
      <li class="task-item task-status">
        <span>File Type</span>
      </li>
      <li class="task-item task-priority">
        <span>Owner</span>
      </li>
      <li class="task-item task-assignee">
        <span>Added/Modified</span>
      </li>
      <li class="task-item justify-center" style="flex: 1">
        <bib-icon icon="elipsis"></bib-icon>
      </li>
    </ul>

    <div class="file w-100">
      <div class="folder-name">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 48 48"
        >
          <title>folder</title>
          <g id="Layer_2" data-name="Layer 2">
            <g id="invisible_box" data-name="invisible box">
              <rect width="48" height="48" fill="none"></rect>
            </g>
            <g id="icons_Q2" data-name="icons Q2">
              <path
                d="M19.3,10l4.9,4.8L25.3,16H42V38H6V10H19.3M21,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2H27L21,6Z"
              ></path>
            </g>
          </g>
        </svg>
        <span>Folder</span>
      </div>

      <ul
        class="task-bundle"
        v-for="(item, index) in [1, 2, 3, 4, 5]"
        :key="'task-file-' + index"
      >
        <li class="task-item task-number">0</li>
        <li class="task-item task-name" style="width: 50%">
          <bib-icon icon="awesome-file"></bib-icon>
          <span>File name</span>
        </li>
        <li class="task-item task-status">
          <span class="m-0">File Type</span>
        </li>
        <li class="task-item task-priority">
          <bib-avatar size="20px" class="m-0"></bib-avatar>
          <span>Owner</span>
        </li>
        <li class="task-item task-assignee">
          <span class="m-0">Nov 23, 2032</span>
        </li>
        <li class="task-item justify-center" style="flex: 1">
          <bib-icon icon="elipsis"></bib-icon>
        </li>
      </ul>
      <div class="folder-name">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 48 48"
        >
          <title>folder</title>
          <g id="Layer_2" data-name="Layer 2">
            <g id="invisible_box" data-name="invisible box">
              <rect width="48" height="48" fill="none"></rect>
            </g>
            <g id="icons_Q2" data-name="icons Q2">
              <path
                d="M19.3,10l4.9,4.8L25.3,16H42V38H6V10H19.3M21,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2H27L21,6Z"
              ></path>
            </g>
          </g>
        </svg>
        <span>Folder</span>
      </div>

      <div class="folder-name">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 48 48"
        >
          <title>folder</title>
          <g id="Layer_2" data-name="Layer 2">
            <g id="invisible_box" data-name="invisible box">
              <rect width="48" height="48" fill="none"></rect>
            </g>
            <g id="icons_Q2" data-name="icons Q2">
              <path
                d="M19.3,10l4.9,4.8L25.3,16H42V38H6V10H19.3M21,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2H27L21,6Z"
              ></path>
            </g>
          </g>
        </svg>
        <span>Folder</span>
      </div>

      <div class="folder-name">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 48 48"
        >
          <title>folder</title>
          <g id="Layer_2" data-name="Layer 2">
            <g id="invisible_box" data-name="invisible box">
              <rect width="48" height="48" fill="none"></rect>
            </g>
            <g id="icons_Q2" data-name="icons Q2">
              <path
                d="M19.3,10l4.9,4.8L25.3,16H42V38H6V10H19.3M21,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2H27L21,6Z"
              ></path>
            </g>
          </g>
        </svg>
        <span>Folder</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file {
  span {
    margin-left: 15px;
  }

  .folder-name,
  .file-name {
    padding: 10px 14px;
    font-size: $sidebar-size;
  }

  .folder-name {
    border-top: 1px solid $gray4;
  }

  .file-name {
    display: flex;
    position: relative;
    border-top: 1px solid $gray6;

    &:last-child {
      border-bottom: 1px solid $gray4;
    }

    .options {
      margin-left: auto;
    }
  }
}
</style>
