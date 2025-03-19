const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});

traverse(ast, {
  // // 自动为console添加日志开始行数和列数
  // CallExpression(path){
  //   const code = generator(path.node.callee).code
  //   if(code.includes('console')){
  //     const { line, column } = path.node.loc.start
  //     path.insertAfter(generator)
  //     path.node.arguments.unshift(types.stringLiteral(`filename:(${line}:${column})`))
  //   }
  // }

  //自动为console添加一行新的console日志开始行数和列数
  CallExpression(path) {
    if(path.node.isNew) return
    const code = generator(path.node.callee).code;
    if (code.includes('console')) {
      const { line, column } = path.node.loc.start;
      const str = template.expression(
        `console.log("filename:(${line}:${column})")`
      )();
      str.isNew = true;
      if (path.findParent((path) => types.isJSXExpressionContainer(path))) {
        path.replaceWith(types.arrayExpression([str, path.node]));
        path.skip()
      } else {
        path.insertBefore(str);
      }
    }
  },
});

const str = generator(ast);
console.log('str: ', str.code);
