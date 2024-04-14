<script>
	import Game from './Game.svelte';
	import SelectLevel from './SelectLevel.svelte';
	import { route } from './store.js';
</script>

{#if $route.route == 'select level'}
	<SelectLevel/>
{:else}
	<Game/>
{/if}

