/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            lighter: '#F0F4FA',
            light: '#E6EEF9',
            DEFAULT: '#424874',
            dark: '#363B5F',
          },
          cream: '#FFF8E5',
        },
      },
      borderRadius: {
        'curved': '32px 16px 32px 16px',
      },
      zIndex: {
        '-1': '-1',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#424874',
            h1: {
              color: '#424874',
            },
            h2: {
              color: '#424874',
            },
            h3: {
              color: '#424874',
            },
            strong: {
              color: '#424874',
            },
            a: {
              color: '#424874',
              '&:hover': {
                color: '#363B5F',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};