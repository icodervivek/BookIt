export interface FormData {
  fullName: string;
  email: string;
  agreedToTerms: boolean;
}

export interface Summary {
  experienceId?: string;
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface BookingState {
  experienceId?: string;
  experienceName?: string;
  date?: string;
  time?: string;
  quantity?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
}