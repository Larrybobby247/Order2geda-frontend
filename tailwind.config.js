export default { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: {
  colors: { brand: { DEFAULT: '#10B981', 50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 400: '#34D399', 600: '#059669', 700: '#047857', dark: '#064E3B', deep: '#022C22', mint: '#D1FAE5', gold: '#FBBF24', amber: '#F59E0B' }, ink: '#17211F' },
  fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }, borderRadius: { card: '18px' },
  boxShadow: { soft: '0 10px 30px -14px rgba(6,78,59,.28)', glow: '0 18px 50px -14px rgba(16,185,129,.55)' },
  keyframes: {
    fadeUp: { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'none' } }, fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
    float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } }, marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
    blob: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(40px,-30px) scale(1.12)' }, '66%': { transform: 'translate(-30px,25px) scale(.94)' } },
    pop: { '0%': { transform: 'scale(.85)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } }, ring: { '0%': { transform: 'scale(.8)', opacity: .6 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
    draw: { to: { strokeDashoffset: 0 } }, gradient: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } } },
  animation: { 'fade-up': 'fadeUp .6s cubic-bezier(.2,.7,.2,1) both', 'fade-in': 'fadeIn .5s both', float: 'float 6s ease-in-out infinite', 'float-slow': 'float 9s ease-in-out infinite', marquee: 'marquee 32s linear infinite', blob: 'blob 14s ease-in-out infinite', pop: 'pop .4s cubic-bezier(.2,.8,.3,1.3) both', ring: 'ring 2s ease-out infinite', draw: 'draw .8s .2s ease-out forwards', gradient: 'gradient 8s ease infinite' } } }, plugins: [] };
