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
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Switch } from "@/components/ui/switch";
import {
  useGenerateEventToken,
  useGetEventToken,
  useMyEvents,
  useExtendEventToken,
  useCurtailEventToken,
  useInvalidateEventToken,
} from "@/hooks/GlobalHooks";
import type { Event } from "@/components/Interfaces";
import { streamIdToNameMap } from "@/components/Constants";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

export default function GenerateQRCode() {
  const [selectedCourse, setSelectedCourse] = useState<string>(
    () => localStorage.getItem("lastCourse") || ""
  );
  const [useAutoExpiry, setUseAutoExpiry] = useState<boolean>(true);
  const [expiry, setExpiry] = useState<number>(15);
  const [qrData, setQrData] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [smsCode, setSmsCode] = useState<string>("");
  const [hasFetchedToken, setHasFetchedToken] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number>(0);

  const { data: myEvents = [], isLoading } = useMyEvents();
  const { mutate: generateToken, isPending: isGenerating } =
    useGenerateEventToken();
  const { mutate: extendToken } = useExtendEventToken();
  const { mutate: curtailToken } = useCurtailEventToken();
  const { mutate: invalidateToken } = useInvalidateEventToken();

  const { data, isLoading: isTokenLoading } = useGetEventToken(
    Number(selectedCourse)
  );
  const eventToken = data ?? {
    has_token: false,
    is_expired: false,
    token: "",
    expires_at: "",
    sms_code: "",
  };
  const secretKey = import.meta.env.VITE_AES_SECRET_KEY;

  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem("lastCourse", selectedCourse);
    }
  }, [selectedCourse]);

  const handleGenerateQr = () => {
    const myEvent = myEvents.find(
      (e: Event) => String(e.id) === selectedCourse
    );
    if (!myEvent) {
      toast.error("No course selected. Please select one before generating.");
      return;
    }

    generateToken(
      {
        eventId: Number(selectedCourse),
        expiresIn: expiry,
        auto_expiry: useAutoExpiry,
      },
      {
        onSuccess: (data) => {
          const rawData = JSON.stringify({ token: data.token });
          const encrypted = CryptoJS.AES.encrypt(rawData, secretKey).toString();

          const safeEncrypted = encodeURIComponent(encrypted);

          setQrData(safeEncrypted);
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
        onError: () => {
          toast.error("Failed to generate token. Try again later.");
        },
      }
    );
  };

  useEffect(() => {
    setHasFetchedToken(false);
    if (!selectedCourse || isTokenLoading) return;

    if (eventToken?.token) {
      const expiryDate = new Date(eventToken.expires_at);

      const rawData = JSON.stringify({ token: eventToken.token });
      const encrypted = CryptoJS.AES.encrypt(rawData, secretKey).toString();
      const safeEncrypted = encodeURIComponent(encrypted);

      setQrData(safeEncrypted);
      setExpiresAt(expiryDate);
      setSmsCode(eventToken.sms_code || "");
    } else {
      setQrData("");
      setExpiresAt(null);
      setSmsCode("");
    }

    setHasFetchedToken(true);
  }, [selectedCourse, eventToken, isTokenLoading]);

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

  const handleExtendToken = () => {
    extendToken(
      { eventId: Number(selectedCourse), additionalMinutes: expiry },
      {
        onSuccess: (data) => {
          toast.success(`Token extended by ${expiry} minutes`);
          setExpiresAt(new Date(data.expires_at));
          setSmsCode(data.sms_code);
        },
        onError: () => toast.error("Failed to extend token"),
      }
    );
  };

  const handleCurtailToken = () => {
    curtailToken(
      { eventId: Number(selectedCourse), reduceByMinutes: expiry },
      {
        onSuccess: () => toast.success(`Token curtailed by ${expiry} minutes`),
        onError: () => toast.error("Failed to curtail token"),
      }
    );
  };

  const handleInvalidateToken = () => {
    invalidateToken(
      { eventId: Number(selectedCourse) },
      {
        onSuccess: () => toast.success("Token invalidated"),
        onError: () => toast.error("Failed to invalidate token"),
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2">
          <span className="text-4xl">🎯</span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
            Generate Attendance QR Code
          </h2>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl border border-purple-300/30">
        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="text-center text-purple-500 animate-pulse space-y-2">
              <Loader2 className="animate-spin mx-auto h-8 w-8" />
              <p className="text-sm text-gray-300">Loading your events...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Select Course</label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {myEvents.map((event: Event) => (
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
                  {selectedCourse && isTokenLoading && (
                    <p className="text-sm text-purple-400 animate-pulse mt-2 flex items-center gap-1">
                      <Hourglass className="w-4 h-4" />
                      Fetching active token for this course...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300 flex items-center gap-1">
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
                        className="text-xs text-gray-400"
                      >
                        Use event duration
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCourse && (
                <p className="text-sm text-gray-400">
                  {eventToken.has_token
                    ? "An active token is already present for this course. You can reuse or manage it."
                    : "No active token found. You can generate a new one."}
                </p>
              )}

              {!eventToken.has_token && (
                <Button
                  className="w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                  onClick={handleGenerateQr}
                  disabled={!selectedCourse || isGenerating || isTokenLoading}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> Generate QR Code
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {hasFetchedToken && qrData && (
            <Card className="bg-purple-50 border border-purple-200 mt-6">
              <CardContent className="space-y-4 p-4">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Active Token Management
                </h3>

                <div className="flex justify-center">
                  <div className="inline-block border-8 border-purple-500/20 rounded-2xl p-3 bg-white shadow-2xl">
                    <QRCodeCanvas
                      value={qrData}
                      size={220}
                      fgColor="#4f46e5"
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
                    <>❌ This token has expired. Extend it to reactivate.</>
                  ) : (
                    <>
                      ⏳ Expires in <strong>{timeLeft}</strong>
                    </>
                  )}
                </p>

                <p className="text-sm text-pink-600 bg-pink-100 inline-flex items-center gap-2 px-3 py-1 rounded-full">
                  <MessageSquare className="w-4 h-4" /> SMS Code:{" "}
                  <strong>{smsCode}</strong>
                </p>

                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <Button
                    variant="outline"
                    onClick={handleExtendToken}
                    disabled={
                      isGenerating || isTokenLoading || useAutoExpiry
                      // timeLeftInSeconds < expiry * 60
                    }
                  >
                    <TimerReset className="w-4 h-4 mr-1" /> Extend Token
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCurtailToken}
                    disabled={
                      isGenerating ||
                      isTokenLoading ||
                      useAutoExpiry ||
                      eventToken?.is_expired ||
                      timeLeft === "Expired" ||
                      timeLeftInSeconds < expiry * 60
                    }
                  >
                    <TimerOff className="w-4 h-4 mr-1" /> Curtail Token
                  </Button>
                  <Button variant="destructive" onClick={handleInvalidateToken}>
                    <Trash2 className="w-4 h-4 mr-1" /> Invalidate
                  </Button>
                  <Button
                    className="w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500"
                    variant="default"
                    onClick={handleGenerateQr}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" /> ReGenerate
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
