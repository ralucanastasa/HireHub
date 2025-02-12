CREATE TABLE IF NOT EXISTS "django_migrations" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "app" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "applied" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT INTO django_migrations VALUES(1,'contenttypes','0001_initial','2024-10-23 09:47:30.896350');
INSERT INTO django_migrations VALUES(2,'contenttypes','0002_remove_content_type_name','2024-10-23 09:47:30.905590');
INSERT INTO django_migrations VALUES(3,'auth','0001_initial','2024-10-23 09:47:30.921561');
INSERT INTO django_migrations VALUES(4,'auth','0002_alter_permission_name_max_length','2024-10-23 09:47:30.931688');
INSERT INTO django_migrations VALUES(5,'auth','0003_alter_user_email_max_length','2024-10-23 09:47:30.939655');
INSERT INTO django_migrations VALUES(6,'auth','0004_alter_user_username_opts','2024-10-23 09:47:30.946590');
INSERT INTO django_migrations VALUES(7,'auth','0005_alter_user_last_login_null','2024-10-23 09:47:30.952866');
INSERT INTO django_migrations VALUES(8,'auth','0006_require_contenttypes_0002','2024-10-23 09:47:30.955182');
INSERT INTO django_migrations VALUES(9,'auth','0007_alter_validators_add_error_messages','2024-10-23 09:47:30.960912');
INSERT INTO django_migrations VALUES(10,'auth','0008_alter_user_username_max_length','2024-10-23 09:47:30.966793');
INSERT INTO django_migrations VALUES(11,'auth','0009_alter_user_last_name_max_length','2024-10-23 09:47:30.973752');
INSERT INTO django_migrations VALUES(12,'auth','0010_alter_group_name_max_length','2024-10-23 09:47:30.981805');
INSERT INTO django_migrations VALUES(13,'auth','0011_update_proxy_permissions','2024-10-23 09:47:30.987418');
INSERT INTO django_migrations VALUES(14,'auth','0012_alter_user_first_name_max_length','2024-10-23 09:47:30.994498');
INSERT INTO django_migrations VALUES(15,'api','0001_initial','2024-10-23 09:47:31.008417');
INSERT INTO django_migrations VALUES(16,'admin','0001_initial','2024-10-23 09:47:31.018840');
INSERT INTO django_migrations VALUES(17,'admin','0002_logentry_remove_auto_add','2024-10-23 09:47:31.033203');
INSERT INTO django_migrations VALUES(18,'admin','0003_logentry_add_action_flag_choices','2024-10-23 09:47:31.042465');
INSERT INTO django_migrations VALUES(19,'sessions','0001_initial','2024-10-23 09:47:31.049116');
INSERT INTO django_migrations VALUES(20,'api','0002_job','2024-10-23 11:14:41.148886');
INSERT INTO django_migrations VALUES(21,'api','0003_alter_user_role','2024-10-23 16:06:25.791145');
INSERT INTO django_migrations VALUES(22,'api','0004_jobapplication','2024-10-28 19:35:07.069575');
INSERT INTO django_migrations VALUES(23,'api','0005_jobapplication_status','2024-10-29 19:34:20.206191');
INSERT INTO django_migrations VALUES(24,'api','0006_jobapplication_user','2024-11-04 08:40:10.783662');
INSERT INTO django_migrations VALUES(25,'api','0007_job_category_alter_job_employment_type_and_more','2024-11-05 20:47:16.444298');
INSERT INTO django_migrations VALUES(26,'api','0008_alter_user_role_interviewer','2025-01-09 16:25:59.426491');
INSERT INTO django_migrations VALUES(27,'api','0009_alter_interviewer_token','2025-01-09 22:03:15.641806');
INSERT INTO django_migrations VALUES(28,'api','0010_alter_interviewer_token_employerprofile','2025-01-13 22:48:25.940294');
INSERT INTO django_migrations VALUES(29,'api','0011_alter_interviewer_token_interview','2025-01-14 22:35:17.893365');
INSERT INTO django_migrations VALUES(30,'api','0012_interview_calendar_event_link_and_more','2025-01-18 14:03:13.815904');
INSERT INTO django_migrations VALUES(31,'api','0013_remove_interview_calendar_event_link_and_more','2025-01-18 14:57:02.328005');
INSERT INTO django_migrations VALUES(32,'api','0014_alter_interviewer_token_interviewinvitation_and_more','2025-01-18 17:03:45.873350');
INSERT INTO django_migrations VALUES(33,'api','0015_interviewinvitation_date_interviewinvitation_time_and_more','2025-01-18 19:00:50.631980');
INSERT INTO django_migrations VALUES(34,'api','0016_jobapplication_interview_scheduled_and_more','2025-01-21 13:43:33.564238');
INSERT INTO django_migrations VALUES(35,'api','0017_alter_interviewer_token_note','2025-01-24 13:27:40.952858');
INSERT INTO django_migrations VALUES(36,'api','0018_note_updated_at_alter_interviewer_token_and_more','2025-01-24 13:47:40.372102');
INSERT INTO django_migrations VALUES(37,'api','0019_remove_employerprofile_app_password_and_more','2025-01-29 22:00:17.883034');
INSERT INTO django_migrations VALUES(38,'api','0020_alter_interviewer_token_candidateprofile','2025-01-29 22:39:28.620045');
INSERT INTO django_migrations VALUES(39,'api','0021_alter_interviewer_token_interviewerprofile','2025-01-30 00:04:28.019309');
INSERT INTO django_migrations VALUES(40,'api','0022_remove_interviewerprofile_company_name_and_more','2025-01-30 00:05:55.514836');
INSERT INTO django_migrations VALUES(41,'api','0023_interviewerprofile_company_name_and_more','2025-01-30 07:50:21.662573');
INSERT INTO django_migrations VALUES(42,'api','0024_interviewinvitation_event_id_alter_interviewer_token','2025-01-30 20:51:37.857428');
CREATE TABLE IF NOT EXISTS "django_content_type" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "app_label" varchar(100) NOT NULL, "model" varchar(100) NOT NULL);
INSERT INTO django_content_type VALUES(1,'admin','logentry');
INSERT INTO django_content_type VALUES(2,'auth','permission');
INSERT INTO django_content_type VALUES(3,'auth','group');
INSERT INTO django_content_type VALUES(4,'contenttypes','contenttype');
INSERT INTO django_content_type VALUES(5,'sessions','session');
INSERT INTO django_content_type VALUES(6,'api','user');
INSERT INTO django_content_type VALUES(7,'api','job');
INSERT INTO django_content_type VALUES(8,'api','jobapplication');
INSERT INTO django_content_type VALUES(9,'api','interviewer');
INSERT INTO django_content_type VALUES(10,'api','employerprofile');
INSERT INTO django_content_type VALUES(11,'api','interview');
INSERT INTO django_content_type VALUES(12,'api','interviewinvitation');
INSERT INTO django_content_type VALUES(13,'api','note');
INSERT INTO django_content_type VALUES(14,'api','candidateprofile');
INSERT INTO django_content_type VALUES(15,'api','interviewerprofile');
CREATE TABLE IF NOT EXISTS "auth_group_permissions" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "group_id" integer NOT NULL REFERENCES "auth_group" ("id"), "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id"));
CREATE TABLE IF NOT EXISTS "auth_permission" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id"), "codename" varchar(100) NOT NULL, "name" varchar(255) NOT NULL);
INSERT INTO auth_permission VALUES(1,1,'add_logentry','Can add log entry');
INSERT INTO auth_permission VALUES(2,1,'change_logentry','Can change log entry');
INSERT INTO auth_permission VALUES(3,1,'delete_logentry','Can delete log entry');
INSERT INTO auth_permission VALUES(4,1,'view_logentry','Can view log entry');
INSERT INTO auth_permission VALUES(5,2,'add_permission','Can add permission');
INSERT INTO auth_permission VALUES(6,2,'change_permission','Can change permission');
INSERT INTO auth_permission VALUES(7,2,'delete_permission','Can delete permission');
INSERT INTO auth_permission VALUES(8,2,'view_permission','Can view permission');
INSERT INTO auth_permission VALUES(9,3,'add_group','Can add group');
INSERT INTO auth_permission VALUES(10,3,'change_group','Can change group');
INSERT INTO auth_permission VALUES(11,3,'delete_group','Can delete group');
INSERT INTO auth_permission VALUES(12,3,'view_group','Can view group');
INSERT INTO auth_permission VALUES(13,4,'add_contenttype','Can add content type');
INSERT INTO auth_permission VALUES(14,4,'change_contenttype','Can change content type');
INSERT INTO auth_permission VALUES(15,4,'delete_contenttype','Can delete content type');
INSERT INTO auth_permission VALUES(16,4,'view_contenttype','Can view content type');
INSERT INTO auth_permission VALUES(17,5,'add_session','Can add session');
INSERT INTO auth_permission VALUES(18,5,'change_session','Can change session');
INSERT INTO auth_permission VALUES(19,5,'delete_session','Can delete session');
INSERT INTO auth_permission VALUES(20,5,'view_session','Can view session');
INSERT INTO auth_permission VALUES(21,6,'add_user','Can add user');
INSERT INTO auth_permission VALUES(22,6,'change_user','Can change user');
INSERT INTO auth_permission VALUES(23,6,'delete_user','Can delete user');
INSERT INTO auth_permission VALUES(24,6,'view_user','Can view user');
INSERT INTO auth_permission VALUES(25,7,'add_job','Can add Job');
INSERT INTO auth_permission VALUES(26,7,'change_job','Can change Job');
INSERT INTO auth_permission VALUES(27,7,'delete_job','Can delete Job');
INSERT INTO auth_permission VALUES(28,7,'view_job','Can view Job');
INSERT INTO auth_permission VALUES(29,8,'add_jobapplication','Can add job application');
INSERT INTO auth_permission VALUES(30,8,'change_jobapplication','Can change job application');
INSERT INTO auth_permission VALUES(31,8,'delete_jobapplication','Can delete job application');
INSERT INTO auth_permission VALUES(32,8,'view_jobapplication','Can view job application');
INSERT INTO auth_permission VALUES(33,9,'add_interviewer','Can add interviewer');
INSERT INTO auth_permission VALUES(34,9,'change_interviewer','Can change interviewer');
INSERT INTO auth_permission VALUES(35,9,'delete_interviewer','Can delete interviewer');
INSERT INTO auth_permission VALUES(36,9,'view_interviewer','Can view interviewer');
INSERT INTO auth_permission VALUES(37,10,'add_employerprofile','Can add employer profile');
INSERT INTO auth_permission VALUES(38,10,'change_employerprofile','Can change employer profile');
INSERT INTO auth_permission VALUES(39,10,'delete_employerprofile','Can delete employer profile');
INSERT INTO auth_permission VALUES(40,10,'view_employerprofile','Can view employer profile');
INSERT INTO auth_permission VALUES(41,11,'add_interview','Can add interview');
INSERT INTO auth_permission VALUES(42,11,'change_interview','Can change interview');
INSERT INTO auth_permission VALUES(43,11,'delete_interview','Can delete interview');
INSERT INTO auth_permission VALUES(44,11,'view_interview','Can view interview');
INSERT INTO auth_permission VALUES(45,12,'add_interviewinvitation','Can add interview invitation');
INSERT INTO auth_permission VALUES(46,12,'change_interviewinvitation','Can change interview invitation');
INSERT INTO auth_permission VALUES(47,12,'delete_interviewinvitation','Can delete interview invitation');
INSERT INTO auth_permission VALUES(48,12,'view_interviewinvitation','Can view interview invitation');
INSERT INTO auth_permission VALUES(49,13,'add_note','Can add note');
INSERT INTO auth_permission VALUES(50,13,'change_note','Can change note');
INSERT INTO auth_permission VALUES(51,13,'delete_note','Can delete note');
INSERT INTO auth_permission VALUES(52,13,'view_note','Can view note');
INSERT INTO auth_permission VALUES(53,14,'add_candidateprofile','Can add candidate profile');
INSERT INTO auth_permission VALUES(54,14,'change_candidateprofile','Can change candidate profile');
INSERT INTO auth_permission VALUES(55,14,'delete_candidateprofile','Can delete candidate profile');
INSERT INTO auth_permission VALUES(56,14,'view_candidateprofile','Can view candidate profile');
INSERT INTO auth_permission VALUES(57,15,'add_interviewerprofile','Can add interviewer profile');
INSERT INTO auth_permission VALUES(58,15,'change_interviewerprofile','Can change interviewer profile');
INSERT INTO auth_permission VALUES(59,15,'delete_interviewerprofile','Can delete interviewer profile');
INSERT INTO auth_permission VALUES(60,15,'view_interviewerprofile','Can view interviewer profile');
CREATE TABLE IF NOT EXISTS "auth_group" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "name" varchar(150) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS "api_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "user_id" bigint NOT NULL REFERENCES "api_user" ("id"), "group_id" integer NOT NULL REFERENCES "auth_group" ("id"));
CREATE TABLE IF NOT EXISTS "api_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "user_id" bigint NOT NULL REFERENCES "api_user" ("id"), "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id"));
CREATE TABLE IF NOT EXISTS "django_admin_log" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "object_id" TEXT NULL, "object_repr" varchar(200) NOT NULL, "action_flag" smallint unsigned NOT NULL, "change_message" TEXT NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id"), "user_id" bigint NOT NULL REFERENCES "api_user" ("id"), "action_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "django_session" ("session_key" varchar(40) NOT NULL PRIMARY KEY, "session_data" TEXT NOT NULL, "expire_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT INTO django_session VALUES('64nwqjdt3nfu1jvaq89wmcejscl0rvmt','.eJxVjEEOwiAQRe_C2hCYDgVcuu8ZyDCgVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsnDj9bpH4kesO0p3qrUludV3mKHdFHrTLqaX8vBzu30GhXr711aIjayJYpY3JI5A2TkeVkgLE5AcEi5pYOwLylvWg2OdoEEY2Hpx4fwC7xzaq:1t7eF6:nz3c8ephQav0Id6bUVGBv7J0Zr3JW5KKU_i6ppA9wqk','2024-11-17 17:18:24.713869');
INSERT INTO django_session VALUES('chlyrkh0m5ixzujvbgnrtadmkjtwpozj','eyJzdGF0ZSI6IjcwcWg1MmlnNDNON0pxUGFyQ21md1BDa0c1S1BEcyJ9:1tZYbU:fAREuedaGuwvIZtPwyN0O9HLssdH0KRdxEnlM5vllgE','2025-02-02 16:56:52.387383');
INSERT INTO django_session VALUES('7lidiny5izyfl4nx3wpx5qwh4gj8l9m3','eyJzdGF0ZSI6IndoMENycXZycGp5djhoZFhVcDFOTUlsQXRIZ3BoYyJ9:1tZYdp:qh6HYOtYw6JOXSsmMHEjwLnUm1cO7epMDRyHelk02Iw','2025-02-02 16:59:17.024620');
INSERT INTO django_session VALUES('riera0nq0llqpd8egcotys7cdz7nhj8t','eyJzdGF0ZSI6InZGbU9WeXpwZW1raWFzRVZCREM4MXV2UEd5Vmg5YiJ9:1tZYj4:yFI_NLfgtuSkWTpdQThrfKzH9B-N_5wwyujHQ_XcOlU','2025-02-02 17:04:42.210599');
INSERT INTO django_session VALUES('4fmh7ry4v83ywf1qc1ml3l8zm4wy0y1h','eyJzdGF0ZSI6InlOT2t3NTNTMnlQSXFhUGNmaGQyeDMxT051RkJnSyJ9:1tZYkD:1XMbiz877ihBP0VRokn3Jtqpsn_GDLgRue6WzZwH1kY','2025-02-02 17:05:53.121339');
INSERT INTO django_session VALUES('28t81tx9myk5lg1bvgi09av58imc1rzg','eyJzdGF0ZSI6IjVZZTRvV0JYSUFHa3RRSlVsNFYzTXZQY1RLZmpFbCJ9:1tZYky:Mrx6BWUdWjhh8NwtuPhpttry6rhNvMmGburMW3-Lyzs','2025-02-02 17:06:40.856663');
INSERT INTO django_session VALUES('s02yf5z0ez3wcg1q30qu7z9559jb74c9','eyJzdGF0ZSI6IlRndjZ1VElHTmM0OHNIVUhwMGltVzhvMEpJNGpiQiJ9:1tZYla:DclpoRUFhjCigzbkGaS4Np71-CfTz5MPwKjNgyAYN60','2025-02-02 17:07:18.066255');
CREATE TABLE IF NOT EXISTS "api_job" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "title" varchar(255) NOT NULL, "company_name" varchar(255) NOT NULL, "description" LONGTEXT NOT NULL, "location" varchar(255) NULL, "work_type" varchar(50) NOT NULL, "level" varchar(50) NOT NULL, "employment_type" varchar(50) NOT NULL, "posted_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "closing_date" datetime NULL, "employer_id" bigint NOT NULL REFERENCES "api_user" ("id"), "category" varchar(50) NOT NULL);
INSERT INTO api_job VALUES(11,'Frontend Developer','3Pillar','Descriere','Iasi','full_remote','junior','full_time','2024-11-04 08:52:42.661704','2024-11-30 00:00:00',1,'it');
INSERT INTO api_job VALUES(12,'HR','Amazon','dcfadsc','Iasi','full_remote','junior','full_time','2024-11-05 20:59:58.751531','2024-11-22 00:00:00',1,'hr');
INSERT INTO api_job VALUES(13,'AC','3Pillar','ecdec','Bucuresti','full_remote','junior','full_time','2024-11-05 21:14:55.761431','2024-11-16 00:00:00',1,'accounting');
INSERT INTO api_job VALUES(14,'Marketing','Amazon','edcasc','Iasi','full_remote','junior','full_time','2024-11-05 21:18:20.237488','2024-11-29 00:00:00',1,'marketing');
INSERT INTO api_job VALUES(15,'ACR','sdac','dcdc','dcasdc','full_remote','junior','part_time','2024-11-05 21:20:56.035944','2024-11-09 00:00:00',1,'marketing');
INSERT INTO api_job VALUES(16,'Sale','3Pillar','cdsacexds','Iasi','full_remote','junior','full_time','2024-11-05 21:41:57.380339','2024-11-24 00:00:00',1,'sales');
INSERT INTO api_job VALUES(17,'sdcds','dcsdc','dcwsec','dcwc','full_remote','apprentice','part_time','2025-01-09 20:33:10.474046','2025-01-17 00:00:00',1,'accounting');
INSERT INTO api_job VALUES(18,'QA Tester','NetVision','Căutăm un Tester Software meticulos și orientat spre detalii pentru a ne ajuta să asigurăm calitatea produselor noastre software. Persoana ideală va avea experiență în testarea manuală și/sau automată, va înțelege ciclul de viață al dezvoltării software și va contribui la îmbunătățirea continuă a proceselor de testare.','Iasi','full_remote','senior','full_time','2025-01-14 22:00:14.806369','2025-02-28 00:00:00',11,'it');
INSERT INTO api_job VALUES(19,'Specialist Resurse Umane','NetVision','Căutăm un Specialist în Resurse Umane dedicat și organizat, care să se alăture echipei noastre și să contribuie la dezvoltarea și gestionarea proceselor HR din companie. Rolul implică gestionarea activităților de recrutare, administrarea personalului, dezvoltarea politicilor de resurse umane și asigurarea conformității cu legislația în vigoare.','Cluj','full_remote','junior','full_time','2025-01-29 00:39:14.642490','2025-02-28 00:00:00',11,'hr');
CREATE TABLE IF NOT EXISTS "api_user" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "password" varchar(128) NOT NULL, "last_login" datetime NULL, "is_superuser" TINYINT(1) NOT NULL, "username" varchar(150) NOT NULL UNIQUE, "first_name" varchar(150) NOT NULL, "last_name" varchar(150) NOT NULL, "email" varchar(254) NOT NULL, "is_staff" TINYINT(1) NOT NULL, "is_active" TINYINT(1) NOT NULL, "date_joined" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "role" varchar(15) NOT NULL);
INSERT INTO api_user VALUES(1,'pbkdf2_sha256$870000$QHOom3uunD2k2vc9i2fhQ8$JpKcdtP4Rz/U6aq3olIDVyMY1gjENGoQ0JSuOOjUjGE=',NULL,0,'inastasa','Raluca','Nastasă','a@gmail.com',0,1,'2024-10-23 16:07:31.810416','Employer');
INSERT INTO api_user VALUES(2,'pbkdf2_sha256$870000$yejuUeZ52SIfsQGpytiAzm$qehZt63osoIGHcNoDfRR62zRjAGpwEjSvD67XR8xjNM=',NULL,0,'rradu','Elena','Popescu','raluca.nastasa@yahoo.com',0,1,'2024-10-23 19:27:21.590657','Candidate');
INSERT INTO api_user VALUES(5,'pbkdf2_sha256$870000$tinj2ms0NYPSCW3iGEZzUr$X6TLdCn4K87I2SpruKm1tlZ4TZw4g1Ye6lrlbgy++B8=','2024-11-03 17:18:24.711197',1,'admin','Raluca','Nastasa','ralucaaioanaa385@gmail.com',1,1,'2024-11-03 17:17:51.914909','Employer');
INSERT INTO api_user VALUES(11,'pbkdf2_sha256$870000$n34EsN74kxf4m9xaCHqJ1Q$YBI3mMyBx8LAWq8zK7kjSfuWNjCLlQhPkSH2NtY8wBA=',NULL,0,'inastasa3','Raluca','Nastasă','ralucanastasa@hirehubglobal.com',0,1,'2025-01-09 20:32:31.008156','Employer');
INSERT INTO api_user VALUES(13,'pbkdf2_sha256$870000$bYfgXg4kkSvMnlA6anhi4g$SJSqb/S8nsp8iyKqKVmLuC6GMgjtJtoARI299PovdJE=',NULL,0,'mfirica','Maria','Firica','i.raluca52@yahoo.com',0,1,'2025-01-14 00:52:44.844429','Interviewer');
CREATE TABLE IF NOT EXISTS "api_interviewinvitation_interviewers" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "interviewinvitation_id" bigint NOT NULL REFERENCES "api_interviewinvitation" ("id"), "interviewer_id" bigint NOT NULL REFERENCES "api_interviewer" ("id"));
INSERT INTO api_interviewinvitation_interviewers VALUES(35,35,2);
CREATE TABLE IF NOT EXISTS "api_interviewinvitation" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "meeting_link" varchar(200) NOT NULL, "candidate_email" varchar(254) NOT NULL, "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "status" varchar(10) NOT NULL, "application_id" bigint NOT NULL REFERENCES "api_jobapplication" ("id"), "date" date NOT NULL, "time" time NOT NULL, "event_id" TEXT NULL);
INSERT INTO api_interviewinvitation VALUES(35,'https://meet.google.com/rvt-ffoj-ybq','raluca.nastasa@yahoo.com','2025-01-30 21:45:14.424727','sent',11,'2025-01-31','14:45:00','7c1iru5i2uqpdqcd0iaeartln4');
CREATE TABLE IF NOT EXISTS "api_jobapplication" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "name" varchar(255) NOT NULL, "email" varchar(254) NOT NULL, "resume" varchar(100) NOT NULL, "job_id" bigint NOT NULL REFERENCES "api_job" ("id"), "status" varchar(10) NOT NULL, "user_id" bigint NOT NULL REFERENCES "api_user" ("id"), "interview_scheduled" TINYINT(1) NOT NULL);
INSERT INTO api_jobapplication VALUES(8,'Elena Popescu','raluca.nastasa@yahoo.com','resumes/CV_RaduRobert_o8O3MyX.pdf',18,'accepted',2,1);
INSERT INTO api_jobapplication VALUES(11,'Elena Popescu','raluca.nastasa@yahoo.com','resumes/resume_UeEHt1h.pdf',19,'accepted',2,1);
INSERT INTO api_jobapplication VALUES(12,'Elena Popescu','raluca.nastasa@yahoo.com','resumes/resume_L919wkL.pdf',19,'rejected',2,0);
CREATE TABLE IF NOT EXISTS "api_note" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "content" LONGTEXT NOT NULL, "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "interview_id" bigint NOT NULL REFERENCES "api_interviewinvitation" ("id"), "user_id" bigint NOT NULL REFERENCES "api_user" ("id"), "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT INTO api_note VALUES(8,'Interviul a decurs bine.','2025-01-30 22:06:11.116380',35,13,'2025-02-03 19:40:41.627445');
CREATE TABLE IF NOT EXISTS "api_employerprofile" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "user_id" bigint NOT NULL UNIQUE REFERENCES "api_user" ("id"), "company_description" LONGTEXT NULL, "company_name" varchar(255) NOT NULL, "industry" varchar(100) NULL, "location" varchar(255) NULL, "phone_number" varchar(20) NULL, "website" varchar(200) NULL);
INSERT INTO api_employerprofile VALUES(2,11,NULL,'NetVision','IT',NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "api_candidateprofile" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "phone" varchar(15) NULL, "location" varchar(255) NULL, "resume" varchar(100) NULL, "user_id" bigint NOT NULL UNIQUE REFERENCES "api_user" ("id"));
INSERT INTO api_candidateprofile VALUES(1,'N/A','Iasi','resumes/CV_RaduRobert_z7VxDNG.pdf',2);
CREATE TABLE IF NOT EXISTS "api_interviewerprofile" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "phone" varchar(15) NULL, "location" varchar(255) NULL, "user_id" bigint NOT NULL UNIQUE REFERENCES "api_user" ("id"), "company_name" varchar(255) NOT NULL);
INSERT INTO api_interviewerprofile VALUES(1,'0743347244',NULL,13,'NetVision');
CREATE TABLE IF NOT EXISTS "api_interviewer" ("id" integer NOT NULL PRIMARY KEY AUTO_INCREMENT, "is_active" TINYINT(1) NOT NULL, "invited_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "activated_at" datetime NULL, "company_id" bigint NOT NULL REFERENCES "api_user" ("id"), "user_id" bigint NOT NULL UNIQUE REFERENCES "api_user" ("id"), "token" varchar(64) NOT NULL UNIQUE);
INSERT INTO api_interviewer VALUES(2,1,'2025-01-14 00:52:44.873901','2025-01-14 01:24:42.257158',11,13,'qZAOgeLIa2sRHRhdV04H9YfiRQPBcNcwxQdgTQMHow2OSpxeBdvJlqpvJUa7G3UO');
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type" ("app_label", "model");
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions" ("group_id", "permission_id");
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" ("group_id");
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" ("permission_id");
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission" ("content_type_id", "codename");
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission" ("content_type_id");
CREATE UNIQUE INDEX "api_user_groups_user_id_group_id_9c7ddfb5_uniq" ON "api_user_groups" ("user_id", "group_id");
CREATE INDEX "api_user_groups_user_id_a5ff39fa" ON "api_user_groups" ("user_id");
CREATE INDEX "api_user_groups_group_id_3af85785" ON "api_user_groups" ("group_id");
CREATE UNIQUE INDEX "api_user_user_permissions_user_id_permission_id_a06dd704_uniq" ON "api_user_user_permissions" ("user_id", "permission_id");
CREATE INDEX "api_user_user_permissions_user_id_f3945d65" ON "api_user_user_permissions" ("user_id");
CREATE INDEX "api_user_user_permissions_permission_id_305b7fea" ON "api_user_user_permissions" ("permission_id");
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" ("content_type_id");
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log" ("user_id");
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session" ("expire_date");
CREATE INDEX "api_job_employer_id_d6fed1a0" ON "api_job" ("employer_id");
CREATE UNIQUE INDEX "api_interviewinvitation_interviewers_interviewinvitation_id_interviewer_id_a9049137_uniq" ON "api_interviewinvitation_interviewers" ("interviewinvitation_id", "interviewer_id");
CREATE INDEX "api_interviewinvitation_interviewers_interviewinvitation_id_f574d1c7" ON "api_interviewinvitation_interviewers" ("interviewinvitation_id");
CREATE INDEX "api_interviewinvitation_interviewers_interviewer_id_564275b9" ON "api_interviewinvitation_interviewers" ("interviewer_id");
CREATE INDEX "api_interviewinvitation_application_id_6880ba25" ON "api_interviewinvitation" ("application_id");
CREATE INDEX "api_jobapplication_job_id_a5aab698" ON "api_jobapplication" ("job_id");
CREATE INDEX "api_jobapplication_user_id_e96f16da" ON "api_jobapplication" ("user_id");
CREATE INDEX "api_note_interview_id_63ab49f3" ON "api_note" ("interview_id");
CREATE INDEX "api_note_user_id_ffcd573e" ON "api_note" ("user_id");
CREATE INDEX "api_interviewer_company_id_393b4247" ON "api_interviewer" ("company_id");
