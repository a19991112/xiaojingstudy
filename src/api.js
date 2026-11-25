// src/api.js —— 所有「跟服务器要数据」的活都放这儿
// 好处：以后换后端，只改这个文件，组件不用动

const BASE = 'https://jsonplaceholder.typicode.com'

/**
 * 拿一批待办
 * @param {number} limit 最多几条
 * @returns {Promise<Array<{id:number,title:string,completed:boolean}>>}
 */
export async function fetchTodos(limit = 8) {
  const res = await fetch(`${BASE}/todos?_limit=${limit}`)

  // fetch 有个坑：只有网络错误才 reject，404/500 也算「成功」
  // 所以要自己检查 response.ok
  if (!res.ok) {
    throw new Error(`请求失败：HTTP ${res.status}`)
  }

  return res.json()
}
