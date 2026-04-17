/*
  Warnings:

  - You are about to drop the column `duration` on the `services` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `durationMinutes` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_at_booking` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMinutes` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "price_at_booking" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "duration",
ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "reservations_barber_id_start_time_end_time_idx" ON "reservations"("barber_id", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "services_is_active_idx" ON "services"("is_active");
