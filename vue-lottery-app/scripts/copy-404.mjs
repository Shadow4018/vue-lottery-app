// GitHub Pages не знає про клієнтські маршрути: при оновленні сторінки /vue-lottery-app/users віддається 404.html.
// Копія index.html під ім'ям 404.html повертає застосунок, і vue-router сам відкриває потрібну сторінку.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html created (SPA fallback for GitHub Pages)')
