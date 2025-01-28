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