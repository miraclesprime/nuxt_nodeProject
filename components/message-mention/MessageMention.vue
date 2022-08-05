<template>
  <span class="mention" :class="{ undefined: !contacts[id] }" @click.stop="onClick">
    @{{ displayName }}
  </span>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['contacts']),
    ...mapState(['user']),
    displayName() {
      const user = this.id === this.user.id ? this.user : this.contacts[this.id];

      // if it's not current user or in contacts list
      if (user) {
        return `${user.firstName} ${user.lastName}`;
      }

      return `Deleted Account`;
    },
  },
  methods: {
    onClick() {
      if (this.contacts[this.id]) {
        this.$emit('click', this.id);
      }
    },
  },
};
</script>