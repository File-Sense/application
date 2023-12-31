"use client";
import IndexComboBox from "./index-combobox";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";
import { FolderSearch } from "lucide-react";

export default function SearchByTextMenu() {
  const [sliderValue, setSliderValue] = useState(3);
  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <div className="flex flex-col gap-4 lg:w-[60%]">
        <div className="flex flex-row gap-4 w-full">
          <IndexComboBox />
          <Textarea
            className="max-h-10 w-full"
            placeholder="Explain Image (Image Content or Any Specific Scenario) Here..."
          />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col w-full">
            <Label htmlFor="nors" className="mb-5">
              Number of Results: {sliderValue}
            </Label>
            <Slider
              id="nors"
              onValueChange={(numb) => setSliderValue(numb[0])}
              defaultValue={[sliderValue]}
              max={25}
              step={1}
              min={1}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <Button className="gap-2">
          Search
          <FolderSearch className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
