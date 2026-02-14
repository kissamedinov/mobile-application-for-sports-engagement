export interface User {
    id: number;
    email: string;
    full_name?: string;
    sport_interest?: string;
    skill_level?: string;
    location?: string;
  }
  
  export interface Match {
    id: number;
    sport_type: string;
    date_time: string;
    location: string;
    max_players: number;
    current_players: number;
    status: string;
    participants?: User[];
  }
  
  export interface Notification {
    id: number;
    title: string;
    message: string;
    read_at?: string | null;
  }
  
  export interface ChatMessage {
    id: number;
    message: string;
    created_at: string;
  }
  