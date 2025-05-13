const { Command } = require('commander');
const program = new Command();

program.name('cli-args-test').description('CLI for testing cli-args').version('0.0.1');

program.command('split')
.description('分割字符串为字符数组')
.argument('<string>', '分割的字符串')
.option('--first', '只展示第一个子串')
.option('-s, --separator <char>', '分割字符', ',')
.action((str, options) => {
  const limit = options.first ? 1 : undefined;
  console.log(str.split(options.separator, limit));
});

program.parse();
