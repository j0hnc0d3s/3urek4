import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message } = req.body

  try {
    await resend.emails.send({
      from: 'john@3urek4.com',
      to: email,
      replyTo: email,
      cc: ['john@3urek4.com', 'josiahjohngreen@gmail.com'],
      subject: `New message from ${name} — 3urek4 Website`,
      html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      `
    })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message.' })
  }
}