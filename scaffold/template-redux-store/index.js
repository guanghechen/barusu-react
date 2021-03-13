const {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  TextTransformerBuilder,
} = require('@guanghechen/option-helper')
const fs = require('fs-extra')
const path = require('path')

const transformers = {
  storeRootPath: text =>
    text
      .trim()
      .split(/[/\\]+/)
      .map(toKebabCase)
      .join('/'),
  stateName: new TextTransformerBuilder().trim.kebab.build(),
}

module.exports = function (plop) {
  const cwd = path.resolve(process.cwd())

  plop.setGenerator('new:store', {
    description: 'create redux store',
    prompts: [
      {
        type: 'input',
        name: 'storeRootPath',
        message: 'root path of redux store',
        default: () => 'src/store',
        transformer: transformers.storeRootPath,
      },
    ],
    actions: function (answers) {
      // eslint-disable-next-line no-param-reassign
      answers.storeRootPath = transformers.storeRootPath(answers.storeRootPath)

      const { storeRootPath } = answers
      const resolveSourcePath = p =>
        path.normalize(path.resolve(__dirname, 'boilerplate/store', p))
      const resolveTargetPath = p =>
        path.normalize(path.resolve(cwd, storeRootPath, p))

      return [
        {
          type: 'add',
          path: resolveTargetPath('state.ts'),
          templateFile: resolveSourcePath('state.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('reducer.ts'),
          templateFile: resolveSourcePath('reducer.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('saga.ts'),
          templateFile: resolveSourcePath('saga.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('index.ts'),
          templateFile: resolveSourcePath('index.ts.hbs'),
        },
      ]
    },
  })

  plop.setGenerator('new:state', {
    description: 'create new state node in redux store',
    prompts: [
      {
        type: 'input',
        name: 'stateName',
        message: 'state node name of redux store',
        transformer: transformers.stateName,
      },
      {
        type: 'input',
        name: 'storeRootPath',
        message: 'root path of redux store',
        default: () => 'src/store',
        transformer: transformers.storeRootPath,
      },
    ],
    actions: function (answers) {
      // eslint-disable-next-line no-param-reassign
      answers.storeRootPath = transformers.storeRootPath(answers.storeRootPath)
      // eslint-disable-next-line no-param-reassign
      answers.stateName = transformers.stateName(answers.stateName)

      const { storeRootPath, stateName } = answers
      const resolveSourcePath = p =>
        path.normalize(path.resolve(__dirname, 'boilerplate/state', p))
      const resolveTargetPath = p =>
        path.normalize(path.resolve(cwd, storeRootPath, stateName, p))

      // register state
      {
        const storeStateFilePath = resolveTargetPath('../state.ts')
        if (fs.existsSync(storeStateFilePath)) {
          const storeStateContent = fs.readFileSync(storeStateFilePath, 'utf-8')
          const resolvedStoreStateContent = storeStateContent
            .replace(
              // import statement
              /((?:import[^'"]*['"][^'"]*['"]\s*?\n)*)\s*/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `import { ${toPascalCase(
                    stateName,
                  )}State, initial${toPascalCase(
                    stateName,
                  )}State } from './${toKebabCase(stateName)}/state'` +
                  '\n\n\n'
                )
              },
            )
            .replace(
              // StoreState interface
              /(export\s+interface\s+StoreState[^{]*\{[\s\S]*?)\n\}/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `  ${toCamelCase(stateName)}: ${toPascalCase(
                    stateName,
                  )}State` +
                  '\n}'
                )
              },
            )
            .replace(
              // initialStoreState
              /(export\s+const\s+initialStoreState:\s*StoreState\s*=\s*[^{]*\{[\s\S]*?)\n\}/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `  ${toCamelCase(stateName)}: initial${toPascalCase(
                    stateName,
                  )}State,` +
                  '\n}'
                )
              },
            )
          fs.writeFileSync(
            storeStateFilePath,
            resolvedStoreStateContent,
            'utf-8',
          )
        }
      }

      // register reducer
      {
        const rootReducerFilePath = resolveTargetPath('../reducer.ts')
        if (fs.existsSync(rootReducerFilePath)) {
          const storeStateContent = fs.readFileSync(
            rootReducerFilePath,
            'utf-8',
          )
          const resolvedRootReducerContent = storeStateContent
            .replace(
              // import statement
              /((?:import[^'"]*['"][^'"]*['"]\s*?\n)*)\s*/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `import { ${toCamelCase(
                    stateName,
                  )}Reducer } from './${toKebabCase(stateName)}/reducer'` +
                  '\n\n\n'
                )
              },
            )
            .replace(
              // rootReducer
              /(export\s+const\s+rootReducer\s*=\s*[^{]*\{[\s\S]*?)\n\}/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `  ${toCamelCase(stateName)}: ${toCamelCase(
                    stateName,
                  )}Reducer,` +
                  '\n}'
                )
              },
            )
          fs.writeFileSync(
            rootReducerFilePath,
            resolvedRootReducerContent,
            'utf-8',
          )
        }
      }

      // register saga
      {
        const rootReducerFilePath = resolveTargetPath('../saga.ts')
        if (fs.existsSync(rootReducerFilePath)) {
          const storeStateContent = fs.readFileSync(
            rootReducerFilePath,
            'utf-8',
          )
          const resolvedRootReducerContent = storeStateContent
            .replace(
              // import statement
              /((?:import[^'"]*['"][^'"]*['"]\s*?\n)*)\s*/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `import { watch${toPascalCase(
                    stateName,
                  )}Saga } from './${toKebabCase(stateName)}/sagas'` +
                  '\n\n\n'
                )
              },
            )
            .replace(
              // rootSaga
              /(export\s+function\s*\*\s*rootSaga[^{]*\{[\s\S]*?)\n\}/,
              (m, p1) => {
                return (
                  p1.trim() +
                  '\n' +
                  `  yield fork(watch${toPascalCase(stateName)}Saga)` +
                  '\n}'
                )
              },
            )
          fs.writeFileSync(
            rootReducerFilePath,
            resolvedRootReducerContent,
            'utf-8',
          )
        }
      }

      return [
        {
          type: 'add',
          path: resolveTargetPath('actions/action.ts'),
          templateFile: resolveSourcePath('actions/action.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('actions/constant.ts'),
          templateFile: resolveSourcePath('actions/constant.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('actions/creator.ts'),
          templateFile: resolveSourcePath('actions/creator.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('actions/index.ts'),
          templateFile: resolveSourcePath('actions/index.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('reducer.ts'),
          templateFile: resolveSourcePath('reducer.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('sagas.ts'),
          templateFile: resolveSourcePath('sagas.ts.hbs'),
        },
        {
          type: 'add',
          path: resolveTargetPath('state.ts'),
          templateFile: resolveSourcePath('state.ts.hbs'),
        },
      ]
    },
  })
}
