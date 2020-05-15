import QueryBuilder from "./QueryBuilder";
import DataLoader from "./DataLoader";

export default class Datasets {

    private static instance: Datasets | null = null
    private datasets: string[] = []
    private currentDataset: string | null = null
    private callbacks: (() => void)[] = []
    private dataLoader: DataLoader
    private ready: boolean = false

    static getInstance(){
        if (this.instance === null) this.instance = new Datasets()
        return this.instance
    }


    private constructor() {
        this.parseDataset(QueryBuilder.getInstance().getQuery())
        this.dataLoader = new DataLoader(this.currentDataset)
        QueryBuilder.getInstance().addGenerator(this.getQueryString.bind(this), 0)
        fetch(window.location.pathname + "/datasets.json")
            .then(res => res.json())
            .then((res) => {
                this.datasets = res
                this.ready = true
                if (this.currentDataset === null) this.currentDataset = this.datasets[0]
                this.setCurrentDataset(this.currentDataset)
            })
    }

    addChangeCallback(callback: ()=>void) {
        this.callbacks.push(callback)
    }

    isReady() {
        return this.ready
    }

    getCurrentDataset() {
        if (this.currentDataset != null) return this.currentDataset
        return undefined
    }

    getCurrentDatasetName() {
        if (this.currentDataset != null) return Datasets.getDatasetTitle(this.currentDataset)
        return undefined
    }

    getDatasets() {
        if (this.ready) return this.datasets
        return undefined
    }

    getDatasetNames() {
        if (this.ready) return this.datasets.map(Datasets.getDatasetTitle)
        return undefined
    }

    getDataLoader() {
        return this.dataLoader
    }

    setCurrentDataset(name: string) {
        this.currentDataset = name
        QueryBuilder.getInstance().update()
        this.dataLoader.setDataset(name)
        this.callbacks.forEach(c => c())
    }

    private parseDataset(query: string) {
        if (query[0] === '?') query = query.slice(1)
        const res = query.split('&').filter((e) => e.startsWith('d='))
        if (res.length !== 0)
            this.currentDataset = res[0].substr(2)
    }

    private getQueryString(): string {
        if (this.currentDataset === null) return ""
        return 'd=' + this.currentDataset
    }

    static getDatasetTitle(name: string): string {
            if (name.match(/^\d*$/)) {
                const year = Number.parseInt(name)
                return name + '-' + (year + 1).toString()
            }
            else return name
    }
}
