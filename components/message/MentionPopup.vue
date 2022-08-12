<template>
  <tippy ref="tippy" :animate-fill="false" interactive placement="top-right" trigger="click">
    <div slot="trigger" class="toolbar-icon">
      <fa :icon="faAddressCard" />
    </div>

    <div class="container">
      <bib-input
        type="text"
        v-model="filter"
        placeholder="Enter name"
        label="Search for someone to mention"
        size="md"
      />
      <div class="list">
        <div class="item" v-for="user in users" :key="user.id" @click="selectUser(user)">
          <bib-avatar size="1.7rem" :src="user.avatar" />
          <div class="name">{{ user.firstName }} {{ user.lastName }}</div>
        </div>
      </div>
    </div>
  </tippy>
</template>

<script>
import { mapGetters } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';

export default {
  components: {
    fa: FontAwesomeIcon,
    tippy: TippyComponent,
  },
  data() {
    return {
      filter: '',
      faAddressCard,
    };
  },
  computed: {
    ...mapGetters({
      contacts: "user/getTeamMembers"
    }),
    users() {
      if (!this.filter) {
        return this.contacts;
      }

      const regex = new RegExp(this.filter, 'i');
      return Object.values(this.contacts).filter(
        ({ firstName, lastName }) => regex.test(firstName) || regex.test(lastName)
      );
    },
  },
  methods: {
    selectUser(user) {
      this.$refs.tippy.tip.hide();
      this.$emit('select', user);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  width: 450px;
  height: 220px;
  overflow: hidden;
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.15);
  padding: 15px 15px 0 15px;

  /*& > :first-child {
    flex: 0 1 auto;
  }*/
  .input {}
}

.list {
  flex: 1 1 auto;
  overflow-y: scroll;
}

.item {
  display: flex;
  align-items: center;
  padding: 3px 0;
  gap: 7px;
  cursor: pointer;
}

.name {
  font-size: 0.9rem;
  color: var(--bib-text);
}
</style>