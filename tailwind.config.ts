import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

    },
  },


  plugins: [
    plugin(({ addVariant }) => {
      addVariant("progress-bar", ["&::-moz-progress-bar", "&::-webkit-progress-value"])
    }),
    iconsPlugin({
      collections: getIconCollections(["tabler"]),
    }),],
};
export default config;
