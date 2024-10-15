<script>
	import { _ } from 'svelte-i18n';

</script>

<div class='loading'>
	<div class='text'>{$_('messages.loading')}</div>
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
		background-color: rgb(19, 19, 19);
		/* background-image: url('./textures/skybox/6.png'); */
		/* background-size: cover; */
	}
	
	.text
	{
    font-family: "Lexend", sans-serif;
		color: white;
    font-size: 1.2em;
    font-weight: 200;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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

</style>