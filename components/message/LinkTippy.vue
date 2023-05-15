<template>
    <div class="container" id="link-trippy-wrapper">
      <div class="text" id="link-trippy-text">{{ text }}</div>
      <div class="link" id="link-trippy-link-wrap">
        <a :href="href" target="_blank" id="link-trippy-link">{{ href }}</a>
      </div>
      <div class="buttons-container" id="link-trippy-button-container">
        <bib-button label="Edit" variant="primary--light" @click="$emit('edit')" id="link-trippy-edit-btn"></bib-button>
        <bib-button label="Remove" variant="danger" @click="$emit('remove')" id="link-trippy-remove-btn"></bib-button>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
    },
    href: {
      type: String,
      required: false,
    },
  },
};

</script>
<style lang="scss" scoped>
.container {
  padding: 20px 20px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  box-shadow: 0 3px 7px rgb(0 0 0 / 20%);
  width: 300px;
  overflow: hidden;
}

.text {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link {
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-decoration: none;
  color: rgb(0, 0, 238);
  overflow: hidden;
  text-overflow: ellipsis;

  &:visited {
    color: rgb(0, 0, 238);
  }
}

.buttons-container {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

</style>
