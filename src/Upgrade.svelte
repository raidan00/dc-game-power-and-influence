<script>
	import { onMount, onDestroy } from "svelte";
	import { nextUpgrade, power, influence } from "./store.js";
	import { lvl } from './store.js';


	$power = 3;
	$influence = 10;
	let show = true;
	let interval;
	onMount(async() => {
		interval = setInterval(()=>{
			show = true;
		}, 1000)
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>


{#if show }
	<div class="main">
		<div>
			<div>Power</div>
			<div>Voters moving to vote box until he in your power ring</div>
			<button on:click={()=>{$power = $power*2; show=false} }>
				Upgrade to {$power*2}
			</button>

		</div>
		<div>
			<div>Influence</div>
			<div>Random voter move to vote box until he vote</div>
			<button on:click={()=>{$influence = $influence/2; show=false} }>
				Upgrade to {($influence/2).toFixed(2)}
			</button>
		</div>
	</div>
{/if}

<style>
	.main {
		height: 100vh;
		position: fixed;
		top: 0px;
		left: 0px;
		color: black;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.main > div{
		background: grey;
		width: 20vw;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
	}
	.main > div div:first-child{
		background: white;
		border-radius: 3px;
		font-size: 24px;
	}
</style>
