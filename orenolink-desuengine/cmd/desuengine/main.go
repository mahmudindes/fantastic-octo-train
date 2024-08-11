package main

import (
	"context"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"github.com/urfave/cli/v2"

	desuengine "github.com/mahmudindes/orenolink-desuengine"
	"github.com/mahmudindes/orenolink-desuengine/internal/auth"
	"github.com/mahmudindes/orenolink-desuengine/internal/config"
	"github.com/mahmudindes/orenolink-desuengine/internal/controller"
	"github.com/mahmudindes/orenolink-desuengine/internal/datastore"
	"github.com/mahmudindes/orenolink-desuengine/internal/logger"
	"github.com/mahmudindes/orenolink-desuengine/internal/server"
	"github.com/mahmudindes/orenolink-desuengine/internal/service"
)

var StartTime = time.Now()

func main() {
	env := os.Getenv(strings.ToUpper(desuengine.ID) + "_ENV")
	if env == "" {
		env = "development"
	}

	godotenv.Load(".env." + env + ".local")
	if env != "test" {
		godotenv.Load(".env.local")
	}
	godotenv.Load(".env." + env)
	godotenv.Load()

	app := cli.NewApp()

	log := logger.New(app.ErrWriter)

	cfg, err := config.New()
	if err != nil {
		log.ErrMessage(err, "Config initialization failed.")
		os.Exit(1)
	}

	app.Usage = desuengine.Project + " backend API (" + desuengine.Name + ") CLI"
	app.Version = desuengine.Version
	app.Commands = []*cli.Command{
		{
			Name:  "start",
			Usage: "Start server",
			Action: func(cCtx *cli.Context) error {
				log.Message("Starting service.", "version", desuengine.Version)
				defer func() {
					log.Message("Service stopped.", "uptime", time.Since(StartTime))
				}()

				dst, err := datastore.New(cCtx.Context, cfg.Datastore, log)
				if err != nil {
					return err
				}
				if err := dst.Database.AutoMigrate(cCtx.Context); err != nil {
					return err
				}
				defer func() {
					if err := dst.Stop(); err != nil {
						log.ErrMessage(err, "Datastore stop failed.")
					}
				}()

				aut, err := auth.New(cCtx.Context, dst.Redis, cfg.Auth, log)
				if err != nil {
					log.ErrMessage(err, "Auth initialization failed.")
					return err
				}

				svc := service.New(dst.Database, aut.OAuth)

				ctr := controller.New(svc, aut.OAuth, cfg.General.Controller, log)

				svr, err := server.New(ctr, cfg.Server, log.WithName("Server"))
				if err != nil {
					svr.Shutdown()
					return err
				}
				defer svr.Shutdown()

				select {
				case <-cCtx.Done():
					log.Message("Stopping service.")
				case <-svr.ListenAndServe():
					log.Message("Unexpected server stopped.")
				}

				return nil
			},
		},
		{
			Name:  "migrate",
			Usage: "Migrate manually schema",
			Action: func(cCtx *cli.Context) error {
				log.Message("Starting migration.", "version", desuengine.Version)
				defer func() {
					log.Message("Migration finished.", "duration", time.Since(StartTime))
				}()

				args := cCtx.Args()

				dst, err := datastore.New(cCtx.Context, cfg.Datastore, log)
				if err != nil {
					return err
				}
				if !args.Present() {
					return dst.Database.MigrateCommand(cCtx.Context, "up")
				}
				if err := dst.Database.MigrateCommand(cCtx.Context, args.Slice()...); err != nil {
					return err
				}
				defer func() {
					if err := dst.Stop(); err != nil {
						log.ErrMessage(err, "Datastore stop failed.")
					}
				}()

				return nil
			},
		},
	}

	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)

		<-c
		cancel()
	}()

	if err := app.RunContext(ctx, os.Args); err != nil {
		log.ErrMessage(err, "Run failed.")
		os.Exit(1)
	}
}
