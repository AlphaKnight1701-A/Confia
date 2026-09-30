import type { ReactNode } from "react";

export function DemoNotice({ children }: { children?: ReactNode }) {
  return <aside role="note" className="demo-notice">{children ?? "Synthetic demonstration data · no real retailer offers or independent certification."}</aside>;
}

