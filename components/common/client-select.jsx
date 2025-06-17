"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClientSelect({ clients = [], value = "", onValueChange, placeholder = "Select client", required }) {

  const selectedClient = clients.find(client => client._id === value)
  const displayValue = selectedClient ? `${selectedClient.client_name} (${selectedClient.client_mail})` : ""


  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} >
          <SelectValue placeholder={placeholder}>
            {displayValue}
          </SelectValue>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client._id} value={client._id}>
            {client.client_name} ({client.client_mail})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
