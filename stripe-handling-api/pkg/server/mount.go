package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VersionFunc[TConfigOptions any] func(ctx context.Context, rg *gin.RouterGroup, cfg *Config[TConfigOptions]) error

// mount configures all the routes for the server
func (s *Server[TConfigOptions]) mount(ctx context.Context, r *gin.Engine, versions []VersionFunc[TConfigOptions]) error {

	// ADD API routes
	api := r.Group("/api")
	{
		// Health check endpoint
		api.GET("/version", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"tag": s.tagName,
			})
		})

		for idx, version := range versions {
			// Versioned API routes
			group := api.Group(fmt.Sprintf("/v%d", idx+1))
			{
				// Register additional routes
				if err := version(ctx, group, s.cfg); err != nil {
					return fmt.Errorf("failed to register version %d: %w", idx+1, err)
				}
			}
		}
	}

	return nil
}
