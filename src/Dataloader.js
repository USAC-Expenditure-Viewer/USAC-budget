
export default class Dataloader{

    #data = null
    #records_callbacks = []
    #words_callbacks = []
    #keywordList

    constructor(input_url, keywordList) {
        fetch(input_url)
            .then(res => res.json())
            .then(result =>{
                this.#data = result
                this.listChangeCallback()
            })
        this.#keywordList = keywordList
        keywordList.addChangeCallback(() => this.listChangeCallback())
    }

    listChangeCallback() {
        let records = this.getRecords(this.#keywordList.getList())
        this.#records_callbacks.forEach(c=>c(records))
        let words = this.getWordList(records)
        this.#words_callbacks.forEach(c=>c(words))
    }

    addRecordCallback(callback) {
        this.#records_callbacks.push(callback)
    }

    addWordsCallback(callback) {
        this.#words_callbacks.push(callback)
    }

    getRecords(root_word) {
        if (this.#data === null) {
            return [{"date": "",
                "department": "",
                "description": "Loading...",
                "amount": "",}];
        }

        if (root_word === null || root_word === [])
            return this.#data

        let records = this.#data.filter(row => {
            return root_word.map((w) => row.words.includes(w)).reduce((a, b)=>a && b, true)
        })
        //records.sort((a, b) => b.amount - a.amount)
        return records
    }

    getWordList(records) {
        if (this.#data === null) {
            return [{text: 'Loading...', value: 100}];
        }

        let words_set = {}
        records.forEach(row => {
            row.words.forEach(w => {
                if (words_set[w] === undefined) words_set[w] = row.amount;
                else words_set[w] += row.amount;
            })
        })

        let words_list = []
        for (let w in words_set) {
            words_list.push({text: w, value: words_set[w]})
        }

        words_list.sort((a, b) => a.value - b.value)

        return words_list
    }
}