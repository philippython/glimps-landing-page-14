import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLocale } from "@/locales/LocaleProvider";

export default function LanguagePicker() {
  const { setLocale, availableLocales, currentLocale } = useLocale();
  const currentLocaleName = availableLocales.find((lang) => lang.code === currentLocale)?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-glimps-700 hover:text-glimps-accent transition-colors">
        <Globe className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">{currentLocaleName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {availableLocales.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="cursor-pointer"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
