import type { ReactNode } from "react";

export function DemoNotice({ children }: { children?: ReactNode }) {
  return <aside role="note" className="demo-notice">{children ?? "Development scaffold · no live merchant or shopping data."}</aside>;
}
