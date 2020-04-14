import { coverBoolean, coverString } from '@barusu/option-util'
import fs from 'fs-extra'
import reservedWords from 'reserved-words'
import { GetCSSTokenHook } from './types'


export interface CSSDtsProps {
  /**
   * @default '  '
   */
  indent?: string
  /**
   * whether to add a semicolon at the end of the statement
   * @default false
   */
  semicolon?: boolean
  /**
   * encoding of the target '.d.ts' file
   * @default 'utf-8'
   */
  encoding?: string
  /**
   * whether to aslo create a '*.d.s' file for the output CSS files
   * @default false
   */
  alsoCreateTargetCssDts?: boolean
  /**
   *
   */
  hook?: GetCSSTokenHook
  /**
   * 是否要为指定的文件生成 *.d.ts
   */
  shouldGenerateDtsFile?: (
    cssPath: string,
    json: { [key: string]: string },
    outputFilePath: string,
  ) => boolean
}


export class CSSDts implements GetCSSTokenHook {
  public readonly indent: string
  public readonly semicolon: string
  public readonly encoding: string
  public readonly alsoCreateTargetCssDts: boolean
  public readonly shouldGenerateDtsFile: CSSDtsProps['shouldGenerateDtsFile']

  public constructor(props: CSSDtsProps) {
    this.indent = coverString('  ', props.indent)
    this.semicolon = coverBoolean(false, props.semicolon) ? ';' : ''
    this.encoding = coverString('utf-8', props.encoding)
    this.alsoCreateTargetCssDts = coverBoolean(false, props.alsoCreateTargetCssDts)
    this.shouldGenerateDtsFile = props.shouldGenerateDtsFile
  }

  /**
   *
   * @param cssPath
   * @param json
   * @param outputFilePath
   * @see https://github.com/css-modules/postcss-modules#saving-exported-classes
   */
  public async getJSON(
    cssPath: string,
    json: { [key: string]: string },
    outputFilePath: string,
  ): Promise<void> {
    const self = this
    if (self.shouldGenerateDtsFile != null) {
      if (!self.shouldGenerateDtsFile(cssPath, json, outputFilePath)) return
    }

    const classNames: string[] = Object.keys(json)
    const dtsContent: string = self.calcDts(classNames)
    await self.writeFile(cssPath, dtsContent)
    if (self.alsoCreateTargetCssDts) {
      await self.writeFile(outputFilePath, dtsContent)
    }
  }

  /**
   * calc content of .d.ts
   * @param classNames
   */
  protected calcDts(classNames: string[]): string {
    const { indent, semicolon } = this
    const uniqueName = 'stylesheet'
    return classNames
      .sort()
      .filter(x => !/\-/.test(x) && !reservedWords.check(x))
      .map(x => `export const ${ x }: string${ semicolon }`)
      .join('\n')
      .concat('\n\n\n')
      .concat('interface Stylesheet {\n')
      .concat(classNames.map(x => `${ indent }'${ x }': string`).join('\n'))
      .concat('\n}\n\n\n')
      .concat(`declare const ${ uniqueName }: Stylesheet${ semicolon }\n`)
      .concat(`export default ${ uniqueName }${ semicolon }\n`)
  }

  /**
   * create .d.ts
   * @param cssPath
   * @param classNames
   * @returns filePath of .d.ts created
   */
  protected async writeFile(cssPath: string, dtsContent: string): Promise<string> {
    const self = this
    const dtsFilePath: string = cssPath + '.d.ts'
    await fs.writeFile(dtsFilePath, dtsContent, self.encoding)
    return dtsFilePath
  }
}


export function createHook(props: CSSDtsProps = {}): GetCSSTokenHook {
  const cssDts = new CSSDts(props)
  return {
    async getJSON(
      cssPath: string,
      json: { [key: string]: string },
      outputFilePath: string,
    ): Promise<void> {
      await props.hook?.getJSON?.(cssPath, json, outputFilePath)
      await cssDts.getJSON(cssPath, json, outputFilePath)
    }
  }
}
