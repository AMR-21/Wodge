CREATE TABLE `profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text,
	`avatar` text,
	`bio` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `image`;