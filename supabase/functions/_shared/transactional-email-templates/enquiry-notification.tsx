import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  phone?: string
  functionType?: string
  date?: string
  time?: string
  capacity?: string
  message?: string
}

const Email = ({
  name,
  email,
  phone,
  functionType,
  date,
  time,
  capacity,
  message,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New booking enquiry from {name || 'a customer'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={eyebrow}>NEW ENQUIRY · A.R GRAND</Text>
          <Heading style={h1}>New Booking Enquiry</Heading>
        </Section>

        <Section style={card}>
          <Text style={subhead}>Customer</Text>
          <Text style={detail}><strong>Name:</strong> {name || '—'}</Text>
          <Text style={detail}>
            <strong>Phone:</strong>{' '}
            {phone ? <Link href={`tel:${phone}`} style={link}>{phone}</Link> : '—'}
          </Text>
          <Text style={detail}>
            <strong>Email:</strong>{' '}
            {email ? <Link href={`mailto:${email}`} style={link}>{email}</Link> : '—'}
          </Text>

          <Hr style={hr} />
          <Text style={subhead}>Event</Text>
          <Text style={detail}><strong>Function Type:</strong> {functionType || '—'}</Text>
          <Text style={detail}><strong>Event Date:</strong> {date || '—'}</Text>
          <Text style={detail}><strong>Preferred Time:</strong> {time || '—'}</Text>
          <Text style={detail}><strong>Hall Capacity:</strong> {capacity || '—'}</Text>

          {message && (
            <>
              <Hr style={hr} />
              <Text style={subhead}>Message</Text>
              <Text style={detail}>{message}</Text>
            </>
          )}
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Sent from argrandweddinghall.com · Please respond within 24 hours.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    `New enquiry: ${data.functionType || 'Event'} — ${data.name || 'Customer'}`,
  displayName: 'Enquiry Notification (Admin)',
  to: 'booking@argrandweddinghall.com',
  previewData: {
    name: 'Priya Raman',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    functionType: 'Wedding',
    date: '2026-08-12',
    time: '18:00',
    capacity: '100–250 Guests',
    message: 'Need vegetarian catering and stage decoration.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { margin: '0 auto', padding: '24px 16px', maxWidth: '600px' }
const header = { textAlign: 'center' as const, padding: '16px 0 8px' }
const eyebrow = { color: '#b08b3f', fontSize: '11px', letterSpacing: '4px', margin: '0 0 8px', fontFamily: 'Arial, sans-serif' }
const h1 = { color: '#1a1a1a', fontSize: '26px', margin: '0', fontWeight: 'normal' as const, fontStyle: 'italic' as const }
const card = { backgroundColor: '#faf7f1', border: '1px solid #ecdfc7', borderRadius: '8px', padding: '28px' }
const subhead = { color: '#b08b3f', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' as const, margin: '0 0 10px', fontFamily: 'Arial, sans-serif' }
const detail = { color: '#2b2b2b', fontSize: '14px', lineHeight: '1.7', margin: '0 0 6px', fontFamily: 'Arial, sans-serif' }
const hr = { borderColor: '#ecdfc7', margin: '18px 0' }
const link = { color: '#b08b3f', textDecoration: 'underline' }
const footer = { textAlign: 'center' as const, padding: '20px 0 0' }
const footerText = { color: '#888', fontSize: '12px', margin: 0, fontFamily: 'Arial, sans-serif' }
