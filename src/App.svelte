<script>
	import Game from './Game.svelte';
	import Back from './Back.svelte';
	import SelectLevel from './SelectLevel.svelte';
	import { lvl } from './store.js';
</script>

{#if $lvl == -1}
	<SelectLevel/>
{:else}
	<Game/>
	<Back/>
{/if}

