"use client";

import { useMemo, useState } from "react";
import { Loader2, CheckCircle2, CalendarPlus, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { createEvent } from "@/lib/api/events";
import { getToken } from "@/lib/auth";
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
    const now = new Date();

    if (selectedDate.getTime() < now.getTime()) {
      setError("Event date and time must be today or in the future.");
      setState("error");
      return;
    }

    setError("");
    setState("submitting");
    try {
      const token = getToken() ?? "";
      const res = await createEvent(
        {
          title,
          description,
          eventDate: selectedDate.toISOString().slice(0, 19),
          location,
          batchYear: batchYear ? parseInt(batchYear) : 0,
          registrationRequired,
          registrationLink: registrationRequired ? registrationLink : undefined,
        },
        token,
      );

      if (!res.success) throw new Error(res.message);
      setState("success");
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create event.");
      setState("error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details for your new event
          </DialogDescription>
        </DialogHeader>

        {state === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">Event Created!</p>
              <p className="text-sm text-muted-foreground">
                Your event has been published to the community.
              </p>
            </div>
            <Button onClick={handleClose}>Done</Button>
          </div>
        ) : state === "error" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">Creation Failed</p>
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setState("form")}>Try Again</Button>
              <Button onClick={handleClose} variant="outline">Cancel</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">
                Event Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="MEC Alumni Reunion 2025"
                disabled={state === "submitting"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the event..."
                disabled={state === "submitting"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>
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
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>
                  Time <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-1 h-9">
                  <select
                    value={timeHour}
                    onChange={(e) => setTimeHour(e.target.value)}
                    disabled={state === "submitting"}
                    className="flex-1 h-full rounded border border-border bg-card px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    {["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="text-muted-foreground font-semibold text-xs px-0.5">:</span>
                  <select
                    value={timeMinute}
                    onChange={(e) => setTimeMinute(e.target.value)}
                    disabled={state === "submitting"}
                    className="flex-1 h-full rounded border border-border bg-card px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    disabled={state === "submitting"}
                    className="w-16 h-full rounded border border-border bg-card px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchYear">Batch Year Restriction</Label>
              <Input
                id="batchYear"
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                placeholder="e.g. 2019 (Leave empty for no restriction)"
                min="1980"
                max="2030"
                disabled={state === "submitting"}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="MEC Main Auditorium, Kochi"
                disabled={state === "submitting"}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="registration"
                checked={registrationRequired}
                onCheckedChange={setRegistrationRequired}
                disabled={state === "submitting"}
              />
              <Label htmlFor="registration">Registration Required</Label>
            </div>

            {registrationRequired && (
              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <Input
                  id="registrationLink"
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://forms.google.com/..."
                  disabled={state === "submitting"}
                />
              </div>
            )}

            <Separator />

            <DialogFooter>
              <Button
                type="submit"
                disabled={state === "submitting"}
              >
                {state === "submitting" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating</>
                ) : (
                  <><CalendarPlus className="h-4 w-4" /> Create Event</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={state === "submitting"}
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
