import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function LanguagePicker() {
  const [language, setLanguage] = useState("English");

  const languages = [
    { name: "English", code: "en" },
    { name: "Español", code: "es" },
    { name: "Français", code: "fr" },
    { name: "Deutsch", code: "de" },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Here you would typically call a function to change the app's language
    console.log(`Language changed to ${lang}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-glimps-700 hover:text-glimps-accent transition-colors">
        <Globe className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">{language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.name)}
            className="cursor-pointer"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
