CREATE TABLE `invites` (
	`token` text NOT NULL,
	`created_by` text,
	`limit` integer DEFAULT 10 NOT NULL,
	`workspace_id` text NOT NULL,
	PRIMARY KEY(`token`, `workspace_id`),
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invites_token_unique` ON `invites` (`token`);