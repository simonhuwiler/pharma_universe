import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH;

const hash = (Math.random() + 1).toString(36).substring(7);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const htmlTemplate = {
	template: async ({ attributes, files, meta, publicPath, title }) => {
		const script = (files.js || [])
			.map(({ fileName }) => {
				return `<script defer src='${fileName}'></script>`;
			})
			.join('\n');

		const css = (files.css || [])
			.map(({ fileName }) => {
				return `<link rel='stylesheet' href='${fileName}'>`;
			})
			.join('\n');
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width,initial-scale=1'>
        <meta name='apple-mobile-web-app-capable' content='yes'>
        <title>PharmaUniverse</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap" rel="stylesheet">
        <link rel='stylesheet' href='./global.css'>
        ${css}
        ${script}
			</head>
			<body>
			</body>
    </html>`;
	}
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'build/bundle-' + hash + '.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
    production && del({ targets: 'build/*' }),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle-' + hash + '.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		json(),
		copy({
			targets: [
			  { src: 'public/*', dest: 'build/' }
			]
		  }),

		html(htmlTemplate),		

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('build'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
