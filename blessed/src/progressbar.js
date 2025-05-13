const blessed = require('blessed')
const screen = blessed.screen({
  fullUnicode: true
})

const progressBar = blessed.progressbar({
  parent: screen,
  top: '50%',
  left: '50%',
  height: 2,
  width: 20,
  style: {
      bg: 'gray',
      bar: {
          bg: 'green'
      }
  }
})

let total = 0
const timer = setInterval(()=>{
  if(total === 100){
    clearInterval(timer)
  }
  progressBar.setProgress(total)
  screen.render()
  total += 2
},100)

screen.key('C-c',()=>{
  screen.destroy()
})

screen.render()