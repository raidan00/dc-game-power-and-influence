<script>
	import { lvl } from './store.js';

	function back(val) {
		lvl.set(-1);
	}
</script>

<button on:click={back}>
	Back
</button>

<style>
	button {
		margin: 0px;
		top: 0px;
		left: 0px;
		position: fixed;
	}
</style>
