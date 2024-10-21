// eslint-disable-next-line no-undef
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--text-primary-color)',
        'view-more': '#CBB472',
        'primary-color-only': '#CBB472',
        'secondary-color': '#A48000',
        'gold-0': '#FAF6EB',
        'gold-200': '#CBB472',
        'gold-150': '#44acf3',
        'gold-150-1': 'var(--gold-150-1)',
        'gold-300': '#AF8811',
        'gold-400': '#BE9417',
        'primary-100': '#EBEEFA',
        'primary-200': '#D0D8F0',
        'primary-300': '#7286CB',
        'primary-400': '#465EAF',
        'primary-500': '#2A4392',
        'primary-600': '#1C3073',
        'primary-700': '#132253',
        'primary-800': '#0A163D',
        white: 'var(--color-white)',
        'white-01': 'var(--color-white-01)',
        'white-04': 'rgba(255, 255, 255, 0.40)',
        'white-06': 'rgba(255, 255, 255, 0.60)',
        'white-005': 'rgba(255, 255, 255, 0.05)',
        'primary-01': 'var(--primary-01)',
        'neutral-100': '#e8e8e8',
        'neutral-200': 'var(--neutral-200)',
        'neutral-300': '#bfbfbf',
        'neutral-400': 'var(--neutral-400)',
        'neutral-500': '#616161',
        'neutral-600': 'var(--neutral-400)',
        'neutral-600-1': 'var(--neutral-400)',
        'neutral-700': '#2b2b2b',
        'neutral-800': 'var(--neutral-800)', // 1a1a1a
        'neutral-800-1': 'var(--neutral-800-1)',
        'neutral-850': 'var(--neutral-850)', // 141414
        'neutral-850-2': 'var(--neutral-850-2)', // 141414
        'neutral-900': 'var(--neutral-900)', // 0F0F0F
        'text-gray-1': '#474747',
        'no-data': 'var(--text-no-data)',
        secondary: 'var(--text-secondary)',
        'secondary-white': 'var(--text-secondary-white)',

        // 'neutral-850': '#272829',
        // 'neutral-900': '#18191A',

        'red-color': '#CE0000',
        'red-color-1': '#FF0C15',
        'red-color-2': '#FF3D3D',
        'yellow-color': '#DDAF0C'
      }
    },
    screens: {
      xsm: '280px',
      ssm: '281px',
      ssm1: '390px',
      ssm12: '365px',
      ssm2: '414px',
      sm: '640px',
      md: '768px',
      lg: '1025px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1536px'
    }
  }
}
