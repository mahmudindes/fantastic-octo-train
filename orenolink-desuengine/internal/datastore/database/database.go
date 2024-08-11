package database

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"

	desuengine "github.com/mahmudindes/orenolink-desuengine"
	"github.com/mahmudindes/orenolink-desuengine/embedded"
	"github.com/mahmudindes/orenolink-desuengine/internal/logger"
)

type (
	Database struct {
		client   *pgxpool.Pool
		provider string
		logger   logger.Logger
	}

	Config struct {
		URL      string `conf:"url"`
		Provider string `conf:"provider"`
	}
)

func New(ctx context.Context, cfg Config, log logger.Logger) (*Database, error) {
	config, err := pgxpool.ParseConfig(cfg.URL)
	if err != nil {
		return nil, err
	}

	client, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, err
	}

	if err := client.Ping(ctx); err != nil {
		return nil, err
	}

	return &Database{client: client, provider: cfg.Provider, logger: log}, nil
}

func (db Database) Close() error {
	if db.client != nil {
		db.client.Close()
	}

	return nil
}

func (db Database) AutoMigrate(ctx context.Context) error {
	return db.MigrateCommand(ctx, "up")
}

func (db Database) MigrateCommand(ctx context.Context, args ...string) error {
	if err := goose.SetDialect("pgx"); err != nil {
		return err
	}
	switch strings.ToLower(db.provider) {
	case "crdb", "cockroachdb":
		goose.SetBaseFS(embedded.CRDBMigrations)
	case "pg", "postgres", "postgresql":
		goose.SetBaseFS(embedded.PGMigrations)
	default:
		return errors.New("database provider " + db.provider + " not supported")
	}
	goose.SetTableName(desuengine.ID + "_version")
	goose.SetLogger(&migrationLogger{logger: db.logger})

	if err := goose.RunContext(
		ctx,
		args[0],
		stdlib.OpenDBFromPool(db.client),
		"migrations",
		args[1:]...,
	); err != nil {
		return err
	}

	goose.SetBaseFS(nil)

	return nil
}

type migrationLogger struct {
	logger logger.Logger
}

func (ml *migrationLogger) Fatalf(format string, v ...interface{}) { panic(fmt.Sprintf(format, v...)) }
func (ml *migrationLogger) Printf(format string, v ...interface{}) {
	ml.logger.Message(fmt.Sprintf(strings.ReplaceAll(format, "\n", ""), v...))
}
