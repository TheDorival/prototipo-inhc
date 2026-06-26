export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        subtle: '#f1f5f9',
        inset: '#e2e8f0',
        line: '#e5e7eb',
        fg: '#1e293b',
        muted: '#64748b',
        accent: '#4f46e5',
        accentemph: '#4338ca',
        accentsoft: '#eef2ff',
        green: '#16a34a',
        greenh: '#15803d',
        danger: '#dc2626',
        dangerbg: '#fee2e2',
        warn: '#d97706',
        warnbg: '#fef3c7',
        okfg: '#15803d',
        okbg: '#dcfce7',
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
