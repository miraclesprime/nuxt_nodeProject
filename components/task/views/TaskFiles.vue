<template>
  <div id="task-files-wrapper">
    <task-actions />

    <ul class="task-bundle" id="task-files-task-bundle">
      <li class="task-item task-number" id="task-files-task-item1">
        <span id="task-files-task-item1-text">#</span>
      </li>
      <li class="task-item task-name" id="task-files-task-item2" style="width: 50%">
        <span id="task-files-task-item2-text">File name</span>
      </li>
      <li class="task-item task-status" id="task-files-task-item3">
        <span id="task-files-task-item3-text">File Type</span>
      </li>
      <li class="task-item task-priority" id="task-files-task-item4">
        <span id="task-files-task-item4-text">Owner</span>
      </li>
      <li class="task-item task-assignee" id="task-files-task-item5">
        <span id="task-files-task-item5-text">Added/Modified</span>
      </li>
      <li class="task-item justify-center" style="flex: 1" id="task-files-task-item6">
        <bib-icon icon="elipsis"></bib-icon>
      </li>
    </ul>

    <div class="file w-100" id="task-files-file">
      <div class="folder-name d-flex align-center" id="task-files-folder-name">
        <bib-icon icon="folder" />
        <span id="task-files-folder-text">Folder</span>
      </div>

      <ul
        class="task-bundle"
        :id="'task-file-' + index"
        v-for="(item, index) in [1, 2, 3, 4, 5]"
        :key="'task-file-' + index"
      >
        <li id="task-files-task-item1" class="task-item task-number">0</li>
        <li id="task-files-task-item2" class="task-item task-name" style="width: 50%">
          <bib-icon icon="awesome-file"></bib-icon>
          <span  id="task-files-task-item1-name">File name</span>
        </li>
        <li id="task-files-task-item3" class="task-item task-status">
          <span id="task-files-task-item3-name" class="m-0">File Type</span>
        </li>
        <li id="task-files-task-item4" class="task-item task-priority">
          <bib-avatar size="20px" class="m-0"></bib-avatar>
          <span id="task-files-task-item4-name">Owner</span>
        </li>
        <li id="task-files-task-item5" class="task-item task-assignee">
          <span id="task-files-task-item5-name" class="m-0">Nov 23, 2032</span>
        </li>
        <li id="task-files-task-item6" class="task-item justify-center" style="flex: 1">
          <bib-icon icon="elipsis"></bib-icon>
        </li>
      </ul>
      <div class="folder-name d-flex align-center" id="task-files-folder-name-1">
        <bib-icon icon="folder" />
        <span id="task-files-folder-name-1-text">Folder</span>
      </div>

      <div id="task-files-folder-name-2" class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
        <span id="task-files-folder-name-2-text">Folder</span>
      </div>

      <div id="task-files-folder-name-3" class="folder-name d-flex align-center">
        <bib-icon icon="folder" />
        <span id="task-files-folder-name-3-text">Folder</span>
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
