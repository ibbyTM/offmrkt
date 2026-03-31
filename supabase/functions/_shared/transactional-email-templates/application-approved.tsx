import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Off The Markets"
const SITE_URL = "https://off-the-markets.com"
const LOGO_URL = "https://uruqmzpihbxzzowrsrny.supabase.co/storage/v1/object/public/email-assets/logo.png"

interface ApplicationApprovedProps {
  name?: string
}

const ApplicationApprovedEmail = ({ name }: ApplicationApprovedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're approved — welcome to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={SITE_NAME} width="160" height="auto" style={logo} />
        <Heading style={h1}>You're Approved</Heading>
        <Text style={text}>
          Dear {name || 'Investor'},
        </Text>
        <Text style={text}>
          We're pleased to confirm that your investor application has been approved.
        </Text>
        <Text style={text}>
          You now have full access to our exclusive off-market property listings — deals
          you won't find on Rightmove or Zoopla, pre-analysed with full financial
          breakdowns included.
        </Text>
        <Text style={text}>
          Log in to your dashboard to start browsing available deals.
        </Text>
        <Button style={button} href={`${SITE_URL}/properties`}>
          View Available Deals
        </Button>
        <Text style={text}>
          If you have any questions about a listing or would like to discuss a deal
          further, reply to this email and a member of our team will be in touch.
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
  component: ApplicationApprovedEmail,
  subject: "You're Approved — Welcome to Off The Markets",
  displayName: 'Application approved',
  previewData: { name: 'Jane' },
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
