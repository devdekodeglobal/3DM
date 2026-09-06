export class HttpError extends Error {
  constructor(message: string, public status = 400, public retryAfter?: number) { super(message) }
}

export const MAX_DESIGN_BYTES = 1024 * 1024
export const MAX_ELEMENTS = 500
const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype'])

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError('Expected an object')
  return value as Record<string, unknown>
}
export function onlyKeys(value: Record<string, unknown>, allowed: string[]) {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new HttpError('Unexpected field')
}
export function emailAddress(value: unknown): string {
  if (typeof value !== 'string' || value.length > 254) throw new HttpError('Enter a valid email address')
  const email = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError('Enter a valid email address')
  return email
}
export function passwordValue(value: unknown, newPassword = false): string {
  if (typeof value !== 'string' || value.length < (newPassword ? 12 : 1) || new TextEncoder().encode(value).length > 1024) throw new HttpError(newPassword ? 'Password must contain 12 or more characters and be at most 1024 bytes' : 'Invalid password')
  return value
}
export function designId(value: unknown): string {
  if (typeof value !== 'string' || !/^[a-f0-9]{32}$/.test(value)) throw new HttpError('Design not found', 404)
  return value
}

// Schema-independent budgets also cover optional renderer properties and nested wall elements.
export function boundedTree(value: unknown, depth = 0, budget: { nodes: number; numericLimit?: number } = { nodes: 0 }) {
  if (depth > 12 || ++budget.nodes > 20000) throw new HttpError('Design is too complex')
  if (typeof value === 'number' && (!Number.isFinite(value) || Math.abs(value) > (budget.numericLimit ?? 100000))) throw new HttpError('Numeric value is out of range')
  if (typeof value === 'string' && value.length > 300000) throw new HttpError('Content is too long')
  if (Array.isArray(value)) {
    if (value.length > 1000) throw new HttpError('Too many entries')
    value.forEach(item => boundedTree(item, depth + 1, budget))
  } else if (value && typeof value === 'object') {
    if (Object.keys(value).length > 100) throw new HttpError('Too many properties')
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN.has(key) || key.length > 80) throw new HttpError('Unsupported property')
      if (key === 'platesCount' && (typeof item !== 'number' || !Number.isInteger(item) || item < 1 || item > 100)) throw new HttpError('Invalid plate count')
      boundedTree(item, depth + 1, budget)
    }
  } else if (!['string', 'number', 'boolean'].includes(typeof value) && value !== null) throw new HttpError('Unsupported value')
}

export function validateConfig(value: unknown) {
  const config = object(value)
  boundedTree(config)
  for (const key of ['width', 'depth']) if (typeof config[key] !== 'number' || config[key] <= 0 || config[key] > 100) throw new HttpError('Space dimensions must be between 0 and 100 metres')
  if (typeof config.wallThickness !== 'number' || config.wallThickness <= 0 || config.wallThickness > 2) throw new HttpError('Invalid wall thickness')
  const walls = object(config.walls)
  onlyKeys(walls, ['north','south','east','west'])
  if (['north','south','east','west'].some(k => typeof walls[k] !== 'boolean')) throw new HttpError('Invalid wall configuration')
  return config
}

const ELEMENT_TYPES = new Set(['wall','asset','3d_logo','pillar','caged-wall','panel','caged-panel','banner','window','door','light','tube','text','rect','circle','roof'])
export function validateElements(value: unknown) {
  if (!Array.isArray(value) || value.length > MAX_ELEMENTS) throw new HttpError(`Use at most ${MAX_ELEMENTS} elements`)
  boundedTree(value)
  let count = 0
  const ids = new Set<string>()
  function element(raw: unknown) {
    if (++count > MAX_ELEMENTS) throw new HttpError('Too many nested elements')
    const el = object(raw)
    if (typeof el.id !== 'string' || !/^[\w-]{1,100}$/.test(el.id) || ids.has(el.id)) throw new HttpError('Invalid or duplicate element ID')
    ids.add(el.id)
    if (typeof el.type !== 'string' || !ELEMENT_TYPES.has(el.type)) throw new HttpError('Unsupported element type')
    for (const key of ['x','y','width','height','rotation','depth','thickness','realWidth','realHeight','realDepth','verticalScale','yOffset','platesCount','plateGap','plateThickness']) {
      if (el[key] !== undefined && (typeof el[key] !== 'number' || !Number.isFinite(el[key]))) throw new HttpError(`Invalid ${key}`)
    }
    for (const key of ['width','height','depth','thickness','realWidth','realHeight','realDepth','verticalScale','plateGap','plateThickness']) if (typeof el[key] === 'number' && el[key] < 0) throw new HttpError(`Invalid ${key}`)
    if (el.platesCount !== undefined && (!Number.isInteger(el.platesCount) || (el.platesCount as number) < 1 || (el.platesCount as number) > 100)) throw new HttpError('Invalid plate count')
    if (el.svgData !== undefined && el.svgData !== null && typeof el.svgData !== 'string') throw new HttpError('Invalid logo')
    for (const key of ['assetName','categoryFolder']) if (el[key] !== undefined && (typeof el[key] !== 'string' || !/^[\w-]{1,150}$/.test(el[key]))) throw new HttpError('Invalid asset path')
    for (const key of ['assetUrl','url']) {
      if (el[key] !== undefined && (typeof el[key] !== 'string' || !/^(?:blob:|data:image\/(?:png|jpeg|webp|svg\+xml)[;,]|\/(?!\/))/.test(el[key]))) throw new HttpError('Use a local image or asset')
    }
    if (el.wallElements !== undefined) {
      if (!Array.isArray(el.wallElements)) throw new HttpError('Invalid wall elements')
      el.wallElements.forEach(element)
    }
  }
  value.forEach(element)
  return value
}

export function validateDesign(value: unknown, partial = false) {
  const data = object(value)
  onlyKeys(data, ['name','config','elements'])
  if (!Object.keys(data).length) throw new HttpError('Provide a design change')
  boundedTree(data)
  if (new TextEncoder().encode(JSON.stringify(data)).length > MAX_DESIGN_BYTES) throw new HttpError('Design exceeds 1 MiB', 413)
  if (!partial || data.name !== undefined) {
    if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 120) throw new HttpError('Design name must contain 1 to 120 characters')
    data.name = data.name.trim()
  }
  if (!partial || data.config !== undefined) validateConfig(data.config)
  if (!partial || data.elements !== undefined) validateElements(data.elements)
  return data
}

export function validateProject(value: unknown) {
  const project = object(value)
  validateDesign({ name: 'Imported project', config: project.booth, elements: project.elements })
  return { booth: project.booth, elements: project.elements as any[] }
}
