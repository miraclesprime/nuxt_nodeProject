<template>
  <tippy ref="tippy" theme="light-border p-0" :animate-fill="false" interactive placement="top-right" trigger="click">
    <div slot="trigger" class="toolbar-icon" id="mpu-toolbar-icon">
      <fa :icon="faAddressCard" />
    </div>

    <div class="container" id="mpu-container">
      <bib-input
        type="text"
        v-model="filter"
        placeholder="Enter name"
        label="Search for someone to mention"
        size="md"
      />
      <div class="list" id="mpu-list">
        <div class="item" :id="'mpu-'+index" v-for="(user, index) in users" :key="user.id" @click="selectUser(user)">
          <bib-avatar size="1.7rem" :src="user.avatar" />
          <div class="name" id="mpu-name">{{ user.firstName }} {{ user.lastName }}</div>
        </div>
      </div>
    </div>
  </tippy>
</template>

<script>
import { mapGetters } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { TippyComponent } from 'vue-tippy';

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