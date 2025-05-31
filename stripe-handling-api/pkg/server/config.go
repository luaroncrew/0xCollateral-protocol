package server

import (
	"fmt"
	"log/slog"

	"github.com/spf13/viper"
)

const (
	configPrefix = "0X"
)

// Config holds all configuration for the application
type Config[TConfigOptions any] struct {
	Server  ServerConfig   `yaml:"server"`
	Options TConfigOptions `yaml:"options"`
}

// ServerConfig holds server-specific configuration
type ServerConfig struct {
	Port int    `yaml:"port"`
	Host string `yaml:"host"`
}

func (c *Config[TConfigOptions]) GetAddress() string {
	return fmt.Sprintf("%s:%d", c.Server.Host, c.Server.Port)
}

// configure loads configuration from file and environment variables
func (s *Server[TConfigOption]) configure(configFile string) error {

	v := viper.New()

	// Set the configuration file name and path
	v.SetConfigFile(configFile)

	// Set the configuration file type
	v.AutomaticEnv()

	// Set the environment variable prefix to 0X
	v.SetEnvPrefix(configPrefix)

	// Read the configuration file
	if err := v.ReadInConfig(); err != nil {
		// It's okay if the config file doesn't exist
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return fmt.Errorf("error reading config file: %w", err)
		}
	}

	if err := v.Unmarshal(&s.cfg); err != nil {
		return fmt.Errorf("unable to decode config into struct: %w", err)
	}

	slog.Info("configured server", slog.Any("config", s.cfg.Options))

	return nil
}
