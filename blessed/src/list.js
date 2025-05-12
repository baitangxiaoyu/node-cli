const blessed = require('blessed');

const screen = blessed.screen({
  // 支持中文字符
  fullUnicode: true,
});

const data = [
  "红楼梦",
  "西游记",
  "水浒传",
  "三国演义",
]

const list = blessed.list({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  border:'line',
  align: 'left',
  keys: true,
  items: data,
  mouse: true,
  label: '书籍列表',
  style:{
    fg: 'white',
    bg: 'default',
    selected: {
        bg: 'blue'
    }
  }
})

screen.append(list)

list.select(0)

list.on('select',(item)=>{
  screen.destroy()
  console.log(item.getText())
})

screen.key('C-c',()=>{
  screen.destroy()
})

list.focus()
screen.render()