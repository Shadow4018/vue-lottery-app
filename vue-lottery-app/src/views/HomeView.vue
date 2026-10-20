<script setup lang="ts">
import { REPO_URL, technologies } from '../data/author'
</script>

<template>
  <section class="card app-card">
    <h1 class="page-title">Vue Lottery</h1>
    <p>
      Навчальний застосунок-лотерея: список користувачів із REST API, пагінація та пошук (стан
      зберігається в URL), перегляд і редагування користувача, вибір переможців та авторизація на
      основі JWT.
    </p>

    <h2 class="section-title">Технології</h2>
    <ul>
      <li v-for="technology in technologies" :key="technology">{{ technology }}</li>
    </ul>

    <p class="mb-0">
      Код проєкту:
      <a :href="REPO_URL" target="_blank" rel="noopener noreferrer">{{ REPO_URL }}</a>
    </p>
  </section>
</template>
