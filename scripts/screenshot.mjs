// Loads every route in headless Chromium to (1) catch runtime/React errors and
// (2) capture slide-ready PNGs into screenshots/. Run: npm run screenshots
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:4173/poorna_ai/#'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const ROUTES = [
  ['01-home', '/'],
  ['02-search', '/find?dept=cardiology'],
  ['03-hospital', '/hospital/aiims-delhi'],
  ['04-booking', '/book/aiims-delhi?dept=cardiology'],
  ['05-confirmation', '/confirm'],
  ['06-dashboard', '/dashboard'],
  ['07-forecast', '/dashboard/forecast'],
]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()

let problems = 0
for (const [name, route] of ROUTES) {
  const errors = []
  page.removeAllListeners('console')
  page.removeAllListeners('pageerror')
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.waitForSelector('header', { timeout: 5000 })
  await page.waitForTimeout(1800) // let charts settle
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })

  const status = errors.length ? `❌ ${errors.length} error(s)` : '✅ ok'
  console.log(`${status}  ${name}  (${route})`)
  errors.forEach((e) => console.log('     · ' + e))
  problems += errors.length
}

await browser.close()
console.log(problems ? `\n${problems} console/runtime problem(s) found.` : '\nAll routes rendered cleanly.')
process.exit(problems ? 1 : 0)
