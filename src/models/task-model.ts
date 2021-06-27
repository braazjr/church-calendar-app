export class Task {
    id: string
    date: any
    functions: string[]
    minister: {
        id: string
        color: string
        name: string
    }
    ministry: {
        id: string
        name: string
    }
    hasOpenChangeRequest: boolean
}