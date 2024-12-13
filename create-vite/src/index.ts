import chalk from "chalk";
import minimist from "minimist";
import prompts from "prompts";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { TEMPLATES, FRAMEWORKS, Framework } from './const.js'
import { copy, renameFiles } from './utils.js'

const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${chalk.yellow('vanilla-ts     vanilla')}
${chalk.green('vue-ts         vue')}
${chalk.cyan('react-ts       react')}
${chalk.cyan('react-swc-ts   react-swc')}
${chalk.magenta('preact-ts      preact')}
${chalk.redBright('lit-ts         lit')}
${chalk.red('svelte-ts      svelte')}
${chalk.blue('solid-ts       solid')}
${chalk.blueBright('qwik-ts        qwik')}`


const defaultTargetDir = 'vite-project'

const argv = minimist(process.argv.slice(2), {
  alias: { h: 'help', t: 'template' },
  string: ['_']
})

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

async function main() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argTemplate = argv.template || argv.t
  const help = argv.help
  if (help) {
    console.log(helpMessage)
    return
  }
  let targetDir = argTargetDir || defaultTargetDir

  let result

  try {
    result = await prompts([
      {
        // type 指定 null 忽略当前问题
        type: argTargetDir ? null : 'text',
        name: 'projectName',
        message: chalk.reset('Project name:'),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir
        }
      },
      {
        type:
          argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
        name: 'framework',
        message: chalk.reset('Select a framework:'),
        initial: 0,
        choices: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color
          return {
            title: frameworkColor(framework.display || framework.name),
            value: framework,
          }
        }),
      },
      {
        type: (framework: Framework) =>
          framework && framework.variants ? 'select' : null,
        name: 'variant',
        message: chalk.reset('Select a variant:'),
        choices: (framework: Framework) =>
          framework.variants.map((variant) => {
            const variantColor = variant.color
            return {
              title: variantColor(variant.display || variant.name),
              value: variant.name,
            }
          }),
      },
    ],
      {
        onCancel: () => {
          throw new Error(chalk.red('✖') + ' Operation cancelled')
        },
      },
    )

  } catch (error: any) {
    console.log(error.message)
    return
  }

  const { framework, variant } = result

  const root = path.join(process.cwd(), targetDir)

  let template: string = variant || argTemplate

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template-${template}`,
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    write(file)
  }

  const cdProjectName = path.relative(process.cwd(), root)
  console.log(`\nDone. Now run:\n`)
  if (root !== process.cwd()) {
    console.log(
      `  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
}


main().catch((e) => {
  console.error(chalk.red(`${e}`))
})