export type ResponseError = {
  error: string
  code?: string
  validation?: Record<string, string>
}

export type BtcpayWebhookEvent = {
  id: string
  type: "invoice_created" | "invoice_expired"
  data: Record<string, unknown>
  created: string
} 