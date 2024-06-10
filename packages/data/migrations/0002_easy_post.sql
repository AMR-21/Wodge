ALTER TABLE invites ADD `emails` text;--> statement-breakpoint
ALTER TABLE workspaces ADD `is_invite_link_enabled` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `invites` DROP COLUMN `limit`;