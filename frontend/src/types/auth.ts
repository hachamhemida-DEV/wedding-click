export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'vendor';
  phone: string | null;
  language_preference: 'ar' | 'fr';
  created_at: string;
  vendor_profile?: VendorProfile;
}

export interface VendorProfile {
  id: number;
  user_id: number;
  business_name: string;
  category: string;
  phone: string | null;
  description: string | null;
  address: string | null;
  wilaya: string | null;
  status: 'pending_payment' | 'active' | 'suspended';
  subscription_ends_at: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
