package hook

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"0x/internal/pledger/config"

	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
)

func handlePaymentIntent(opt config.Options, intent *stripe.PaymentIntent) error {

	req := struct {
		PaymentIntent string `json:"payment_intent"`
	}{
		PaymentIntent: intent.ID,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	if _, err := http.Post(opt.Collateral.URL, "application/json", bytes.NewBuffer(body)); err != nil {
		return fmt.Errorf("failed to post to collateral URL: %w", err)
	}

	return nil
}

func parseEventData[T any](event *stripe.Event) (*T, error) {
	var data T
	if err := json.Unmarshal(event.Data.Raw, &data); err != nil {
		return nil, fmt.Errorf("failed to parse event data: %w", err)
	}

	return &data, nil
}

// Handler returns a gin.HandlerFunc that processes Stripe webhook events.
func Handler(sc *stripe.Client, opt config.Options) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the raw request body
		bodyBytes, err := c.GetRawData()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
			return
		}

		// Verify the Stripe signature
		event, err := webhook.ConstructEvent(bodyBytes, c.GetHeader("Stripe-Signature"), opt.Stripe.Webhook.Secret)
		if err != nil {

			slog.ErrorContext(c, "Failed to verify Stripe signature", "error", err)

			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Stripe signature"})
			return
		}

		slog.InfoContext(c, "Received webhook event", "event_type", event.Type)

		c.JSON(http.StatusOK, gin.H{"status": "success"})

		go func(event *stripe.Event) {

			slog.InfoContext(c, "Processing event asynchronously", "event_type", event.Type)

			handleEvent := func(event *stripe.Event) error {
				switch event.Type {
				case "checkout.session.completed":
					data, handlerErr := parseEventData[stripe.CheckoutSession](event)
					if handlerErr != nil {
						return fmt.Errorf("failed to parse checkout session: %w", handlerErr)
					}
					return handlePaymentIntent(opt, data.PaymentIntent)
				// case "payment_intent.amount_capturable_updated":
				// 	data, handlerErr := parseEventData[stripe.PaymentIntent](event)
				// 	if handlerErr != nil {
				// 		return fmt.Errorf("failed to parse payment intent: %w", handlerErr)
				// 	}
				// 	return handlePaymentIntent(opt, data)
				default:
					return fmt.Errorf("unhandled event type: %s", event.Type)
				}
			}

			if err := handleEvent(event); err != nil {
				slog.ErrorContext(c, "Failed to handle event", "event_type", event.Type, "error", err)
			}

			slog.InfoContext(c, "Event processed successfully", "event_type", event.Type)
		}(&event)
	}
}
