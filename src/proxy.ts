import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redirectPath } from './lib/routes.ts'
import {
  splitTestSwitches,
  testSwitchesEnabled,
  testSwitchesHeader,
} from './lib/api/test-switches.ts'

// Runs before pages render:
// 1. Removes API test switches from the URL (/delay/3000/products) and passes
//    them to Server Components in a request header.
// 2. Redirects older query-string URLs (/?page=…) and retired products.
export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  // Only the proxy may set this header.
  requestHeaders.delete(testSwitchesHeader)

  const { prefix, rest } = splitTestSwitches(url.pathname)
  const switches = prefix && testSwitchesEnabled() ? prefix : ''
  const pathname = switches ? rest || '/' : url.pathname

  const redirect = redirectPath(new URL(pathname + url.search, url.origin))
  if (redirect) {
    return NextResponse.redirect(new URL(switches + redirect, url.origin), 307)
  }
  if (switches) {
    requestHeaders.set(testSwitchesHeader, switches)
    const target = url.clone()
    target.pathname = pathname
    return NextResponse.rewrite(target, {
      request: { headers: requestHeaders },
    })
  }
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Pages only: not Next.js files or public images and icons.
  matcher: ['/((?!_next/|images/|raha\\.svg|botanical\\.svg|favicon\\.ico).*)'],
}
