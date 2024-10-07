export interface UserRequest {
    user_id:         number;
    uuid:            string;
    name:            string;
    last_name:       string;
    nickname:        string;
    email:           string;
    password:        string;
    phone:           string;
    phoneVerified:   boolean | null;
    avatar:          string | null;
    code:            string | null;
    code_created_at: Date | null;
    created_at:      Date | null;
}
