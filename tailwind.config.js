const c = (v) => `rgb(var(${v}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: c('--c-canvas'),
        subtle: c('--c-subtle'),
        inset: c('--c-inset'),
        line: c('--c-line'),
        fg: c('--c-fg'),
        muted: c('--c-muted'),
        accent: c('--c-accent'),
        accentemph: c('--c-accentemph'),
        accentsoft: c('--c-accentsoft'),
        green: c('--c-green'),
        greenh: c('--c-greenh'),
        danger: c('--c-danger'),
        dangerbg: c('--c-dangerbg'),
        warn: c('--c-warn'),
        warnbg: c('--c-warnbg'),
        okfg: c('--c-okfg'),
        okbg: c('--c-okbg'),
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        card: '0 1px 3px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.04)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
