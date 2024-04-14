<script>
	import { route } from './store.js';

	function reset() {
		route.set(0);
	}
</script>

<button on:click={reset}>
	start game
</button>

