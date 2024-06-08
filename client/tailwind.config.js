/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Montserrat:['Montserrat','serif'],
        Pacifico:['Pacifico','cursive'],
        RobotoSlab:['Roboto Slab','arial'],
      }
    }, 
    daisyui: {
      themes: ["light", "dark"],
    },
  },
  plugins: [daisyui,tailwindScrollbar],
}

