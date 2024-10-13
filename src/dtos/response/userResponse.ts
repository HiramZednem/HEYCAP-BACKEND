export interface UserResponse {
    uuid:          string;
    name:          string;
    last_name:     string;
    nickname:      string;
    email:         string;
    phone:         string | null;
    phoneVerified: boolean | null;
    avatar:        string | null;
}