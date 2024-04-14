<script>
	import { lvl } from './store.js';

	function reset(val) {
		lvl.set(val);
	}
</script>

<div class="main">
	<div class="lelves">
		levels
	</div>
	<button on:click={()=>reset(0)}>
		how to play
	</button>
	<button on:click={()=>reset(1)}>
		1
	</button>
	<button on:click={()=>reset(2)}>
		2
	</button>
	<button on:click={()=>reset(3)}>
		3
	</button>
</div>

