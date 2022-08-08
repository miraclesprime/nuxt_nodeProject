<template>
  <div class="msg">
    <div class="msg__date"></div>
    <div class="d-flex">
      <figure class="width-5">
        <bib-avatar size="3rem"></bib-avatar>
      </figure>
      <div class="flex-grow-1">
        <div class="msg__owner">Vishwajeet <small class="ml-1">Monday, January 25, 2021 @ 14:50</small></div>
        <div class="msg__content pb-05">
          <p>Lorem ipsum dolor sit amet consectetur 🙂, <a href="https://dev.proj-mgmt.biztree.com/">ipsum</a> adipisicing elit. Sit eum praesentium animi error delectus reprehenderit neque odit? Nesciunt facere quod ab veniam eligendi architecto vitae?</p>
        </div>
        <message-files :files="files"></message-files>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'Message',

  data() {
    return {
    	files: [
    		{ img: 'https://placeimg.com/200/300/tech' },
    		{ img: 'https://placeimg.com/200/360/tech' },
    		{ img: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
    		{ img: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image'}
    	]
    }
  }
}

</script>
<style lang="scss" scoped>
.msg {
  border-top: 1px solid $gray3;
  padding-top: 1rem;
  font-size: $font-size-lg;

  &__owner {
    color: $text;
    font-weight: bold;

    small {
      font-size: $base-size;
      color: $gray5;
      font-weight: normal;
    }
  }

  &__content {
    font-size: 1rem;
    color: $gray5;
  }

  &__files {
    color: $gray5;

    .file {
      .file-overlay {
        position: absolute;
        inset: 40%;
        z-index: 3;
        background-color: rgba(220, 220, 230, 0.25);
        opacity: 0.1;
        transition: opacity 300ms ease-in, inset 400ms linear;
      }

      .file-menu {
        opacity: 0;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 5;
        transition: opacity 200ms ease-out 400ms;

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
        	inset: 0;
        	opacity: 1;
        }
      }
    }
  }
}

</style>
