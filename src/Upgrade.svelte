<script>
	import { onMount, onDestroy } from "svelte";
	import { lvl, power, influence, winLooseMsg } from "./store.js";

	let powers = [5, 10, 20, 25, 30, 31,32,33,34,36,37];
	let powerI = 0;
	function getNextPower(){
		if(powerI > powers.length-2)powerI = powers.length-2;
		return powers[powerI+1];
	}
	let influences = [10000, 5000, 2500, 1700, 1000, 700, 690, 670, 660, 650, 640];
	let influenceI = 0;
	function getNextInfluence(){
		if(influenceI>influences.length-2)influenceI = influences.length-2;
		return influences[influenceI+1];
	}
	$power = powers[0];
	$influence = influences[0];
	let show = true;
	let interval;
	onMount(async() => {
		interval = setInterval(()=>{
			show = true;
		}, 15000)
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>


{#if show && !$winLooseMsg && $lvl != -0}
	<div class="main">
		<div>
			<div>Power</div>
			<div>Voters moving to vote box until he in your power ring</div>
			<button on:click={()=>{ $power = getNextPower(); show=false; powerI++;} }>
				Upgrade to {getNextPower().toFixed(2)}
			</button>

		</div>
		<div>
			<div>Influence</div>
			<div>Random voter move to vote box until he vote</div>
			<button on:click={()=>{ $influence = getNextInfluence(); show=false; influenceI++;} }>
				Upgrade to {getNextInfluence().toFixed(2)}
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
		pointer-events: none;
	}
	.main > div{
		background: grey;
		width: 20vw;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		pointer-events: all;
	}
	.main > div div:first-child{
		background: white;
		border-radius: 3px;
		font-size: 24px;
	}
</style>
