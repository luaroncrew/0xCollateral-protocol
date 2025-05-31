package intent

// Request represents the request body for creating a new payment intent.
type Request struct {
	Amount  int64  `json:"amount" binding:"required,min=1"`
	Address string `json:"address" binding:"required"`
}
