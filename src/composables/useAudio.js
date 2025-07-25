// composables/useAudio.js
import { ref, onBeforeUnmount } from 'vue'

export const useAudio = () => {
  const audioContext = ref(new Map())
  const isAudioEnabled = ref(true)
  const masterVolume = ref(0.7)
  const musicVolume = ref(0.5)
  const sfxVolume = ref(0.8)

  // Типы аудио
  const AUDIO_TYPES = {
    MUSIC: 'music',
    SFX: 'sfx'
  }

  // Конфигурация аудио файлов
  const AUDIO_CONFIG = {
    // Фоновая музыка
    backgroundMusic: {
      src: 'src/assets/sounds/main-theme.mp3',
      type: AUDIO_TYPES.MUSIC,
      loop: true,
      volume: 0.3
    },
    
    // Звуковые эффекты
    gameOver: {
      src: 'src/assets/sounds/lose-bell.mp3',
      type: AUDIO_TYPES.SFX,
      volume: 0.8
    },
    victory: {
      src: 'src/assets/sounds/victory.mp3',
      type: AUDIO_TYPES.SFX,
      volume: 0.7
    },
    correctLetter: {
      src: 'src/assets/sounds/correct-letter.mp3',
      type: AUDIO_TYPES.SFX,
      volume: 0.6
    },
    wrongLetter: {
      src: 'src/assets/sounds/wrong-letter.mp3',
      type: AUDIO_TYPES.SFX,
      volume: 0.5
    }
  }

  // Инициализация аудио
  const initAudio = () => {
    Object.entries(AUDIO_CONFIG).forEach(([key, config]) => {
      const audio = new Audio(config.src)
      audio.preload = 'auto'
      audio.loop = config.loop || false
      audio.volume = calculateVolume(config.volume, config.type)
      
      // Обработка ошибок загрузки
      audio.addEventListener('error', (e) => {
        console.warn(`Ошибка загрузки аудио ${key}:`, e)
      })
      
      audioContext.value.set(key, {
        audio,
        config,
        isPlaying: false
      })
    })
  }

  // Вычисление итоговой громкости
  const calculateVolume = (baseVolume, type) => {
    if (!isAudioEnabled.value) return 0
    
    const typeVolume = type === AUDIO_TYPES.MUSIC ? musicVolume.value : sfxVolume.value
    return baseVolume * typeVolume * masterVolume.value
  }

  // Воспроизведение звука
  const play = async (soundKey, options = {}) => {
    if (!isAudioEnabled.value) return

    const audioItem = audioContext.value.get(soundKey)
    if (!audioItem) {
      console.warn(`Аудио ${soundKey} не найдено`)
      return
    }

    const { audio, config } = audioItem
    
    try {
      // Применяем опции
      if (options.volume !== undefined) {
        audio.volume = calculateVolume(options.volume, config.type)
      }
      
      if (options.loop !== undefined) {
        audio.loop = options.loop
      }

      // Перезапускаем с начала если нужно
      if (options.restart !== false) {
        audio.currentTime = 0
      }

      await audio.play()
      audioItem.isPlaying = true

      // Обработчик окончания воспроизведения
      audio.addEventListener('ended', () => {
        audioItem.isPlaying = false
      }, { once: true })

    } catch (error) {
      console.warn(`Ошибка воспроизведения ${soundKey}:`, error)
    }
  }

  // Остановка звука
  const stop = (soundKey) => {
    const audioItem = audioContext.value.get(soundKey)
    if (audioItem && audioItem.isPlaying) {
      audioItem.audio.pause()
      audioItem.audio.currentTime = 0
      audioItem.isPlaying = false
    }
  }

  // Пауза
  const pause = (soundKey) => {
    const audioItem = audioContext.value.get(soundKey)
    if (audioItem && audioItem.isPlaying) {
      audioItem.audio.pause()
      audioItem.isPlaying = false
    }
  }

  // Возобновление
  const resume = async (soundKey) => {
    const audioItem = audioContext.value.get(soundKey)
    if (audioItem && !audioItem.isPlaying) {
      try {
        await audioItem.audio.play()
        audioItem.isPlaying = true
      } catch (error) {
        console.warn(`Ошибка возобновления ${soundKey}:`, error)
      }
    }
  }

  // Остановка всей музыки
  const stopAllMusic = () => {
    audioContext.value.forEach((audioItem, key) => {
      if (audioItem.config.type === AUDIO_TYPES.MUSIC && audioItem.isPlaying) {
        stop(key)
      }
    })
  }

  // Остановка всех звуков
  const stopAll = () => {
    audioContext.value.forEach((audioItem, key) => {
      if (audioItem.isPlaying) {
        stop(key)
      }
    })
  }

  // Изменение громкости всех звуков определенного типа
  const updateVolumeByType = (type) => {
    audioContext.value.forEach((audioItem) => {
      if (audioItem.config.type === type) {
        audioItem.audio.volume = calculateVolume(audioItem.config.volume, type)
      }
    })
  }

  // Управление настройками звука
  const toggleAudio = () => {
    isAudioEnabled.value = !isAudioEnabled.value
    if (!isAudioEnabled.value) {
      stopAll()
    }
    updateAllVolumes()
  }

  const setMasterVolume = (volume) => {
    masterVolume.value = Math.max(0, Math.min(1, volume))
    updateAllVolumes()
  }

  const setMusicVolume = (volume) => {
    musicVolume.value = Math.max(0, Math.min(1, volume))
    updateVolumeByType(AUDIO_TYPES.MUSIC)
  }

  const setSfxVolume = (volume) => {
    sfxVolume.value = Math.max(0, Math.min(1, volume))
    updateVolumeByType(AUDIO_TYPES.SFX)
  }

  const updateAllVolumes = () => {
    audioContext.value.forEach((audioItem) => {
      audioItem.audio.volume = calculateVolume(audioItem.config.volume, audioItem.config.type)
    })
  }

  // Проверка состояния
  const isPlaying = (soundKey) => {
    const audioItem = audioContext.value.get(soundKey)
    return audioItem ? audioItem.isPlaying : false
  }

  // Очистка ресурсов
  const cleanup = () => {
    audioContext.value.forEach((audioItem) => {
      audioItem.audio.pause()
      audioItem.audio.src = ''
    })
    audioContext.value.clear()
  }

  // Очистка при размонтировании
  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    // Основные методы
    initAudio,
    play,
    stop,
    pause,
    resume,
    stopAllMusic,
    stopAll,
    
    // Управление настройками
    toggleAudio,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    
    // Проверка состояния
    isPlaying,
    isAudioEnabled,
    
    // Значения громкости (для UI настроек)
    masterVolume,
    musicVolume,
    sfxVolume,
    
    // Очистка
    cleanup
  }
}