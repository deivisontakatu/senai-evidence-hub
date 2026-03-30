import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const items = [
    { label: "Iniciação Científica", value: "Iniciação Científica" },
    { label: "Projeto de Extensão", value: "Projeto de Extensão" },
    { label: "Visita Técnica", value: "Visita Técnica" },
    { label: "Palestra/Workshop/Masterclass", value: "Palestra/Workshop/Masterclass" },
    { label: "Outro", value: "Outro" },
]

export function SelectInput({value,onChange}) {
  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger className="w-full max-w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Selecione uma categoria</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
