CREATE TABLE `replicache_client` (
	`id` text PRIMARY KEY NOT NULL,
	`last_mutation_id` integer NOT NULL,
	`client_group_id` text NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `replicache_server` (
	`id` text PRIMARY KEY DEFAULT '1234' NOT NULL,
	`version` integer DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE users ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `is_verified`;