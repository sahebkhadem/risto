import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	// Place ignores at the top level to ensure they apply globally
	{
		ignores: [
			"src/generated/**",
			"node_modules/**",
			"dist/**",
			"build/**",
			".next/**"
		]
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
			]
		}
	}
];

export default eslintConfig;
