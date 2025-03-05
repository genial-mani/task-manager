export interface FormProps {
    fields:             Field[];
    onSubmit:           (formData: Record<string, any>) => void;
    submitButtonLabel:  string;
    formName?:          string;
    classname?:         string;
}

export interface Field {
    name:           string;
    label:          string;
    type:           string;
    placeholder:    string;
    required:       boolean;
}

export interface TaskType{
    id:         string,
    title:      string;
    desc:       string,
    status:     string,
    priority:   string,
    start:      number,
    end:        number,
    createdAt:  number,
    updatedAt:  number,
}

export interface userType{
    userEmail:  string,
    userId:     string,
   userName:    string | null,
}

export interface dashboardStats{
    totalTasks: number,
    totalPendingTasks: number,
    totalFinishedTasks: number,
    p1Tasks: number,
    p2Tasks: number,
    p3Tasks: number,
    p4Tasks: number,
    p5Tasks: number,
    pp1Tasks: number,
    pp2Tasks: number,
    pp3Tasks: number,
    pp4Tasks: number,
    pp5Tasks: number,
    fp1Tasks: number,
    fp2Tasks: number,
    fp3Tasks: number,
    fp4Tasks: number,
    fp5Tasks: number,
    balanceTasksTime: string,
    avgTaskTime: string,
    runningTasks: number,
    missedTasks: number,
}
export interface priorities{
    P1: number,
    P2: number,
    P3: number,
    P4: number,
    P5: number,
}