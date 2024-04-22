<script>
	import { scoreData} from './store.js';
</script>

<div class="main">
	<div>
		your voters: {$scoreData.yourVoters}
	</div>
	<div>
		opponent voters: {$scoreData.opponentVoters}
	</div>
</div>

<style>
	.main{
		position: fixed;
		right: 0px;
		top: 0px;
		background: white;
		border: 2px solid black;
		border-radius: 5px;
		text-align: left;
		padding: 3px;
		font-size: 14px;
	}
</style>


