CREATE TABLE IF NOT EXISTS "outbox_messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"type" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
