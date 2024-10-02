-- CreateTable
CREATE TABLE "dislikes" (
    "dislike_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,

    CONSTRAINT "dislikes_pkey" PRIMARY KEY ("dislike_id")
);

-- CreateTable
CREATE TABLE "likes" (
    "like_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "places" (
    "place_id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "phoneVerified" BOOLEAN DEFAULT false,
    "avatar" VARCHAR,
    "code" VARCHAR(4),
    "code_created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "itinerarie_id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER,
    "name" VARCHAR,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("itinerarie_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "places_uuid_key" ON "places"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "itineraries_uuid_key" ON "itineraries"("uuid");

-- AddForeignKey
ALTER TABLE "dislikes" ADD CONSTRAINT "dislikes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dislikes" ADD CONSTRAINT "dislikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
