export interface TableColumn {
  name: string;
  type: string;
}

export interface TableNodeData {
  label: string;
  columns: TableColumn[];
}

export type RelationshipType = "oneToOne" | "oneToMany" | "manyToMany";

export interface SchemaExport {
  nodes: {
    id: string;
    label: string;
    columns: TableColumn[];
    position: {
      x: number;
      y: number;
    };
  }[];
  relationships: {
    id: string;
    source: string;
    target: string;
    type: RelationshipType;
  }[];
}

export interface NodeSchema {
  id?: number;
  projectId?: number;
  name: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    columns: TableColumn[];
  };
}

