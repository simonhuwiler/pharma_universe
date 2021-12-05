<script>
	import { _ } from 'svelte-i18n';
	let dots = ''
	// setInterval(() => {
	// 	dots = dots.length % 4 == 3 ? '' : dots + '.'
	// }, 200)


</script>

<div class='loading'>
	<div class='text'>{$_('messages.loading')}{dots}</div>
</div>
	
<style>
	.loading
	{
		z-index: 9000;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: black;
		background-image: url('./textures/skybox/6.png');
		background-size: cover;
	}
	
	.text
	{
		color: white;
		font-family: 'Titillium Web', sans-serif;
		font-size: 1.0em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-50%);
    animation: pulse 1s infinite;
		animation-direction: alternate;
	}

	@keyframes pulse {
    0% {
        opacity: 0;
    }

    80% {
        opacity: 1;
    }

    100% {
        opacity: 1;
    }
}

	/*
@media (min-width: 800px) {
	.loadingtext
	{
		font-size: 3em;
	}
}  
*/


	</style>