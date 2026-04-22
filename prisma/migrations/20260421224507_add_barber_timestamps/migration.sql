/*
  Warnings:

  - You are about to alter the column `price_at_booking` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,0)`.

*/
-- AlterTable
ALTER TABLE "barbers" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "price_at_booking" SET DATA TYPE DECIMAL(10,0);

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");
