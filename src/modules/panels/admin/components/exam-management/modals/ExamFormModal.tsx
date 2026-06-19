import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Exam = {
  id: number;
  title: string;
  passingScore: number;
  timeLimit: number;
};

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  courseId: string;
}

export function ExamFormModal({
  isOpen,
  onClose,
  initialData,
  courseId,
}: ExamFormModalProps) {
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPassingScore(initialData.passingScore.toString());
      setTimeLimit(initialData.timeLimit.toString());
    } else {
      setTitle("");
      setPassingScore("");
      setTimeLimit("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    const payload = {
      course: courseId,
      title,
      passingScore: Number(passingScore),
      timeLimit: Number(timeLimit),
    };
    console.log(initialData ? "Update Exam:" : "Create Exam:", payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {initialData ? "Edit Exam" : "Create New Exam"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700 dark:text-[#ccc]">
              Exam Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Final Exam"
              className="rounded-2xl dark:bg-[#2a2a2a] dark:border-[#555]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="score"
                className="text-slate-700 dark:text-[#ccc]"
              >
                Passing Score
              </Label>
              <Input
                id="score"
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                placeholder="e.g. 70"
                className="rounded-2xl dark:bg-[#2a2a2a] dark:border-[#555]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-slate-700 dark:text-[#ccc]">
                Time Limit (Mins)
              </Label>
              <Input
                id="time"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="e.g. 60"
                className="rounded-2xl dark:bg-[#2a2a2a] dark:border-[#555]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-2xl dark:text-white dark:border-[#555] hover:dark:bg-[#444]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white"
          >
            {initialData ? "Save Changes" : "Create Exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
