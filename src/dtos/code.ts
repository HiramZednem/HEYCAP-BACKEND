export enum CodeType {
    VERIFY = "VERIFY",
    LOGIN = "LOGIN",
    RECOVERY = "RECOVERY",
  }
  
  
export interface Code {
code_id: number;       // ID único del código
code: string;          // Código numérico o string de 4 caracteres
code_type: CodeType;   // Tipo de código (enum)
created_at: Date;      // Fecha de creación del código
user_id: number;       // ID del usuario asociado
}