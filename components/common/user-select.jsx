"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserSelect({ users = [], value = "", onValueChange, placeholder = "Select user", required }) {

  const selectedUser = users.find(user => user._id === value)
  const displayValue = selectedUser ? `${selectedUser.name} (${selectedUser.email})` : ""

  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger className="w-full" >
        <SelectValue placeholder={placeholder}>
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user._id} value={user._id}>
            {user.name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}