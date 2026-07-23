// ورودی: یک وظیفه ساده
export type TaskInput = {
  id: string;
  title: string;
  done: boolean;
  created_at?: string;
};

// خروجی: هر وظیفه با رتبه و دلیل
export type RankedTask = {
  id: string;
  rank: number;
  reason: string;
};

// نتیجه کامل
export type PrioritizeResult = {
  items: RankedTask[];
  summary: string;
  engine: string;
};

// قرارداد: هر موتور هوش باید این شکلی باشد
export interface AIEngine {
  name: string;
  prioritize(tasks: TaskInput[]): Promise<PrioritizeResult>;
}