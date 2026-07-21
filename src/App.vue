<template>
  <main class="page">
    <h1>scaffold-frontend</h1>
    <p class="hint">Vue3 微应用 · /vome/apps/scaffold-frontend/</p>
    <p class="hint">可用：同域调宿主 API（共享登录态）。不可用：整包打入 vome-core/admin CRUD。</p>
    <button type="button" class="btn" :disabled="loading" @click="probe">
      {{ loading ? '请求中…' : '探测宿主 /admin/base/auth/me' }}
    </button>
    <pre v-if="result" class="result">{{ result }}</pre>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { hostRequest } from './lib/host-api'

defineOptions({ name: 'App' })

const loading = ref(false)
const result = ref('')

async function probe() {
  loading.value = true
  result.value = ''
  try {
    const data = await hostRequest('GET', '/admin/base/auth/me')
    result.value = JSON.stringify(data, null, 2)
  } catch (e) {
    result.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: #f5f7fb;
  color: #1a1d26;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #4e5dff;
}

.hint {
  margin: 0;
  max-width: 28rem;
  font-size: 0.875rem;
  opacity: 0.75;
  line-height: 1.5;
}

.btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #4e5dff;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin: 0.75rem 0 0;
  max-width: 36rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7ef;
  overflow: auto;
}
</style>
