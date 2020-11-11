/**
 * 延时加载
 * @param delay 时间
 * @param callback 执行上下文
 * @returns {function(): void}
 */
export const debounce = (delay, callback) => {
  let task
  return function () {
    clearTimeout(task)
    task = setTimeout(() => {
      callback.apply(this, arguments)
    }, delay)
  }
}
