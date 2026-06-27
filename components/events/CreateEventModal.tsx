"use client";

import { useMemo, useState } from "react";
import { Loader2, CheckCircle2, CalendarPlus, AlertCircle } from "lucide-react";
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
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  const minDateTime = useMemo(() => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !location) return;

    const selectedDate = new Date(eventDate);
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
          eventDate: new Date(eventDate).toISOString().slice(0, 19),
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
    } catch (err: any) {
      setError(err.message || "Failed to create event.");
      setState("error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">
                  Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  min={minDateTime}
                  disabled={state === "submitting"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchYear">Batch Year</Label>
                <Input
                  id="batchYear"
                  type="number"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  placeholder="2019"
                  min="1980"
                  max="2030"
                  disabled={state === "submitting"}
                />
              </div>
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
