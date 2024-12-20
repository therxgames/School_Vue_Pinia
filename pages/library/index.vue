<template>
  <nuxt-layout name="default">
    <main class="py-3 content-container">
      <materials/>
    </main>
  </nuxt-layout>
</template>
<script setup lang="ts">
useHead({
  ...pageTitle("Библиотека"),
});
</script>
