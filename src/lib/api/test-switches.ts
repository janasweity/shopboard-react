// API test switches, as in the course API: /delay/<ms>, /fail/<400-599> and
// /empty at the start of a path. They can be combined, for example
// /delay/2000/fail/503/products. src/proxy.ts removes them from a page URL and
// passes them to the server in this header; the API client adds them in front
// of the products API path.
export const testSwitchesHeader = 'x-raha-test-switches'

// Splits a path into its leading switches and the rest of the path. Only
// well-formed switches count; anything else stays in the rest.
export function splitTestSwitches(pathname: string): {
  readonly prefix: string
  readonly rest: string
} {
  let rest = pathname
  let prefix = ''
  for (;;) {
    const match = /^\/(delay\/\d{1,5}|fail\/(?:4|5)\d\d|empty)(?=\/|$)/.exec(
      rest,
    )
    if (!match) return { prefix, rest }
    prefix += '/' + match[1]
    rest = rest.slice(match[0].length)
  }
}

// On in development; in production only when RAHA_TEST_SWITCHES=1 is set.
export function testSwitchesEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.RAHA_TEST_SWITCHES === '1'
  )
}
