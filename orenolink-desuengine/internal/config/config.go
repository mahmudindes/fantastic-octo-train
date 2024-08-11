package config

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"strings"

	"github.com/knadh/koanf/parsers/yaml"
	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/providers/rawbytes"
	"github.com/knadh/koanf/v2"

	desuengine "github.com/mahmudindes/orenolink-desuengine"
	"github.com/mahmudindes/orenolink-desuengine/embedded"
	"github.com/mahmudindes/orenolink-desuengine/internal/auth"
	"github.com/mahmudindes/orenolink-desuengine/internal/controller"
	"github.com/mahmudindes/orenolink-desuengine/internal/datastore"
	"github.com/mahmudindes/orenolink-desuengine/internal/server"
)

type Config struct {
	Auth      auth.Config      `conf:"auth"`
	Datastore datastore.Config `conf:"datastore"`
	Server    server.Config    `conf:"server"`

	General struct {
		Controller controller.Config `conf:",squash"`
	} `conf:"general"`
}

func New() (*Config, error) {
	cfr := koanf.New(".")

	if err := cfr.Load(rawbytes.Provider(embedded.DefaultConfig), yaml.Parser()); err != nil {
		return nil, fmt.Errorf("load default config failed: %w", err)
	}

	if err := cfr.Load(&pfile{desuengine.ConfigPath}, yaml.Parser()); err != nil {
		if !errors.Is(err, fs.ErrNotExist) {
			return nil, fmt.Errorf("load config file failed: %w", err)
		}
	}

	if err := save(cfr, yaml.Parser(), desuengine.ConfigPath); err != nil {
		return nil, fmt.Errorf("save config file failed: %w", err)
	}

	if err := cfr.Load(env.Provider(strings.ToUpper(desuengine.ID)+"_", ".", func(s string) string {
		return strings.Replace(strings.TrimPrefix(strings.ToLower(s), desuengine.ID+"_"), "_", ".", -1)
	}), nil); err != nil {
		return nil, fmt.Errorf("read environtment variables failed: %w", err)
	}

	var config Config
	if err := cfr.UnmarshalWithConf("", &config, koanf.UnmarshalConf{
		Tag: "conf",
	}); err != nil {
		return nil, fmt.Errorf("unmarshal config failed: %w", err)
	}

	return &config, nil
}

func save(cfr *koanf.Koanf, parser koanf.Parser, name string) error {
	data, err := cfr.Marshal(parser)
	if err != nil {
		return err
	}
	file, err := os.Create(name)
	if err != nil {
		return err
	}
	if _, err := file.Write(data); err != nil {
		return err
	}
	return nil
}
