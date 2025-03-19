const generator = require('@babel/generator').default;

module.exports = function ({types, template}) {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.isNew) return;
        const code = generator(path.node.callee).code;
        if (code.includes('console')) {
          const { line, column } = path.node.loc.start;
          const str = template.expression(
            `console.log("filename:(${line}:${column})")`
          )();
          str.isNew = true;
          if (path.findParent((path) => types.isJSXExpressionContainer(path))) {
            path.replaceWith(types.arrayExpression([str, path.node]));
            path.skip();
          } else {
            path.insertBefore(str);
          }
        }
      },
    },
  };
};
