const blessed = require('blessed')

const screen = blessed.screen({
  fullUnicode: true
})

const fm = blessed.filemanager({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  border: 'line',
  label: ' {blue-fg}%path{/blue-fg} ',
  cwd: process.cwd(),
  keys: true,
  scrollbar: {
    bg: 'white'
  }, 
  style: {
    selected: {
      bg: 'blue'
    }
  }
})

fm.on('file', (file)=> {
  screen.destroy();
  console.log(file);
})


screen.key('C-c', function() {
  screen.destroy();
});

fm.refresh();

screen.render();