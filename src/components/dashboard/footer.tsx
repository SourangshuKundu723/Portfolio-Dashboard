export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/40 bg-background/50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <span>&copy; {currentYear} Portfolio Dashboard</span>
        <span className="hidden sm:inline">
          Market data may be delayed or unavailable. For informational purposes only, not financial advice.
        </span>
      </div>
    </footer>
  );
}
