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
          DEFAULT: '#0a0d3a', // Discord deep indigo
          soft: '#1e2353',    // Discord raised indigo
          card: '#1e2353',    // Surface indigo / card
          onyx: '#23272a',    // Discord onyx
          dark: '#080a29',
        },
        hairline: '#282b54',
        blurple: {
          DEFAULT: '#5865f2',
          hover: '#4752c4',
          light: '#7983f5',
        },
        ink: {
          DEFAULT: '#ffffff',
          hover: '#f2f3f5',
          dark: '#000000',
        },
        body: {
          DEFAULT: '#dadbdf',
          mid: '#949ba4',
        },
        mute: '#949ba4',
        accent: {
          blurple: '#5865f2',
          green: '#35ed7e',     // Discord Online green
          magenta: '#ec48bd',   // Discord vibrant pink
          link: '#00b0f4',      // Discord link cyan
          sunset: '#ec48bd',    // Playful magenta
          'sunset-soft': '#f472b6',
          breeze: '#5865f2',    // Blurple
          twilight: '#00b0f4',  // Cyan link
        },
      },
      fontFamily: {
        sans: [
          'ABC Ginto',
          'ggsans',
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
        display: [
          'ABC Ginto Nord',
          'Space Grotesk',
          'Hanken Grotesk',
          'Inter',
          'sans-serif'
        ],
        mono: [
          'Geist Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      borderRadius: {
        xs: '6px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        pill: '50px',
        full: '9999px',
      },
      boxShadow: {
        'discord-card': '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
        'discord-blurple': '0 0 20px rgba(88, 101, 242, 0.4)',
      }
    },
  },
  plugins: [],
}
