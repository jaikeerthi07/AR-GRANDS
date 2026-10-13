import type { ComponentType } from 'npm:react@18.3.1'
import { template as enquiryConfirmation } from './enquiry-confirmation.tsx'
import { template as enquiryNotification } from './enquiry-notification.tsx'

export interface TemplateEntry {
  component: ComponentType<unknown>
  subject: string | ((data: unknown) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'enquiry-confirmation': enquiryConfirmation,
  'enquiry-notification': enquiryNotification,
}
