import { useEffect } from "react";

export default function StepIndustry({ value, onChange }) {
  useEffect(() => {
    if (value !== "Real Estate") onChange("Real Estate");
  }, []);

  return null;
}