import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@ui/components/Dialog";
import { Button } from "@ui/components/Button";
import { Input } from "@ui/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/Select";
import { Label } from "@ui/components/Label";
import { Textarea } from "@ui/components/TextArea";
import { Chip } from "@ui/components/Chip";

export const ToDoModal: React.FC<
  Readonly<{
    isOpen: boolean;
    onClose: () => void;
  }>
> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log({ name, description, severity, dueDate });
      onClose();
    },
    [name, description, severity, dueDate, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary mb-5">
            Create New ToDo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right font-semibold text-secondary-foreground"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 border-2 border-input focus:border-primary"
                placeholder="Enter todo name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="description"
                className="text-right font-semibold text-secondary-foreground"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 border-2 border-input focus:border-primary min-h-[100px]"
                placeholder="Enter todo description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="severity"
                className="text-right font-semibold text-secondary-foreground"
              >
                Severity
              </Label>
              <Select onValueChange={setSeverity} value={severity}>
                <SelectTrigger className="col-span-3 border-2 border-input focus:border-primary">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <Chip text="Low" status="success" />
                  </SelectItem>
                  <SelectItem value="medium">
                    <Chip text="Medium" status="warning" />
                  </SelectItem>
                  <SelectItem value="high">
                    <Chip text="High" status="error" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="dueDate"
                className="text-right font-semibold text-secondary-foreground"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3 border-2 border-input focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!name || !description || !severity || !dueDate}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Create ToDo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
