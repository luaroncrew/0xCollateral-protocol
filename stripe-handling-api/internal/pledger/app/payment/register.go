package payment

import (
	"0x/internal/pledger/app/payment/hook"
	"0x/internal/pledger/app/payment/intent"
	"0x/internal/pledger/config"
	"0x/pkg/server"

	"context"

	"github.com/gin-gonic/gin"

	"github.com/stripe/stripe-go/v82"
)

func RegisterV1(ctx context.Context, rg *gin.RouterGroup, cfg *server.Config[config.Options]) error {
	sc := stripe.NewClient(cfg.Options.Stripe.Key)

	// Create a new router group for payment-related routes
	payment := rg.Group("/payments")
	{
		payment.POST("/hook", hook.Handler(sc, cfg.Options))
		payment.POST("/intent", intent.Handler(sc, cfg.Options))
	}

	return nil
}
