// Remounts on every route change (unique key per segment), so the CSS
// enter animation replays on navigation — a fast, state-conveying page transition.
export default function Template({ children }: { children: React.ReactNode }) {
  return <main className="route-transition flex-1">{children}</main>;
}
