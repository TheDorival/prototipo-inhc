export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        subtle: '#f6f8fa',
        inset: '#eaeef2',
        line: '#d0d7de',
        linemuted: '#d8dee4',
        fg: '#1f2328',
        muted: '#656d76',
        accent: '#0969da',
        accentemph: '#0550ae',
        header: '#24292f',
        headerfg: '#e6edf3',
        green: '#1f883d',
        greenh: '#1a7f37',
        danger: '#cf222e',
        dangerbg: '#ffebe9',
        warn: '#9a6700',
        warnbg: '#fff8c5',
        okfg: '#1a7f37',
        okbg: '#dafbe1',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
