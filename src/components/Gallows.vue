<script setup>

  import { ref } from 'vue'

  const WORD = 'Человек';
  const letters = [...WORD.toLowerCase()];

  const errorValue = ref(0);
  const wrongLetters = ['a', 'и'];

  function checkLetter() {

  }

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
            <div v-for="letter in letters" class="gallows__info-letter">{{ letter }}</div>
          </div>
        </div>
        <div class="gallows__info-item">
          <div class="gallows__info-txt">Ошибки ({{errorValue}}):</div>
          <div class="gallows__info-word error">
            <span v-for="item in wrongLetters">{{ item }}</span>
          </div>
        </div>
        <div class="gallows__info-item">
          <div class="gallows__info-txt">Буква:</div>
          <input type="text" class="gallows__info-input" maxlength="1"/>
        </div>

        <button type="button" class="btn">Проверить</button>
      </div>
    </div>
  </div>
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
        display: flex;
        align-items: center;
        grid-gap: 10px;
        font-size: 18px;

        &:not(:last-child) {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(26, 62, 77, 0.2);
        }
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
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        text-transform: uppercase;
        border: 1px solid var(--vt-c-divider-dark-1);
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
      left: 80px;

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

    .btn {
      font: inherit;
      border: none;
      background-color: var(--vt-c-black);
      color: var(--vt-c-white);
      font-weight: 700;
      padding: 10px 16px;
      cursor: pointer;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;
      transition: background-color 0.2s;

      @media (hover: hover) {
        &:hover {
          background-color: hsl(162, 93%, 40%);
        }
      }
    }
  }
</style>