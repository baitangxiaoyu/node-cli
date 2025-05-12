const blessed = require('blessed')

const screen = blessed.screen({
  fullUnicode: true
})

const prompt = blessed.prompt({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: 'shrink',
  border: 'line',
})

const msg = blessed.message({
  parent: screen,
  border: 'line',
  width: 'half',
  height: 'shrink',
  top: 'center',
  left: 'center',
  label: ' {blue-fg}提示{/blue-fg} ',
  tags: true,
  hidden: true
});

prompt.input('你的用户名',(err,username)=>{
  prompt.input('你的秘密',(err,password)=>{
    msg.display('登陆成功')
    setTimeout(()=>{
      screen.destroy()
    },1000)
  })
 
})

screen.key('C-c',()=>{
  screen.destroy()
})

screen.render()
