-- DropForeignKey
ALTER TABLE "produtos" DROP CONSTRAINT "produtos_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "produtos" ALTER COLUMN "estoqueAtual" DROP DEFAULT,
ALTER COLUMN "estoqueMinimo" DROP DEFAULT,
ALTER COLUMN "fornecedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
