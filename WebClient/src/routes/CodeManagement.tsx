import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw,
  Clock,
  ShieldCheck,
  MessageSquare,
  Loader2,
  Hourglass,
  TimerReset,
  TimerOff,
  Trash2,
  Users,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Switch } from "@/components/ui/switch";
import {
  useGenerateEventToken,
  useGetEventToken,
  useEvents,
  useExtendEventToken,
  useCurtailEventToken,
  useInvalidateEventToken,
} from "@/hooks/GlobalHooks";
import type { Event } from "@/components/Interfaces";
import { streamIdToNameMap } from "@/components/Constants";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

export default function CodeManagement() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [useAutoExpiry, setUseAutoExpiry] = useState(true);
  const [expiry, setExpiry] = useState(15);
  const [qrData, setQrData] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [smsCode, setSmsCode] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number>(0);
  const [hasFetchedToken, setHasFetchedToken] = useState(false);

  const { data: allEvents = [], isLoading } = useEvents({
    Streams: Object.keys(streamIdToNameMap),
  });
  const { mutate: generateToken, isPending: isGenerating } =
    useGenerateEventToken();
  const { mutate: extendToken } = useExtendEventToken();
  const { mutate: curtailToken } = useCurtailEventToken();
  const { mutate: invalidateToken } = useInvalidateEventToken();

  const { data, isLoading: isTokenLoading } = useGetEventToken(
    Number(selectedEvent)
  );
  const eventToken = data ?? {
    has_token: false,
    is_expired: false,
    token: "",
    expires_at: "",
    sms_code: "",
  };

  const secretKey = import.meta.env.VITE_AES_SECRET_KEY;

  const handleGenerateQr = () => {
    const myEvent = allEvents.find(
      (e: Event) => String(e.id) === selectedEvent
    );
    if (!myEvent) {
      toast.error("Please select an event first.");
      return;
    }

    generateToken(
      {
        eventId: Number(selectedEvent),
        expiresIn: expiry,
        auto_expiry: useAutoExpiry,
      },
      {
        onSuccess: (data) => {
          const rawData = JSON.stringify({ token: data.token });
          const encrypted = CryptoJS.AES.encrypt(rawData, secretKey).toString();
          setQrData(encrypted);
          setExpiresAt(new Date(data.expires_at));
          setSmsCode(data.sms_code);
          setHasFetchedToken(true);
          toast.success(
            `${
              data.reused ? "Reused" : "Generated"
            } token! Expires at ${new Date(
              data.expires_at
            ).toLocaleTimeString()}`
          );
        },
        onError: () => toast.error("Failed to generate token."),
      }
    );
  };

  useEffect(() => {
    setHasFetchedToken(false);
    if (!selectedEvent || isTokenLoading) return;

    if (eventToken?.token) {
      const expiryDate = new Date(eventToken.expires_at);
      setQrData(JSON.stringify({ token: eventToken.token }));
      setExpiresAt(expiryDate);
      setSmsCode(eventToken.sms_code || "");
    } else {
      setQrData("");
      setExpiresAt(null);
      setSmsCode("");
    }

    setHasFetchedToken(true);
  }, [selectedEvent, eventToken, isTokenLoading]);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
      setTimeLeftInSeconds(diff);
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-4xl">🛡️ </span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-blue-600 text-transparent bg-clip-text">
            Admin QR Code Generator
          </h2>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Generate and manage QR tokens for any event
        </p>
      </div>

      <Card className="bg-white/90 backdrop-blur-xl border border-emerald-300 shadow-xl">
        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="text-center text-emerald-500 animate-pulse">
              <Loader2 className="animate-spin mx-auto h-8 w-8" />
              <p>Loading all events...</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Select Event</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose event" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEvents.map((event: Event) => (
                      <SelectItem key={event.id} value={String(event.id)}>
                        {event.title} -{" "}
                        {(event.streams || [])
                          .map(
                            (id) =>
                              streamIdToNameMap[
                                id as keyof typeof streamIdToNameMap
                              ] || id
                          )
                          .join(", ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Expiry (minutes)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    disabled={useAutoExpiry}
                    value={expiry}
                    onChange={(e) => setExpiry(Number(e.target.value))}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      id="auto-expiry"
                      checked={useAutoExpiry}
                      onCheckedChange={setUseAutoExpiry}
                    />
                    <label
                      htmlFor="auto-expiry"
                      className="text-xs text-gray-500"
                    >
                      Use event duration
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-blue-600 hover:to-emerald-500"
            onClick={handleGenerateQr}
            disabled={!selectedEvent || isGenerating || isTokenLoading}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate QR Code
              </>
            )}
          </Button>

          {hasFetchedToken && qrData && (
            <Card className="bg-emerald-50 border border-emerald-200 mt-6">
              <CardContent className="space-y-4 p-4">
                <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Active Token Management
                </h3>

                <div className="flex justify-center">
                  <div className="inline-block border-8 border-emerald-300 rounded-2xl p-3 bg-white shadow-md">
                    <QRCodeCanvas
                      value={qrData}
                      size={220}
                      fgColor="#059669"
                      bgColor="#fff"
                      level="H"
                      includeMargin
                    />
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    eventToken?.is_expired || timeLeft === "Expired"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {timeLeft === "Expired" || eventToken?.is_expired ? (
                    <>❌ This token has expired. Extend to reactivate.</>
                  ) : (
                    <>
                      ⏳ Expires in <strong>{timeLeft}</strong>
                    </>
                  )}
                </p>

                <p className="text-sm text-emerald-700 bg-emerald-100 inline-flex items-center gap-2 px-3 py-1 rounded-full">
                  <MessageSquare className="w-4 h-4" /> SMS Code:{" "}
                  <strong>{smsCode}</strong>
                </p>

                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      extendToken(
                        {
                          eventId: Number(selectedEvent),
                          additionalMinutes: expiry,
                        },
                        {
                          onSuccess: (data) => {
                            toast.success(`Extended by ${expiry} mins`);
                            setExpiresAt(new Date(data.expires_at));
                          },
                          onError: () => toast.error("Failed to extend"),
                        }
                      )
                    }
                  >
                    <TimerReset className="w-4 h-4 mr-1" /> Extend
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      curtailToken(
                        {
                          eventId: Number(selectedEvent),
                          reduceByMinutes: expiry,
                        },
                        {
                          onSuccess: () =>
                            toast.success(`Curtailed by ${expiry} mins`),
                          onError: () => toast.error("Failed to curtail"),
                        }
                      )
                    }
                  >
                    <TimerOff className="w-4 h-4 mr-1" /> Curtail
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      invalidateToken(
                        { eventId: Number(selectedEvent) },
                        {
                          onSuccess: () => toast.success("Invalidated"),
                          onError: () => toast.error("Failed to invalidate"),
                        }
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Invalidate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
