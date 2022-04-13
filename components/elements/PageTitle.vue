<template>
    <nav :id="id+'-title-wrapper'" class="d-flex align-center gap-05 py-075 px-025">
        <nuxt-link to="/" class="d-flex">
            <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
        </nuxt-link>
        <!-- <bib-icon icon="arrowhead-left" class="p-05 project-top-icon" :scale="2"></bib-icon> -->
        <span class=" mr-1 title-text" :id="id+'-title-text'">{{title}}</span>
    </nav>
</template>
<script>
export default {

    name: 'PageTitle',
    props: {
        title: {
            type: String,
            default: "Page Title"
        }
    },

    data() {
        return {

        }
    },
    computed: {
    	id(){
    		return this.title.replace(" ", "_").toLowerCase()
    	}
    }
}
</script>
<style lang="css" scoped>
	nav { border-bottom: 1px solid var(--bib-light);}
	.title-text { font-size: 1.25rem; font-weight: bold; }
</style>