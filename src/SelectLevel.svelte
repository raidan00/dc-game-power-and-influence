<script>
	import { lvl } from './store.js';

	function reset(val) {
		lvl.set(val);
	}
</script>

<div class="main">
	<div class="text">
		You need win election. You have power and influence that have different effect on voters. Your opponent have only influence.
	</div>
	<div class="lelves">
		levels:
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

<style>
	.text {
		width: 70vw;
		font-size: 24px;
		margin-bottom: 10px;
		background: #cacff9;
		border-radius: 10px;
	}
</style>
