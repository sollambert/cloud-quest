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
	"room_name" varchar(255) NOT NULL,
	"room_image" text NOT NULL,
	"room_description" varchar(1024) NOT NULL,
	"room_exits" json NOT NULL,
	"room_interactables" json,
	CONSTRAINT "rooms_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "items" (
	"id" serial NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"item_description" varchar(1024) NOT NULL,
	"item_interactions" JSON,
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
	CONSTRAINT "saves_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk0" FOREIGN KEY ("room_id") REFERENCES "rooms"("id");
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk1" FOREIGN KEY ("item_id") REFERENCES "items"("id");

ALTER TABLE "saves" ADD CONSTRAINT "saves_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");

--generate all rooms for initial database
insert into rooms (room_name, room_description, room_image, room_interactables, room_exits)
VALUES('car',
'You are in your car. You pulled to the side of the road about a half mile south of your childhood home. There is a note in the passenger seat and a photograph stuck to the dashboard.',
'=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$?+-,,,,,,,,\n=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$?=,,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$!--,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW:---,,,,,,,\n=;?WWWWWWWWWWWWWWWWWWWWWWWWWW?$WWW;,------,,,\n=+!$WWW$$$$$$$$$$$$$$$$$??$$!!!?!;:,,,,,,,,,,\n-=;!!!!!!!!!!!!!!!!!!!!!!!!;;;;;;;:----===--,\n,=::;;;!????$??$$$$$$$$$$$$!;;;;:;;:;:+:==:+=\n.-+::;:;;;;;!?!!!$$$??????!;;;;::::::;;;:;;++\n.,=+;!!!????$$$$$$$$$$$???!!!!!!!!::;;;;;;;;;\n,,-+;$$$$$$$$$$$$$$$$$$$$$$??!???????!!!!;;;;\n,.,=:$$$$$$$$$$$$$$$$$$$$$$$$$??!!!!!!???????\n,,,=+?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!!;!!!!\n,,.-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!;;\n,,,,=+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??\n,,..-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n--..,=+?$$$$$$$$?$?????!!;;;::;;;;!!!????????\n--.,,,=+;!???;+=-:=--=+:;!!!!!??!!!!!;::::;::\n--.,,,-=:!!:-,...,,...,,=;?$$$$$$$$???;;;;;;;\n=-,,.-,=?;=,.,,,,,,,,,,,.,=!??$!=--,,,,,-=::;\n=-,,.,-:+-.--,,,,,,,,,,,-,,,++:=.,,-=---.,-,=\n=-,,,.=+-.=!,.,,,,,,,,,.=-..,-+-.,-,-,,,,,,,,\n=-,,.-+,,,==,,,,,--,,-,,,=,..,+=,,-+===-,,-,-\n,,,,,+-..-=-.,,,,--,--,,,+:,..,-,,---,,,,,,,,\n-=,,==.,-+:=.,,-.,,.--,,,;$+..,,,,-,,,.,,.,,,\n-,.,+,,;$$$:.,--,,,,,,,,,!?!-,,,,,,......,-==\n,,.-=.,=!$$;..=+::::+=,,-!!?;+,-,======++::;;\n,,.=-,==+$$!,=::+:++===--;;;;!==,;!!!!!!!!;;;\n,,,=,,,-=:!!====----+=--=+::;;+=-=;:::+:+:=-:\n,,,=.--,----===,....,=-..,==+===-,+++==+++==+\n,.,=-===-,,==+,..-=,.,=,,,--,,,,.,---,,,,,,-=\n,.,===-,,,,=+=.,+=++,,:-.,,..,,,,,,,,.,,,,.,+\n,.,==--,,,,=+-.=:==---;=.,,,,,,,,,,,,,,,,,,,=\n,.,==-,,,,,=+,.=+==-,-:=.,,,,,,,,.,,,,,,,,,.,\n,.=++,,,,,,-=-.,----,=:-.,,,,,,..-,,,,,,,,,,.\n.+!!!-.,,,,.,=-,,,,,.=:,,,,,,,,=,+:.,,,,,,,,,\n:?!?!-.,,,,,.,=,,,,,.==.,,,,,.-?;=!=.,,,,,,,,\n??!?;,.,,,,,,.,=-,,,--.,,,,,,,-!!:!!-.,,,,.,,\n??!!+,,,,,,,,,.,----,.,,,,,.,,-:!:;;=.,,,,-,,\n!??!:,,,,,,,,,,......,,,,,,,,-,=!:;;+,,,.,-,,\n;!!!+,,,,,,,,,,+,.,,,+,,,,,-,-.=!;;:+-------,\n;;;:+,,,,,,,,,.:=.,.-:.,,,,,-,.:;::++,--,=-,,\n;;+++,.,,,,,,,.+=.,.-:.,,.,-,.,:;++++,--,,-,,\n;;++=,,,,,,,,.,:+.,.=:-,,,-,.,,:;:+++,,--,,,,\n:++=,.,,,,,,,,=!:.,.+!:,--,.,,.+;;+++-.,,,,-,\n',
'{"interactables": [
{
    "name": "note",
    "description": "It''s from dad... \n\"Hey kid, our data center went down and we need you to deploy our calculator app to the cloud! The entire world is depending on those basic calculations!\"\nSounds pretty serious."
},
{
    "name": "photo",
    "description": "You see a bald man sitting on a throne made out of money. The image is unsettling and you can''t help but feel like his company controls most of the internet."
}
]}',
'{"exits": ["road"]}'),
('road',
'You are on the road that leads to your childhood home. Everything seems to be smaller than you remember. The dirt road leading up to your house is inviting you in. Better get moving, you have a calculator to save.',
'!!!!!!;;:::;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!?;+==::+==::!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n???;===+:+==+:::!????????????????????????????\n???+===::==+::::;????????????????????????????\n??!===+::===::::;????????????????????????????\n??!====::+==++::;???????????????!????????????\n???===+++:+++++=+!$???????????;+=+:;!!??$$???\n??$+=+:::::::+=+::?$?????????$:,-=--=++::::;$\n$$$:=+:::::::+=::+;$$$$$$$$$$?---==-=+++===+;\n$$$:=+=+:::::+==::;??!!!??$$$+----=++++++++++\n$$?=+:+:+++++++++++:;!!;;!!?!==-,---=+==++==+\n!!;=+::+=-==-==+::+++:;!!!;!:-+=,-,,,=-,=+==+\n!!+==+==-======++::;::::;!;;=,==,-,-==+=====-\n!!;======-======+;!!!!!!;!!!=-=----=======--,\n!!!:===========+;!!!!!!!!;:::--,,,----=--=---\n!!;;:++-===++;;!!!!!!!!!!:;::--,,,,--,-===+==\n!;;;!!!=;;=;?!!!!;!!!!!::++++--,,,,---,,---=+\n::+:+:==+:=+:::;!;;!!;!:+++==--,,,-,---,-----\n;;;;::++++++++++;:+;:;;!;;;:+====--,---,----=\n;;!!!!!!!!;++;;;;;::+;;;;;;;;;;;;:+=--=------\n;;;!!!!!!!+-:;;!!;;;:;;;;;+=;;;;;!!;;;;;;;;:+\n;;;!;;;;!!;;!;;!;;!!;;;!!;::;!!!!;!;;;!!;!;!!\n!!!;;;;;;;;;;;;;;;!!!!;;;!!!!!;;;!!!;;;:=+:!!\n!!;;!;;;;;;;;;;;:;;!!!!!;;;;!;;;;;;;;;;+--:;;\n;;;;;;;;;;;;;;;;;;;;!!!!!!;;;;!!;;;;;!;;:;;;!\n;;;;::;;;;;;;;;!!!;!;!!!!!!!!!!;;!;;!;;;!;;;;\n!!!;:+:!:::;!!!!!;;;;!;;;;!!!!!!!!!;!!!!;;;;;\n!!!;++:!:=+;!;!!;;;;:;!!;;;;!!!!!!!!!;;!!;;;;\n!!!;:::::::;;;;;;!!!!;;;!!:;;;;!!!!!!!!!!!!!;\n;;;;;;;;;;!!;!!;;;!!;;;;::=;+:;;;!!!!!!!!!!!!\n;;;;;;;;;;;::::::+::;;:;;=-==!!;;;!!!!!!!!!!!\n++;;;;;;:::+=========+;;;+--+:;!!;;;;!!!!!!!!\n=:;;;:::;;;:++::+:;:+++::++:;:;;!!;;;;;!!!!!!\n=+:++=+:;:+:::::+;:::+::++=++:;;;!!!;;;;;!!!!\n=======++=+;::++=:+++==+======:;;;;!!;;;;;;!!\n==============-----=----=====-:;;;:;!!!;;;;;;\n+-==-,-=-=======-=====-,,-===-+;;;;;;!!!;;;;;\n===,,-,,-=======-====-,-=,--===;;;;;;;;!!!;;;\n==-.+;+,-------------,,:;=-++::;;;;;;;;;;!!!;\n++=,:;+,========+++++=,::-=::;!!!!!!!!!!!!!!!\n+++-,-,=++++++++++++++-,--++++;!!!!!!!!!!;;;;\n:::::+:::::::::::::;;;;::;;;;;;;;;;;;;;;;;;;;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!;!!!;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
'{"interactables": []}',
'{"exits": ["car","house"]}'),
('house',
'Man, this brings back memories. The paint is peeling off the side of the house. Seems like nobody''s been here for quite some time.',
'??????????????????$?:------------------------\n?????????????????$!=-------------------------\n??????????$$$$$?$!---------------------------\n??????????$$$$$$$:-,,,,,,,-------------------\n??????????$$$$$$$$$;+,...,,,,,,,,------------\n??$$$$$$$$$$$$$$$$$$$$!:-.,,,,,,,,,,,,,,-,,,,\n?$$$$$$$$$$$$$$$$$$$$$$$!=,,...,,,,,,,,,,,,,,\n????????????$$$$$$$$$$$$$$?!;+=-,,,,,,.,,,,,,\n?????????????????$$$$$$$$$$$$$$$?!;:--=-,,,,.\n????????????????$$$$$$$$$$$$$$$$$$$$?+;??!;;:\n??????????????$$$$$?$$$$$$!!$$$$$$$$$$::$WWWW\n????????????$$$$$$+=::;;!!+:$$$$$$$$$$$;+!$$W\n???????????$$$$$$?--====+++;$?:;;?$$$$$$!+:$W\n???????????$$$$$$:-=-======;$?+++;$$$$$$$$++!\n??????????$$$$$$?-==------=;$?::::?$$$$$$$$;=\n??????????$$?$$$;-=+=-=====;$?::::;$$$$$$$$W?\n???????????$$$$$==+:+-+++++++:+::::?$$$$$$$$W\n????????$$$$$$$!,+::+====---+++::::;$$$$$$$W$\n??????$$$$$$$$$+-+++++---,,=+++:::::?$$$$$$$$\n?????????????$?-=+==++=---,;:++:::::;$$$$$WWW\n????????$$$$$$:,++++++=-=-=!;++::::::?$WWWWWW\n!!!!!!!!!!!??!--=++++=====+::+++:::::;???????\n:::::::::::::+,======-===---==========+;!!!!!\n++++++::::;;;:====++==-=++==--==========+:!!!\n++::;;!!!!!!!!:-=+=+++==+++++=+;;::::::::::!;\n:;;;;;;;;;;;;;+=+++++++=+++++:;!!::::::::;:;:\n;;;;::::::::::+=+++++++=:?!?!?;!!!!!?!:::;:::\n;;::::::::::::+=++++++++:!!???;;!!;!?!:+::::+\n:::::+:+++++++======++++:!:;!!;;;!:;?!:+::+++\n+++==-=-==+++++---+!:++++:++;;;;;!:;!;;;!!:+;\n+=======++::::+==+!!:++:+++:!!;;!!!!!!!!!?:+!\n==+++++:::::::::::;;!!!???????!???????????!;!\n==========+::;;!!!!!???????????????????!!!!!!\n===-----==+++:::;;!!???????????!!!!!!!!!!!;;;\n==------=======++::::::;;;;::++++++++++++====\n=-------====+:::::::::::+====================\n=------==+::::::::::::+=====================,\n-----=+::::::::::::+==================-+====-\n--==::;;;;;;::;::+==================--,+====-\n=+::::::::::;::+===========,,,======--,======\n::::::::::::+==============,,,-=====-,,-+===-\n::::::::::+================-,,-======,,,--,,,\n::::::::+=-================-,,-====--,,,,,,,-\n+++++:+=-===================,,,--,,,,,,,--===\n+++++=--===================-,,,,,,,,--,,-====',
'{"interactables": []}',
'{"exits": ["road","front door","shed"]}'),
('front door',
'Walking up to the steps, you feel a blast of nostalgia. You expect to hear your mother calling you for dinner, but instead you''re met with silence.',
',,,,..,,,,,,,,,,,,,,.,.,,.........,,,,..,,...\n.,,,..,,,,,,,,,,,,,,,..,.........,,,.......,.\n,.,,,.,,,,,,,,,,,,,,,,..,,,..,,.,,,.,,.,.,,,.\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,------------------------------------,--,\n---=========================================-\n==-=============================-==========--\n===============,,,,,,,,,,,,,,,-=-==========-=\n===============,,,,,,,,,,,,,,,-=--===========\n+++++++;+======,,,,,,,,,,,,,,,-=-===+;==+++++\n--==---;=======,,,,,,,,,,,--,,-=-===+;--===--\n++::+++;=====+=,,,,---=--,--,,-+-====;==+::++\n::::+::;=====+=,-,,-,-==-,--,,-+-====;=+::;::\n::;::::;=====+=,-,,,,,-,,,--,,-+-====;=+::;::\n::;;:::;=-===+=,-,----------,,-+--=-=;=+:;;::\n::;;:::;=-===+=,-------------,-+--===;+::;;;:\n:;;;;::;=====+=,------,,--,--,-+-,-=+;+:;;;;:\n;!!!;::!=====:=,--,,,,,,,,--,,-+-,-==;+:;!!!;\n;!!!!;;!=====:=,--,---,--,--,,-+-===+;:;!!!!;\n!!?!!;;!+====:=,--,-----,,-----+-===+;:;!!!!!\n!???!!;!+====+=,--,----,-,--,,-+-===+;:;????!\n?????!;!=-===+=,--,---------,,=+--=-=;:!?????\n??????;!=====+=,------------,,=+-===+;;!?????\n!!?!!!;!=====+=,--------------=+-===+;;!!!?!!\n++++++++-====+=,--,,,----,----=+-====++++++++\n======--=====+=,--,,,,,,,,----==-=====--=====\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--------------==-============\n===============,--------------==-============\n--------------,------------------------------\n-------------,.,,,,,,,,,,,,,,,,,-------------\n-------------,,------------------------------\n--------------,------------------------------\n=------------,.,,,,,,,,,,,,,,,,,-------------\n====------==+=+++++++++++++++++++------------\n++++++::;;!!$$?!!!!!!!!!!!!!!!?$$!+::++::::::\n+++++++::::;!!;;;;;;!!!!!!!!!!!?$$!;!!!!!!!!!\n:;;:::++++:;:::::::;!??!!???????$$?!;;;;;::;;\n++++++++=++:::;;;;!!!!!;;!!!;;;;;;;;:;;;::::+\n=============+++:::::::::::::::::::::++++++==\n==============++:::::::::::::::::::++========',
'{"interactables": [
	{
		"name": "front door",
		"description": "The front door to your old house. Looks like it''s locked."
	},
	{	"name": "welcome mat",
		"description": "Printed on the mat is a large WELCOME in fading letters. You remember you used to keep a spare key under it."
	}
]}',
'{"exits": ["house"]}'),
('shed',
'The shed smells like chopped firewood and motor oil. There''s a generator sitting in the corner. Looks like it hasn''t been used in some time.',
'W$$$$WWWWWWWWWWWW;!WWWWWWWWWWWWWWWWWWWWW$$$$$\n$!!!!?????$$$$$$$:!$;WWWWWWWW$$$$$$$$$???????\n$!!!!!;;!!!;;!!!!:;+,?$$$$??????!!?!!????????\n$;++!;::;;;-+!!;;::-,;!!!??????????????$$$???\nW;-=;;!;+=+;!!!!:!:++;::;???????$$$$$$???$??$\nW;-=;!::+=:;!!!!;!:++;:::???????$:+!??;++???$\nW:--====+=+=+::;:++-=;:::!???????++;??!+:???$\nW;;;,,-:;;;;::-+:::+--=::!???????;;;???!;???$\nW!;:,,:;;;;;;;::=+++-+;;!?!!!;??$!?!??$?????$\nW!;+-:;;;!;;;;=:=:+:=:;:+?;:;:??$????????$??$\nW?!=:!:++!!;::.==+:::;:==!!::;??$!?!?;;!????$\nW?;;!!:==;!?!!=+==+=;;:==!?;:???$!;;;=,:????$\nW?;;!!;==;!$WW$:====;+:++??;:????==+;=-=+???$\nW!=-=+:==+:::::++++===+++!?;:????:::!::+:???$\nW!::-,-:;:::;;;:+:;=.-;!???;:???$:++!:+=;?!?$\nW!;;-,+;;;;;;;;+++;=-;?????;:???$$$?$??:??!?$\nW?;;-+;;;;!!!;!:+:!:;!?????;:??$$$$$$$$;$!??$\nW?;;;!!!!!!!!!!;+:!!;;!????;:???!!!!!!;:!;??$\nW?!!!!!!!;;;!!!;;;;!;?!!???!;??????!!?!;????$\nW?!!!!!!!!!;;;;;:+=+???;?????!????!???;!????$\nW?;!!!!!!!!;:;:;:+:+!?!;!??;-,,-=!????;!????$\nW?;;!!!;!!!!??+::=-+:;::;;:,.....,!???;!????$\nW$;:++--:!!!$$:=====++++++,.,,-...+???:?????$\nW$!:++++=::;!!+=+++=+::::+.,-:!,..-???:?????$\nW$!++!!:+-,+::;!!;;::::::=.,,;?,..,???:?????$\nW$:++;;+:=,,:!!!!!!!!::::+,..=;...-???;???!?$\nW$+;++++-=-=:!!!!!!;;::::+-..,,...:??!;?????$\nW!=:+==!--==:;;;!!!!;++++:+......=?;:::!????$\n$:=+:=+?=-+-:;::!!??;+:::::+----+!!=--==:???$\n!=;!;=+:+===::;;;!!;:::::::::::::::=----=!??$\n;;$!!++:+:++::::::::;;;;;::::::::::::+++:;!?W\nWWWWW;+$?!!;:::;;;;;;;;;;;;;;;:::::;!!?$$WWWW\nWWWWW$?WWWWW$$??!;;;;;;;;:::;;;!?$$WWWWWWWWWW\nWWWWWWWWWWWWWWWWWW$$?!!;;;!?$$WWWWWWWWWWWWWWW',
'{"interactables":[
	{
		"name": "generator",
		"description": "The generator is old. Upon further investigation there seems to be some gas already in there but it won''t turn on."
	},
	{
		"name": "fried squirrel",
		"description": "Poor guy. Looks like he liked chewing on wires. I don''t know why but he seems like he would''ve been named CJ."
	}
]}',
'{"exits": ["house"]}'),
('living room',
'',
'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!;;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n?$??!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?$???!!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$????$?$??!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?!+;??$??$??!;:;:;;;;;;;;;;;;;;;;;;;;;;;;;;\n?$?!---=:;???$?$!?????$??????$????$?$????$??$\n?$?!+;:+=--=:!!?!$????$??????$????$?$??$?$?$$\n?$?!+!;??-=+=-=?!$????$??????$?????!!!!!!!!!!\n?$?!+;!$;-+!!!-?!$?????!?????$????;==========\n?$?!+;??:-+!$;-?!?????;::::;+!????;-,,,,,,,,-\n?$?!+!$!:-+?$:-?!?????;??!?$;;????;-,,,,,,,,-\n?$?!+$!;:-:$!:-?!?????;;!!!!:;????;-,,,,,,,,-\n?$?!:?;;:-:?;:-?!?????;==:!+:!????;-,,,,,,,,-\n!??!+!;;:-+!;:-?!?????:=-+?::!????;-,,,,,,,,-\n;!?!+;;;;-+!;:-?!?????:=-=!:+!????;-,,,,,,,,-\n:!?!+;;!!-+!;:-?!?????;===++=!????;-,,,,,,,,-\n+!?!=;;??-+!;:-?!?????;=+====!????;-,,,,,,,,-\n;?!;+;;$;-+!!!-!???????;!!!!!?????;-,,,,,,,,-\n?$;+;!?!:-+;??-!??????$?$?$$?$????;--,,,,,,,-\n?$;:;??;:-+!$;-!?????!!!!!!!!!!???;--,,,,,,,-\n?$;:;!?;:-+$?:-;;;;;;;;;;;;;;;:;;;;+=-,,,,,,-\n?$;:;!?;:-:$;:;;;!!!;;!!!!!!!;;!!!!!!;;+=,,,-\n?$;:;!?;:-:!;;!!!!!!;;!!!!!!!;;!!!!!!!!!;=,,-\n?$;:;??!:-+;;!;;;;;!;;;;;;;;!:;;;;;;;;;!;-,,-\n?$;::;!;;-+!;;;;;;;;;;;;;;;;;:;;;;;;;;;;=,,,-\n?$??;;;!?-=;;:;;;;;;;;;;;;;;;:;;;;;;;;;:-,,,-\n?$??;;;$!+:;;;:;;;;;::;;;;;;;:;;;;;;;;:::+,,-\n?$?;:;!$;;;:;;:;;;;;::;;;;;;::;;;;;;;:;;::,,-\n?$?;;??!:;;:;::::::::::::::::+::::::::;;:+,,-\n!;+=+::=+;;:::::::::::::::::::::::::::;;+-,,-\n+====:-==:;:::::::::::::::::+:::::::::::+++++\n::+==+=---::::::::::::::::::::::::::::::+++++\n+=====----+:::::::::::::::::::::::::::+:+++++\n=-=--=-==-+:::::::::::::::::::::::::::+:+++++\n--===+-===+:::::::::::::::::::::::::::+++++++\n-=++++-======+++++++++++++++++++++++=-=++++++\n++++++=++++++++++++++++++++++++++++++=+++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n+++++++++++++++++++++++++++++++++++++++++++++\n=============================================\n=============================================',
'{"interactables":[
    {
		"name": "fuses box",
		"description": "Sitting on the bookshelf is a box of fuses. Convenient."
	}
]}',
'{"exits": ["bedroom", "front door"]}');

--create items in items db
insert into items (item_name, item_description, item_interactions)
VALUES('fuse',
'This fuse looks like it could be useful for getting the power back on.', 
'{"interactions": ["generator"]}'),
('key','Maybe this will get me in the front door.',
'{"interactions": ["front door"]}');

--relational keys for putting items into rooms
insert into rooms_items (room_id, item_id)
VALUES(4, 2),
(6, 1);



