<template>
  <div id="cont" :style="{height: radius * 2, width: radius * 2}" class="position-relative" >
    <svg :height="radius * 2" :width="radius * 2">
      <circle fill="transparent" stroke="white" :stroke-width="stroke" :r="normalizedRadius" :cx="radius" :cy="radius" />
      <circle fill="transparent" :stroke-dasharray="circumference + ' ' + circumference" :style="{ 'stroke-dashoffset': strokeDashoffset, stroke: 'var(--bib-'+variant+')' }" :stroke-width="stroke" :r="normalizedRadius" :cx="radius" :cy="radius" />
    </svg>
    <output :class="'text-'+variant" :style="{'font-size': (radius/2)-5+'px'}">{{progress}}%</output>
  </div>
</template>
<script>
export default {
  name: "ProgressCircle",
  props: {
    
    suffix: "",
    prefix: "",
    variant: {
      type: String,
      default () {
        return 'gray5';
      },
    },
    background: { type: String, default: 'transparent'},
    radius: {type:Number, default(){return 50}},
    progress: {type:Number, required: true},
    stroke: {type:Number, default(){ return 6 }},
  },
  data() {
    return {
      
    };
  },
  computed: {
    normalizedRadius() { return this.radius - this.stroke * 2; },
    circumference() { return this.normalizedRadius * 2 * Math.PI; },
    strokeDashoffset() { return this.circumference - this.progress / 100 * this.circumference; }
  },
};

</script>
<style lang="scss" scoped>
circle {
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-out;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
#cont {
  border-radius: 100%;
  position: relative;
}
output {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  border-radius: 100%;
}

</style>
