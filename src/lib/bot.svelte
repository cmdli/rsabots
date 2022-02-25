<script lang="ts">
	function positionStyle(x, y) {
		return 'left:' + x + 'px;top:' + y + 'px';
	}
	let leftEye = '/botparts/eye-left.svg';
	let rightEye = '/botparts/eye-right.svg';
	let faceSrc = '/botparts/head.svg';
	let leftEyeStyle = positionStyle(17, 30);
	let rightEyeStyle = positionStyle(53, 30);
</script>

<div class="bot">
	<div id="bot-head" class="face">
		<img src={faceSrc} class="face-background" />
		<div id="eye-left" class="eye" style={leftEyeStyle}><img src={leftEye} /></div>
		<div id="eye-right" class="eye" style={rightEyeStyle}><img src={rightEye} /></div>
	</div>
</div>

<style>
	.bot {
		display: block;
		width: 100px;
		height: 100px;
	}
	.face {
		display: block;
		z-index: 100;
		position: absolute;
		width: 100px;
		height: 100px;
	}
	.face-background {
		z-index: 101;
		position: absolute;
	}
	.eye {
		z-index: 102;
		width: 30px;
		height: 30px;
		position: absolute;
	}
</style>
