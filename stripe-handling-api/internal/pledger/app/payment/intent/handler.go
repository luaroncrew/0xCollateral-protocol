package intent

import (
	"fmt"
	"log/slog"
	"net/http"

	"0x/internal/pledger/config"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v82"
)

// Handler handles the creation of a new payment intent
func Handler(sc *stripe.Client, opt config.Options) gin.HandlerFunc {

	return func(c *gin.Context) {

		var req Request
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx := c.Request.Context()

		metadata := map[string]string{
			"address": req.Address,
		}

		// Create a new payment intent
		sessionParams := &stripe.CheckoutSessionCreateParams{
			CancelURL:  stripe.String(opt.Frontend.Cancel.URL),
			SuccessURL: stripe.String(opt.Frontend.Success.URL),
			Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
			PaymentIntentData: &stripe.CheckoutSessionCreatePaymentIntentDataParams{
				Metadata:      metadata,
				CaptureMethod: stripe.String(stripe.PaymentIntentCaptureMethodManual),
			},
			CustomText: &stripe.CheckoutSessionCreateCustomTextParams{
				AfterSubmit: &stripe.CheckoutSessionCreateCustomTextAfterSubmitParams{
					Message: stripe.String(fmt.Sprintf("The pledge will be attached to the address: %s", req.Address)),
				},
			},
			LineItems: []*stripe.CheckoutSessionCreateLineItemParams{
				{
					PriceData: &stripe.CheckoutSessionCreateLineItemPriceDataParams{
						Currency: stripe.String(stripe.CurrencyUSD),
						ProductData: &stripe.CheckoutSessionCreateLineItemPriceDataProductDataParams{
							Name: stripe.String("Pledge"),
						},
						UnitAmount: stripe.Int64(req.Amount),
					},
					Quantity: stripe.Int64(1),
				},
			},
		}

		session, err := sc.V1CheckoutSessions.Create(ctx, sessionParams)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment session", "details": err.Error()})
			return
		}

		slog.InfoContext(ctx, "Payment intent created", "session_id", session.ID, "amount", req.Amount, "address", req.Address)

		c.JSON(http.StatusOK, Response{
			CheckoutURL: session.URL,
		})
	}
}
