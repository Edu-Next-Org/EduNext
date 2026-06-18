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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  score: number;
};

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  examId: string;
}

export function QuestionFormModal({
  isOpen,
  onClose,
  initialData,
  examId,
}: QuestionFormModalProps) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState("0");
  const [score, setScore] = useState("1");

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      const paddedOptions = [...initialData.options];
      while (paddedOptions.length < 4) paddedOptions.push("");
      setOptions(paddedOptions.slice(0, 4));

      const cIndex = initialData.options.indexOf(initialData.correctAnswer);
      setCorrectIndex(cIndex !== -1 ? cIndex.toString() : "0");
      setScore(initialData.score.toString());
    } else {
      setText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex("0");
      setScore("1");
    }
  }, [initialData, isOpen]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    const correctAnswer = options[parseInt(correctIndex)];
    const payload = {
      examId,
      text,
      options: options.filter((opt) => opt.trim() !== ""),
      correctAnswer,
      score: Number(score),
    };
    console.log(initialData ? "Update Question:" : "Create Question:", payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {initialData ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-[#ccc]">
              Question Text
            </Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type the question here..."
              className="rounded-2xl resize-none dark:bg-[#2a2a2a] dark:border-[#555] min-h-[80px]"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-[#ccc]">
              Options & Correct Answer
            </Label>
            <p className="text-xs text-slate-500 dark:text-[#898989] mb-2">
              Fill in the options and select the radio button next to the
              correct answer.
            </p>
            <RadioGroup
              value={correctIndex}
              onValueChange={setCorrectIndex}
              className="space-y-3"
            >
              {options.map((opt, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="border-violet-500 text-violet-600"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={`rounded-xl dark:bg-[#2a2a2a] dark:border-[#555] ${correctIndex === index.toString() ? "border-violet-400 ring-1 ring-violet-400 dark:border-violet-500 dark:ring-violet-500" : ""}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2 w-1/3">
            <Label
              htmlFor="q-score"
              className="text-slate-700 dark:text-[#ccc]"
            >
              Score Weight
            </Label>
            <Input
              id="q-score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="rounded-xl dark:bg-[#2a2a2a] dark:border-[#555]"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-4">
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
            {initialData ? "Update Question" : "Save Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
