/**
 * Handles changes in the URL when the user interacts with the graphics or tabs
 */
export default class QueryBuilder {

  private static instance: QueryBuilder | null = null
  private queryString: string
  private generators: Map<number, () => string> = new Map()

  static getInstance() {
    if (this.instance === null) this.instance = new QueryBuilder()
    return this.instance
  }


  private constructor() {
    this.queryString = window.location.search.replace('?', '')
  }

  getQuery() {
    return this.queryString
  }

  addGenerator(callback: () => string, index: number) {
    this.generators.set(index, callback)
  }

  update() {
    let strings: string[] = [...this.generators.values()].map((c) => c())
    const query = strings.join('&')

    let path = window.location.href
    if (path.includes('?')) path = path.substr(0, path.indexOf('?'))
    window.history.pushState({ path: path + '?' + query }, '', path + '?' + query);
  }
}
