package server

import (
	"context"
	"net/http"
)

// Start starts the HTTP server
func (s *Server[TConfigOption]) Start(ctx context.Context) error {

	srv := &http.Server{
		Addr:    s.cfg.GetAddress(),
		Handler: s.router,
	}

	return srv.ListenAndServe()
}
