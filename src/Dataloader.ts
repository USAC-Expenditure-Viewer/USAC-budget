import {KMFormat, KMFToNum} from "./util";
import * as Papa from 'papaparse';

interface DataEntry {
    date: Date,
    fund: string,
    division: string,
    department: string,
    gl: string,
    event: string,
    description: string,
    amount: number,
    words: string[]
}

interface WordEntry {
    text: string,
    value: number
}

interface Filter {
    category: string,
    name: string,
    index: DataEntry[],
    amount: number,
}

export interface DataloaderProps {
    dataloader: Dataloader,
    style?: Object,
}

export default class Dataloader{

    private data: DataEntry[] = []
    private filters: Filter[] = []
    private dataChangeCallbacks: (()=> void)[] = []
    private readonly dataset: string;
    private total_amount: number = 0

    constructor(query : string) {
        this.dataset = Dataloader.parseDataset(query)
        Papa.parse(window.location.pathname + "/expense_summary_"+ this.dataset +".csv",
            {
                download: true,
                header: true,
                complete: (results)=> {
                    this.data = results.data.map((e) => {
                        e.date = new Date(Number.parseFloat(e.date) * 1000)
                        e.amount = Number.parseFloat(e.amount)
                        e.words = e.__parsed_extra || []
                        return e
                    })

                    this.onLoad(query)
                }
            })
    }

    private onLoad(query: string) {
        this.total_amount = this.data.reduce((prev, curr) => prev + curr.amount, 0)
        this.parseQuery(query)
        this.listChangeCallback()
    }

    private static parseDataset(query: string): string {
        if (query[0] === '?') query = query.slice(1)
        const res = query.split('&').filter((e) => e.startsWith('d='))
        if (res.length === 0) return "2018"
        return res[0].substr(2)
    }

    private parseQuery(query: string) {
        if (query[0] === '?') query = query.slice(1)
        const callbacks = this.dataChangeCallbacks
        this.dataChangeCallbacks = []
        try {
            query.split('&').forEach(entry => {
                if (!entry.includes('=')) return
                const sign_location = entry.indexOf('=')
                const q = entry.substr(0, sign_location)
                const v = entry.substr(sign_location + 1)
                switch (q) {
                    case 'keyword':
                        this.addkeywordFilter(v)
                        break
                    case 'fund':
                    case 'division':
                    case 'department':
                    case 'gl':
                    case 'event':
                        this.addCategoryFilter(q, btoa(v))
                        break
                    case 'amount':
                        if (!v.includes('..')) return
                        const values = v.split('..').map(e => KMFToNum(e))
                        this.addAmountFilter(values[0], values[1])
                        break
                }
            })
        } catch (e) {
            console.log(e)
        }
        this.dataChangeCallbacks = callbacks
    }

    private setQueryString(){
        const string = "d=" + this.dataset +
            this.filters.reduce((prev, curr) => {
                switch (curr.category) {
                    case 'keyword':
                        return prev + '&keyword=' + curr.name
                    case 'amount':
                        return prev + '&amount=' + curr.name.replace('~', '..')
                    default:
                        return prev + '&' + curr.category + '=' + atob(curr.name)
                }
            }, "")
        let path = window.location.href
        if (path.includes('?')) path = path.substr(0, path.indexOf('?'))
        window.history.pushState({path: path + '?' + string},'',path + '?' + string);
    }

    private listChangeCallback() {
        this.dataChangeCallbacks.forEach(c => c())
        this.setQueryString()
    }

    addChangeCallback(callback: () => void) {
        this.dataChangeCallbacks.push(callback)
    }

    getRecords(): DataEntry[] {
        if (this.data.length === 0) {
            return [];
        }

        if (this.filters.length === 0) {
            return this.data
        }

        const indexes = this.filters[this.filters.length - 1].index
        return indexes
    }

    getWordList() : WordEntry[] {
        if (this.data.length === 0) {
            return [];
        }

        let words_set = new Map<string, number>()
        this.getRecords().forEach(row => {
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

    getTotal(): number {
        if (this.filters.length === 0) {
            return this.total_amount
        }
        return this.filters[this.filters.length - 1].amount
    }

    getDatasetTotal(): number {
        return this.total_amount
    }

    getFilters(){
        return this.filters
    }

    getDatasetName(){
        return this.dataset
    }

    sliceFilter(remaining_length: number) {
        this.filters = this.filters.slice(0, remaining_length)
        this.listChangeCallback()
    }

    addkeywordFilter(word: string) {
        if (this.data.length === 0) return
        if (this.filters.reduce((prev, curr) => prev || (curr.category === 'keyword' && curr.name === word), false))
            return

        let word_index: DataEntry[]
        if (this.filters.length !== 0) {
            const last_index = this.filters[this.filters.length - 1].index
            word_index = last_index.filter((e) => e.words.includes(word))
        } else {
            word_index = this.data.filter(e => e.words.includes(word))
        }

        this.filters.push({
            category: 'keyword',
            name: word,
            index: word_index,
            amount: word_index
                .reduce((prev, curr) => prev + curr.amount, 0)
        })

        this.listChangeCallback()
    }

    addCategoryFilter(category: string, value: string) {
        if (this.data.length === 0) return

        let new_index: DataEntry[]
        if (this.filters.length !== 0) {
            const last_index = this.filters[this.filters.length - 1].index
            // @ts-ignore
            new_index = last_index.filter((e) => (e[category] === value))
        } else {
            // @ts-ignore
            new_index = this.data.filter(e => (e[category] === value))
        }

        this.filters.push({
            category: category,
            name: value,
            index: new_index,
            amount: new_index.reduce((prev, curr) => prev + curr.amount, 0)
        })

        this.listChangeCallback()
    }

    addAmountFilter(low: number, high: number) {
        if (this.data.length === 0) return

        let new_index: DataEntry[]
        if (this.filters.length !== 0) {
            if (this.filters[this.filters.length - 1].category === 'amount') {
                this.filters = this.filters.slice(0, -1)
            }
            const last_index = this.filters[this.filters.length - 1].index
            new_index = last_index
                .filter((e) => (low <= e.amount && e.amount <= high))
        } else {
            new_index = this.data
                .filter((e) => (low <= e.amount && e.amount <= high))
        }

        this.filters.push({
            category: 'amount',
            name: KMFormat(low) + "~" + KMFormat(high),
            index: new_index,
            amount: new_index
                .reduce((prev, curr) => prev + curr.amount, 0)
        })

        this.listChangeCallback()
    }
}