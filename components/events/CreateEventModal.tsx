"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, CalendarPlus, AlertCircle, Calendar as CalendarIcon, Building2, User, Sparkles } from "lucide-react";
import { getErrorMessage } from "@/lib/get-error-message";
import { createEvent } from "@/lib/api/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllClubsQuery } from "@/hooks/queries/clubs";
import { cn } from "@/lib/utils";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

type ModalState = "form" | "submitting" | "success" | "error";

export default function CreateEventModal({
  open,
  onOpenChange,
  onCreated,
}: CreateEventModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [mode, setMode] = useState("IN_PERSON");
  const [speakerName, setSpeakerName] = useState("");
  const [topicDomain, setTopicDomain] = useState("");
  const [speakerDetails, setSpeakerDetails] = useState("");
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [timeHour, setTimeHour] = useState("10");
  const [timeMinute, setTimeMinute] = useState("00");
  const [timePeriod, setTimePeriod] = useState("AM");
  const [location, setLocation] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  const { data: clubs = [] } = useAllClubsQuery();

  const formatDateString = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleClubSelection = (clubId: number) => {
    if (selectedClubIds.includes(clubId)) {
      setSelectedClubIds(selectedClubIds.filter((id) => id !== clubId));
    } else {
      setSelectedClubIds([...selectedClubIds, clubId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dateValue || !location) return;

    const datePart = dateValue.toISOString().split("T")[0];
    let hours24 = parseInt(timeHour);
    if (timePeriod === "PM" && hours24 < 12) hours24 += 12;
    if (timePeriod === "AM" && hours24 === 12) hours24 = 0;
    const hoursStr = String(hours24).padStart(2, "0");

    const selectedDate = new Date(`${datePart}T${hoursStr}:${timeMinute}:00`);

    setError("");
    setState("submitting");
    try {
      const res = await createEvent({
        title,
        description,
        category,
        mode,
        speakerName: speakerName || undefined,
        topicDomain: topicDomain || undefined,
        speakerDetails: speakerDetails || undefined,
        eventDate: selectedDate.toISOString().slice(0, 19),
        location,
        batchYear: batchYear ? parseInt(batchYear) : 0,
        registrationRequired,
        registrationLink: registrationRequired ? registrationLink : undefined,
        collaboratingClubIds: selectedClubIds.length > 0 ? selectedClubIds : undefined,
      } as any);

      if (!res.success) throw new Error(res.message);
      setState("success");
      onCreated();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to create event."));
      setState("error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("GENERAL");
    setMode("IN_PERSON");
    setSpeakerName("");
    setTopicDomain("");
    setSpeakerDetails("");
    setSelectedClubIds([]);
    setDateValue(undefined);
    setTimeHour("10");
    setTimeMinute("00");
    setTimePeriod("AM");
    setLocation("");
    setBatchYear("");
    setRegistrationRequired(false);
    setRegistrationLink("");
    setState("form");
    setError("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Publish Event / Session / Talk</DialogTitle>
          <DialogDescription className="text-xs">
            Create a campus event, alumni keynote session, or club-collaborated workshop.
          </DialogDescription>
        </DialogHeader>

        {state === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">Event Published!</p>
              <p className="text-sm text-muted-foreground">
                Your event has been published to the community events hub.
              </p>
            </div>
            <Button onClick={handleClose} size="sm">Done</Button>
          </div>
        ) : state === "error" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">Creation Failed</p>
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setState("form")} size="sm">Try Again</Button>
              <Button onClick={handleClose} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Event Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. MEC Tech Summit / Keynote on AI & System Design"
                disabled={state === "submitting"}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event Category</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || "GENERAL")}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General Event</SelectItem>
                    <SelectItem value="ALUMNI_SESSION">Alumni Session / Talk</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="TECH_TALK">Tech Talk</SelectItem>
                    <SelectItem value="REUNION">Reunion</SelectItem>
                    <SelectItem value="COMPETITION">Competition / Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event Mode</Label>
                <Select value={mode} onValueChange={(val) => setMode(val || "IN_PERSON")}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PERSON">In-Person (On Campus)</SelectItem>
                    <SelectItem value="ONLINE">Online (Virtual Webinar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Collaborating Clubs Section */}
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border/60">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Collaborating Student Clubs
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Select clubs collaborating or co-hosting this event:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {clubs.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">No clubs registered yet</span>
                ) : (
                  clubs.map((club) => {
                    const isSelected = selectedClubIds.includes(club.id);
                    return (
                      <Badge
                        key={club.id}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => toggleClubSelection(club.id)}
                        className="cursor-pointer text-xs font-normal transition-all"
                      >
                        {isSelected ? "✓ " : "+ "}
                        {club.name}
                      </Badge>
                    );
                  })
                )}
              </div>
            </div>

            {/* Speaker & Domain Details */}
            {(category === "ALUMNI_SESSION" || category === "TECH_TALK" || category === "WORKSHOP") && (
              <div className="space-y-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="speakerName" className="text-xs font-semibold flex items-center gap-1">
                      <User className="h-3 w-3 text-purple-600" /> Speaker / Instructor Name
                    </Label>
                    <Input
                      id="speakerName"
                      value={speakerName}
                      onChange={(e) => setSpeakerName(e.target.value)}
                      placeholder="e.g. Dr. Rahul Sharma (Staff Engineer Google)"
                      className="text-xs bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="topicDomain" className="text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-purple-600" /> Topic / Tech Domain
                    </Label>
                    <Input
                      id="topicDomain"
                      value={topicDomain}
                      onChange={(e) => setTopicDomain(e.target.value)}
                      placeholder="e.g. Distributed Systems / Cloud Infrastructure"
                      className="text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="speakerDetails" className="text-xs font-semibold">Speaker Bio / Designation</Label>
                  <Input
                    id="speakerDetails"
                    value={speakerDetails}
                    onChange={(e) => setSpeakerDetails(e.target.value)}
                    placeholder="Short bio or current role & credentials of the speaker..."
                    className="text-xs bg-background"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">Event Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe key takeaways, target audience, schedule, and prerequisites..."
                disabled={state === "submitting"}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        type="button"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9 text-xs cursor-pointer bg-card border-border",
                          !dateValue && "text-muted-foreground"
                        )}
                        disabled={state === "submitting"}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground/60 shrink-0" />
                        {dateValue ? formatDateString(dateValue) : "Select event date"}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={setDateValue}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom Theme Time Pickers */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Time <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  <Select value={timeHour} onValueChange={(v) => setTimeHour(v || "10")}>
                    <SelectTrigger className="h-9 text-xs px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"].map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={timeMinute} onValueChange={(v) => setTimeMinute(v || "00")}>
                    <SelectTrigger className="h-9 text-xs px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v || "AM")}>
                    <SelectTrigger className="h-9 text-xs px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold">
                Location / Venue <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. MEC Main Auditorium / Google Meet Link"
                disabled={state === "submitting"}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="registration"
                checked={registrationRequired}
                onCheckedChange={setRegistrationRequired}
                disabled={state === "submitting"}
              />
              <Label htmlFor="registration" className="text-xs font-medium cursor-pointer">
                Registration Required
              </Label>
            </div>

            {registrationRequired && (
              <div className="space-y-1.5">
                <Label htmlFor="registrationLink" className="text-xs font-semibold">Registration Link</Label>
                <Input
                  id="registrationLink"
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://forms.google.com/..."
                  disabled={state === "submitting"}
                  className="text-xs"
                />
              </div>
            )}

            <Separator />

            <DialogFooter>
              <Button type="submit" disabled={state === "submitting"} size="sm" className="cursor-pointer">
                {state === "submitting" ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Publishing...</>
                ) : (
                  <><CalendarPlus className="h-4 w-4 mr-1.5" /> Publish Event</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={state === "submitting"}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
