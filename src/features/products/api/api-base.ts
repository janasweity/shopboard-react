// One base URL for every products API request (the list and one product).
// Set VITE_API_BASE before starting Vite to try the API test switches:
//   VITE_API_BASE=/delay/3000   VITE_API_BASE=/fail/500   VITE_API_BASE=/empty
// It can also be a full http(s) URL of a server with the same API.
// Empty or unset means the normal same-origin /api routes.
function readApiBase(value: string | undefined): string {
  const base = (value || '').trim().replace(/\/+$/, '')
  if (base === '' || base.startsWith('/') || /^https?:\/\//.test(base)) {
    return base
  }
  throw new Error(
    'VITE_API_BASE must be empty, start with "/" or be an http(s) URL.',
  )
}

const apiBase = readApiBase(import.meta.env.VITE_API_BASE)

export const apiUrl = (path: string): string => apiBase + path
