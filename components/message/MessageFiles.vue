<template>
  <client-only>
    <div class="file-wrap d-flex ">
      <figure class="position-relative w-100" v-tooltip="`${property.name}`">
        <img :src="filePreview" class="shape-rounded d-block">
        <div class="file-overlay d-flex align-center justify-center cursor-pointer" @click="$emit('file-click')">
          <fa :icon="faMagnifyingGlassPlus" class="width-2 height-2"></fa>
        </div>
        <div class="shape-circle bg-gray4 width-2 height-2 d-flex justify-center align-center file-menu">
          <bib-button pop="elipsis" :scale="1">
            <template v-slot:menu>
              <div class="list ">
                <!-- <span class="list__item file-name ">{{property.name}}</span> -->
                <!-- <hr> -->
                <span class="list__item" v-if="canPreview" @click="$emit('file-click')">Preview</span>
                <span class="list__item">Open</span>
                <span class="list__item" @click.stop="fileDetailModal = true">Detail</span>
                <span class="list__item" @click.stop="downloadFile">Download File</span>
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
      <bib-modal-wrapper v-if="fileDetailModal" title="File Details" @close="fileDetailModal = false">
        <template slot="content">
          <table class="table">
            <tr v-for="file in fileDetail">
              <template v-if="file.key == 'size'">
                <th class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{$formatBytes(file.value)}}</td>
              </template>
              <template v-else>
                <th class="text-right font-w-400">{{file.key}}:</th>
                <td class="text-left text-gray6 pl-1">{{file.value}}</td>
              </template>
            </tr>
          </table>
        </template>
        <template slot="footer">
          <div class="d-flex justify-end">
            <bib-button label="Close" variant="light" pill @click="fileDetailModal = false"></bib-button>
            <!-- <bib-button label="Create" variant="success" class="ml-auto" pill></bib-button> -->
          </div>
        </template>
      </bib-modal-wrapper>
    </div>
  </client-only>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs'

export default {

  name: 'MessageFiles',
  props: {
    property: { type: Object },
  },

  components: {
    fa: FontAwesomeIcon,
  },

  data() {
    return {
      faMagnifyingGlassPlus,
      fileDetailModal: false,
      filePreview: "",
    }
  },
  computed: {

    fileDetail() {
      let arr = []
      if (this.property.hasOwnProperty("key")) {
        Object.entries(this.property).map(([key, value]) => {
          if (key == 'name' || key == "extension" || key == "size") {
            arr.push({ value: value, key: key })
          }
          if (key == "createdAt" || key == "updatedAt") {
            arr.push({key: key, value: dayjs(value).format('DD MMM YYYY')})
          }
        })
      }
      return arr
    },
    canPreview() {
      if (this.property.type.indexOf('image/') == 0 || this.property.type.indexOf('pdf') > 0) {
        return true
      } else {
        return false
      }
    },
  },
  mounted() {
    this.previewFile()

  },
  methods: {
    async previewFile() {
      if (this.property.type.indexOf('image/') == 0 && "url" in this.property) {
        let imgtype = this.property.type.split("/")[1]
        const prev = await this.$axios.get("file/single/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        })
        // console.log(prev.data.data)
        this.filePreview = `data:image/${imgtype};base64,${prev.data.data}`
      } else {
        this.filePreview = "https://via.placeholder.com/200x160/f0f0f0/6f6f79?text=" + this.property.extension
      }
    },

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
            // alert('your file has downloaded!');
          }
        })
        .catch(e => console.error(e))
    },
  }
}

</script>
<style lang="scss" scoped>
.file-wrap {
  min-height: 8rem;
  font-size: 1rem;
  background-color: rgb(240, 240, 240);
  flex: 0 1 14rem;

  figure {
    img {
      width: 100%;
      object-fit: cover;
      aspect-ratio: 1.5 / 1;
    }
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
  border-collapse: collapse;
  width: 100%;
  font-size: $base-size;
}

table th,
table td {
  padding: 0.25rem;
}

</style>
