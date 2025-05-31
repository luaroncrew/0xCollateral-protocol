package config

type Options struct {
	Stripe struct {
		Key     string `yaml:"key"`
		Webhook struct {
			Secret string `yaml:"secret"`
		} `yaml:"webhook"`
	} `yaml:"stripe"`
	Frontend struct {
		Cancel struct {
			URL string `yaml:"url"`
		}
		Success struct {
			URL string `yaml:"url"`
		}
	} `yaml:"frontend"`
	Collateral struct {
		URL string `yaml:"url"`
	} `yaml:"collateral"`
}
