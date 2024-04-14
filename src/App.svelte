<script>
	import Game from './Game.svelte';
	import SelectLevel from './SelectLevel.svelte';
	import { lvl } from './store.js';
</script>

{#if $lvl == -1}
	<SelectLevel/>
{:else}
	<Game/>
{/if}

