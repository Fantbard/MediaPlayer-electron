// 递归获取嵌套对象中的值
export function get(obj, path, defaultValue = undefined) {
  const paths = path.split(".");
  let result = obj;
  for (const p of paths) {
    if (result === null || result === undefined) return defaultValue;
    result = result[p];
  }
  return result !== undefined ? result : defaultValue;
}

// 递归设置嵌套对象中的值
export function set(obj, path, value) {
  const paths = path.split(".");
  let current = obj;
  for (let i = 0; i < paths.length - 1; i++) {
    const p = paths[i];
    if (!current[p]) current[p] = {};
    current = current[p];
  }
  current[paths[paths.length - 1]] = value;
  return obj;
}

// 深合并两个对象
export function deepMerge(target, source) {
  if (typeof target !== "object" || typeof source !== "object") return source;
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        key in target &&
        typeof target[key] === "object" &&
        !Array.isArray(target[key]) &&
        typeof source[key] === "object"
      ) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
