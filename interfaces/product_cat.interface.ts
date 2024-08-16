export interface IState {
    fallback: {
        '/api/product_category/list': Data
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
    form: formModal,
}

export interface formModal {
    name: string | undefined
    description: string | undefined
    id?: string | undefined
}