-- SQLite
CREATE TABLE `crud` (
`id` integer,
`string` varchar,
`integer` integer,
`float` real,
`date` varchar,
`boolean` varchar,
PRIMARY KEY (`id`)
);
INSERT INTO crud(id, string, integer, float, date, boolean)
VALUES
(3, 'testing data', 12, 1.05, '12 desember 2017', 'true');