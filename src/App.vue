<script setup>
import { computed, ref, watch } from 'vue'
import TodoItem from './components/TodoItem.vue'

const KEY = 'todo-vue-items'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const items = ref(load())
const draft = ref('')
const keyword = ref('')

watch(items, (value) => localStorage.setItem(KEY, JSON.stringify(value)), { deep: true })

const visible = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return q ? items.value.filter((i) => i.text.toLowerCase().includes(q)) : items.value
})

const left = computed(() => items.value.filter((i) => !i.done).length)
const summary = computed(() =>
  keyword.value.trim() ? `找到 ${visible.value.length} 项（共 ${items.value.length} 项）` : `${left.value} 项未完成`,
)

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
    </div>

    <ul class="list">
      <TodoItem
        v-for="item in visible"
        :key="item.id"
        :item="item"
        @toggle="toggle"
        @remove="remove"
      />
      <li v-if="visible.length === 0" class="empty">还没有内容</li>
    </ul>

    <footer class="footer">
      <span>{{ summary }}</span>
      <button type="button" @click="clearDone">清除已完成</button>
    </footer>
  </main>
</template>
