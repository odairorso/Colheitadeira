interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl md:text-4xl gradient-text pb-1">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 text-base md:text-lg opacity-90">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 drop-shadow-sm">{action}</div>}
    </div>
  );
}
