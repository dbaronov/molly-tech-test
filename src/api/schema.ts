export interface MovieInstance {
    id: string,
    reviews: number[],
    title: string,
    filmCompanyId: string,
    cost: number,
    releaseYear: number
}

export enum AppError {
    NO,
    MovieFetchError,
}

export interface Movie {
    id: string
    review: string
    title: string
    filmCompany?: string
    filmCompanyId: string
}

export interface Company {
    id: string
    name: string
}

export interface Film {
    id: string
    review: string
    title: string
    filmCompany?: string
    filmCompanyId: string
    companyName: string
}
