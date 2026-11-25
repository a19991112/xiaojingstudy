import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 的地址是 https://<用户名>.github.io/<仓库名>/，
  // 所以构建时必须带上仓库名这一层路径，否则 JS/CSS 会 404。
  base: '/xiaojingstudy/',
  plugins: [vue()],
})
