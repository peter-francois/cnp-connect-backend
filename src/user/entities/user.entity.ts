export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  hiredAt: Date;
  isConnected: boolean;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
