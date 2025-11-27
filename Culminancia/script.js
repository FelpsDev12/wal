const faseSection = document.querySelector('section')
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const teladerrota = document.querySelector('.teladerrota')
const restart = document.getElementById('restart')
const feedbackCustom = document.querySelector('.feedbackCustom')

faseSection.onclick = () => {
   if (faseSection.classList.contains('unlocked')) {
    start()
   }
}

function start() {
    document.querySelector('.fases').style.display = 'none'
    canvas.style.display = ''
}
