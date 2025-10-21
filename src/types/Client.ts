export interface Client {
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
    selected: boolean;
}
