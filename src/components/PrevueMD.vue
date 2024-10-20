<script setup lang="ts">
import MarkdownEditor from "./MarkdownEditor.vue"
import MarkdownPreview from "./MarkdownPreview.vue"
</script>

<template>
  <header class="header-footer border-b-2">
    <h1 class="
      font-sans text-lg font-bold text-neutral-200

      md:text-2xl

      sm:text-xl
    "> PrevueMD </h1>
    <button class="
      flex items-center rounded-md bg-neutral-200 px-2 py-1 font-sans text-xs font-semibold
      text-neutral-800 drop-shadow-sm

      md:px-4 md:py-3 md:text-xs

      sm:px-3 sm:py-2 sm:text-sm
    ">
      Open from
      <img src="/github.svg" alt="GitHub Icon" class="ml-2 h-6 w-6" />
    </button>
  </header>

  <main class="
    ' mx-4 my-4 flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800 p-2 drop-shadow-xl

    lg:mx-32 lg:my-10 lg:gap-12 lg:p-6

    md:flex-row md:gap-8 md:p-4

    sm:mx-8 sm:my-6
  ">
    <MarkdownEditor class="
      w-full

      md:w-1/2
    " />
    <MarkdownPreview class="
      w-full

      md:w-1/2
    " />
  </main>

  <footer class="header-footer border-t-2">
    <span class="
      font-sans text-xs font-normal text-neutral-500

      md:text-xs

      sm:text-sm
    ">Built with Vue</span>
    <a href="https://github.com/wazeerc/PrevueMD" target="_blank" class="
      font-sans text-xs font-normal text-neutral-500 underline

      md:text-xs

      sm:text-sm
    ">Collaborate here!</a>
  </footer>
</template>
