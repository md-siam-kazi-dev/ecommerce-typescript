import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const title = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">{title}</CardTitle>
        <CardDescription>Section placeholder — implement later.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Content for{" "}
          <span className="font-mono text-foreground">{section}</span> will be
          implemented later.
        </p>
      </CardContent>
    </Card>
  );
}
