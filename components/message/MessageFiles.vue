<template>
  <client-only>
    <div class="file d-flex ">
      <figure class="position-relative w-100"><img :src="preview" class="shape-rounded d-block" >
        <div class="file-overlay d-flex align-center justify-center cursor-pointer">
          <!-- <bib-icon icon="search" variant="gray1" :scale="2"></bib-icon> -->
          <fa :icon="faMagnifyingGlassPlus" class="width-2 height-2" ></fa>
        </div>
        <div class="shape-circle bg-gray4 width-2 height-2 d-flex justify-center align-center file-menu">
          <bib-button pop="elipsis" :scale="1">
            <template v-slot:menu>
              <div class="list ">
                <span class="list__item file-name ">{{property.name}}</span>
                <hr>
                <!-- <span class="list__item">
                <bib-icon icon="upload" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Open
              </span> -->
                <span class="list__item">
                  <bib-icon icon="urgent" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Details
                </span>
                <span class="list__item" @click.stop="downloadFile">
                  <bib-icon icon="align-bottom" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Download File
                </span>
                <!-- <span class="list__item">
                <bib-icon icon="duplicate" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Copy
              </span> -->
                <!-- <hr>
                <span class="list__item list__item__danger">Delete</span> -->
              </div>
            </template>
          </bib-button>
        </div>
      </figure>
      <!-- <figure class="position-relative"><img src="https://placeimg.com/200/360/tech" class="shape-rounded" alt="img1"></figure>
      <figure class="position-relative"><img src="https://placeimg.com/150/200/tech" class="shape-rounded" alt="img1"></figure> -->
    </div>
  </client-only>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
export default {

  name: 'MessageFiles',
  props: {
    property: { type: Object }
  },

  components: {
    fa: FontAwesomeIcon,
  },

  data() {
    return {
      faMagnifyingGlassPlus,
      /*property: {
        name: "ImageFile Name",
        // colorLabel: "secondary-sub2",
        preview: "https://loremflickr.com/360/240",
        type: "image/png",
        size: "2340",
      }*/
    }
  },
  computed: {
    preview() {
      if (this.property.type.indexOf('image/') == 0 && "url" in this.property) {
        return this.property.url
      } else {
        // return 'https://placeimg.com/300/300/tech'
        return "https://via.placeholder.com/200x100/f0f0f0/6f6f79?text="+this.property.extension
      }
    },
    fileDetail() {
      let arr = []
      if (this.property.hasOwnProperty("id")) {
        Object.entries(this.property).map(([key, value]) => {
          // if (value) {
            if (key == 'name' || key == "extension" || key == "size" || key == "createdAt" || key == "updatedAt") {
              arr.push({ value: value, key: key })
            }
          // }
        })
      }
      return arr
    }
  },
  methods: {

    downloadFile() {
      this.$axios.get("file/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          console.log(f.data)
          if (f.data.statusCode == 200) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = f.data.data;
            // the filename you want
            // a.download = 'todo-1.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
            alert('your file has downloaded!');
          }
        })
        .catch(e => console.error(e))
    },
  }
}

</script>

<style lang="scss" scoped>
.file {
  min-height: 8rem;
  font-size: 1rem;
  background-color: rgb(240, 240, 240);
  flex: 0 1 14rem;
  figure {
    img { width:100%; object-fit: contain; aspect-ratio: 14 / 8; }
  }

  .file-overlay {
    position: absolute;
    inset: 0;
    z-index: 3;
    background-color: rgba(220, 220, 225, 0.75);
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

table {
  border: 1px solid $gray2;
  border-collapse: collapse;
}

table td {
  border: 1px solid $gray2;
  font-size: 1rem;
}

</style>
