import { Node, Config, Global } from '../core'

export class NodeHelper {
  static isSource(node: Node) {
    if (node.type === 'record')
      return node.locale === Config.sourceLanguage
    return false
  }

  static hasFilepath(node: Node) {
    if (node.type === 'record')
      return !!node.filepath
    return false
  }

  static notShadowOrHasFilepath(node: Node) {
    return !node.shadow || this.hasFilepath(node)
  }

  static isTranslatable(node: Node) {
    if (Config.readonly || node.readonly || node.type === 'tree' || !this.notShadowOrHasFilepath(node))
      return false

    if (Config.promptTranslatingSource)
      return true

    return !this.isSource(node)
  }

  static isOpenable(node: Node) {
    return node.type !== 'tree'
      && this.notShadowOrHasFilepath(node)
  }

  static isEditable(node: Node) {
    return !Config.readonly
      && !node.readonly
      && node.type !== 'tree'
  }

  static splitKeypath(keypath: string): string[] {
    if (Config.disablePathParsing)
      return [keypath]

    return keypath.replace(/\[(.*?)\]/g, '.$1').split('.')
  }

  static getPathWithoutNamespace(node: Node) {
    if (Global.namespaceEnabled && node.meta?.namespace != null)
      return node.keypath.slice(node.meta?.namespace.length + 1)

    return node.keypath
  }
}
