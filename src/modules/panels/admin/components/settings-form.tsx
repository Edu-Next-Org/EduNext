"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, ShieldAlert, Save, RotateCcw } from "lucide-react";

export function SettingsForm() {
  const [siteTitle, setSiteTitle] = useState("Edunext");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      siteTitle,
      isMaintenanceMode,
    };
  };

  const handleCancel = () => {
    setSiteTitle("Edunext");
    setIsMaintenanceMode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 "
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-[#ccc]">
          Manage core configurations and system status for EduNext Academy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-3xl py-10 border-white/70 bg-white/80 shadow-md backdrop-blur dark:bg-[#333] dark:border-[#444] overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-600" />
              General Configuration
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 dark:text-[#898989]">
              Modify global properties that apply to the entire website
              interface.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="siteTitle"
                className="text-sm font-medium text-slate-700 dark:text-[#ccc]"
              >
                Site Title
              </Label>
              <Input
                id="siteTitle"
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Enter website title..."
                className="h-12 rounded-2xl border-slate-200 focus-visible:ring-1 focus-visible:ring-violet-600 dark:bg-[#252525] dark:border-[#444] text-sm font-medium"
              />
            </div>

            <hr className="border-slate-100 dark:border-[#444]/60" />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-[#ccc]">
                Platform Status
              </Label>

              <div
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                  isMaintenanceMode
                    ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
                    : "border-slate-200 bg-slate-50/50 dark:border-[#444] dark:bg-[#454545]/30"
                }`}
              >
                <div className="flex gap-3 items-start pl-2">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      isMaintenanceMode
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-slate-200/60 text-slate-500 dark:bg-[#333]"
                    }`}
                  >
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Maintenance Mode
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#b1b1b1] mt-0.5 leading-relaxed max-w-md">
                      When activated, the public website is locked. Visitors
                      will see a maintenance screen, while admins can still
                      access the dashboard.
                    </div>
                  </div>
                </div>

                <Switch
                  checked={isMaintenanceMode}
                  onCheckedChange={setIsMaintenanceMode}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-7 mb-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-2xl dark:text-white border-slate-200 dark:border-[#444] hover:bg-slate-50 dark:hover:bg-[#454545]/50 px-5 transition-all"
          >
            <RotateCcw className="mr-1.5 h-4 w-4 opacity-70" />
            Cancel Changes
          </Button>

          <Button
            type="submit"
            className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 shadow-md shadow-violet-600/10 transition-all"
          >
            <Save className="mr-1.5 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
