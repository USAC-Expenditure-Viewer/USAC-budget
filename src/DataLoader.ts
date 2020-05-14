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

export interface AmountBin {
    low: number
    high: number
    value: number
    name: string
}

export type Category = 'fund'| 'division'| 'department'| 'gl'| 'event'

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

export interface DataLoaderProps {
    dataloader: DataLoader,
    style?: Object,
}

export default class DataLoader{

    private data: DataEntry[] = []
    private filters: Filter[] = []
    private dataChangeCallbacks: (()=> void)[] = []
    private readonly dataset: string;
    private total_amount: number = 0

    constructor(query : string) {
        this.dataset = DataLoader.parseDataset(query)
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
                        this.addKeywordFilter(v)
                        break
                    case 'fund':
                    case 'division':
                    case 'department':
                    case 'gl':
                    case 'event':
                        this.addCategoryFilter(q, atob(v))
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
                        return prev + '&' + curr.category + '=' + btoa(curr.name)
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

        return this.filters[this.filters.length - 1].index
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

    getCategories(category: Category): WordEntry[] {
        if (this.data.length === 0) {
            return [];
        }

        let category_set = new Map<string, number>()
        this.getRecords().forEach(row => {
            const cate_name = row[category]
                category_set.set(cate_name, (category_set.get(cate_name) || 0) + row.amount);
        })

        let category_list: WordEntry[] = []
        for (let [word, val] of category_set.entries()) {
            category_list.push({text: word, value: val})
        }

        category_list.sort((a, b) => a.value - b.value)

        return category_list
    }

    getAmountBins(numBin: number): {data: AmountBin[], domain: [number, number]}{
        if (this.data.length === 0) {
            return {data: [], domain: [0, 1]}
        }

        let records : DataEntry[];
        let domain: [number, number] | null = null;
        if (this.filters.length != 0 && this.filters[this.filters.length - 1].category == 'amount') {
            records = this.filters.length >= 2 ? this.filters[this.filters.length - 2].index : this.data
            const values = this.filters[this.filters.length - 1].name.split('~').map(e => KMFToNum(e))
            domain = values as [number, number]
        } else {
            records = this.getRecords()
        }
        let [allMin, allMax] = records.reduce(((previousValue, currentValue) =>
                [Math.min(previousValue[0], currentValue.amount),
                    Math.max(previousValue[1], currentValue.amount)]), [Number.MAX_VALUE, Number.MIN_VALUE])

        if (domain == null) domain = [allMin, allMax]

        let bins : AmountBin[] = []
        let bin_size = (allMax - allMin) / numBin
        for (let i = 0; i < numBin; i ++) {
            bins.push({low: allMin + i * bin_size, high: allMin + (i + 1) * bin_size,
                        value: 0, name: KMFormat(allMin + (i + 0.5) * bin_size)})
        }

        records.forEach((e) => {
            bins.forEach((b) =>{
                if (b.low <= e.amount && e.amount < b.high)
                    b.value += e.amount
            })
        })

        return {data: bins, domain: domain}
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

    addKeywordFilter(word: string) {
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

    addCategoryFilter(category: Category, value: string) {
        if (this.data.length === 0) return
        if (this.filters.reduce((prev, curr) => prev || (curr.category === category && curr.name === value), false))
            return

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

        if (this.filters.length > 0 && this.filters[this.filters.length - 1].category === 'amount') {
                this.filters = this.filters.slice(0, -1)
        }
        const last_index = this.filters.length > 0 ? this.filters[this.filters.length - 1].index : this.data
        const new_index = last_index
            .filter((e) => (low <= e.amount && e.amount <= high))

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