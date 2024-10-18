<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <h1 class="text-4xl font-bold text-blue-500 font-[Helvetica]">{{ msg }}</h1>
</template>
