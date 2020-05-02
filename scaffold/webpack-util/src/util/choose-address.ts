import os from 'os'


/**
 * 获取当前主机的一个 ip
 * 选择一个 ipv4 的地址，因为在虚拟机中使用时，hmr 默认会连接 localhost，导致无法热更新
 */
export function chooseIpv4Address (prefix = '') {
  const niFaces = os.networkInterfaces()
  for (const iFaces of Object.values(niFaces)) {
    for (const iFace of Object.values(iFaces!)) {
      if (iFace.family !== 'IPv4') continue
      if (iFace.address.startsWith(prefix)) return iFace.address
    }
  }
  return undefined
}
