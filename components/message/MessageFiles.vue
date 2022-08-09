<template>
  <div class="msg-files pb-05">
    <small>{{files.length}} files</small>
    <div class="d-flex align-start gap-1">
      <figure v-for="file in files" class="position-relative file"><img :src="file.img" class="shape-rounded d-block" alt="img1">
        <div class="file-overlay d-flex align-center justify-center cursor-pointer">
          <bib-icon icon="bib-logo" variant="gray1" :scale="2"></bib-icon>
        </div>
        <div class="shape-circle bg-gray4 width-2 height-2 d-flex justify-center align-center file-menu">
          <bib-button pop="elipsis" :scale="1">
            <template v-slot:menu>
              <div class="list ">
                <span class="list__item file-name ">{{file.img}}</span>
                <hr>
                <span class="list__item">
                  <bib-icon icon="upload" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Open
                </span>
                <span class="list__item">
                  <bib-icon icon="urgent" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Details
                </span>
                <span class="list__item">
                  <bib-icon icon="align-bottom" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Download File
                </span>
                <span class="list__item">
                  <bib-icon icon="duplicate" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Copy
                </span>
                <hr>
                <span class="list__item list__item__danger">Delete</span>
              </div>
            </template>
          </bib-button>
        </div>
      </figure>
      <!-- <figure class="position-relative"><img src="https://placeimg.com/200/360/tech" class="shape-rounded" alt="img1"></figure>
      <figure class="position-relative"><img src="https://placeimg.com/150/200/tech" class="shape-rounded" alt="img1"></figure> -->
    </div>
  </div>
</template>
<script>
export default {

  name: 'MessageFiles',
  props: {
    files: { type: Array }
  },

  data() {
    return {

    }
  }
}

</script>
<style lang="scss" scoped>
.msg-files {
  color: $gray5;

  .file {
    .file-overlay {
      position: absolute;
      inset: 0;
      z-index: 3;
      background-color: rgba(240, 240, 255, 0.75);
      opacity: 0;
      transition: opacity 200ms ease-in;
    }

    .file-menu {
      opacity: 0;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 5;
      transition: opacity 180ms ease-out 200ms;

      .list {
        max-width: 12rem;
      }

      .file-name {
        white-space: normal;
        word-break: break-all;
        height: auto;
        cursor: default;
      }
    }

    &:hover {
      .file-menu {
        opacity: 1;
      }

      .file-overlay {
        opacity: 1;
      }
    }
  }
}

</style>
