"use client";

import Image from "next/image";
import { Calendar, User, Tag, ArrowRight, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNews } from "@/lib/mockData";

export default function NewsPage() {
  const featured = mockNews[0];
  const rest = mockNews.slice(1);

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-muted-foreground" /> News &amp; Announcements
            </h1>
            <p className="text-xs text-muted-foreground">
              Stay updated with community highlights and university news.
            </p>
          </div>
        </div>
      </div>

      {/* Featured News Card */}
      {featured && (
        <Card className="overflow-hidden p-0 border-border">
          <div className="grid lg:grid-cols-5">
            {featured.image && (
              <div className="lg:col-span-2 h-56 lg:h-auto relative bg-muted">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="lg:col-span-3 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-[10px]">
                  {featured.category}
                </Badge>
                <h2 className="text-lg font-bold text-foreground leading-snug">
                  {featured.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-border/40">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    {featured.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {featured.date}
                  </span>
                </div>
                <Button size="xs" className="w-fit cursor-pointer">
                  Read Story <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Rest of News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((news) => (
          <Card key={news.id} className="overflow-hidden p-0 flex flex-col justify-between hover:shadow-md transition-shadow">
            {news.image && (
              <div className="h-40 relative bg-muted">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="outline" className="text-[10px]">
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {news.category}
                </Badge>
                <h3 className="font-semibold text-xs text-foreground line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {news.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-2 border-t border-border/40 mt-auto">
                <span>{news.author}</span>
                <span>{news.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
