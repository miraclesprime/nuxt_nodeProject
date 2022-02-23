<template>
  <div class="container pt-1">
    <section-title title="Add Files/Folders" />

    <div class="file w-100">
      <div class="folder-name">
        <bib-icon icon="folder" :scale="1.25"></bib-icon>

        <span>Folder</span>
      </div>

      <div class="file-name">
        <bib-icon icon="awesome-file" :scale="1.25"></bib-icon>
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
