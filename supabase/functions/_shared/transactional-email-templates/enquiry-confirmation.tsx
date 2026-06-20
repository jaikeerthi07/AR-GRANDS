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
  functionType?: string
  date?: string
  time?: string
  capacity?: string
  phone?: string
  message?: string
}

const Email = ({
  name,
  functionType,
  date,
  time,
  capacity,
  phone,
  message,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your enquiry — A.R Grand Marriage Hall</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={eyebrow}>A.R GRAND MARRIAGE HALL</Text>
          <Heading style={h1}>Thank you for your enquiry</Heading>
        </Section>

        <Section style={card}>
          <Text style={text}>
            Dear {name || 'Guest'},
          </Text>
          <Text style={text}>
            We have received your enquiry for A.R Grand Marriage Hall, Kodungaiyur.
            Our team will reach out to you within 24 hours to confirm availability
            and walk you through the next steps.
          </Text>

          <Hr style={hr} />
          <Text style={subhead}>Your Enquiry Details</Text>
          {functionType && <Text style={detail}><strong>Function:</strong> {functionType}</Text>}
          {date && <Text style={detail}><strong>Event Date:</strong> {date}</Text>}
          {time && <Text style={detail}><strong>Preferred Time:</strong> {time}</Text>}
          {capacity && <Text style={detail}><strong>Hall Capacity:</strong> {capacity}</Text>}
          {phone && <Text style={detail}><strong>Phone:</strong> {phone}</Text>}
          {message && <Text style={detail}><strong>Message:</strong> {message}</Text>}

          <Hr style={hr} />
          <Text style={text}>
            For urgent queries, call us at{' '}
            <Link href="tel:+919444043451" style={link}>+91 94440 43451</Link>{' '}
            or visit{' '}
            <Link href="https://argrandweddinghall.com" style={link}>
              argrandweddinghall.com
            </Link>.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            A.R Grand Marriage Hall · Kodungaiyur, Chennai
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'We received your enquiry — A.R Grand Marriage Hall',
  displayName: 'Enquiry Confirmation (Customer)',
  previewData: {
    name: 'Priya',
    functionType: 'Wedding',
    date: '2026-08-12',
    time: '18:00',
    capacity: '100–250 Guests',
    phone: '+91 98765 43210',
    message: 'Vegetarian catering required.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { margin: '0 auto', padding: '24px 16px', maxWidth: '600px' }
const header = { textAlign: 'center' as const, padding: '16px 0 8px' }
const eyebrow = { color: '#b08b3f', fontSize: '11px', letterSpacing: '4px', margin: '0 0 8px', fontFamily: 'Arial, sans-serif' }
const h1 = { color: '#1a1a1a', fontSize: '28px', margin: '0', fontWeight: 'normal' as const, fontStyle: 'italic' as const }
const card = { backgroundColor: '#faf7f1', border: '1px solid #ecdfc7', borderRadius: '8px', padding: '28px' }
const text = { color: '#2b2b2b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px', fontFamily: 'Arial, sans-serif' }
const subhead = { color: '#b08b3f', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' as const, margin: '0 0 12px', fontFamily: 'Arial, sans-serif' }
const detail = { color: '#2b2b2b', fontSize: '14px', lineHeight: '1.7', margin: '0 0 6px', fontFamily: 'Arial, sans-serif' }
const hr = { borderColor: '#ecdfc7', margin: '20px 0' }
const link = { color: '#b08b3f', textDecoration: 'underline' }
const footer = { textAlign: 'center' as const, padding: '20px 0 0' }
const footerText = { color: '#888', fontSize: '12px', margin: 0, fontFamily: 'Arial, sans-serif' }
