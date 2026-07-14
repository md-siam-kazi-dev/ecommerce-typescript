import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          {children ?? (
            <p className="text-sm text-muted-foreground">
              Content for this section will be implemented soon.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
