package app

import (
	"0x/internal/pledger/app/payment"
	"0x/internal/pledger/config"
	"0x/pkg/server"
	"context"

	"github.com/gin-gonic/gin"
)

// RegisterV1 registers the v1 routes for the application
func RegisterV1(ctx context.Context, rg *gin.RouterGroup, cfg *server.Config[config.Options]) error {

	if err := payment.RegisterV1(ctx, rg, cfg); err != nil {
		return err
	}

	return nil
}
