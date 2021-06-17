export class ChangeRequest {
    id: string
    requestDateTime: any
    task: {
        id: string
        date: any
        functions: string[]
        minister: {
            color: string
            id: string
            name: string
        }
        ministry: {
            id: string
            name: string
        }
    }
    done: boolean;
    newTask: {
        id: string
        date: any
        functions: string[]
        minister: {
            color: string
            id: string
            name: string
        }
        ministry: {
            id: string
            name: string
        }
    };
    doneDateTime: any;
}