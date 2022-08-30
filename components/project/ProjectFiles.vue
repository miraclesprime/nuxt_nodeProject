<template>
  <div id="project-files-wrapper">
    <div id="project-file-actions-wrapper" class="file-actions p-025 ">
      <div class="action-left d-flex " id="file-action-left">
        <div class="d-flex gap-05 cursor-pointer shape-rounded bg-hover-gray3 py-025 px-05 text-secondary text-hover-dark" id="file-upload-button">
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-upload-text" class="">Upload File</span>
        </div>
        <!-- <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="file-add-section-button" >
          <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="file-add-section-text" class="">New Section</span>
        </div> -->
      </div>
    </div>
    <div class="files d-flex flex-wrap gap-2 p-1" id="project-files-list">
      <!-- <bib-file :property="property" :favorite="isFileFavorite" icon="heart-like"></bib-file> -->
      <div v-for="n in 15" class="file bg-secondary-sub3 border-hover-gray4 ">
        <img :src="'https://loremflickr.com/320/240?random='+n" alt="">
        <div class="d-flex align-center gap-05 p-05">
          <bib-icon icon="file-text" variant="gray4" :scale="1.5"></bib-icon> <span>extremely-extremely-very-loooong-File-name.jpg</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProjectFiles",
  data: function() {
    return {
      property: {
        name: "File Name",
        variant: "secondary",
        preview: "https://loremflickr.com/640/360",
        // extension: "jpg",
        type: "Image",
        size: "234",
      },
      isFileFavorite: false
    }
  },
  methods: {

  }
}

</script>
<style scoped lang="scss">
.file-actions {
  border-bottom: 1px solid $gray4;
}

.files {
  .file {
    flex: 0 0 18rem;
    border-radius: 0.5rem;

    img {
      object-fit: cover;
      width: 100%;
      height: 12rem;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
  }
}

</style>
