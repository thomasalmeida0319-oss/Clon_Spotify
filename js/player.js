// player.js - control real de audio: play/pause, progreso, tiempo y volumen
document.addEventListener('DOMContentLoaded', function () {
 const audio = document.getElementById('audioPlayer')
 const playBtn = document.querySelector('.player .play')
 const progress = document.querySelector('.player .progress')
 const nowTitle = document.querySelector('.player .now-title')
 const nowArtist = document.querySelector('.player .now-artist')
 const nowCover = document.querySelector('.player .now-cover')
 const timeCurrent = document.querySelector('.player .time-current')
 const timeDuration = document.querySelector('.player .time-duration')
 const volume = document.querySelector('.player .volume')

 function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
   .toString()
   .padStart(2, '0')
  return `${m}:${s}`
 }

 function setTrack({ src, title, artist, cover }) {
  if (!audio) return
  const same = audio.src === src
  if (!same) {
   audio.src = src || ''
   audio.currentTime = 0
  }
  if (title) nowTitle.textContent = title
  if (artist) nowArtist.textContent = artist
  if (cover) {
   nowCover.src = cover
   nowCover.alt = title || 'Portada'
  }
 }

 // construir playlist desde las tarjetas (orden del DOM)
 const trackButtons = Array.from(document.querySelectorAll('.play-btn'))
 const playlist = trackButtons.map((btn, idx) => ({
  src: btn.dataset.audio,
  title: btn.dataset.title || `Pista ${idx + 1}`,
  artist: btn.dataset.artist || '',
  cover: btn.dataset.cover || nowCover.src,
  button: btn,
  card: btn.closest('.card'),
 }))
 let currentIndex = -1
 let isShuffle = false
 let isRepeat = false // when true repeat current track on end

 // lazy-load images for performance
 document.querySelectorAll('img').forEach((img) => {
  img.loading = 'lazy'
 })

 const announcer = document.getElementById('player-announcer')

 function announce(text) {
  if (announcer) announcer.textContent = text
 }

 function highlightCurrent(index) {
  document
   .querySelectorAll('.card.playing')
   .forEach((c) => c.classList.remove('playing'))
  if (playlist[index] && playlist[index].card)
   playlist[index].card.classList.add('playing')
 }

 function playIndex(index) {
  if (index < 0 || index >= playlist.length) return
  currentIndex = index
  const t = playlist[index]
  setTrack(t)
  playAudio()
  highlightCurrent(index)
  announce(`${t.title} — ${t.artist}`)
 }

 function nextTrack() {
  if (playlist.length === 0) return
  if (isShuffle) {
   const rand = Math.floor(Math.random() * playlist.length)
   playIndex(rand)
   return
  }
  let next = currentIndex + 1
  if (next >= playlist.length) next = 0
  playIndex(next)
 }

 function prevTrack() {
  if (playlist.length === 0) return
  let prev = currentIndex - 1
  if (prev < 0) prev = playlist.length - 1
  playIndex(prev)
 }

 function updatePlayStateUI() {
  if (!playBtn || !audio) return
  if (audio.paused) {
   playBtn.textContent = '▶'
   playBtn.setAttribute('aria-pressed', 'false')
  } else {
   playBtn.textContent = '⏸'
   playBtn.setAttribute('aria-pressed', 'true')
  }
 }

 function playAudio() {
  if (!audio) return audio.play().catch(() => {})
 }
 function pauseAudio() {
  if (!audio) return audio.pause()
 }

 // reproducción desde tarjetas
 document.querySelectorAll('.play-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
   e.stopPropagation()
   const src = btn.dataset.audio
   const title = btn.dataset.title || 'Pista'
   const artist = btn.dataset.artist || ''
   const cover = btn.dataset.cover || nowCover.src
   const isSame = audio && audio.src === src
   // si ya forma parte de la playlist, actualizar currentIndex
   const idx = playlist.findIndex((t) => t.src === src)
   if (idx !== -1) currentIndex = idx
   setTrack({ src, title, artist, cover })
   // si es la misma pista, alternar reproducción
   if (isSame && audio && !audio.paused) pauseAudio()
   else playAudio()
  })
 })

 // botón del player flotante
 if (playBtn) {
  playBtn.addEventListener('click', () => {
   if (!audio) return
   if (audio.paused) playAudio()
   else pauseAudio()
  })
 }

 // controles next/prev/shuffle/repeat
 const btnNext = document.querySelector('.player .next')
 const btnPrev = document.querySelector('.player .prev')
 const btnShuffle = document.querySelector('.player .shuffle')
 const btnRepeat = document.querySelector('.player .repeat')

 if (btnNext) btnNext.addEventListener('click', () => nextTrack())
 if (btnPrev) btnPrev.addEventListener('click', () => prevTrack())
 if (btnShuffle)
  btnShuffle.addEventListener('click', () => {
   isShuffle = !isShuffle
   btnShuffle.setAttribute('aria-pressed', String(isShuffle))
   btnShuffle.classList.toggle('active', isShuffle)
   announce(isShuffle ? 'Aleatorio activado' : 'Aleatorio desactivado')
  })
 if (btnRepeat)
  btnRepeat.addEventListener('click', () => {
   isRepeat = !isRepeat
   btnRepeat.setAttribute('aria-pressed', String(isRepeat))
   btnRepeat.classList.toggle('active', isRepeat)
   announce(isRepeat ? 'Repetir activo' : 'Repetir desactivado')
  })

 // progreso y tiempos
 if (audio && progress) {
  audio.addEventListener('timeupdate', () => {
   if (!audio.duration) return
   const pct = (audio.currentTime / audio.duration) * 100
   progress.value = pct
   if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime)
  })

  audio.addEventListener('loadedmetadata', () => {
   if (timeDuration) timeDuration.textContent = formatTime(audio.duration)
   if (progress) progress.value = 0
  })

  progress.addEventListener('input', () => {
   if (!audio.duration) return
   const seek = (progress.value / 100) * audio.duration
   audio.currentTime = seek
   if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime)
  })

  audio.addEventListener('play', updatePlayStateUI)
  audio.addEventListener('pause', updatePlayStateUI)
  audio.addEventListener('ended', () => {
   updatePlayStateUI()
   if (isRepeat && currentIndex !== -1) {
    // repetir la misma pista
    playIndex(currentIndex)
   } else {
    nextTrack()
   }
  })
  audio.addEventListener('error', (e) => {
   console.error('Audio error', e)
  })
 }

 // volumen
 if (volume && audio) {
  volume.addEventListener('input', () => {
   audio.volume = parseFloat(volume.value)
  })
  // establecer volumen inicial
  audio.volume = parseFloat(volume.value || 1)
 }

 // accesibilidad: espacio para play/pause cuando no se está escribiendo
 document.addEventListener('keydown', (e) => {
  const active = document.activeElement
  const tag = active && active.tagName && active.tagName.toLowerCase()
  if (e.code === 'Space' && tag !== 'input' && tag !== 'textarea') {
   e.preventDefault()
   if (!audio) return
   if (audio.paused) playAudio()
   else pauseAudio()
  }
 })

 // Inicializar estado visual del reproductor
 if (timeCurrent) timeCurrent.textContent = '0:00'
 if (timeDuration) timeDuration.textContent = '0:00'
 updatePlayStateUI()
})
