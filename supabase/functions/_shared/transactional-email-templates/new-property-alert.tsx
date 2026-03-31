import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Off The Markets"
const SITE_URL = "https://off-the-markets.com"
const LOGO_URL = "https://uruqmzpihbxzzowrsrny.supabase.co/storage/v1/object/public/email-assets/logo.png"

interface NewPropertyAlertProps {
  name?: string
  propertyAddress?: string
  city?: string
  askingPrice?: number
  grossYield?: number
  propertyType?: string
  strategy?: string
  propertyId?: string
}

const formatPrice = (price?: number) => {
  if (!price) return '—'
  return '£' + price.toLocaleString('en-GB')
}

const formatType = (type?: string) => {
  if (!type) return '—'
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const NewPropertyAlertEmail = ({
  name,
  propertyAddress,
  city,
  askingPrice,
  grossYield,
  propertyType,
  strategy,
  propertyId,
}: NewPropertyAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      New Deal Alert: {propertyAddress || 'New Property'} — {grossYield ? `${grossYield}%` : 'High'} Yield
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={SITE_NAME} width="160" height="auto" style={logo} />
        <Heading style={h1}>New Deal Alert</Heading>
        <Text style={text}>
          Dear {name || 'Investor'},
        </Text>
        <Text style={text}>
          A new off-market property has been listed that matches your investment criteria.
        </Text>

        <Section style={propertyCard}>
          <Text style={propertyTitle}>{propertyAddress || 'New Property Listing'}</Text>
          <Text style={statLine}>📍 Location: {city || '—'}</Text>
          <Text style={statLine}>💰 Asking Price: {formatPrice(askingPrice)}</Text>
          <Text style={statLine}>📈 Gross Yield: {grossYield ? `${grossYield}%` : '—'}</Text>
          <Text style={statLine}>🏠 Property Type: {formatType(propertyType)}</Text>
          <Text style={statLine}>📋 Strategy: {formatType(strategy)}</Text>
        </Section>

        <Button
          style={button}
          href={propertyId ? `${SITE_URL}/properties/${propertyId}` : `${SITE_URL}/properties`}
        >
          View Full Property Details
        </Button>

        <Text style={text}>
          This deal includes a full investment analysis, compliance documents, and
          financial breakdown. Properties like this move quickly — we'd recommend
          reviewing it at your earliest convenience.
        </Text>
        <Text style={text}>
          If you have any questions about this listing, reply to this email and
          we'll be happy to help.
        </Text>
        <Text style={signoff}>
          The {SITE_NAME} Team
        </Text>
        <Link href={SITE_URL} style={link}>off-the-markets.com</Link>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewPropertyAlertEmail,
  subject: (data: Record<string, any>) =>
    `New Deal Alert: ${data.propertyAddress || 'New Property'} — ${data.grossYield ? `${data.grossYield}%` : 'High'} Yield`,
  displayName: 'New property alert',
  previewData: {
    name: 'Jane',
    propertyAddress: '42 High Street, Manchester',
    city: 'Manchester',
    askingPrice: 125000,
    grossYield: 8.5,
    propertyType: 'terraced',
    strategy: 'btl',
    propertyId: 'preview-id',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px' }
const logo = { marginBottom: '28px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1E3A5A',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const propertyCard = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '16px 0 24px',
  border: '1px solid #e2e8f0',
}
const propertyTitle = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#1E3A5A',
  margin: '0 0 12px',
}
const statLine = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.8',
  margin: '0',
}
const button = {
  backgroundColor: '#14B8A6',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '14px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block' as const,
  margin: '8px 0 24px',
}
const signoff = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '24px 0 4px',
  fontWeight: '600' as const,
}
const link = { color: '#14B8A6', textDecoration: 'underline', fontSize: '14px' }
