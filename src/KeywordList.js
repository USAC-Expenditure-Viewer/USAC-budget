
export default class KeywordList{

    constructor(){
        this.list = []
        this.callback = []
    }

    addChangeCallback(callback) {
        this.callback.push(callback)
    }

    addWord(word) {
        if (!this.list.includes(word)) {
            this.list.push(word)
            this.callback.forEach(c => c(this.list))
        }
    }

    sliceWord(word) {
        let index = this.list.indexOf(word)
        if (index !== -1) {
            this.list = this.list.slice(0, index + 1)
            this.callback.forEach(c => c(this.list))
        }
    }

    reset() {
        this.list = []
        this.callback.forEach(c => c(this.list))
    }

    getList(){
        return this.list
    }
}