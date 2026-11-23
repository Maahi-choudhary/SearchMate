/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0a0a0a',
          soft: '#1a1c20',
          card: '#191919',
          mid: '#363a3f',
        },
        hairline: '#212327',
        ink: {
          DEFAULT: '#ffffff',
          hover: '#fafaf7',
        },
        body: {
          DEFAULT: '#dadbdf',
          mid: '#7d8187',
        },
        mute: '#7d8187',
        accent: {
          sunset: '#ff7a17',
          'sunset-soft': '#ffc285',
          dusk: '#7c3aed',
          twilight: '#c4b5fd',
          breeze: '#a0c3ec',
          midnight: '#0d1726',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'universalSans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        mono: [
          'Geist Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'monospace'
        ]
      },
      borderRadius: {
        sm: '8px',
        pill: '9999px',
      },
      letterSpacing: {
        'display-xl': '-2.4px',
        'display-lg': '-1.8px',
        'display-md': '-1.2px',
        'display-sm': '-0.6px',
        'caption-mono': '1.4px',
        'caption-mono-sm': '1.2px',
      }
    },
  },
  plugins: [],
}
