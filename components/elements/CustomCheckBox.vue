<template>
  <div :id="'custom-checkbox-wrapper-'+name" class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" :id="id+name" :checked="checked" disabled />
    <label :id="id+'-label-'+name" class="custom-control-label" :for="id+name">
      <bib-icon icon="check-circle" variant="gray4" :scale="1" />
    </label>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
    }
  },
  props: {
    id: {
      type: String,
      default: "my-chk"
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  created() {
    let n = Math.random().toString()
    this.name = 'ch-'+n.slice(-4)
  }
};

</script>
<style scope lang="scss">
.custom-checkbox {
  position: relative;
  cursor: pointer;

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    visibility: hidden;
  }

  .custom-control-input:checked~.custom-control-label::before { border: 0 none; padding: 0; background-color: none transparent;}
  .custom-control-input:checked~.custom-control-label .icon {
    opacity: 1;
    visibility: visible;
  }

}

.custom-control-label {
  &::before {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    padding:2px;
    border-radius: 50%;
    color: #fff;
    border: 1px solid var(--bib-gray4);
    background-color: var(--bib-white);
  }
}

.custom-control-input {
  position: absolute;
  opacity: 0;
}

</style>
