import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        seasalt: "#f8f9fa",
        "antiflash-white": "#e9ecef",
        platinum: "#dee2e6",
        "french-gray": "#ced4da",
        "french-gray-2": "#adb5bd",
        "slate-gray": "#6c757d",
        "outer-space": "#495057",
        onyx: "#343a40",
        "eerie-black": "#212529",
      },
    },
  },
  plugins: [],
} satisfies Config;
