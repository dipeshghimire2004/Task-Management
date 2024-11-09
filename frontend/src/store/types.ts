// types.ts
export interface Category {
    id: number;
    name: string;
  }
      


  export interface Task {
    id: number; // Optional for new tasks
    title: string;
    category: string;
    assigned_to: string;
    start_date: string;
    end_date: string;
    priority: number;
    description: string;
    location: string;
    completed?: boolean; // Optional, defaults to false
    category_name:string;
    user_name:string;
}