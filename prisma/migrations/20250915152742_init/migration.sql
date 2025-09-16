-- CreateEnum
CREATE TYPE "public"."ElectionType" AS ENUM ('PRIMARY', 'GENERAL', 'SPECIAL_PRIMARY', 'SPECIAL_GENERAL', 'RUNOFF');

-- CreateEnum
CREATE TYPE "public"."Party" AS ENUM ('R', 'D', 'I', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Stance" AS ENUM ('SUPPORT', 'OPPOSE', 'MIXED', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "public"."EndorserType" AS ENUM ('PERSON', 'ORG', 'MEDIA', 'PAC', 'OTHER');

-- CreateTable
CREATE TABLE "public"."City" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "state" VARCHAR(4) NOT NULL,
    "county" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Election" (
    "id" UUID NOT NULL,
    "cityId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "electionDate" DATE NOT NULL,
    "electionType" "public"."ElectionType" NOT NULL,
    "registrationDeadline" DATE,
    "earlyVotingStart" DATE,
    "earlyVotingEnd" DATE,
    "absenteeDeadline" DATE,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Candidate" (
    "id" UUID NOT NULL,
    "electionId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "party" "public"."Party" NOT NULL,
    "ballotName" TEXT,
    "incumbent" BOOLEAN NOT NULL DEFAULT false,
    "websiteUrl" TEXT,
    "photoUrl" TEXT,
    "residenceCity" TEXT,
    "occupation" TEXT,
    "summaryBio" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateIssuePosition" (
    "id" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "issueId" UUID NOT NULL,
    "positionSummary" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "stance" "public"."Stance" NOT NULL DEFAULT 'UNSPECIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateIssuePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Endorsement" (
    "id" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "endorserName" TEXT NOT NULL,
    "endorserType" "public"."EndorserType" NOT NULL,
    "quote" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "public"."City"("slug");

-- CreateIndex
CREATE INDEX "City_name_state_idx" ON "public"."City"("name", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Election_cityId_slug_key" ON "public"."Election"("cityId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_slug_key" ON "public"."Issue"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateIssuePosition_candidateId_issueId_key" ON "public"."CandidateIssuePosition"("candidateId", "issueId");

-- AddForeignKey
ALTER TABLE "public"."Election" ADD CONSTRAINT "Election_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "public"."Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateIssuePosition" ADD CONSTRAINT "CandidateIssuePosition_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateIssuePosition" ADD CONSTRAINT "CandidateIssuePosition_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Endorsement" ADD CONSTRAINT "Endorsement_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
