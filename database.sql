--create all tables for project
CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"ui_color" varchar(6) NOT NULL DEFAULT '73F450',
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "rooms" (
	"id" serial NOT NULL,
	"game_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text NOT NULL,
	"description" varchar(1024) NOT NULL,
	"exits" json NOT NULL,
	"interactables" json,
	CONSTRAINT "rooms_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "items" (
	"id" serial NOT NULL,
	"game_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "rooms_items" (
	"id" serial NOT NULL,
	"room_id" int NOT NULL,
	"item_id" int NOT NULL,
	CONSTRAINT "rooms_items_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "saves" (
	"id" serial NOT NULL,
	"save" JSON NOT NULL,
	"user_id" int NOT NULL,
	"timestamp" timestamp NOT NULL,
	"game_id" int NOT NULL,
	CONSTRAINT "saves_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "games" (
	"id" serial NOT NULL,
	"name" varchar(256) NOT NULL,
	"start_location" varchar(256) NOT NULL,
	"user_id" int NOT NULL,
	"inventory" JSON NOT NULL,
	CONSTRAINT "games_pk" PRIMARY KEY ("id")
);

--foreign keys
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk0" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE;
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk1" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE;

ALTER TABLE "saves" ADD CONSTRAINT "saves_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
ALTER TABLE "saves" ADD CONSTRAINT "saves_fk1" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;

ALTER TABLE "rooms" ADD CONSTRAINT "rooms_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;
ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;

ALTER TABLE "games" ADD CONSTRAINT "games_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;

--create admin user
insert into "user" ("username", "password")
VALUES('admin', '$2a$10$eXaya1.jTeVgi2p1QmyeJ.bOG4B3TOdwpGKTTLXeDqkdFCvcxWhnK');

--insert game info for cloud-quest
insert into games ("name", "start_location", "inventory", "user_id")
VALUES('cloud-quest', 'car', '[]', 1);

--generate all rooms for cloudquest
insert into rooms ("name", "game_id", "description", "image", "interactables", "exits")
VALUES('car',
1,
'You are in your car. You pulled to the side of the road about a half mile south of your childhood home. There is a note in the passenger seat and a photograph stuck to the dashboard.',
'=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$?+-,,,,,,,,\n=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$?=,,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$!--,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW:---,,,,,,,\n=;?WWWWWWWWWWWWWWWWWWWWWWWWWW?$WWW;,------,,,\n=+!$WWW$$$$$$$$$$$$$$$$$??$$!!!?!;:,,,,,,,,,,\n-=;!!!!!!!!!!!!!!!!!!!!!!!!;;;;;;;:----===--,\n,=::;;;!????$??$$$$$$$$$$$$!;;;;:;;:;:+:==:+=\n.-+::;:;;;;;!?!!!$$$??????!;;;;::::::;;;:;;++\n.,=+;!!!????$$$$$$$$$$$???!!!!!!!!::;;;;;;;;;\n,,-+;$$$$$$$$$$$$$$$$$$$$$$??!???????!!!!;;;;\n,.,=:$$$$$$$$$$$$$$$$$$$$$$$$$??!!!!!!???????\n,,,=+?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!!;!!!!\n,,.-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!;;\n,,,,=+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??\n,,..-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n--..,=+?$$$$$$$$?$?????!!;;;::;;;;!!!????????\n--.,,,=+;!???;+=-:=--=+:;!!!!!??!!!!!;::::;::\n--.,,,-=:!!:-,...,,...,,=;?$$$$$$$$???;;;;;;;\n=-,,.-,=?;=,.,,,,,,,,,,,.,=!??$!=--,,,,,-=::;\n=-,,.,-:+-.--,,,,,,,,,,,-,,,++:=.,,-=---.,-,=\n=-,,,.=+-.=!,.,,,,,,,,,.=-..,-+-.,-,-,,,,,,,,\n=-,,.-+,,,==,,,,,--,,-,,,=,..,+=,,-+===-,,-,-\n,,,,,+-..-=-.,,,,--,--,,,+:,..,-,,---,,,,,,,,\n-=,,==.,-+:=.,,-.,,.--,,,;$+..,,,,-,,,.,,.,,,\n-,.,+,,;$$$:.,--,,,,,,,,,!?!-,,,,,,......,-==\n,,.-=.,=!$$;..=+::::+=,,-!!?;+,-,======++::;;\n,,.=-,==+$$!,=::+:++===--;;;;!==,;!!!!!!!!;;;\n,,,=,,,-=:!!====----+=--=+::;;+=-=;:::+:+:=-:\n,,,=.--,----===,....,=-..,==+===-,+++==+++==+\n,.,=-===-,,==+,..-=,.,=,,,--,,,,.,---,,,,,,-=\n,.,===-,,,,=+=.,+=++,,:-.,,..,,,,,,,,.,,,,.,+\n,.,==--,,,,=+-.=:==---;=.,,,,,,,,,,,,,,,,,,,=\n,.,==-,,,,,=+,.=+==-,-:=.,,,,,,,,.,,,,,,,,,.,\n,.=++,,,,,,-=-.,----,=:-.,,,,,,..-,,,,,,,,,,.\n.+!!!-.,,,,.,=-,,,,,.=:,,,,,,,,=,+:.,,,,,,,,,\n:?!?!-.,,,,,.,=,,,,,.==.,,,,,.-?;=!=.,,,,,,,,\n??!?;,.,,,,,,.,=-,,,--.,,,,,,,-!!:!!-.,,,,.,,\n??!!+,,,,,,,,,.,----,.,,,,,.,,-:!:;;=.,,,,-,,\n!??!:,,,,,,,,,,......,,,,,,,,-,=!:;;+,,,.,-,,\n;!!!+,,,,,,,,,,+,.,,,+,,,,,-,-.=!;;:+-------,\n;;;:+,,,,,,,,,.:=.,.-:.,,,,,-,.:;::++,--,=-,,\n;;+++,.,,,,,,,.+=.,.-:.,,.,-,.,:;++++,--,,-,,\n;;++=,,,,,,,,.,:+.,.=:-,,,-,.,,:;:+++,,--,,,,\n:++=,.,,,,,,,,=!:.,.+!:,--,.,,.+;;+++-.,,,,-,\n',
'[
{
    "name": ["note", "letter"],
		"display_name": "note",
    "description": "It''s from dad... \n\"Hey kid, our data center went down and we need you to deploy our calculator app to the cloud! The entire world is depending on those basic calculations!\"\nSounds pretty serious."
},
{
    "name": ["photo", "photograph"],
	"display_name": "photo",
    "description": "You see a bald man sitting on a throne made out of money. The image is unsettling and you can''t help but feel like his company controls most of the internet."
}
]',
'["road"]'),
('road',
1,
'You are on the road that leads to your childhood home. Everything seems to be smaller than you remember. The dirt road leading up to your house is inviting you in. Better get moving, you have a calculator to save.',
'!!!!!!;;:::;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!?;+==::+==::!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n???;===+:+==+:::!????????????????????????????\n???+===::==+::::;????????????????????????????\n??!===+::===::::;????????????????????????????\n??!====::+==++::;???????????????!????????????\n???===+++:+++++=+!$???????????;+=+:;!!??$$???\n??$+=+:::::::+=+::?$?????????$:,-=--=++::::;$\n$$$:=+:::::::+=::+;$$$$$$$$$$?---==-=+++===+;\n$$$:=+=+:::::+==::;??!!!??$$$+----=++++++++++\n$$?=+:+:+++++++++++:;!!;;!!?!==-,---=+==++==+\n!!;=+::+=-==-==+::+++:;!!!;!:-+=,-,,,=-,=+==+\n!!+==+==-======++::;::::;!;;=,==,-,-==+=====-\n!!;======-======+;!!!!!!;!!!=-=----=======--,\n!!!:===========+;!!!!!!!!;:::--,,,----=--=---\n!!;;:++-===++;;!!!!!!!!!!:;::--,,,,--,-===+==\n!;;;!!!=;;=;?!!!!;!!!!!::++++--,,,,---,,---=+\n::+:+:==+:=+:::;!;;!!;!:+++==--,,,-,---,-----\n;;;;::++++++++++;:+;:;;!;;;:+====--,---,----=\n;;!!!!!!!!;++;;;;;::+;;;;;;;;;;;;:+=--=------\n;;;!!!!!!!+-:;;!!;;;:;;;;;+=;;;;;!!;;;;;;;;:+\n;;;!;;;;!!;;!;;!;;!!;;;!!;::;!!!!;!;;;!!;!;!!\n!!!;;;;;;;;;;;;;;;!!!!;;;!!!!!;;;!!!;;;:=+:!!\n!!;;!;;;;;;;;;;;:;;!!!!!;;;;!;;;;;;;;;;+--:;;\n;;;;;;;;;;;;;;;;;;;;!!!!!!;;;;!!;;;;;!;;:;;;!\n;;;;::;;;;;;;;;!!!;!;!!!!!!!!!!;;!;;!;;;!;;;;\n!!!;:+:!:::;!!!!!;;;;!;;;;!!!!!!!!!;!!!!;;;;;\n!!!;++:!:=+;!;!!;;;;:;!!;;;;!!!!!!!!!;;!!;;;;\n!!!;:::::::;;;;;;!!!!;;;!!:;;;;!!!!!!!!!!!!!;\n;;;;;;;;;;!!;!!;;;!!;;;;::=;+:;;;!!!!!!!!!!!!\n;;;;;;;;;;;::::::+::;;:;;=-==!!;;;!!!!!!!!!!!\n++;;;;;;:::+=========+;;;+--+:;!!;;;;!!!!!!!!\n=:;;;:::;;;:++::+:;:+++::++:;:;;!!;;;;;!!!!!!\n=+:++=+:;:+:::::+;:::+::++=++:;;;!!!;;;;;!!!!\n=======++=+;::++=:+++==+======:;;;;!!;;;;;;!!\n==============-----=----=====-:;;;:;!!!;;;;;;\n+-==-,-=-=======-=====-,,-===-+;;;;;;!!!;;;;;\n===,,-,,-=======-====-,-=,--===;;;;;;;;!!!;;;\n==-.+;+,-------------,,:;=-++::;;;;;;;;;;!!!;\n++=,:;+,========+++++=,::-=::;!!!!!!!!!!!!!!!\n+++-,-,=++++++++++++++-,--++++;!!!!!!!!!!;;;;\n:::::+:::::::::::::;;;;::;;;;;;;;;;;;;;;;;;;;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!;!!!;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
'[]',
'["car","house"]'),
('house',
1,
'Man, this brings back memories. The paint is peeling off the side of the house. Seems like nobody''s been here for quite some time.',
'??????????????????$?:------------------------\n?????????????????$!=-------------------------\n??????????$$$$$?$!---------------------------\n??????????$$$$$$$:-,,,,,,,-------------------\n??????????$$$$$$$$$;+,...,,,,,,,,------------\n??$$$$$$$$$$$$$$$$$$$$!:-.,,,,,,,,,,,,,,-,,,,\n?$$$$$$$$$$$$$$$$$$$$$$$!=,,...,,,,,,,,,,,,,,\n????????????$$$$$$$$$$$$$$?!;+=-,,,,,,.,,,,,,\n?????????????????$$$$$$$$$$$$$$$?!;:--=-,,,,.\n????????????????$$$$$$$$$$$$$$$$$$$$?+;??!;;:\n??????????????$$$$$?$$$$$$!!$$$$$$$$$$::$WWWW\n????????????$$$$$$+=::;;!!+:$$$$$$$$$$$;+!$$W\n???????????$$$$$$?--====+++;$?:;;?$$$$$$!+:$W\n???????????$$$$$$:-=-======;$?+++;$$$$$$$$++!\n??????????$$$$$$?-==------=;$?::::?$$$$$$$$;=\n??????????$$?$$$;-=+=-=====;$?::::;$$$$$$$$W?\n???????????$$$$$==+:+-+++++++:+::::?$$$$$$$$W\n????????$$$$$$$!,+::+====---+++::::;$$$$$$$W$\n??????$$$$$$$$$+-+++++---,,=+++:::::?$$$$$$$$\n?????????????$?-=+==++=---,;:++:::::;$$$$$WWW\n????????$$$$$$:,++++++=-=-=!;++::::::?$WWWWWW\n!!!!!!!!!!!??!--=++++=====+::+++:::::;???????\n:::::::::::::+,======-===---==========+;!!!!!\n++++++::::;;;:====++==-=++==--==========+:!!!\n++::;;!!!!!!!!:-=+=+++==+++++=+;;::::::::::!;\n:;;;;;;;;;;;;;+=+++++++=+++++:;!!::::::::;:;:\n;;;;::::::::::+=+++++++=:?!?!?;!!!!!?!:::;:::\n;;::::::::::::+=++++++++:!!???;;!!;!?!:+::::+\n:::::+:+++++++======++++:!:;!!;;;!:;?!:+::+++\n+++==-=-==+++++---+!:++++:++;;;;;!:;!;;;!!:+;\n+=======++::::+==+!!:++:+++:!!;;!!!!!!!!!?:+!\n==+++++:::::::::::;;!!!???????!???????????!;!\n==========+::;;!!!!!???????????????????!!!!!!\n===-----==+++:::;;!!???????????!!!!!!!!!!!;;;\n==------=======++::::::;;;;::++++++++++++====\n=-------====+:::::::::::+====================\n=------==+::::::::::::+=====================,\n-----=+::::::::::::+==================-+====-\n--==::;;;;;;::;::+==================--,+====-\n=+::::::::::;::+===========,,,======--,======\n::::::::::::+==============,,,-=====-,,-+===-\n::::::::::+================-,,-======,,,--,,,\n::::::::+=-================-,,-====--,,,,,,,-\n+++++:+=-===================,,,--,,,,,,,--===\n+++++=--===================-,,,,,,,,--,,-====',
'[]',
'["road","front door","shed"]'),
('front door',
1,
'Walking up to the steps, you feel a blast of nostalgia. You expect to hear your mother calling you for dinner, but instead you''re met with silence.',
',,,,..,,,,,,,,,,,,,,.,.,,.........,,,,..,,...\n.,,,..,,,,,,,,,,,,,,,..,.........,,,.......,.\n,.,,,.,,,,,,,,,,,,,,,,..,,,..,,.,,,.,,.,.,,,.\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,------------------------------------,--,\n---=========================================-\n==-=============================-==========--\n===============,,,,,,,,,,,,,,,-=-==========-=\n===============,,,,,,,,,,,,,,,-=--===========\n+++++++;+======,,,,,,,,,,,,,,,-=-===+;==+++++\n--==---;=======,,,,,,,,,,,--,,-=-===+;--===--\n++::+++;=====+=,,,,---=--,--,,-+-====;==+::++\n::::+::;=====+=,-,,-,-==-,--,,-+-====;=+::;::\n::;::::;=====+=,-,,,,,-,,,--,,-+-====;=+::;::\n::;;:::;=-===+=,-,----------,,-+--=-=;=+:;;::\n::;;:::;=-===+=,-------------,-+--===;+::;;;:\n:;;;;::;=====+=,------,,--,--,-+-,-=+;+:;;;;:\n;!!!;::!=====:=,--,,,,,,,,--,,-+-,-==;+:;!!!;\n;!!!!;;!=====:=,--,---,--,--,,-+-===+;:;!!!!;\n!!?!!;;!+====:=,--,-----,,-----+-===+;:;!!!!!\n!???!!;!+====+=,--,----,-,--,,-+-===+;:;????!\n?????!;!=-===+=,--,---------,,=+--=-=;:!?????\n??????;!=====+=,------------,,=+-===+;;!?????\n!!?!!!;!=====+=,--------------=+-===+;;!!!?!!\n++++++++-====+=,--,,,----,----=+-====++++++++\n======--=====+=,--,,,,,,,,----==-=====--=====\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--------------==-============\n===============,--------------==-============\n--------------,------------------------------\n-------------,.,,,,,,,,,,,,,,,,,-------------\n-------------,,------------------------------\n--------------,------------------------------\n=------------,.,,,,,,,,,,,,,,,,,-------------\n====------==+=+++++++++++++++++++------------\n++++++::;;!!$$?!!!!!!!!!!!!!!!?$$!+::++::::::\n+++++++::::;!!;;;;;;!!!!!!!!!!!?$$!;!!!!!!!!!\n:;;:::++++:;:::::::;!??!!???????$$?!;;;;;::;;\n++++++++=++:::;;;;!!!!!;;!!!;;;;;;;;:;;;::::+\n=============+++:::::::::::::::::::::++++++==\n==============++:::::::::::::::::::++========',
'[
	{
		"name": ["front door", "door"],
		"display_name": "front door",
		"description": "The front door to your old house. Looks like it''s locked.",
		"use": {
			"4": {
				"set_var": {
					"house_unlocked": true
				},
					"new_description": "The front door to your old house. It''s been unlocked.",
					"new_exits": ["house","living room"],
				"message": "You slip the key into the deadbolt of the door and it gives you a resounding ''click''. You''re in."
			}
		}
	},
	{
		"name": ["welcome mat", "mat"],
		"display_name": "welcome mat",
		"description": "Printed on the mat is a large WELCOME in fading letters. You remember you used to keep a spare key under it.",
		"move": {
			"shows_item":["4"],
				"message": "And find a key under it!",
				"new_description": "Printed on the mat is a large WELCOME in fading letters. You''ve already found the secret spare key."
		}
	}
]',
'["house"]'),
('shed',
1,
'The shed smells like chopped firewood and motor oil. There''s a generator sitting in the corner. Looks like it hasn''t been used in some time.',
'::::;;;;;;;;;;;;!!!!!!!!!!!!!!!!!!!!!!!!;;;;;\n:++::::;;;;;;;;;;;!!!!!!!!!?;+!!!!!!!!;;;;;;;\n;::++++:::;;;;;;;;;;;!!!!!!!;;;;;;;;;;;;;;;;;\n;;:+::+::+::;;;;;;;;;;;;;;;;!?;;;:;;;::;;::::\n;;+=+++:;::++:::::::::::;::;!!;:::;!!;;;;;:;;\n:;:++++++:::+;;;;;;;;;:;;;;!!???!!!!!;;;;:;;;\n:;;::+:::+:++;;;;;;;;;;;;!??????!!!!!;;;;::++\n;;;::+:::+:++;;;;;;;;;;;;;:;;:;;;;!!!;;;;:+-=\n:::::+:::+::+:;;;;;;;;;;;;;;;:::;:;!!;;;;:==!\n:+::+++::+::+:;;;;;;;;;;;;;;;:!;!?;!!;;;;:=-:\n:=+::++::+::+:;;;;;;;;;;;;;;;:;;!;;!!;;;;:=-;\n+=+;::+::+::+:;;:;:;;;;:;;;;;:::+=;!!;;;;:=-:\n:+=:::+:::::+:;;;;;;;;;;!!;;;:++++;!!;;;:++++\n:+=+::+:::+:+:!!!!!!!;;!;!!;;:!??;;!!;;;;:++:\n++++::+:::+:+:!!!;!!!::!:;!;;;$$$!;!!;;;;::+:\n++++::+:::+:++!!;;!;!!!!;!!;:;???;;!!;;;;::::\n++=+::++::+:::!?!;?;!!!!;;!;:;$$$!;!!;;!;:::;\n++=++:++::+:;:;?!;?!!!!!!!!;;:;!!;;!!;!?:::;!\n++=++::+::+::+;?;:!!!!?!;!!;;:::::;!!!!!::;;!\n++=:+::+::::;:;?!!;!????!!!!!!;;;;!?!;;!!!!!!\n++-+=::+:::+!::???!;!??!!!?!;!!;;;:::++;:;;:;\n++-==::+:::+!::?!!;:+!;!!??;;;!!;;:+:+:!!;:+:\n++==+::++::+!::!!!!!=!!!:;?;;;!!;:+++++;;;+=;\n++++:::++::+!:;?!;!?;!??:;?!;!!;;;;:;::;::;:;\n++:;;::++:::!::!??!!!!???!!!!?!;::;;;::;:+:;;\n:+:;;:::+:::;:;?????????????!::;!:;;;;;;;;:;;\n:++;:=::+::::;!!!!!!!!!!!!!!++:+!!!!!!!!!!!!!\n:++;=-:::::::;;+:::::::::;;;:+++;:;;;;;;;;;;;\n:++;=,:::::::;!++++++---=;;+++++:+:::+:++++::\n::+;:=+::::::;!:::::=,,,-;;+++++++::+++==++::\n::;!;++:::::;;!:!!::=,,,=;;+++++++::+++==++:;\n:;;+,==:::::;:;;;;+=:---:!;+++++++::+++=+++:!\n+:+,,=-:::::;;;!!!!!!!!!!!;+++++++::+++=++::!\n+::,,+-:::::::;;:;;;;::::;;+++++++::+++=++:;!\n+::,,+,:::+=====-+;;:++++:;++++++++:+++=++:;!\n+::,,:-++:=------=??;++++:;+++++++::===--+;;!\n++:+:::++=+----=-:??;+::+:;++++++++++++++:!!!\n==+:++++=-==;+=!+=;;:++++:;++++++++++:::::!?!\n++++++=+=-==:=-++-::::::;;;;;;;;;::::::::::!!\n+++=++++=---++-++-;!!!!!!!!!!!!!!!!!!;;;::::;\n---======-,=+++++-+!!!!!!!!!!!!!!!!!!!!!!;;::\n--===-===-=::::::+:!!!!!!!!!!!!!!!!!!!!!!!!!;\n-,===-===-;!;;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n-,-=-====-;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n--==-====-;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
'[
	{
		"name": ["generator"],
		"display_name": "generator",
		"description": "The generator is old. Upon further investigation there seems to be some gas already in there but it won''t turn on. Looks like a rodent did some damage to the wiring.",
		"use": {
			"1": {
				"set_var": {
					"generator": true
				},
				"new_description": "After replacing the wiring, the generator is humming with life.",
				"message": "You replace the chewed wiring, pull the ripcord, and the generator springs to life with a roar!"
			}
		}
	},
	{
		"name": ["fried squirrel", "squirrel"],
		"display_name": "fried squirrel",
		"description": "Poor guy. Looks like he liked chewing on wires. I don''t know why but he seems like he would''ve been named CJ."
	}
]',
'["house"]'),
('living room',
1,
'The air is stale and the furniture is covered in plastic. It still somehow feels like home even after all these years.',
'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!;;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n?$??!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?$???!!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$????$?$??!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?!+;??$??$??!;:;:;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?!---=:;???$?$!?????$??????$????$?$????$??$\n?$?!+;:+=--=:!!?!$????$??????$????$?$??$?$?$$\n?$?!+!;??-=+=-=?!$????$??????$?????!!!!!!!!!!\n?$?!+;!$;-+!!!-?!$?????!?????$????;==========\n?$?!+;??:-+!$;-?!?????;::::;+!????;-,,,,,,,,-\n?$?!+!$!:-+?$:-?!?????;??!?$;;????;-,,,,,,,,-\n?$?!+$!;:-:$!:-?!?????;;!!!!:;????;-,,,,,,,,-\n?$?!:?;;:-:?;:-?!?????;==:!+:!????;-,,,,,,,,-\n!??!+!;;:-+!;:-?!?????:=-+?::!????;-,,,,,,,,-\n;!?!+;;;;-+!;:-?!?????:=-=!:+!????;-,,,,,,,,-\n:!?!+;;!!-+!;:-?!?????;===++=!????;-,,,,,,,,-\n+!?!=;;??-+!;:-?!?????;=+====!????;-,,,,,,,,-\n;?!;+;;$;-+!!!-!???????;!!!!!?????;-,,,,,,,,-\n?$;+;!?!:-+;??-!??????$?$?$$?$????;--,,,,,,,-\n?$;:;??;:-+!$;-!?????!!!!!!!!!!???;--,,,,,,,-\n?$;:;!?;:-+$?:-;;;;;;;;;;;;;;;:;;;;+=-,,,,,,-\n?$;:;!?;:-:$;:;;;!!!;;!!!!!!!;;!!!!!!;;+=,,,-\n?$;:;!?;:-:!;;!!!!!!;;!!!!!!!;;!!!!!!!!!;=,,-\n?$;:;??!:-+;;!;;;;;!;;;;;;;;!:;;;;;;;;;!;-,,-\n?$;::;!;;-+!;;;;;;;;;;;;;;;;;:;;;;;;;;;;=,,,-\n?$??;;;!?-=;;:;;;;;;;;;;;;;;;:;;;;;;;;;:-,,,-\n?$??;;;$!+:;;;:;;;;;::;;;;;;;:;;;;;;;;:::+,,-\n?$?;:;!$;;;:;;:;;;;;::;;;;;;::;;;;;;;:;;::,,-\n?$?;;??!:;;:;::::::::::::::::+::::::::;;:+,,-\n!;+=+::=+;;:::::::::::::::::::::::::::;;+-,,-\n+====:-==:;:::::::::::::::::+:::::::::::+++++\n::+==+=---::::::::::::::::::::::::::::::+++++\n+=====----+:::::::::::::::::::::::::::+:+++++\n=-=--=-==-+:::::::::::::::::::::::::::+:+++++\n--===+-===+:::::::::::::::::::::::::::+++++++\n-=++++-======+++++++++++++++++++++++=-=++++++\n++++++=++++++++++++++++++++++++++++++=+++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n=============================================\n=============================================',
'[
    {
		"name": ["box fuses", "box", "fuses"],
		"display_name": "box of fuses",
		"description": "Sitting on the bookshelf is a box of fuses. Convenient.",
		"open": {
			"shows_item":["5"],
				"message": "There''s one lonely fuse sitting inside the box."
		}
	}
]',
'["basement", "bedroom", "front door", "kitchen"]'),
('kitchen',
1,
'You wouldn''t expect the kitchen of an abandoned house to be this clean and inviting, but there''s barely any dust or decay here. The counter still looks good enough to eat off of.',
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\n?????????????????????????????????????????????\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n?????????????!??;::::!???????????????????????\n!!!!!!!!!!!!!???;+++=;???!!!!!!!!!!!!!!!!!!!!\n=-==========:!!?;+++=;?!?;==========+++++++++\n=-----------+!??;+++=;???;----------+++++++++\n=-==========+!??;+++=;???;=-====----+++++++++\n=+!!!!!!;;:=+!??;+++=;???;=-:+!+----+++++++++\n++;+===+=++=+!??;=++=:???;==+=:======++++++++\n++;-,,,==::=+!!!;=++=:!!!;=--------==++++++=+\n:=;---,==:+=+!!!;;;;;::!!;=-----+=-==+++++::+\n:=!;;;;;=:+=+!!!!!!!!!;:;;=---===--==+++++::+\n;=+::::+=+==+!!!!!!!!??!;;====+==-===========\n!:+++++++++++::::::::+++++:++++++++++++++++++\n??;;;;::::::+:::::::::::++!!:::::::::::::::::\n??!;;??!!!:+:::!!!!!!!!!!;!!!;;;;;;;;;;;;::::\n?;++:;?!??!;!!!???????????!!!!!!!!!!!!!!!!!!!\n?::+::????!!!!!????????????!!;;?!!!!!!!!!!!!!\n?!++::!?!?;;::;??????!????!::==;?!?!!?!!!?!!!\n??==+:!?!?!!!!?????!?!!!!?!;===:?!?!!!!?!;;!?\n??:++:!???????;;;;;:;!;+!?!;+-+;????????!!;!?\n??;;;:?$$$$$$?::::::;!;+?$?:+-:!$$$$$$$$$$!!$\n!;::+:;;;;;;:::+++::++=+:;;::+::;;;;;:+++++:;\n:+++++++=====+++++++++++==++++++=====++++++++\n!+++++++=++==+++::::+:+++++++++::+===::++++++\n!+++++++++!==+++++=====++=++++++:++==;:++++++\n!+++++++++;==+++=+::+=+:+=++++++=++==;:++++++\n!+++++++++;=-+++=++++=+++=+==========::=+++++\n?+++++++++:==;;::;;;!!!!;=++++++:+===:+=+++++\n?+++++++++:==!!;;;;;;;!!;=+++++::++==:+++++++\n?:=++++++++==!!:=-----;!;=++++===++==:+++++++\n?:=++++++++=-!!:-,---,;!;=++++++=====+=++++++\n$:=+++++++==-;!+,--,,,:!;============++++++++\n$;=++++++++=-;!+,-,,,,:!;=++++::;+++=++++++++\n!:=+++++++==-;!+----,,:!:=++=++++++==++++++++\n;:++++======-:!!;;;;;;!!:=+++++++++==++++++++\n!;----------,+;;;;;;;;;;:========----====----\n!;----------=:++++++++++:+-------------------\n!!!!!!!!!!;!!!!!!;!!!!!!!;!!!!!!!!;!!!!!!!!;!\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!;;\n;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
'[]',
'["living room"]'),
('basement',
1,
'It''s dark, dank, and humid. You''d prefer to not spend too much time down here. You see a friendly spider in the corner, web full of poor basement dwelling insects.',
'+=-------------------------------------------\n:+==-----------------------------------------\n+++====-------,,-----------------------------\n++++=====-----,,-------------------------====\n::++++======---,---------------==============\n:::++++=======--------=======================\n::::++::::::::;:;++++++++++++++++++++++++++++\n+:::++::::::;!!;?!;:+++++++++:+---====++:++++\n++++++:::+:!??!;???!:++++++++:+--------++++++\n+++++++::;!!??!;????!!::+++++++-=---==-++++++\n+++++++:!?????!;???????!;:+++++--------++++++\n++++++:!???????!?????????!;++++--------++++++\n++++++;!???????!???????!!!!;:++-------=++++++\n+++++:!!???????!????????!!!!!;+-------=:+++++\n+++++:!!??????!!????????!!!!!?;-------=:+++++\n+++++;!!??????!!!!????????!!!!?=--=====:+++++\n+:::+;!!?????!!!!??????????!!?;=+------=+++++\n+::::!!!?????!!!!?????????????:=:+------=:+++\n+::+;!!??????!!!!????!???????!+=+++---,--++++\n++++;!!???????!?????!!!!!!???;==++++=-,--+:++\n+++:!!!??????$$$$$???!!!!!???:==::::+=,--=:++\n+++;!!!?????$$$$$$$??!;;!!??!+=-------,,--+++\n++:;!!!??!!?$$$$$$$$?!!!!!??!+====++===---+++\n++:!??!?????$$$$$$$$?!!!!???;==---------=-=:+\n++;!??!???$??$$$$$$$$?!!!!?!:=====++=====+-++\n+:;!?!!!?$$??$$$$$$$$$?????!+=----------=:-=:\n+:!!!!???$$$$$$$$$$$$$$???!;=====+++=====++-:\n+:!!???$$$$$$$$$$$$$$$$?$?!:==----------==:-+\n++;!?!!?!!??$$$?????????!!!+==++++:+++++==:==\n++;?!++:;?!????$$$$?;:;?:;;+=-,,,,,,,,,,-=++-\n++;!?!???$$$???$$$$????$;;;==++++::+++++==+:-\n++;!??$$$$$$$$$$$$$$$$$$!;:=-------------==:=\n++:!??$$?;!$$$$$$$$$$$$$!:+======++========+=\n++:!??$$::;$$$$$$????$$$!========++========,,\n:+:!??$?:;;$$$$$$$???$$$?+==-,,,,,,,,,,,,-=,,\n:+:!!?$$;;;?$$?$$$???$$$?+==++++:;;:++++++-,-\n+++!??$$$??$$$?$$$$$$$$$?:=----------------,,\n++:!??$$$$$$$$?$$$$$$$$$?:+-,,,,,,,,,,,,,,-,,\n+::;?$$$$$$$???$$$$?$$$$?:+,,,,,,,,,,,,,,,,,.\n+::;??!!!!!!!!!!!!!!!!!!!::===--,,,,,,,,,,,,,\n+:+:::::;;;;;;;;;;;;;;:::++++=-,,,,,,,,,,,,,,\n+:+,,-=+::;;;;;;;;::::++++++=-,,,,,,,,,,,,,,,\n+=,,,,,--=++++++++++========,,,,,,,,,,,,,,,,,\n-,,,,,,,,,--==-------------,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
'[
	{
		"name": ["electrical panel", "panel"],
		"display_name": "electrical panel",
		"description": "Looks like the electrical panel for the house. It''s currently closed tight.",
		"open": {
			"add_interaction":
			{
				"use":
				{
					"5":
					{
						"set_var":
						{
							"electricity": true
						},
							"new_description": "With the fuse replaced electricity can flow once again. Time to get that calculator app running.",
						"message": "You click the new fuse into socket and with a flip of the switch, you''re one step closer to saving the world''s calculations."
					}
				}
			},
			"new_description": "The electical panel is now open, but it looks like it''s missing a fuse.",
			"message": "It''s a little tough to open but with enough force the panel lid breaks free."
		}
	},
	{
		"name": ["spider"],
		"display_name": "spider",
		"description": "I''m not worried about that kind of web! I have a calculator to save.",
		"use":
		{
			"3":
			{
				"new_description": "You see the little spiders gathered around the donut, still dancing and still snacking. It fills you with determination.",
				"message": "You place the donut in the spider''s web. A few of its buddies come out of the webwork and they all start a synchronized dance with each other. Every now and then a spider stops dancing for a brief moment to snack on the delicious looking donut. It fills you with determination."
			}
		}
	}
]',
'["living room"]'),
('bedroom',
1,
'Though the corners of your Led Zeppelin posters are starting to curl, it still looks just like how you left it.',
'---------------------------------------------\n---------------------------------------------\n--------------------------------+=-----------\n-,----------------=========+==+=::=---=====--\n,,----------------+:;:+;;+:;:+;:+:+---::::+--\n,,--------,-------+;;:+;;+:;;+;;+==---::::+--\n,,--------=-------+;!::!!+;!;+!;+=----::::+--\n,,--------=-------+;!::!!+;!;+;;+=-==-::::+--\n,,--------,-------+;;++++=++:=::+=-==-==---==\n,,,---------------++++=++=+++=:++=-=+----,,==\n,,----------------===========================\n----------------------------------=-======-==\n------------------------==--------===========\n-----------------------===-,,,,---===========\n-----+;!;:=--+::+=-----===--,,,---=--=====-==\n----:????$!=;?$??!=----=----,,,---===========\n--++;?????:;?????!:=----,,,,,.,---=--=====-==\n+:::::::::::;;;;;::+--------------===========\n::::::::::::::::::::---===---==---=--=====-==\n++::::::::::::::::::=--=------==--========--=\n====+++++++++:::::::=-=======-=------=====---\n=========--==::::::=-=-=====-------=======---\n===-=====-=+::::::+-==-==---,,---------------\n===-======:::::::=-======-----=-==-----------\n+++++++++::::::+--========================---\n++++::::::::::+--===========================-\n++++++++::::::--=============================\n++++++++::::=--==============================\n++++++++:::+,-===============================\n:+:+++:+::+--===============+++++++++++++++==\n--=--=+++=,-===========++++++++++++++++++++++\n,,,,,,-----========+++++::::::++++++++++====+\n------,,--=======++++:::::::::+=============:\n=======--=======++++:::::::::;:+++=======+++:\n===============++++::::::::;;;:+=========+++:\n===============++++::::::::::::++=========+::\n===============+++++:::::::::::::::+++++:::::\n================+++++::::::::::::::::::::::::\n=================+++++++:::::::::::::::::::::\n===================+++++++++++::::::::::::::+\n======================+++++++++++++++++++++++\n==========================+++++++++++++++++++\n=============================================\n=============================================\n=============================================',
'[
	{
		"name": ["computer"],
		"display_name": "computer",
		"description": "There''s a computer sitting on the desk. Luckily you still remember the pin to access it. It''s 1077, the price of a cheese pizza and a soda at your old job, Panucci''s pizza.",
		"use":
		{
			"2":
			{
				"condition": {
					"generator": true,
					"electricity": true
				},
				"condition_message": "Looks like there''s no power. I must be missing something.",
				"deploy": true,
				"new_description": "You''ve done it! The world''s simple arithmetic has been saved!",
				"message": "You grab the calculator firmly with both hands and give it a solid shove into the computer''s disk tray. After a couple solid smacks it slides in and the screen whirrs to life... You''ve done it. Let''s get to testing and gather back around for a quick retro on the whole experience."
			}
		}
	}
]',
'["living room", "closet"]'),
('closet',
1,
'Yuck, the closet reeks of mothballs. There''s a stack of christmas sweaters your grandmother knitted neatly folded and stacked in the corner.',
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\n$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$\n:!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW?:\n::;?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$;::\n::::;;:::::;;;;;;;;;;;;;;;;;;:::::;::::;;::::\n:::::+:::;=-=---------------=;!+-=++++-=:::::\n:::::+;!;;+==-===---=+=====-+!W;!!++++-=:::::\n:::::+==-+:++=======+!!?!===+-;;+!===:++:::::\n::::::---====;:=----+?!?;---=-==-;:!???::::::\n::::::+;;;;=+W;+--==+?!!+,--++=:!!!?$??;:::::\n::::::;;;;:=:$;:--;:+!!?+,--+::?$!?$???;:::::\n::::::;:??;+=!;:--;;:!??;,=-+:::;!$$???;:::::\n::::::::!!!;=!;:=-;;:!??!-=-=:??+==+++++:::::\n:::::+--=+--=!;:=-;;+!!!!=+-=-?:--,-+-,=:::::\n:::::+------=!!+-=;;:?::!====-+-----=+,=:::::\n::::::==----=!!:-=;;:?=-?=,,+!-----,:!=+:::::\n::::::+=--++=!!:-=;;;!--?+=,=!+,--,+!;$!:::::\n::::::++;;;;+??=-+;::+,-!;$;+!?--:+;!!;;:::::\n:::::::!?:!!+??---=;!=,-:::::!$-=;+;!;;;:::::\n:::::::++=+++??---;?W$=++++:+:?-;?+:;!W!:::::\n::::::-,==--+:=,,-+;?!=++++++=?=?$;;::?;:::::\n:::::;?!!;--+:=,-+!!!!+;!!;+++;:$$$$$$:+:::::\n:::::;$?!;+=+;::???!!?;!?;+++==+$$$$$$;::::::\n:::::;$??$$?=::;$$?!!!;:++::+==+$$$WWWW!:::::\n::::::?!:?!;::::!!;++=++:!!;+==:WWWWWW$!:::::\n:::::+::+===:?$??$?!!!+:?$$?+==:WW$!;$$!:::::\n:::::+-=+:--+?$$$$$$$$??$$$?=-=:W$;,+:+!:::::\n::::::;:=!??+??????!!!?????!=-=:W$=,;+=!:::::\n:::::::==::::?????!::;?????!+--;W$!+:+=!:::::\n:::::;?=,-==+?$$$$$?!$$$$$$?=--;W$?!:;;!:::::\n::::::??+?$!+?$$???!;?????$!=-,;WW$!:$$!:::::\n::::::=::;;;:!::!?!::;!!!;!!+-,:WW$?!$$!:::::\n:::::+=-++=-+$!;$$$!!$$$!;!?=-,:$$$$$$;;:::::\n:::::+=-;?:-+?$$$$$?!$$$?;!!=-+!!!?$$!=::::::\n:::::;;:;;;;;????????????!?!;;!!!!!?;=+;:::::\n:::;$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$;+=$$;:::\n::!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$?$WW?::\n;$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$!\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'[]',
'["bedroom"]');

--create items in items db
insert into items ("name", "game_id", "description")
VALUES('wires',
1,
'Some extra copper wiring. Could probably use this on the generator to get it up and running again.'),
('calculator',
1,
'A basic calculator! This should do the trick, just have to get this uploaded to the cloud.'),
('donut',
1,
'A beautifully crafted and somehow still fresh donut covered in sprinkles. Looks like it''s got raspberry filling.'),
('key',
1,
'Maybe this will get me in the front door.'),
('fuse',
1,
'This fuse looks like it could be useful for getting the power back on.');

-- relational keys for putting items into rooms
insert into rooms_items (room_id, item_id)
VALUES
(7, 3),
(8, 1),
(10, 2);