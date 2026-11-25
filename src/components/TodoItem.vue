<script setup>
defineProps({
  item: { type: Object, required: true },
})

defineEmits(['toggle', 'remove'])
</script>

<template>
  <li class="item" :class="{ done: item.done }">
    <input type="checkbox" :checked="item.done" @change="$emit('toggle', item.id)" />
    <span class="text">{{ item.text }}</span>
    <button class="del" type="button" @click="$emit('remove', item.id)">删除</button>
  </li>
</template>
