<template>
  <div class="container pt-1">
    <a href="#" class="add-task">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <g>
          <path
            d="M39,22H26V9a2,2,0,0,0-4,0V22H9a2,2,0,0,0,0,4H22V39a2,2,0,0,0,4,0V26H39a2,2,0,0,0,0-4Z"
          ></path>
        </g>
      </svg>

      <span>Add Files/Folders</span>
    </a>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      preserveAspectRatio="xMinYMin"
      class="arrows"
      width="15"
      height="15"
    >
      <path
        class="medium-gray arrow-r"
        d="M16,7.4h-2v7.4c0.1,0.6-0.4,1.2-1,1.2c-0.6-0.1-1.1-0.6-1-1.2V7.4h-2L13,0L16,7.4z"
      ></path>
      <path
        class="medium-gray arrow-r"
        d="M6,8.6L3,16L0,8.6h2V1.2C1.9,0.6,2.4,0.1,3,0c0.6,0.1,1.1,0.6,1,1.2v7.4L6,8.6z"
      ></path>
    </svg>

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

      <div class="file-name">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 18 24"
        >
          <path
            class="a"
            d="M10.5,6.375V0H1.125A1.122,1.122,0,0,0,0,1.125v21.75A1.122,1.122,0,0,0,1.125,24h15.75A1.122,1.122,0,0,0,18,22.875V7.5H11.625A1.128,1.128,0,0,1,10.5,6.375ZM18,5.714V6H12V0h.286a1.124,1.124,0,0,1,.8.328l4.589,4.594A1.121,1.121,0,0,1,18,5.714Z"
          ></path>
        </svg>
        <div class="divider" style="left: 68%"></div>
        <span style="width: 65%">File</span>
        <div class="divider" style="left: 95%"></div>
        <span class="date">Nov 23, 2032</span>
        <span class="options">. . .</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-task {
  margin: 0 0 5px 0;
}

.arrows {
  margin: 4px 0 0 auto;
}

.file {
  span {
    margin-left: 5px;
  }

  .folder-name,
  .file-name {
    padding: 10px 0;
    font-size: $sidebar-size;
  }

  .folder-name {
    border-top: 1px solid $gray4;
  }

  .file-name {
    display: flex;
    position: relative;
    border-top: 1px solid $gray7;

    &:last-child {
      border-bottom: 1px solid $gray4;
    }

    .options {
      margin-left: auto;
    }
  }
}
</style>