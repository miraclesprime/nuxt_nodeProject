<template>
  <div class="file-wrap border-light shape-rounded p-025" >
    <div class="d-flex gap-05 align-center" v-tooltip="`${property.name} (${property.size})`">
      <bib-avatar size="2rem" :src="property.preview"></bib-avatar> <span class="file-text font-md text-truncate" >{{property.name}}</span>
      <div class="width-2 height-2 bg-light shape-circle d-flex align-center justify-center">
        <bib-popup pop="elipsis" icon-variant="gray5" icon-hover-variant="gray6">
          <template v-slot:menu>
            <div class="list">
              <span class="list__item" @click.stop="previewFile">Preview</span>
              <span class="list__item" @click.stop="openFile">Open</span>
              <span class="list__item" @click.stop="fileDetailModal = true">Detail</span>
              <span class="list__item" @click.stop="downloadFile">Download</span>
              <hr>
              <span v-if="cdtf" class="list__item list__item__danger" @click.stop="deleteFile">Delete</span>
            </div>
          </template>
        </bib-popup>
      </div>
    </div>
    <!-- file detail modal -->
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
</template>
<script>
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
    // canDelete: {
    //   type: Boolean,
    //   default: () => {
    //     return false
    //   }
    // }
  },

  data() {
    return {
      fileDetailModal: false,
      cdtf: false
    }
  },
  computed: {
    /*id() {
      return this.title.replace(" ", "_").toLowerCase()
    }*/
    fileDetail() {
      let arr = []
      if (this.property.hasOwnProperty("key")) {
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
  mounted() {
    this.canDeleteTaskFile()
  },
  methods: {
    openFile(){
        this.$emit("open-file", this.property)
    },
    previewFile(){
        this.$emit("preview-file", this.property)
    },
    detailFile(){
        this.$emit("detail-file", this.property)
    },
    downloadFile() {
      this.$axios.get("file/" + this.property.key, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }).then(f => {
          // console.log(f.data)
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
    deleteFile(){
        this.$emit("delete-file", this.property)
    },

    canDeleteTaskFile() {
      // console.log(this.property.owner, JSON.parse(localStorage.getItem('user')).sub)
      //  console.log(JSON.parse(localStorage.getItem('user')).subr)
      if (this.property.owner == JSON.parse(localStorage.getItem('user')).sub || JSON.parse(localStorage.getItem('user')).subr == 'ADMIN' ) {
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
    width: 7.5rem;  
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
