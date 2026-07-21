"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, CalendarPlus, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [timeHour, setTimeHour] = useState("10");
  const [timeMinute, setTimeMinute] = useState("00");
  const [timePeriod, setTimePeriod] = useState("AM");
  const [location, setLocation] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  const formatDateString = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
        eventDate: selectedDate.toISOString().slice(0, 19),
        location,
        batchYear: batchYear ? parseInt(batchYear) : 0,
        registrationRequired,
        registrationLink: registrationRequired ? registrationLink : undefined,
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
          <DialogTitle className="text-lg font-bold">Create Event / Session</DialogTitle>
          <DialogDescription className="text-xs">
            Publish a campus event, alumni keynote session, or workshop.
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
                placeholder="e.g. MEC Alumni Reunion / Tech Keynote Talk"
                disabled={state === "submitting"}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event Type / Category</Label>
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
                <Label className="text-xs font-semibold">Mode</Label>
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

            {/* Additional Alumni Session Fields */}
            {category === "ALUMNI_SESSION" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="space-y-1.5">
                  <Label htmlFor="speakerName" className="text-xs font-semibold">Speaker Name</Label>
                  <Input
                    id="speakerName"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    placeholder="e.g. Dr. Anand Sharma (VP Google)"
                    className="text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="topicDomain" className="text-xs font-semibold">Topic / Domain</Label>
                  <Input
                    id="topicDomain"
                    value={topicDomain}
                    onChange={(e) => setTopicDomain(e.target.value)}
                    placeholder="e.g. System Design / AI & Cloud"
                    className="text-xs bg-background"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe agenda, prerequisites, and speaker background..."
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Time <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-1 h-9">
                  <select
                    value={timeHour}
                    onChange={(e) => setTimeHour(e.target.value)}
                    disabled={state === "submitting"}
                    className="flex-1 h-full rounded border border-border bg-card px-1.5 text-xs cursor-pointer"
                  >
                    {["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="text-muted-foreground font-semibold text-xs">:</span>
                  <select
                    value={timeMinute}
                    onChange={(e) => setTimeMinute(e.target.value)}
                    disabled={state === "submitting"}
                    className="flex-1 h-full rounded border border-border bg-card px-1.5 text-xs cursor-pointer"
                  >
                    {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    disabled={state === "submitting"}
                    className="w-14 h-full rounded border border-border bg-card px-1 text-xs cursor-pointer"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
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
