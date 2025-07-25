<script setup>
	const emit = defineEmits(['resetGame']);

	defineProps({
		isGameOver: Boolean,
		isGameWon: Boolean,
		WORD: String
	})
</script>

<template>
    <div class="overlay"></div>
    <div class="popup" :class="isGameWon ? 'win' : 'lose'">
		<template v-if="isGameWon">
			<div class="popup__confetti left">
				<img src="@/assets/img/confetti.png" alt="decor">
			</div>
			<div class="popup__title">
				<span>Win!</span>
			</div>
			<div class="popup__confetti right">
				<img src="@/assets/img/confetti.png" alt="decor">
			</div>
		</template>
		<div class="popup__content">
			<h2>{{ isGameOver ? (isGameWon ? 'Поздравляем, вы выиграли!' : 'К сожалению, вы проиграли.') : '' }}</h2>
			<p v-if="isGameOver">Загаданное слово: <b>{{ WORD }}</b></p>
			<button class="btn" @click="emit('resetGame')">Начать заново</button>
		</div>
    </div>
</template>

<style scoped lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 20;
		text-align: center;

		&.win b {
			color: var(--color-green);
		}
		&.lose b {
			color: red;
		}

		&__content {
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0 0 20px rgba(26, 62, 77, 0.2);
			padding: 20px;
			position: relative;
			z-index: 1;
		}

		&__title {
			font-size: 80px;
			font-weight: 700;
			text-shadow: 0 0 10px rgba(26, 62, 77, 0.5);
			color: var(--color-green);
			text-transform: uppercase;
			position: absolute;
			top: -130px;
			left: 50%;
			transform: translateX(-50%);

			& span {
				display: block;
				font-weight: inherit;
				transform-origin: center;
				opacity: 0;
				animation: scaleConfetti 0.5s ease-in-out forwards;
				animation-delay: 1s;
			}
		}

		&__confetti {
			position: absolute;
			top: -165px;
			width: 220px;
			animation: confetti 1.4s ease-in-out forwards;
			z-index: -1;

			& img {
				width: 100%;
				height: auto;
			}

			&.left {
				left: -20%;

				& img {
					transform: scale(-1, 1);
				}
			}

			&.right {
				right: -20%;
			}
		}

		h2 {
			margin-bottom: 10px;
			font-size: 30px;
		}

		p {
			margin-bottom: 20px;
		}

		b {
			font-weight: 700;
		}

		@keyframes confetti {
			0% {
				transform-origin: bottom;
				transform: scale(0) translateY(100px);
			}
			100% {
				transform-origin: bottom;
				transform: scale(1) translateY(0);
			}
		}

		@keyframes scaleConfetti {
			0% {
				opacity: 0;
				transform: scale(0);
			}
			100% {
				opacity: 1;
				transform: scale(1);
			}
			
		}
	}
</style>