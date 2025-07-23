<script setup>

import { computed, nextTick, ref, watch } from 'vue'
import Popup from './Popup.vue';

  const WORD = 'Человек';
  const letters = [...WORD.toLowerCase()];

  const errorValue = ref(0);

  const allTriedLetters = ref([]);
  const correctLetters = ref([]);
  const isSameLetter = ref(false);
  const wrongLetters = ref([]);
  const inputLetter = ref('');
  const inputRef = ref();

  const MAX_ERRORS = 6;

  // Computed properties to check the game status
  const isGameLost = computed(() => errorValue.value >= MAX_ERRORS);
  const isGameWon = computed(() => {
    const uniqueLetters = [...new Set(letters)];
    return uniqueLetters.every(letter => correctLetters.value.includes(letter));
  });

  // Check if the game is over (either won or lost)
  const isGameOver = computed(() => isGameWon.value || isGameLost.value);

  watch(isGameWon, (newValue) => {
    if (newValue) {
      console.log('ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!');
    }
  });

  watch(isGameLost, (newValue) => {
    if (newValue) {
      console.log('ИГРА ОКОНЧЕНА! ВЫ ПРОИГРАЛИ!');
    }
  });

  function checkLetter() {
    if (isGameOver.value) return;

    const letter = inputLetter.value.toLowerCase().trim();
    if (!letter) return;

    if (allTriedLetters.value.includes(letter)) {
      isSameLetter.value = true;

      nextTick(() => {
        inputRef.value?.focus();
      });
      return;
    }

    isSameLetter.value ? isSameLetter.value = false : ''
    allTriedLetters.value.push(letter);

    if (letters.includes(letter)) { // if the letter is in the word

      if (!correctLetters.value.includes(letter)) {
        correctLetters.value.push(letter); // add the letter to the list of correct letters
      }

      letters.forEach((item, index) => {
        if (item === letter) {
          const letterElement = document.querySelector(`.gallows__info-letter:nth-child(${index + 1})`);
          if (letterElement) {
            letterElement.classList.add('active');
          }
        }
      });
      
    } else {

      if (wrongLetters.value.length === 0) {
        wrongLetters.value.push(letter);
      } else {
        wrongLetters.value.push(`, ${letter}`);
      }

      errorValue.value++;
    }

    inputLetter.value = '';

    if (!isGameOver.value) {        
      nextTick(() => {
        inputRef.value?.focus();
      });
    } else {
      nextTick(() => {
        inputRef.value?.blur();
      });
    }
  }

  const wrongLettersString = computed(() => wrongLetters.value.join(''));
</script>

<template>
  <div class="gallows">
    <h1>Виселица!</h1>
    <div class="gallows__holder">
      <div class="gallows__picture">
        <div class="gallows__picture-blocks">
          <div class="gallows__picture-block one"></div>
          <div class="gallows__picture-block two"></div>
          <div class="gallows__picture-block three"></div>
        </div>
        <div class="gallows__person">
          <div v-if="errorValue >= 1" class="gallows__person-head"></div>
          <div v-if="errorValue >= 2" class="gallows__person-body"></div>
          <div v-if="errorValue >= 3" class="gallows__person-hand left"></div>
          <div v-if="errorValue >= 4" class="gallows__person-hand right"></div>
          <div v-if="errorValue >= 5" class="gallows__person-foot left"></div>
          <div v-if="errorValue >= 6" class="gallows__person-foot right"></div>
        </div>
      </div>
      <div class="gallows__info">
        <div class="gallows__info-item">
          <div class="gallows__info-txt">Слово:</div>
          <div class="gallows__info-word">
            <div v-for="letter in letters" class="gallows__info-letter">
              <div class="back"></div>
              <div class="front">{{ letter }}</div>
            </div>
          </div>
        </div>
        <div class="gallows__info-item">
          <div class="gallows__info-txt">Ошибки ({{ errorValue }} / {{ MAX_ERRORS }}):</div>
          <div class="gallows__info-word error">{{ wrongLettersString }}</div>
        </div>
        <div class="gallows__info-item">
          <div class="gallows__info-txt">Буква:</div>
          <input
            ref="inputRef"
            v-model="inputLetter"
            @keyup.enter="checkLetter"
            type="text"
            class="gallows__info-input"
            maxlength="1"/>
          <div v-if="isSameLetter && inputLetter" class="gallows__info-error">Вы уже пробовали эту букву, попробуйте другую!</div>
        </div>

        <button
          @click="checkLetter"
          :disabled="!inputLetter"
          type="button"
          class="btn">Проверить</button>
      </div>
    </div>
  </div>

  <Popup 
    v-if="isGameOver"
    :isGameOver="isGameOver" 
    :isGameWon="isGameWon" 
    :WORD="WORD"
  />
</template>

<style scoped lang="scss">
  .gallows {

    h1 {
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 40px;
    }

    &__holder {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      max-width: 880px;
      margin: 0 auto;
      padding: 30px;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(26, 62, 77, 0.2);
    }

    &__info {
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid rgba(26, 62, 77, 0.2);

      &-item {
        position: relative;
        display: flex;
        align-items: center;
        grid-gap: 10px;
        font-size: 18px;

        &:not(:last-child) {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(26, 62, 77, 0.2);
        }
      }

      &-error {
        position: absolute;
        left: 0;
        bottom: 0;
        font-weight: 700;
        color: red;
        font-size: 12px;
      }

      &-word {
        display: flex;
        grid-gap: 6px;

        &.error {
          font-weight: 700;
          color: red;
        }
      }
      
      &-letter {
        width: 40px;
        height: 40px;
        box-shadow: 0 0 6px -4px black;
        transition: 0.75s all;
        transform-style: preserve-3d;
        position: relative;

        &.active {
          transform: rotateY(180deg);
        }

        .back,
        .front {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 6px;
          font-weight: 700;
          inset: 0;
          text-transform: uppercase;
          border: 1px solid var(--vt-c-divider-dark-1);
          overflow: hidden;
        }

        .back {
          background-color: #f1f1f1;
        }

        .front {
          background-color: #fff;
          overflow: hidden;
          transform: rotateY(180deg);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      }

      input {
        font: inherit;
      }
    }

    &__picture {
      position: relative;

      &-blocks {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      &-block {

        &.one {
          width: 200px;
          height: 80px;
          border: 30px solid var(--vt-c-black);
          border-width: 20px 30px 0 10px;
          margin: 0 auto;
        }

        &.two {
          width: 200px;
          height: 360px;
          border: 30px solid var(--vt-c-black);
          border-width: 0 30px 0 0;
          margin: 0 auto;
        }

        &.three {
          width: 360px;
          height: 40px;
          background-color: var(--vt-c-black);
          margin: 0 auto;
        }
      }
    }

    &__person {
      position: absolute;
      top: 75px;
      left: 73px;

      &-head {
        width: 60px;
        height: 60px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        border: 5px solid var(--vt-c-black);
      }

      &-body {
        width: 5px;
        height: 160px;
        background-color: var(--vt-c-black);
        margin: 0 auto;
      }

      &-hand {
        position: absolute;
        top: 84px;
        width: 5px;
        height: 80px;
        background-color: var(--vt-c-black);

        &.left {
          left: -7px;
          transform: rotate(295deg);
        }

        &.right {
          right: -7px;
          transform: rotate(-295deg);
        }
      }

      &-foot {
        position: absolute;
        top: 204px;
        width: 5px;
        height: 100px;
        background-color: var(--vt-c-black);

        &.left {
          left: -7px;
          transform: rotate(45deg);
        }

        &.right {
          right: -7px;
          transform: rotate(-45deg);
        }
      }
    }
  }
</style>