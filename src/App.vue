<script setup>
import { computed, onMounted, ref } from 'vue'
import TodoItem from './components/TodoItem.vue'
import { fetchTodos } from './api.js'

const items = ref([])
const draft = ref('')
const keyword = ref('')
const statusFilter = ref('all')

// 三个状态：加载中 / 出错 / 正常
const loading = ref(false)
const error = ref('')
const loadedFromCloud = ref(false)

const visible = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return items.value.filter((i) => {
    const matchesKeyword = !q || i.text.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'done' ? i.done : !i.done)
    return matchesKeyword && matchesStatus
  })
})

const left = computed(() => items.value.filter((i) => !i.done).length)
const summary = computed(() =>
  keyword.value.trim() || statusFilter.value !== 'all'
    ? `找到 ${visible.value.length} 项（共 ${items.value.length} 项）`
    : `${left.value} 项未完成`,
)

/** 从服务器加载 */
async function loadFromCloud() {
  loading.value = true
  error.value = ''
  try {
    const rows = await fetchTodos(8)
    items.value = rows.map((r) => ({
      id: String(r.id),
      text: r.title,
      done: r.completed,
    }))
    loadedFromCloud.value = true
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadFromCloud)

function add() {
  const text = draft.value.trim()
  if (!text) return
  items.value.unshift({ id: crypto.randomUUID(), text, done: false })
  draft.value = ''
}

function toggle(id) {
  const item = items.value.find((i) => i.id === id)
  if (item) item.done = !item.done
}

function remove(id) {
  items.value = items.value.filter((i) => i.id !== id)
}

function clearDone() {
  items.value = items.value.filter((i) => !i.done)
}
</script>

<template>
  <main class="app">
    <h1>今天要做的事</h1>

    <form class="row" @submit.prevent="add">
      <input v-model="draft" type="text" placeholder="写点什么…" autocomplete="off" />
      <button type="submit">添加</button>
    </form>

    <div class="search">
      <input v-model="keyword" type="search" placeholder="搜索…" autocomplete="off" />
      <select v-model="statusFilter" aria-label="状态筛选">
        <option value="all">全部</option>
        <option value="pending">未完成</option>
        <option value="done">已完成</option>
      </select>
    </div>

    <p v-if="loading" class="hint">正在从服务器拿数据…</p>
    <p v-else-if="error" class="hint error">
      {{ error }}
      <button type="button" class="link" @click="loadFromCloud">重试</button>
    </p>
    <p v-else-if="loadedFromCloud" class="hint ok">
      已从服务器加载 {{ items.length }} 条
      <button type="button" class="link" @click="loadFromCloud">重新加载</button>
    </p>

    <ul class="list">
      <TodoItem
        v-for="item in visible"
        :key="item.id"
        :item="item"
        @toggle="toggle"
        @remove="remove"
      />
      <li v-if="!loading && visible.length === 0" class="empty">还没有内容</li>
    </ul>

    <footer class="footer">
      <span>{{ summary }}</span>
      <button type="button" @click="clearDone">清除已完成</button>
    </footer>
  </main>
</template>
