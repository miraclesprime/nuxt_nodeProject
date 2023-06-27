<template>
    <div v-if="loading" class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
    <div v-else>
      <!-- Your actual content here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'Skeleton',
    props: {
      loading: {
        type: Boolean,
        default: true,
      },
    },
  }
  </script>
  
  <style scoped>
  .skeleton {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 10px;
    animation: skeleton-loading 1s infinite alternate;
  }
  
  .skeleton-line {
    background-color: #e0e0e0;
    height: 20px;
    margin-bottom: 10px;
  }
  
  @keyframes skeleton-loading {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  </style>