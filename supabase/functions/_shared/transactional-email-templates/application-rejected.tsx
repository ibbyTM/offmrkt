import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Link, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Off The Markets"
const SITE_URL = "https://off-the-markets.com"
const LOGO_URL = "https://uruqmzpihbxzzowrsrny.supabase.co/storage/v1/object/public/email-assets/logo.png"

interface ApplicationRejectedProps {
  name?: string
}

const ApplicationRejectedEmail = ({ name }: ApplicationRejectedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Off The Markets Application</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={SITE_NAME} width="160" height="auto" style={logo} />
        <Heading style={h1}>Your Application</Heading>
        <Text style={text}>
          Dear {name || 'Investor'},
        </Text>
        <Text style={text}>
          Thank you for taking the time to apply to {SITE_NAME}.
        </Text>
        <Text style={text}>
          After reviewing your application, we're unable to approve your investor
          profile at this time. This decision is based on our current criteria and
          does not reflect negatively on you personally.
        </Text>
        <Text style={text}>
          We would encourage you to reapply in the future should your circumstances
          change. If you have any questions regarding this decision, please don't
          hesitate to get in touch by replying to this email.
        </Text>
        <Text style={text}>
          We wish you well with your investment journey.
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
  component: ApplicationRejectedEmail,
  subject: 'Your Off The Markets Application',
  displayName: 'Application rejected',
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
const signoff = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: '1.6',
  margin: '24px 0 4px',
  fontWeight: '600' as const,
}
const link = { color: '#14B8A6', textDecoration: 'underline', fontSize: '14px' }
