export type AdminRole = 'SUPER_ADMIN' | 'ADMIN_TU' | 'OPERATOR';

export type UserStatus = 'AKTIF' | 'NONAKTIF';

export type UserUnit = 'SEMUA' | 'SD' | 'SMP' | 'SMA' | 'PKBM' | 'LAINNYA';

export interface AdminUser {
  userId: string;       // USR-000001, USR-000002, etc.
  nama: string;
  email: string;        // lowercase, trimmed, unique
  role: AdminRole;
  status: UserStatus;
  unit: string;         // SEMUA / SD / SMP / SMA / PKBM / LAINNYA
  createdAt: string;    // dd/MM/yyyy HH:mm:ss
  updatedAt: string;    // dd/MM/yyyy HH:mm:ss
  lastLogin: string;    // dd/MM/yyyy HH:mm:ss or '-'
  createdBy: string;    // email of creator or 'SETUP_SYSTEM'
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  authError: {
    type: 'NOT_FOUND' | 'DEACTIVATED' | 'NO_ADMINS_EXIST' | 'SERVER_ERROR' | 'NETWORK_ERROR' | null;
    message: string;
    emailAttempted?: string;
  } | null;
  isFirstAdminSetup: boolean;
}

export interface AuthResponse {
  status: 'SUCCESS' | 'ERROR' | 'DENIED' | 'DEACTIVATED' | 'SETUP_REQUIRED';
  message: string;
  user?: AdminUser;
  isFirstAdminSetupRequired?: boolean;
}
