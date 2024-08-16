export interface IState {
    fallback: {
        '/api/product/list': Data
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
        categories: string[]
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
    master: any
}

export interface formModal {
    name: string | undefined
    description: string | undefined
    picture: string | undefined
    category_id: string | undefined
    id?: string | undefined
}