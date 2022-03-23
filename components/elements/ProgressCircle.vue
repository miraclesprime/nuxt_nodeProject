<template>
  <div id="cont" data-pct="100">
    <svg id="svg" :width="size" :height="size" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="47" cx="50" cy="50" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>
      <circle id="bar" r="47" cx="50" cy="50" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>
    </svg>
  </div>
</template>
<script>
export default {
  name: "ProgressBar",
  props: {
    value: {
      type: Number,
      default () {
        return 0;
      },
    },
    suffix: "",
    prefix: "",
    variant: {
      type: String,
      default () {
        return 'gray5';
      },
    },
    size: {
      type: Number,
      default(){
        return 100
      }
    }
  },
  methods: {
    progress() {
      var val = parseInt($(this).val());
      var $circle = $('#svg #bar');

      if (isNaN(val)) {
        val = 100;
      } else {
        var r = $circle.attr('r');
        var c = Math.PI * (r * 2);

        if (val < 0) { val = 0; }
        if (val > 100) { val = 100; }

        var pct = ((100 - val) / 100) * c;

        $circle.css({ strokeDashoffset: pct });

        $('#cont').attr('data-pct', val);
      }

    }
  }
};

</script>
<style lang="scss" scoped>
#svg circle {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
  stroke: #666;
  stroke-width: 6px;
}

#svg #bar {
  stroke: #FF9F1E;
}

#cont {
  display: block;
  height: 100px;
  width: 100px;
  border-radius: 100%;
  position: relative;
}

#cont:after {
  position: absolute;
  display: block;
  height: 80%;
  width: 80%;
  left: 50%;
  top: 50%;
  content: attr(data-pct)"%";
  transform: translate(-50%, -50%);
  border-radius: 100%;
  line-height: 80px;
  font-size: 2em;
}

</style>
