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

var hash = '.' + (Math.random() + 1).toString(36).substring(5);
hash = production ? hash : ''

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
			<html lang="de">
			<head>
				<meta charset='utf-8'>
				<meta name='viewport' content='width=device-width,initial-scale=1'>
				<meta name="author" content="Simon Huwiler">
				<meta name="apple-mobile-web-app-capable" content="yes" />        

				<meta name="description" content="Wenn die Pharmabranche ein Universum wäre, sähe es so aus." />

				<! -- FAVICON -->
				<link rel="shortcut icon" href="/favicon-16x16.ico">
				<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32">
				<link rel="icon" type="image/png" href="./favicon-96x96.png" sizes="96x96">
				<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon-180x180.png">
				<meta name="msapplication-TileColor" content="#ffffff">
				<meta name="msapplication-TileImage" content="./mstile-150x150.png">        
				
				<!-- FACEBOOK -->
				<meta property="og:url"           content="https://www.journalist.sh/pharmauniverse" />
				<meta property="og:type"          content="website" />
				<meta property="og:title"         content="Das Pharma-Universum | The Pharma-Universe" />
				<meta property="og:description"   content="Wenn die Pharmabranche ein Universum wäre, sähe es so aus." />
				<meta property="og:image"         content="https://www.journalist.sh/pharmauniverse/images/facebook.jpg" />
			
				<!-- TWITTER -->
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:site" content="@simon_huwiler"/>
				<meta name="twitter:url" content="https://www.journalist.sh/pharmauniverse" />
				<meta name="twitter:title" content="Das Pharma-Universum | The Pharma-Universe"/>
				<meta name="twitter:description" content="Wenn die Pharmabranche ein Universum wäre, sähe es so aus."/>
				<meta name="twitter:image" content="https://www.journalist.sh/pharmauniverse/images/facebook.jpg"/>

				<title>Das Pharma-Universum | The Pharma-Universe</title>

				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swap" rel="stylesheet">
				<link href="https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap" rel="stylesheet">
				<link rel='stylesheet' href='./global.css'>
				<link rel='stylesheet' href='./bundle${hash}.css'>
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
		file: 'build/bundle' + hash + '.js',
		// dir: 'build',
		// entryFileNames: "bundle.[hash].js"
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
		css({ output: 'bundle' + hash + '.css' }),

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
