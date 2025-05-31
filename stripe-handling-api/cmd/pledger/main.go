package main

import (
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"0x/internal/pledger/app"
	"0x/internal/pledger/config"

	"0x/pkg/server"

	"github.com/spf13/cobra"
)

var version = "0.0.0-preview.0"

var (
	cfgPath string
	rootCmd = &cobra.Command{
		Use:   "server",
		Short: "0xCollateral Pledger Server",
		Long:  "0xCollateral Pledger Server is a service that handles payment pledges for collateral management.",
		RunE:  run,
	}
)

func run(cmd *cobra.Command, args []string) error {

	// Create a context with cancellation for graceful shutdown
	ctx, stop := signal.NotifyContext(cmd.Context(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Initialize the server
	srv, err := server.New(ctx, cfgPath, version, []server.VersionFunc[config.Options]{app.RegisterV1})
	if err != nil {
		return fmt.Errorf("failed to initialize server: %w", err)
	}

	// Use a channel to capture server errors
	errCh := make(chan error, 1)
	go func() {
		slog.Info("starting server", "address", srv.GetConfig().GetAddress())
		errCh <- srv.Start(ctx)
	}()

	// Wait for server error or interrupt signal
	select {
	case err := <-errCh:
		if err != nil {
			return fmt.Errorf("server error: %w", err)
		}
	case <-ctx.Done():
		slog.Info("shutdown signal received, stopping server...")
	}

	return nil
}

func init() {
	const (
		configKey = "config"
	)

	// Define the persistent flag for the configuration file path
	rootCmd.PersistentFlags().StringVarP(&cfgPath, configKey, "c", "", "Path to configuration file")

	// Mark the config flag as required
	rootCmd.MarkPersistentFlagRequired(configKey)
}

func main() {

	if err := rootCmd.Execute(); err != nil {
		slog.Error("Error executing command", "error", err)
		os.Exit(1)
	}

	os.Exit(0)
}
