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
      <div class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
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
      <div class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
        <span>Folder</span>
      </div>

      <div class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
        <span>Folder</span>
      </div>

      <div class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
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
