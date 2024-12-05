export interface ColumnData {
  name: string;
  type: string;
  primaryKey?: boolean;
  unique?: boolean;
  defaultValue?: string;
}

export interface TableNodeData {
  id: string;
  label: string;
  columns: ColumnData[];
}
