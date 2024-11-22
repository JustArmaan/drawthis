import { createFileRoute } from "@tanstack/react-router";
import Toolbar from "@/components/toolbar";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

function Index() {
  return (
    <div className=" w-full">
      <Toolbar />
    </div>
  );
}
