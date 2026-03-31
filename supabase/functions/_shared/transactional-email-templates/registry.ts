/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as welcomeApplication } from './welcome-application.tsx'
import { template as applicationApproved } from './application-approved.tsx'
import { template as applicationRejected } from './application-rejected.tsx'
import { template as newPropertyAlert } from './new-property-alert.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome-application': welcomeApplication,
  'application-approved': applicationApproved,
  'application-rejected': applicationRejected,
  'new-property-alert': newPropertyAlert,
}
