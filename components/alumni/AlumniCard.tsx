"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AlumniCard({ alumni, variant = "grid" }: any) {
  const name = alumni.name || "Unknown";

  if (variant === "list") {
    return (
      <Card className="flex items-center gap-4 p-(--card-spacing)">
        <Avatar className="size-12 shrink-0">
          {alumni.profilePicture ? (
            <AvatarImage src={alumni.profilePicture} alt={name} />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-0.5">
          <Badge variant="secondary">
            Class of {alumni.batch} &middot; {alumni.department}
          </Badge>
          <h3 className="font-medium text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {alumni.company || "Not specified"}
          </p>
        </div>
        <Link href={`/network/alumni/${alumni.id}`}>
          <Button variant="outline" size="sm">View Profile</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary h-16 relative">
        <div className="absolute -bottom-6 left-4">
          <Avatar className="size-12 ring-4 ring-background">
            {alumni.profilePicture ? (
              <AvatarImage src={alumni.profilePicture} alt={name} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="pt-8">
        <Badge variant="secondary">
          Class of {alumni.batch} &middot; {alumni.department}
        </Badge>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{alumni.company || "Not specified"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alumni.location && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {alumni.location}
          </p>
        )}
        {(alumni.skills?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {alumni.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-sm text-muted-foreground">
                +{alumni.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/network/alumni/${alumni.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
