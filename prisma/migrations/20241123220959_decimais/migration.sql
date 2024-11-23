/*
  Warnings:

  - You are about to alter the column `quantidade` on the `vendaproduto` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE `produto` MODIFY `preco` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `vendaproduto` MODIFY `quantidade` DECIMAL(10, 3) NOT NULL,
    MODIFY `total` DECIMAL(10, 2) NOT NULL;
