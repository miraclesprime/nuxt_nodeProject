<template>
  <div>
    <bib-detail-collapse label="Today" open>
      <template v-slot:content>
        <!-- <div v-rowby="100">
          <div class="pl-1 pr-1">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto soluta repellendus recusandae possimus illum quod nostrum eum aliquid iusto nesciunt, atque commodi consectetur, dolore veniam excepturi delectus reiciendis, officiis ad.
          </div>
        </div> -->
        <div v-for="msg in messages">
          <message :msg="msg"></message>
        </div>
      </template>
    </bib-detail-collapse>
  </div>
</template>
<script>
export default {

  name: 'MessageList',
  props: {
    messages: { type: Array },
  },

  data() {
    return {
      /*files: [
        { img: 'https://placeimg.com/200/300/tech' },
        { img: 'https://placeimg.com/200/360/tech' },
        { img: 'https://placehold.jp/2ba026/ffffff/180x180.jpg' },
        { img: 'https://placehold.jp/24/1f42a2/ffffff/250x200.jpg?text=placeholder%20image' }
      ]*/
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
