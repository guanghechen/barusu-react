import type { ConfigPaths} from '@barusu-react/scaffold-react-start';
import { createConfigPaths } from '@barusu-react/scaffold-react-start'
import fs from 'fs-extra'
import path from 'path'


const appDirectory = fs.realpathSync(process.cwd())
export const resolvePath = (...relativePath: string[]): string => {
  return path.normalize(path.resolve(appDirectory, ...relativePath))
}

const paths: ConfigPaths = createConfigPaths(appDirectory)
paths.source.extraNodeModules.push(resolvePath('../../node_modules'))


export default paths
