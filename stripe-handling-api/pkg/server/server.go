package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Server represents the HTTP server
type Server[TConfigOption any] struct {
	cfg     *Config[TConfigOption]
	router  *gin.Engine
	tagName string
}

// New creates a new HTTP server
func New[TConfigOption any](ctx context.Context, configFile, tagName string, versions []VersionFunc[TConfigOption]) (*Server[TConfigOption], error) {
	router := gin.Default()

	router.Use(gin.Recovery()) // Use recovery middleware to recover from panics

	router.Use(func(c *gin.Context) {
		// Set CORS headers for all responses
		c.Header("Access-Control-Allow-Origin", "*")                                            // Allow all origins
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")             // Allow specific methods
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization") // Allow specific headers

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent) // Handle preflight requests
			return
		}

		// Set a default content type for all responses
		c.Header("Content-Type", "application/json") // Set default content type to JSON

		c.Next() // Call the next handler in the chain
	})

	// Setup routes
	srv := &Server[TConfigOption]{
		router:  router,
		tagName: tagName,
	}

	// Load configuration
	if err := srv.configure(configFile); err != nil {
		return nil, fmt.Errorf("failed to configure server: %w", err)
	}

	// Mount versions routers
	if err := srv.mount(ctx, router, versions); err != nil {
		return nil, fmt.Errorf("failed to mount versions: %w", err)
	}

	return srv, nil
}

func (s *Server[TConfigOption]) GetConfig() *Config[TConfigOption] {
	return s.cfg
}
