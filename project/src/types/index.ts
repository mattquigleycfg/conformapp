export interface DbDrawingRecord {
  id: string;
  product_type: string;
  screen_type: string;
  width: number;
  length: number;
  pitch: number;
  extra_detail?: string;
  comments?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export interface DisplayDrawingRecord {
  WIDTH: number;
  LENGTH: number;
  PITCH: number;
  START_HEIGHT: number;
  CAPACITY: number;
  SHOP_DRAWING: string;
}

export interface FilterState {
  WIDTH: string;
  LENGTH: string;
  PITCH: string;
  START_HEIGHT: string;
  CAPACITY: string;
  SHOP_DRAWING: string;
}

export interface ColumnDefinition {
  key: keyof DisplayDrawingRecord;
  header: string;
  width: number;
}

export interface SortConfig {
  key: keyof DisplayDrawingRecord | null;
  direction: 'ascending' | 'descending';
}