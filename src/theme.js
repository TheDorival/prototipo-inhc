export function currentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function applyTheme(t) {
  const el = document.documentElement
  el.classList.add('theme-transition')
  el.classList.toggle('dark', t === 'dark')
  try { localStorage.setItem('theme', t) } catch (e) {}
  clearTimeout(window._themeTO)
  window._themeTO = setTimeout(() => el.classList.remove('theme-transition'), 350)
}
