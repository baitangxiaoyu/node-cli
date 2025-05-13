const blessed = require('blessed')
const screen = blessed.screen({
  fullUnicode: true
})
const table = blessed.table({
  parent: screen,
  width: '80%',
  height: 'shrink',
  top: 'center',
  left: 'center',
  data: null,
  border: 'line',
  align: 'center',
  //启用标签功能
  tags: true,
  style: {
    border: {
      fg: 'white'
    },
    header: {
      fg: 'blue',
      bold: true
    },
    cell: {
      fg: 'green'
    }
  }
})

const data = [
  [ '姓名',  '性别', '年龄',  '电话号码'  ],
  [ '东东', '男',  '20', '13233334444' ],
  [ '光光', '男', '20', '13233332222' ],
  [ '小红', '女', '21', '13233335555' ],
  [ '小刚', '男', '22', '13233336666' ]
];
// {red-fg} 是开始标签，表示从这里开始应用红色前景色（文字颜色）。 {/red-fg} 是结束标签
data[1][0] = '{red-fg}' + data[1][0] + '{/red-fg}';

table.setData(data);

screen.key('C-c',()=>{
  screen.destroy()
})

screen.render()