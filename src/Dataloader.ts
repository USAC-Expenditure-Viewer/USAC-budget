import KeywordList from "./KeywordList";

interface DataEntry {
    date: number,
    department: string,
    description: string,
    amount: number,
    words: string[]
}

interface WordEntry {
    text: string,
    value: number
}

export default class Dataloader{

    #data: DataEntry[] | null = null
    #records_callbacks : ((r: DataEntry[]) => void)[] = []
    #words_callbacks : ((w: WordEntry[]) => void)[] = []
    #amount_callbacks : ((a: number) => void)[] = []
    #keywordList: KeywordList

    constructor(input_url : string, keywordList: KeywordList) {
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
        const records: DataEntry[] = this.getRecords(this.#keywordList.getList())
        this.#records_callbacks.forEach(c=>c(records))
        let totalAmount = this.getTotal(records)
        this.#amount_callbacks.forEach(c=>c(totalAmount))
        let words = this.getWordList(records)
        this.#words_callbacks.forEach(c=>c(words))
    }

    addRecordCallback(callback: (r: DataEntry[]) => void) {
        this.#records_callbacks.push(callback)
    }

    addWordsCallback(callback: (w: WordEntry[]) => void) {
        this.#words_callbacks.push(callback)
    }

    addAmountCallback(callback: (a: number) => void) {
        this.#amount_callbacks.push(callback)
    }

    getRecords(root_word: string[]): DataEntry[] {
        if (this.#data === null) {
            return [{
                date: 0,
                department: "",
                description: "Loading...",
                amount: 0,
                words: []
            }];
        }

        if (root_word === null || root_word === [])
            return this.#data

        let records : DataEntry[] = this.#data.filter(row => {
            return root_word.map((w) => row.words.includes(w)).reduce((a, b)=>a && b, true)
        })
        //records.sort((a, b) => b.amount - a.amount)
        return records
    }

    getWordList(records: DataEntry[]) : WordEntry[] {
        if (this.#data === null) {
            return [{text: 'Loading...', value: 100}];
        }

        let words_set = new Map<string, number>()
        records.forEach(row => {
            row.words.forEach(w => {
                words_set.set(w, (words_set.get(w) || 0) + row.amount);
            })
        })

        let words_list: WordEntry[] = []
        for (let [word, val] of words_set.entries()) {
            words_list.push({text: word, value: val})
        }

        words_list.sort((a, b) => a.value - b.value)

        return words_list
    }

    getTotal(records : DataEntry[]){
        return records.reduce((prev, curr) => prev + curr.amount, 0)
    }
}