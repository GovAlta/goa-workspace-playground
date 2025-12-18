export interface Case {
    [key: string]: unknown;
    id: string;
    name: string;
    staff: string;
    dueDate: string;
    fileNumber: string;
    status: 'information' | 'success' | 'important' | 'emergency';
    statusText: string;
    priority: 'high' | 'medium' | 'low';
    jurisdiction: string;
    category: 'todo' | 'progress' | 'complete';
    comments: number;
    selected: boolean;
}
