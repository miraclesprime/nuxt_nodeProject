<template>
  <div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" :id="id" />
    <label class="custom-control-label" :for="id">
      <bib-icon icon="tick" variant="dark" />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default() {
        return "my-items-only";
      },
    },
  },
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

  .custom-control-input:checked ~ .custom-control-label:before {
    border-color: #333;
  }

  .custom-control-input:checked ~ .custom-control-label .icon {
    opacity: 1;
    visibility: visible;
  }

  &:hover &::before {
    background-color: $gray6;
  }
}

.custom-control-label {
  &::before {
    content: "";
    display: block;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    color: #fff;
    border: 1px solid #333;
    background-color: #fff;
  }
}

.custom-control-input {
  position: absolute;
  opacity: 0;
}
</style>