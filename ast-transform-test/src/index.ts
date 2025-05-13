import  parser from '@babel/parser'
import { transformFromAstSync} from '@babel/core'
import  template  from '@babel/template'
import { isObjectExpression } from '@babel/types'
import prettier from 'prettier'
import parserTypeScript from 'prettier/parser-typescript';

let sourceCode = `
import { Module } from '@nestjs/common';

@Module({controller: ['bbbController']})
export class AaaModule {}
`

function myPlugin(){
  return {
    visitor:{
      Program(path:any){
        let index = 0

        while(path.node.body[index].type === 'ImportDeclaration') {
          index ++;
        }
        const ast = template.statement("import { AaaController } from './aaa.controller'")()
        path.node.body.splice(index,0,ast)
      },
      Decorator(path:any){
        const name = path.node.expression.callee.name
        if(name !== 'Module') return 
        const properties = path.node.expression.arguments
        const controller = properties.find((item:any)=> item.properties[0].key.name === 'controller')
        if(!controller){
          const ast = template.expression("{controller: ['aaaController']}")()
          if(isObjectExpression(ast)){
            properties.push(ast)
          }
        }else{
          const ast = template.expression("'aaaController'")()
          controller.properties[0].value.elements.push(ast)
        }
      }
    }
  }
}

const ast = parser.parse(sourceCode,{
  sourceType: 'module',
  plugins: ["decorators"]
})

const result = transformFromAstSync(ast,sourceCode,{
  plugins:[myPlugin],
})


if(result?.code){
   (async ()=>{
    const formattedCode = await prettier.format(result.code!,{
      parser: 'typescript',
      plugins: [parserTypeScript], // 明确指定 Prettier 的 
    })
    console.log("Formatted Code:\n", formattedCode);
   })()

}