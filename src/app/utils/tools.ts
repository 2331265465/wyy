export function isObject(obj: Object): boolean {
  return JSON.stringify(obj) === '{}';
}
