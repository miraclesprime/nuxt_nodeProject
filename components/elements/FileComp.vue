<template>
  <div id="file-comp-wrapper" class="file-wrap bg-light shape-rounded px-05 ">
    <div id="file-comp-pn-ps" class="d-flex gap-05 align-center height-2" >
      <bib-icon :scale="1" :icon="icon" variant="gray4"></bib-icon>
      <span id="file-comp-pn" class="file-text font-md text-truncate cursor-pointer" v-tooltip="`${property.name} (${$formatBytes(property.size)})`" @click.stop="previewFile(property)">{{property.name}} </span>
      <span v-if="cdtf" class="d-inline-flex align-center justify-center height-1 width-1 shape-circle cursor-pointer bg-white" @click.stop="deleteFile"><bib-icon icon="close-circle-solid" :scale="1" variant="gray4" ></bib-icon></span>
      <!-- <div id="file-comp-elipsis-icon" class="width-2 height-2 bg-light shape-circle d-flex align-center justify-center">
        <bib-popup pop="elipsis" icon-variant="gray5" icon-hover-variant="gray6">
          <template v-slot:menu>
            <div class="list" id="file-comp-list">
              <span id="file-comp-item1" class="list__item" v-if="canPreview" @click.stop="previewFile">Preview</span>
              <span id="file-comp-item2" class="list__item" @click.stop="openFile">Open</span>
              <span id="file-comp-item3" class="list__item" @click.stop="fileDetailModal = true">Detail</span>
              <span id="file-comp-item4" class="list__item" @click.stop="downloadFile">Download</span>
              <hr>
              <span id="file-comp-delete-btn" v-if="cdtf" class="list__item list__item__danger" @click.stop="deleteFile">Delete</span>
            </div>
          </template>
        </bib-popup>
      </div> -->
    </div>
    <!-- file detail modal -->
    <bib-modal-wrapper v-if="fileDetailModal" title="File Details" @close="fileDetailModal = false">
      <template slot="content">
        <table class="table">
          <tr v-for="file in fileDetail">
            <template v-if="file.key == 'size'">
              <th id="fd-h1" class="text-right font-w-400">{{file.key}}:</th>
              <td class="text-left text-gray6 pl-1">{{$formatBytes(file.value)}}</td>
            </template>
            <template v-else>
              <th fd-h2 class="text-right font-w-400">{{file.key}}:</th>
              <td class="text-left text-gray6 pl-1">{{file.value}}</td>
            </template>
          </tr>
        </table>
      </template>
      <template slot="footer">
        <div id="file-comp-footer" class="d-flex justify-end">
          <bib-button label="Close" variant="light" pill @click="fileDetailModal = false"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {

  name: 'FileComp',
  props: {
    property: {
      type: Object,
      default: () => {
        return {
          key: "",
          name: "File-name.ext",
          size: 853581,
          preview: "",
          type: "",
          extension: "",
          owner: "",
        }
      }
    },
  },

  data() {
    return {
      fileDetailModal: false,
      cdtf: false
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
            arr.push({ key: key, value: dayjs(value).format('DD MMM YYYY') })
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
    icon(){
      if (this.property.type.includes('image')) {
        return "file-text-solid"
      }
      if (this.property.type.includes('video')) {
        return "video-solid"
      }
      if (this.property.type.includes('audio')) {
        return "sales"
      }
      if (this.property.type.includes('pdf')) {
        return "pdf"
      }
      if (this.property.type.includes('msword') || this.property.type.includes("wordprocessingml") || this.property.type.includes("rtf")) {
        return "word"
      }
      if (this.property.type.includes('presentation')) {
        return "powerpoint"
      }
      if (this.property.type.includes('ms-excel') || this.property.type.includes("sheet")) {
        return "excel"
      }
      return "file-text-solid"
    },
  },
  mounted() {
    this.canDeleteTaskFile()
  },
  methods: {
    openFile() {
      this.$emit("open-file", this.property)
    },
    previewFile() {
      this.$emit("preview-file", this.property)
    },
    detailFile() {
      this.$emit("detail-file", this.property)
    },
    downloadFile() {
      this.$axios.get("file/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          if (f.data.statusCode == 200) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = f.data.data;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(f.data.data);
            alert('your file has downloaded!');
          }
        })
        .catch(e => console.error(e))
    },
    deleteFile() {
      this.$emit("delete-file", this.property)
    },

    canDeleteTaskFile() {
      if (this.property.owner == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN') {
        this.cdtf = true
        return true;
      }
      this.cdtf = false
      return false
    },
  }
}

</script>
<style lang="scss" scoped>
.file-wrap {}

.file-text {
  max-width: 16rem;
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
