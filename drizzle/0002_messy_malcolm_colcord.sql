CREATE TABLE IF NOT EXISTS "outbox_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_name" text NOT NULL,
	"event_payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
