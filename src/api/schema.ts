export interface MovieInstance {
    id: string,
    reviews: number[],
    title: string,
    filmCompanyId: string,
    cost: number,
    releaseYear: number
}

export interface CompanyInstance {
    id: string
    name: string
}

export enum AppError {
    NO,
    MovieFetchError,
}

export interface Movie {
    id: string
    review: string
    title: string
    companyName?: string
    filmCompanyId: string
}

