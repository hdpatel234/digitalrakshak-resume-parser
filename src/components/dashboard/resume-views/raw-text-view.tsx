import { mockRawText } from "@/data/mock-resume";
import { Card, CardContent } from "@/components/ui/card";

export function RawTextView() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm leading-loose whitespace-pre-wrap text-muted-foreground">
          {mockRawText}
        </div>
      </CardContent>
    </Card>
  );
}
