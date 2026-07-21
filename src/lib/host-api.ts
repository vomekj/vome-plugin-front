/**
 * 微应用调宿主 HTTP（与 Admin 同域时可用）
 *
 * 可用：
 * - Bearer：读主壳 localStorage `vome_admin_access`（wujie 同域下共享）
 * - 路径前缀：页面在 `/dev/...` 或 `/prod/...` 下时自动加同前缀（对齐 Admin `baseUrl`）
 * - 业务码 `code === 1000` → 返回 `data`
 *
 * 不可用 / 勿默认做：
 * - 把整包 `vome-core/admin` CRUD 打进微应用
 */

const TOKEN_KEY = 'vome_admin_access'

function apiBase(): string {
  if (typeof location === 'undefined') return ''
  if (location.pathname.startsWith('/dev/')) return '/dev'
  if (location.pathname.startsWith('/prod/')) return '/prod'
  return ''
}

export function resolveHostUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const base = apiBase()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function getHostAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export async function hostRequest<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = new Headers()
  const token = getHostAccessToken()
  if (token) headers.set('authorization', `Bearer ${token}`)
  if (body !== undefined) headers.set('content-type', 'application/json')

  const res = await fetch(resolveHostUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const json = (await res.json()) as {
    code?: number
    message?: string
    data?: T
  }
  if (json.code !== 1000) {
    throw new Error(json.message || `请求失败 (${res.status})`)
  }
  return json.data as T
}
