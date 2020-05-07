
export default class KeywordList{

    list: string[]
    callback: ((l: string[]) => void)[]

    constructor(){
        this.list = []
        this.callback = []
    }

    addChangeCallback(callback: (l: string[]) => void): void {
        this.callback.push(callback)
    }

    addWord(word: string): void {
        if (!this.list.includes(word)) {
            this.list.push(word)
            this.callback.forEach((c) => c(this.list))
        }
    }

    sliceWord(word: string): void {
        const index: number = this.list.indexOf(word)
        if (index !== -1) {
            this.list = this.list.slice(0, index + 1)
            this.callback.forEach(c => c(this.list))
        }
    }

    reset(): void {
        this.list = []
        this.callback.forEach(c => c(this.list))
    }

    getList(): string[]{
        return this.list
    }
}