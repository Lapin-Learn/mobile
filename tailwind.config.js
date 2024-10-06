/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      height: {
        'fit-content': 'fit-content(20em)',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '36px',
        '6xl': '40px',
        '7xl': '44px',
        '8xl': '48px',
        '9xl': '52px',
        '10xl': '56px',
      },
      spacing: {
        1: '4px', // 1 unit = 4px
        2: '8px', // 2 units = 8px
        3: '12px', // 3 units = 12px
        4: '16px', // 4 units = 16px
        5: '20px', // 5 units = 20px
        6: '24px', // 6 units = 24px
        7: '28px', // 7 units = 28px
        8: '32px', // 8 units = 32px
        8.5: '34px', // 8.5 units = 34px
        9: '36px', // 9 units = 36px
        10: '40px', // 10 units = 40px
        11: '44px', // 11 units = 44px
        12: '48px', // 12 units = 48px
        12.5: '50px', // 12.5 units = 50px
        13.5: '54px', // 13.5 units = 54px
        14: '56px', // 14 units = 56px
        15: '60px', // 14 units = 56px
        16: '64px', // 16 units = 64px
        18: '72px', // 18 units = 72px
        20: '80px', // 20 units = 80px
        22: '88px', // 22 units = 88px
        24: '96px', // 24 units = 96px
        28: '112px', // 28 units = 112px
        32: '128px', // 32 units = 128px
        36: '144px', // 36 units = 144px
        40: '160px', // 40 units = 160px
        44: '176px', // 44 units = 176px
      },
      boxShadow: {
        button: '4px 4px 0px 0px rgba(169, 66, 28, 1)',
        'listening-lesson': '4px 4px 0px 0px rgba(39,124,181,1)',
        'reading-lesson': '4px 4px 0px 0px rgba(62,145,1,1)',
        'speaking-lesson': '4px 4px 0px 0px rgba(135,62,181,1)',
        'writing-lesson': '4px 4px 0px 0px rgba(181,160,53,1)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'large-title': ['34px', { lineHeight: '51px' }],
        'title-1': ['28px', { lineHeight: '42px' }],
        'title-2': ['22px', { lineHeight: '28px' }],
        'title-3': ['20px', { lineHeight: '25px' }],
        'title-4': ['17px', { lineHeight: '25.5px' }],
        headline: ['17px', { lineHeight: '22px' }],
        body: ['17px', { lineHeight: '22px' }],
        callout: ['16px', { lineHeight: '21px' }],
        subhead: ['15px', { lineHeight: '22.5px' }],
        footnote: ['13px', { lineHeight: '18px' }],
        'caption-1': ['12px', { lineHeight: '16px' }],
        'caption-2': ['11px', { lineHeight: '13px' }],
        streak: ['64px', { lineHeight: '64px' }],
      },
      colors: {
        background: '#F9F7F7',
        orange: {
          50: '#fdefea',
          100: '#facdbc',
          200: '#f7b49c',
          300: '#f4926f',
          400: '#f17d53',
          500: '#ee5d28',
          600: '#d95524',
          700: '#a9421c',
          800: '#833316',
          900: '#642711',
        },
        green: {
          50: '#eefae6',
          100: '#cbefb1',
          200: '#b2e88b',
          300: '#8fdd55',
          400: '#79d635',
          500: '#58cc02',
          600: '#50ba02',
          700: '#3e9101',
          800: '#307001',
          900: '#255601',
        },
        red: {
          50: '#ffeded',
          100: '#ffc7c7',
          200: '#ffacac',
          300: '#ff8686',
          400: '#ff6f6f',
          500: '#ff4b4b',
          600: '#e84444',
          700: '#b53535',
          800: '#8c2929',
          900: '#6b2020',
        },
        yellow: {
          50: '#fffced',
          100: '#fff6c7',
          200: '#fff2ac',
          300: '#ffec86',
          400: '#ffe86f',
          500: '#ffe24b',
          600: '#e8ce44',
          700: '#b5a035',
          800: '#8c7c29',
          900: '#6b5f20',
        },
        purple: {
          50: '#f9eeff',
          100: '#ebcbff',
          200: '#e1b2ff',
          300: '#d38eff',
          400: '#cb79ff',
          500: '#be57ff',
          600: '#ad4fe8',
          700: '#873eb5',
          800: '#69308c',
          900: '#50256b',
        },
        neutral: {
          50: '#efefef',
          100: '#cccccc',
          200: '#b4b4b4',
          300: '#929292',
          400: '#7d7d7d',
          500: '#5c5c5c',
          600: '#545454',
          700: '#414141',
          800: '#333333',
          900: '#272727',
        },
        blue: {
          DEFAULT: '#37aeff',
          50: '#ebf7ff',
          100: '#c1e6ff',
          200: '#a3daff',
          300: '#79c9ff',
          400: '#5fbeff',
          500: '#37aeff',
          600: '#329ee8',
          700: '#277cb5',
          800: '#1e608c',
          900: '#17496b',
        },
        dark: '#272727',
        'supporting-text': '#929292',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
  plugins: [],
};
