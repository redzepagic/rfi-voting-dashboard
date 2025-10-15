import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-muted rounded-full">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Stranica nije pronađena</h1>
        <p className="text-muted-foreground max-w-md">
          Stranica koju tražite ne postoji ili je uklonjena.
        </p>
        <Button asChild data-testid="button-home">
          <Link href="/">Povratak na kontrolnu tablu</Link>
        </Button>
      </div>
    </div>
  );
}
