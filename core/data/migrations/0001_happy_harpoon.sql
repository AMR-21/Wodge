ALTER TABLE `account` RENAME TO `accounts`;--> statement-breakpoint
ALTER TABLE `session` RENAME TO `sessions`;--> statement-breakpoint
ALTER TABLE `user` RENAME TO `users`;--> statement-breakpoint
ALTER TABLE `verificationToken` RENAME TO `verification_tokens`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `providerAccountId` TO `provider_account_id`;--> statement-breakpoint
ALTER TABLE `sessions` RENAME COLUMN `sessionToken` TO `session_token`;--> statement-breakpoint
ALTER TABLE `sessions` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `emailVerified` TO `email_verified`;--> statement-breakpoint
ALTER TABLE `verification_tokens` RENAME COLUMN `identifier` TO `id`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
You're trying to delete PRIMARY KEY(provider,providerAccountId) from 'accounts' table
SQLite does not supportprimary key deletion from existing table
You can do it in 3 steps with drizzle orm:
 - create new mirror table table without pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
/*
You're trying to delete PRIMARY KEY(identifier,token) from 'verification_tokens' table
SQLite does not supportprimary key deletion from existing table
You can do it in 3 steps with drizzle orm:
 - create new mirror table table without pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
/*
 SQLite does not support "Drop default from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
You're trying to add PRIMARY KEY(provider,provider_account_id) to 'accounts' table
SQLite does not support adding primary key to an already created table
You can do it in 3 steps with drizzle orm:
 - create new mirror table with needed pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
/*
You're trying to add PRIMARY KEY(id,token) to 'verification_tokens' table
SQLite does not support adding primary key to an already created table
You can do it in 3 steps with drizzle orm:
 - create new mirror table with needed pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `image`;