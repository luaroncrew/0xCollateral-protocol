package intent

// Request represents the response after creating a new payment intent.
type Response struct {
	CheckoutURL string `json:"payment_url"`
}
