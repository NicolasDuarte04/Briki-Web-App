import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { 
  Country, 
  countries, 
  filterCountries, 
  commonOriginCountries, 
  commonDestinationCountries 
} from "../data/countries"
import { useLanguage } from "./language-selector"

interface CountryComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  emptyMessage?: string
  searchPlaceholder?: string
  isOrigin?: boolean
}

export function CountryCombobox({ 
  value, 
  onChange, 
  placeholder = "Select country",
  label = "Country",
  emptyMessage = "No country found",
  searchPlaceholder = "Search country...",
  isOrigin = false
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { t } = useLanguage()

  // Determine which list to show based on context and search
  const getDisplayCountries = () => {
    if (searchQuery.length >= 2) {
      return filterCountries(searchQuery)
    }
    return isOrigin ? commonOriginCountries : commonDestinationCountries
  }

  const displayCountries = getDisplayCountries()
  
  // Find the selected country object
  const selectedCountry = countries.find((country) => country.code.toLowerCase() === value.toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCountry ? (
            <span className="flex items-center">
              <span className="mr-2">{selectedCountry.name}</span>
              <span className="text-xs text-muted-foreground">({selectedCountry.code})</span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {displayCountries.length === 0 && (
            <CommandEmpty>{emptyMessage}</CommandEmpty>
          )}
          <CommandGroup className="max-h-64 overflow-auto">
            {displayCountries.map((country) => (
              <CommandItem
                key={country.code}
                value={country.code}
                onSelect={(currentValue) => {
                  onChange(currentValue)
                  setOpen(false)
                  setSearchQuery("")
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.code.toLowerCase() ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1">{country.name}</span>
                <span className="text-xs text-muted-foreground">({country.code})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}