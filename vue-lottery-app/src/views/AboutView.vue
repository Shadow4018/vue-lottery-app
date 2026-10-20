<script setup lang="ts">
import { author } from '../data/author'
</script>

<template>
  <section class="card app-card">
    <h1 class="page-title">About author</h1>
    <p class="fs-5 fw-semibold">{{ author.fullName }}</p>

    <h2 class="section-title">Technical skills</h2>
    <ul>
      <li v-for="skill in author.skills" :key="skill">{{ skill }}</li>
    </ul>

    <p class="mb-0">
      GitHub:
      <a :href="author.githubUrl" target="_blank" rel="noopener noreferrer">{{
        author.githubUrl
      }}</a>
    </p>
  </section>
</template>
