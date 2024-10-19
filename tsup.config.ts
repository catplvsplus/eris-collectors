import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
	external: [],
	noExternal: [],
	platform: 'node',
	format: ['esm', 'cjs'],
	target: 'es2022',
	skipNodeModulesBundle: true,
	clean: true,
	shims: true,
	cjsInterop: true,
	minify: false,
	terserOptions: {
		mangle: false,
		keep_classnames: true,
		keep_fnames: true,
	},
	splitting: false,
	keepNames: true,
	dts: true,
	sourcemap: true,
	esbuildPlugins: [],
	treeshake: false,
	outDir:'dist',
});