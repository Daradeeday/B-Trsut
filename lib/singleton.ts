export function singleton<T>(key: string, create: () => T): T {
  const g = globalThis as any
  g.__singletons ??= {}
  return (g.__singletons[key] ??= create())
}
