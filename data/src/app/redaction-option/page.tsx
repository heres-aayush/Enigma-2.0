'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface RedactionOptionsProps {
  onClose: () => void
  onRedact: (fields: string[], method: 'blank' | 'blur') => void
}

export default function RedactionOptions({ onClose, onRedact }: RedactionOptionsProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [redactionMethod, setRedactionMethod] = useState<'blank' | 'blur'>('blank')

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    )
  }

  const handleRedact = () => {
    onRedact(selectedFields, redactionMethod)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redaction Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Select PII fields to redact:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dob"
                  checked={selectedFields.includes('dob')}
                  onCheckedChange={() => handleFieldToggle('dob')}
                />
                <label htmlFor="dob">Date of Birth</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phone"
                  checked={selectedFields.includes('phone')}
                  onCheckedChange={() => handleFieldToggle('phone')}
                />
                <label htmlFor="phone">Phone Number</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={selectedFields.includes('email')}
                  onCheckedChange={() => handleFieldToggle('email')}
                />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Redaction Method:</Label>
            <RadioGroup
              defaultValue="blank"
              onValueChange={(value) => setRedactionMethod(value as 'blank' | 'blur')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blank" id="blank" />
                <Label htmlFor="blank">Blank</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blur" id="blur" />
                <Label htmlFor="blur">Blur</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRedact}>Apply Redaction</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}