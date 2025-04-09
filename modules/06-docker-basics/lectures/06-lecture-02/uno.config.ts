import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    // custom the default background
    'bg-main': 'bg-white text-[#181818] dark:(bg-[#121212] text-[#ddd])',
    'h2': 'text-2xl font-bold mb-8',
  },
  // ...
})