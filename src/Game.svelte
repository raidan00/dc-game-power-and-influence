<script>
	import { onMount, onDestroy } from "svelte";
	import { dcInit, DcWorld } from "dvijcock";
	import DcLogic from "./DcLogic.js";
	import { loadModels } from "./models.js";
	import Score from "./Score.svelte";
	import WinLoose from "./WinLoose.svelte";
	import Upgrade from "./Upgrade.svelte";

	let gemaeLogic = undefined;
	let domEl;
	let dc;
	onMount(async() => {
		await Promise.all([
			loadModels(),
			dcInit(),
		]);
		dc = new DcWorld();
		dc.setDomElement(domEl);
		dc.setLogic(new DcLogic);
	});
	onDestroy(() => {
		dc.destroy();
	});
</script>

<div bind:this={domEl} class="game">
</div>
<Score />
<WinLoose />
<Upgrade />

<style>
	.game {
		width: 100vw;
		height: 100vh;
		margin: 0px;
		top: 0px;
		left: 0px;
		position: fixed;
	}
</style>
