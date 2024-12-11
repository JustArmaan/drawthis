import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from "reactflow";
import { useState } from "react";
import { EdgeProps } from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, data } = props;

  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data?.label || "Click to edit");

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {isEditing ? (
          <input
            type="text"
            value={labelText}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              background: "transparent",
              border: "none",
              fontSize: "12px",
              textAlign: "center",
            }}
          />
        ) : (
          <span
            onClick={handleLabelClick}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              cursor: "pointer",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {labelText}
          </span>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
