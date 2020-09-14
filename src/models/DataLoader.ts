import {KMFormat, KMFToNum} from "../util";
import * as Papa from 'papaparse';
import QueryBuilder from "./QueryBuilder";

interface DataEntry {
    date: Date,
    fund: string,
    division: string,
    department: string,
    gl: string,
    event: string,
    description: string,
    amount: number,
    words: string[],
    id?: number
}

export interface AmountBin {
    low: number
    high: number
    value: number
    name: string
}

export type Category = 'fund' | 'division' | 'department' | 'gl' | 'event'
export function isOfTypeCategory (input: string): input is Category {
    return ['fund', 'division', 'department', 'gl', 'event'].includes(input);
}

export interface WordEntry {
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

export default class DataLoader {

    private data: DataEntry[] = []
    private filters: Filter[] = []
    private dataChangeCallbacks: (() => void)[] = []
    private total_amount: number = 0
    private dataset : string | null = null
    private otherDepth : number = 0
    private otherCategory : Category = "fund"

    constructor(dataset: string | null) {
        this.dataset = dataset
        this.setDataset(dataset)
    }

    setDataset(dataset: string | null) {
        this.sliceFilter(0)
        this.loadDataset(dataset)
    }

    getDataset(): string | null {
        return this.dataset
    }

    private loadDataset(dataset: string | null) {
        if (dataset === null) return
        Papa.parse(window.location.pathname + "/expense_summary_" + dataset + ".csv",
            {
                download: true,
                header: true,
                complete: (results) => {
                    this.data = results.data.map((e) => {
                        e.date = new Date(Number.parseFloat(e.date) * 1000)
                        e.amount = Number.parseFloat(e.amount)
                        e.words = e.__parsed_extra || []
                        return e
                    }).filter(e => !Number.isNaN(e.amount))

                    this.onLoad()
                }
            })
    }

    private onLoad() {
        this.total_amount = this.data.reduce((prev, curr) => prev + curr.amount, 0)
        this.parseQuery(QueryBuilder.getInstance().getQuery())
        QueryBuilder.getInstance().addGenerator(this.generateQueryString.bind(this), 2)
        this.listChangeCallback()
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
                        const valuesa = v.split('..').map(e => KMFToNum(e))
                        this.addAmountFilter(valuesa[0], valuesa[1])
                        break
                    case 'date':
                        if (!v.includes('..')) return
                        const valuesd = v.split('..')
                        this.addMonthFilter(valuesd[0], valuesd[1])
                        break
                }
            })
        } catch (e) {
            console.log(e)
        }
        this.dataChangeCallbacks = callbacks
    }

    private generateQueryString() {
        const strings = this.filters.map((curr) => {
            switch (curr.category) {
                case 'keyword':
                    return 'keyword=' + curr.name
                case 'amount':
                    return 'amount=' + curr.name.replace('~', '..')
                case 'date':
                    return 'date=' + curr.name.replace('~', '..')
                default:
                    return curr.category + '=' + btoa(curr.name)
            }
        })
        return strings.join('&')
    }

    private listChangeCallback() {
        this.dataChangeCallbacks.forEach(c => c())
        QueryBuilder.getInstance().update()
    }

    addChangeCallback(callback: () => void) {
        this.dataChangeCallbacks.push(callback)
    }

    getOtherDepth(): number {
        return this.otherDepth
    }

    setOtherDepth(depth: number) {
        this.otherDepth = depth
    }

    getOtherCategory(): Category {
        return this.otherCategory
    }

    setOtherCategory(category : Category) {
        this.otherCategory = category
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

    getWordList(): WordEntry[] {
        if (this.data.length === 0) {
            return [];
        }

        let words_set = new Map<string, number>()
        this.getRecords().forEach(row => {
            row.words.forEach(w => {
                words_set.set(w, (words_set.get(w) || 0) + row.amount);
            })
        })

        const chosen_words = this.filters.filter(e => e.category === 'keyword').map(e => e.name)

        let words_list: WordEntry[] = []
        for (let [word, val] of words_set.entries()) {
            if (!chosen_words.includes(word))
                words_list.push({text: word, value: val})
        }

        words_list.sort((a, b) => b.value - a.value)

        return words_list
    }

    getCategories(category: Category): WordEntry[] {
        if (this.data.length === 0) {
            return [];
        }

        let records: DataEntry[];
        if (this.getLastFilter()?.category === category) {
            records = this.filters.length >= 2 ? this.filters[this.filters.length - 2].index : this.data
        } else {
            records = this.getRecords()
        }

        let category_set = new Map<string, number>()
        records.forEach(row => {
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

    getAmountBins(numBin: number): { data: AmountBin[], domain: [number, number] } {
        if (this.data.length === 0) {
            return {data: [], domain: [0, 1]}
        }

        let records: DataEntry[];
        let domain: [number, number] | null = null;
        if (this.filters.length !== 0 && this.filters[this.filters.length - 1].category === 'amount') {
            records = this.filters.length >= 2 ? this.filters[this.filters.length - 2].index : this.data
            const values = this.filters[this.filters.length - 1].name.split('~').map(e => KMFToNum(e))
            domain = values as [number, number]
        } else {
            records = this.getRecords()
        }
        let [allMin, allMax] = records.reduce(((previousValue, currentValue) =>
            [Math.min(previousValue[0], currentValue.amount),
                Math.max(previousValue[1], currentValue.amount)]), [Number.MAX_VALUE, Number.MIN_VALUE])

        if (domain === null) domain = [allMin, allMax]
        allMax += 0.001

        let bins: AmountBin[] = []
        let bin_size = (allMax - allMin) / numBin
        for (let i = 0; i < numBin; i++) {
            bins.push({
                low: allMin + i * bin_size, high: allMin + (i + 1) * bin_size,
                value: 0, name: KMFormat(allMin + (i + 0.5) * bin_size)
            })
        }

        records.forEach((e) => {
            bins.forEach((b) => {
                if (b.low <= e.amount && e.amount < b.high)
                    b.value += e.amount
            })
        })

        return {data: bins, domain: domain}
    }

    getMonthBins(): { data: WordEntry[], domain: [string, string] } {
        if (this.data.length === 0) {
            return {data: [{text: '0000-01', value: 0}], domain: ['0000-01', '0000-01']}
        }

        let records: DataEntry[];
        let domain: [string, string] | null = null;
        if (this.filters.length !== 0 && this.filters[this.filters.length - 1].category === 'date') {
            records = this.filters.length >= 2 ? this.filters[this.filters.length - 2].index : this.data
            const values = this.filters[this.filters.length - 1].name.split('~')
            domain = values as [string, string]
        } else {
            records = this.getRecords()
        }
        let [allMin, allMax] = records.reduce((previousValue, currentValue) => {
            const month_string = (currentValue.date.getFullYear() + "").padStart(4, '0') + '-' + ((currentValue.date.getMonth() + 1) + "").padStart(2, "0")
            return [previousValue[0].localeCompare(month_string) < 0 ? previousValue[0] : month_string,
                previousValue[1].localeCompare(month_string) > 0 ? previousValue[1] : month_string]
        }, ['9999-99', '0000-00'])

        if (domain === null) domain = [allMin, allMax]

        let bins: Map<string, number> = new Map()
        records.forEach((e) => {
            const month_string = (e.date.getFullYear() + "").padStart(4, "0") + '-' + ((e.date.getMonth() + 1) + "").padStart(2, "0")
            bins.set(month_string, (bins.get(month_string) || 0) + e.amount)
        })

        let data: WordEntry[] = [...bins.entries()].map((e) => ({text: e[0], value: e[1]}))
            .sort((a, b) => (a.text.localeCompare(b.text)))

        while (data.length !== 0 && data.length < 12) {
            let month_num = data[data.length - 1].text.split('-').map((s) => Number.parseInt(s))
            if (month_num[1] !== 12) month_num[1]++
            else month_num = [month_num[0] + 1, 1]
            let next_month = (month_num[0] + "").padStart(4, "0") + '-' + (month_num[1] + "").padStart(2, "0")
            data.push({text: next_month, value: 0})
        }

        return {data: data, domain: domain}
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

    getFilters() {
        return this.filters
    }

    getLastFilter() {
        if (this.filters.length === 0)
            return null;
        else return this.filters[this.filters.length - 1]
    }

    sliceFilter(remaining_length: number) {
        this.otherDepth = 0
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

    // addCategoryFilter(category: Category, value: string) {
    //     if (this.data.length === 0) return
    //     if (this.filters.reduce((prev, curr) => prev || (curr.category === category && curr.name === value), false))
    //         return

    //     if (this.getLastFilter()?.category === category) {
    //         this.filters = this.filters.slice(0, -1)
    //     }

    //     let new_index: DataEntry[]
    //     if (this.filters.length !== 0) {
    //         const last_index = this.filters[this.filters.length - 1].index
    //         // @ts-ignore
    //         new_index = last_index.filter((e) => (e[category] === value))
    //     } else {
    //         // @ts-ignore
    //         new_index = this.data.filter(e => (e[category] === value))
    //     }

    //     this.filters.push({
    //         category: category,
    //         name: value,
    //         index: new_index,
    //         amount: new_index.reduce((prev, curr) => prev + curr.amount, 0)
    //     })

    //     this.listChangeCallback()
    // }


    
    addCategoryFilter(category: Category, value: string) {
        if (this.data.length === 0) return
        if (this.filters.reduce((prev, curr) => prev || (curr.category === category && curr.name === value), false))
            return

        if (this.getLastFilter()?.category === category) {
            this.filters = this.filters.slice(0, -1)
        }

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

        // console.log("filters", this.filters)
        this.listChangeCallback()
    }

    
    removeCategoryFilter(category: Category, value: string) {
        if (this.data.length === 0) return
        if (this.filters.reduce((prev, curr) => prev || (curr.category === category && curr.name === value), false))
            return

        if (this.getLastFilter()?.category === category) {
            this.filters = this.filters.slice(0, -1)
        }

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

    addMonthFilter(low: string, high: string) {
        if (this.data.length === 0) return

        if (this.filters.length > 0 && this.filters[this.filters.length - 1].category === 'date') {
            this.filters = this.filters.slice(0, -1)
        }
        const last_index = this.filters.length > 0 ? this.filters[this.filters.length - 1].index : this.data
        const new_index = last_index
            .filter((e) => {
                const month_string = (e.date.getFullYear() + "").padStart(4, '0') + '-' + ((e.date.getMonth() + 1) + "").padStart(2, '0')
                return low.localeCompare(month_string) <= 0 && month_string.localeCompare(high) <= 0
            })

        this.filters.push({
            category: 'date',
            name: low + "~" + high,
            index: new_index,
            amount: new_index
                .reduce((prev, curr) => prev + curr.amount, 0)
        })

        this.listChangeCallback()
    }
}
