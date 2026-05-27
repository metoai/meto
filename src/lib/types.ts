export type UserProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type CompileFormat = "universal" | "claude" | "chatgpt" | "gemini";

export type ContextSection = {
  id: string;
  user_id: string;
  section_type: string;
  title: string;
  content: string;
  is_public: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
