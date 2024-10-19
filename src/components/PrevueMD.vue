<script setup lang="ts">
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownPreview from './MarkdownPreview.vue'
</script>

<template>
    <header class="header-footer border-b-2">
        <h1 class="text-lg font-bold font-sans text-neutral-200 sm:text-xl md:text-2xl">PrevueMD</h1>
        <button class="rounded-md font-sans bg-neutral-200 drop-shadow-sm px-2 py-1 text-xs font-semibold text-neutral-800 
                                        sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-xs flex items-center">
            Open from
            <img src="../../public/github.svg" alt="GitHub Icon" class="w-6 h-6 ml-2" />
        </button>
    </header>

    <main class="mx-4 my-4 overflow-y-auto flex flex-col gap-4 rounded-md bg-neutral-800 p-2 
                sm:mx-8 sm:my-6 md:flex-row md:gap-8 md:p-4 lg:mx-32 lg:my-10 lg:gap-12 lg:p-6
                drop-shadow-xl">
        <MarkdownEditor class="w-full md:w-1/2" />
        <MarkdownPreview class="w-full md:w-1/2" />
    </main>

    <footer class="header-footer border-t-2">
        <span class="text-xs font-normal font-sans text-neutral-500 sm:text-sm md:text-xs">Built with Vue</span>
        <a href="https://github.com/wazeerc/PrevueMD" target="_blank"
            class="text-xs font-normal text-neutral-500 font-sans sm:text-sm md:text-xs underline">Collaborate here!</a>
    </footer>
</template>
