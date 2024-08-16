export interface IState {
    fallback: {
        '/api/transactions/list': Data
    },
    data: Data,
    dataDetail: {}
    columns: [],
    isLoading: boolean,
    openModal: boolean,
    typeModal: string,
    dataModal: {}
    filter: Filter,
    master: {
        table: string[]
        products: string[]
    }
}

interface Data {
    dataPerPage: string | number
    currentPage: string | number
    totalData: string | number
    totalPage: string | number
    list: any
    key: string | null
} 

interface Filter {
    key: string;
    directions: string;
    columns: string
}

export interface modalState {
    isLoading: boolean
    oldId: string | undefined
    role: string[],
    maxQ: string | number | undefined
    form: formModal,
    dataTable: formModal[]
    master: any
}

export interface formModal {
    description: string | undefined
    product_id: string | undefined
    label: string | undefined
    quantity: string | number | undefined
    key?: number | undefined
    id?: number | undefined
}