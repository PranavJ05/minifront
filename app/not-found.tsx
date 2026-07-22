import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <Card className="max-w-md w-full border-border bg-card shadow-sm">
        <CardContent className="flex flex-col items-center text-center px-8 py-12">
          <div className="bg-muted p-4 rounded-2xl mb-6">
            <GraduationCap className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h1 className="text-7xl sm:text-8xl font-bold text-foreground leading-none mb-3">404</h1>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-8">
            The page you&apos;re looking for doesn&apos;t exist or you may not have access. If you believe this is a mistake, <a href="mailto:arc@mec.ac.in" className="text-primary hover:underline font-medium">let us know</a>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
            <a href="mailto:arc@mec.ac.in" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full cursor-pointer">
                <Mail className="h-4 w-4" />
                Contact ARC
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
